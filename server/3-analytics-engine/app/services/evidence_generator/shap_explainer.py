import shap
import pandas as pd

class ShapExplainer:
    def __init__(self, model):
        self.model = model
        self.explainer = shap.TreeExplainer(self.model)
        
    def explain(self, X_anomalous: pd.DataFrame):
        shap_values = self.explainer.shap_values(X_anomalous)
        
        explanations = []
        # shap_values is a numpy array of shape (n_samples, n_features)
        for i in range(len(X_anomalous)):
            row_shap = shap_values[i]
            
            contributions = {
                'amount': float(row_shap[0]),
                'velocity': float(row_shap[1]),
                'type_encoded': float(row_shap[2])
            }
            explanations.append(contributions)
            
        return explanations
