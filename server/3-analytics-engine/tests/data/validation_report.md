# IsolationForest Model Validation Report

This report benchmarks the IsolationForest ML model against the deterministic Z-Score and CV Clustering baseline models.

## Transaction History Size: n=30

### Category: Velocity
*(Total Ground Truth Anomalies in subset: 0)*

- *No ground truth anomalies of this category in this window*

### Category: Amount
*(Total Ground Truth Anomalies in subset: 1)*

- **Z-Score**: Precision: 1.00 | Recall: 1.00 | F1: 1.00
- **CV-Clustering**: Precision: 0.00 | Recall: 0.00 | F1: 0.00 *(Expected low recall: CV only designed for clustering)*
- **Isolation Forest**: Precision: 0.12 | Recall: 1.00 | F1: 0.22

### Category: Clustering
*(Total Ground Truth Anomalies in subset: 0)*

- *No ground truth anomalies of this category in this window*

### Category: Multi_dimensional
*(Total Ground Truth Anomalies in subset: 0)*

- *No ground truth anomalies of this category in this window*

### Normal-but-Busy Baseline (Pre-Eid Spike False Positives)
*(Total Pre-Eid txs in subset: 0)*

- *No pre-Eid data in this window*

---

## Transaction History Size: n=50

### Category: Velocity
*(Total Ground Truth Anomalies in subset: 0)*

- *No ground truth anomalies of this category in this window*

### Category: Amount
*(Total Ground Truth Anomalies in subset: 1)*

- **Z-Score**: Precision: 1.00 | Recall: 1.00 | F1: 1.00
- **CV-Clustering**: Precision: 0.00 | Recall: 0.00 | F1: 0.00 *(Expected low recall: CV only designed for clustering)*
- **Isolation Forest**: Precision: 0.09 | Recall: 1.00 | F1: 0.17

### Category: Clustering
*(Total Ground Truth Anomalies in subset: 0)*

- *No ground truth anomalies of this category in this window*

### Category: Multi_dimensional
*(Total Ground Truth Anomalies in subset: 0)*

- *No ground truth anomalies of this category in this window*

### Normal-but-Busy Baseline (Pre-Eid Spike False Positives)
*(Total Pre-Eid txs in subset: 0)*

- *No pre-Eid data in this window*

---

## Transaction History Size: n=100

### Category: Velocity
*(Total Ground Truth Anomalies in subset: 10)*

- **Z-Score**: Precision: 0.00 | Recall: 0.00 | F1: 0.00
- **CV-Clustering**: Precision: 0.00 | Recall: 0.00 | F1: 0.00 *(Expected low recall: CV only designed for clustering)*
- **Isolation Forest**: Precision: 0.00 | Recall: 0.00 | F1: 0.00

### Category: Amount
*(Total Ground Truth Anomalies in subset: 1)*

- **Z-Score**: Precision: 1.00 | Recall: 1.00 | F1: 1.00
- **CV-Clustering**: Precision: 0.00 | Recall: 0.00 | F1: 0.00 *(Expected low recall: CV only designed for clustering)*
- **Isolation Forest**: Precision: 0.05 | Recall: 1.00 | F1: 0.10

### Category: Clustering
*(Total Ground Truth Anomalies in subset: 0)*

- *No ground truth anomalies of this category in this window*

### Category: Multi_dimensional
*(Total Ground Truth Anomalies in subset: 0)*

- *No ground truth anomalies of this category in this window*

### Normal-but-Busy Baseline (Pre-Eid Spike False Positives)
*(Total Pre-Eid txs in subset: 0)*

- *No pre-Eid data in this window*

---

## Transaction History Size: n=500

### Category: Velocity
*(Total Ground Truth Anomalies in subset: 10)*

- **Z-Score**: Precision: 0.00 | Recall: 0.00 | F1: 0.00
- **CV-Clustering**: Precision: 0.00 | Recall: 0.00 | F1: 0.00 *(Expected low recall: CV only designed for clustering)*
- **Isolation Forest**: Precision: 0.00 | Recall: 0.00 | F1: 0.00

### Category: Amount
*(Total Ground Truth Anomalies in subset: 4)*

- **Z-Score**: Precision: 0.33 | Recall: 1.00 | F1: 0.50
- **CV-Clustering**: Precision: 0.00 | Recall: 0.00 | F1: 0.00 *(Expected low recall: CV only designed for clustering)*
- **Isolation Forest**: Precision: 0.04 | Recall: 1.00 | F1: 0.08

### Category: Clustering
*(Total Ground Truth Anomalies in subset: 15)*

- **Z-Score**: Precision: 0.00 | Recall: 0.00 | F1: 0.00 *(Expected low recall: Z-score not designed for this)*
- **CV-Clustering**: Precision: 0.00 | Recall: 0.00 | F1: 0.00
- **Isolation Forest**: Precision: 0.16 | Recall: 1.00 | F1: 0.28

### Category: Multi_dimensional
*(Total Ground Truth Anomalies in subset: 8)*

- **Z-Score**: Precision: 0.67 | Recall: 1.00 | F1: 0.80 *(Expected low recall: Z-score not designed for this)*
- **CV-Clustering**: Precision: 0.00 | Recall: 0.00 | F1: 0.00 *(Expected low recall: CV only designed for clustering)*
- **Isolation Forest**: Precision: 0.09 | Recall: 1.00 | F1: 0.16

### Normal-but-Busy Baseline (Pre-Eid Spike False Positives)
*(Total Pre-Eid txs in subset: 50)*

- **Z-Score**: 0/50 flagged (0.0% FPR)
- **CV-Clustering**: 0/50 flagged (0.0% FPR)
- **Isolation Forest**: 4/50 flagged (8.0% FPR)

---

