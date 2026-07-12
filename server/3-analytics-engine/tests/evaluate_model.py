import pandas as pd
import numpy as np

# We must ensure we can import from app
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.anomaly_detector.zscore_velocity import detect_zscore_velocity
from app.services.anomaly_detector.cv_amount_clustering import detect_cv_clustering
from app.services.anomaly_detector.isolation_forest import detect_isolation_forest

def evaluate_model():
    # 1. Load data
    csv_path = os.path.join(os.path.dirname(__file__), "data", "synthetic_validation_set.csv")
    df = pd.read_csv(csv_path)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    # Sort globally by timestamp just in case
    df = df.sort_values(by='timestamp').reset_index(drop=True)
    
    thresholds = [30, 50, 100, 500]
    provider_value = "test-provider-1"
    
    report_lines = [
        "# IsolationForest Model Validation Report\n\n",
        "This report benchmarks the IsolationForest ML model against the deterministic Z-Score and CV Clustering baseline models.\n\n"
    ]
    
    categories = ['velocity', 'amount', 'clustering', 'multi_dimensional']
    
    def evaluate_detector(func, subset_df, category):
        alerts = func(subset_df.copy(), provider_value)
        flagged_txs = set()
        for a in alerts:
            flagged_txs.update(a.get("evidence_details", {}).get("transaction_ids", []))
            
        gt_positives = set(subset_df[subset_df['anomaly_category'] == category]['transaction_id'])
        
        tp = len(flagged_txs.intersection(gt_positives))
        fp = len(flagged_txs - gt_positives)
        fn = len(gt_positives - flagged_txs)
        
        precision = tp / (tp + fp) if tp + fp > 0 else 0.0
        recall = tp / (tp + fn) if tp + fn > 0 else 0.0
        f1 = 2 * (precision * recall) / (precision + recall) if precision + recall > 0 else 0.0
        
        return precision, recall, f1

    def compute_false_positives(func, subset_df):
        alerts = func(subset_df.copy(), provider_value)
        flagged_txs = set()
        for a in alerts:
            flagged_txs.update(a.get("evidence_details", {}).get("transaction_ids", []))
            
        pre_eid_txs = set(subset_df[subset_df['anomaly_category'] == 'pre_eid_spike']['transaction_id'])
        
        fps = len(flagged_txs.intersection(pre_eid_txs))
        fpr = fps / len(pre_eid_txs) if len(pre_eid_txs) > 0 else 0.0
        return fps, len(pre_eid_txs), fpr

    # Ensure we group by provider just like the live detector does
    # The dataset only contains one provider, but we enforce the semantic slicing here
    prov_df = df[df['provider'] == provider_value].copy()
    
    for n in thresholds:
        report_lines.append(f"## Transaction History Size: n={n}\n\n")
        
        subset_df = prov_df.head(n).copy()
        
        for category in categories:
            report_lines.append(f"### Category: {category.capitalize()}\n")
            
            num_in_subset = len(subset_df[subset_df['anomaly_category'] == category])
            report_lines.append(f"*(Total Ground Truth Anomalies in subset: {num_in_subset})*\n\n")
            
            if num_in_subset == 0:
                report_lines.append("- *No ground truth anomalies of this category in this window*\n\n")
                continue
            
            # Evaluate models
            z_p, z_r, z_f = evaluate_detector(detect_zscore_velocity, subset_df, category)
            cv_p, cv_r, cv_f = evaluate_detector(detect_cv_clustering, subset_df, category)
            
            if n >= 30: # ML model is only active >= 30
                iso_p, iso_r, iso_f = evaluate_detector(detect_isolation_forest, subset_df, category)
            else:
                iso_p, iso_r, iso_f = 0.0, 0.0, 0.0
                
            report_lines.append(f"- **Z-Score**: Precision: {z_p:.2f} | Recall: {z_r:.2f} | F1: {z_f:.2f}")
            if category in ['multi_dimensional', 'clustering']:
                report_lines.append(" *(Expected low recall: Z-score not designed for this)*\n")
            else:
                report_lines.append("\n")
                
            report_lines.append(f"- **CV-Clustering**: Precision: {cv_p:.2f} | Recall: {cv_r:.2f} | F1: {cv_f:.2f}")
            if category != 'clustering':
                report_lines.append(" *(Expected low recall: CV only designed for clustering)*\n")
            else:
                report_lines.append("\n")
                
            if n >= 30:
                report_lines.append(f"- **Isolation Forest**: Precision: {iso_p:.2f} | Recall: {iso_r:.2f} | F1: {iso_f:.2f}\n\n")
            else:
                report_lines.append(f"- **Isolation Forest**: (Skipped, n < 30 cold start limit)\n\n")
                
        # False Positives on Pre-Eid Spike
        report_lines.append("### Normal-but-Busy Baseline (Pre-Eid Spike False Positives)\n")
        num_pre_eid = len(subset_df[subset_df['anomaly_category'] == 'pre_eid_spike'])
        report_lines.append(f"*(Total Pre-Eid txs in subset: {num_pre_eid})*\n\n")
        if num_pre_eid > 0:
            z_fp, z_tot, z_fpr = compute_false_positives(detect_zscore_velocity, subset_df)
            cv_fp, cv_tot, cv_fpr = compute_false_positives(detect_cv_clustering, subset_df)
            if n >= 30:
                iso_fp, iso_tot, iso_fpr = compute_false_positives(detect_isolation_forest, subset_df)
            else:
                iso_fp, iso_tot, iso_fpr = 0, num_pre_eid, 0.0
                
            report_lines.append(f"- **Z-Score**: {z_fp}/{z_tot} flagged ({z_fpr*100:.1f}% FPR)\n")
            report_lines.append(f"- **CV-Clustering**: {cv_fp}/{cv_tot} flagged ({cv_fpr*100:.1f}% FPR)\n")
            if n >= 30:
                report_lines.append(f"- **Isolation Forest**: {iso_fp}/{iso_tot} flagged ({iso_fpr*100:.1f}% FPR)\n\n")
            else:
                report_lines.append(f"- **Isolation Forest**: (Skipped, n < 30 cold start limit)\n\n")
        else:
            report_lines.append("- *No pre-Eid data in this window*\n\n")
            
        report_lines.append("---\n\n")

    report_path = os.path.join(os.path.dirname(__file__), "data", "validation_report.md")
    with open(report_path, "w") as f:
        f.writelines(report_lines)
    print(f"Validation report saved to {report_path}")

if __name__ == "__main__":
    evaluate_model()
