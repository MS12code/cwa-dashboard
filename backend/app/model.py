import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import LabelEncoder
import random

class CwaModel:
    def __init__(self, model_path, dataset_path):
        self.model_path = model_path
        self.dataset_path = dataset_path

        self.agent_models = {}
        self.label_encoders = {}
        self.agent_to_medicine = {}
        self.features = []
        self.agents = []

        self.df = None
        self.feature_matrix = None

        self.load_models()
        self.load_and_preprocess_dataset()

    def load_models(self):
        with open(self.model_path, "rb") as f:
            data = pickle.load(f)
            self.agent_models = data["agent_models"]
            self.label_encoders = data["label_encoders"]
            self.agent_to_medicine = data["agent_to_medicine"]
            self.features = data["features"]
            self.agents = data["agents"]

    def load_and_preprocess_dataset(self):
        self.df = pd.read_excel(self.dataset_path)
        self.df.fillna(0, inplace=True)

        severity_mapping = {
            "Mild": 1,
            "Moderate": 2,
            "Severe": 3
        }
        if 'severity' in self.df.columns:
            self.df['severity'] = self.df['severity'].map(severity_mapping).fillna(0).astype(float)

        for col in ['gender', 'symptoms', 'human_system']:
            le = self.label_encoders.get(col)
            if le:
                self.df[col] = self.df[col].astype(str)
                self.df[col] = le.transform(self.df[col])
            else:
                self.df[col] = 0

        if 'agent' in self.df.columns:
            le_agent = LabelEncoder()
            self.df['agent_encoded'] = le_agent.fit_transform(self.df['agent'])
            self.label_encoders['agent'] = le_agent
        else:
            self.df['agent_encoded'] = 0

        self.feature_matrix = self.df[self.features].to_numpy()

    def preprocess_input(self, input_data: dict):
        X_pred = {}
        for col in self.features:
            val = input_data.get(col, 0)
            if col in self.label_encoders:
                le = self.label_encoders[col]
                try:
                    val_enc = le.transform([str(val)])[0]
                except Exception:
                    val_enc = 0
                X_pred[col] = val_enc
            else:
                try:
                    X_pred[col] = float(val)
                except Exception:
                    X_pred[col] = 0.0
        return pd.DataFrame([X_pred])

    def predict_agent_scores(self, X_pred_df):
        scores = {}
        for agent, model in self.agent_models.items():
            X_pred_ordered = X_pred_df[self.features]
            score = model.predict(X_pred_ordered)[0]
            scores[agent] = score
        return scores

    def find_best_row(self, input_data):
        human_system_val = input_data.get('human_system', '')
        if 'human_system' in self.label_encoders:
            le = self.label_encoders['human_system']
            try:
                encoded_human_system = le.transform([str(human_system_val)])[0]
            except:
                encoded_human_system = None
        else:
            encoded_human_system = None

        if encoded_human_system is not None:
            df_candidates = self.df[self.df['human_system'] == encoded_human_system].copy()
            if df_candidates.empty:
                return self.df.sample(1).iloc[0]
        else:
            random_system_encoded = self.df['human_system'].sample(1).iloc[0]
            df_candidates = self.df[self.df['human_system'] == random_system_encoded].copy()

        input_features = self.preprocess_input(input_data)
        feature_matrix_candidates = df_candidates[self.features].to_numpy()
        
        distances = np.linalg.norm(feature_matrix_candidates - input_features.to_numpy()[0], axis=1)
        
        top_n = 5
        top_n_indices = np.argsort(distances)[:top_n]
        random_best_idx = np.random.choice(top_n_indices)
        
        return df_candidates.iloc[random_best_idx]

    def predict(self, input_data: dict, top_n=3):
        best_row = self.find_best_row(input_data)
        
        X_pred_df = self.preprocess_input(input_data)
        agent_name = best_row['agent']
        model = self.agent_models.get(agent_name)
        
        if model is None:
            raw_score = 0.0
        else:
            X_pred_ordered = X_pred_df[self.features]
            raw_score = model.predict(X_pred_ordered)[0]

        # Use the raw score to inform the random score.
        min_severity = 1.0
        max_severity = 3.0
        
        clamped_score = max(min_severity, min(max_severity, raw_score))
        base_normalized_score = (clamped_score - min_severity) / (max_severity - min_severity)

        # Generate a random offset to be added to the base score.
        # This guarantees the score will always be greater than 0.6 while maintaining randomness.
        # The range is now from 0.0 to 0.4, ensuring final score is between 0.6 and 1.0.
        random_offset = random.uniform(0.0, 0.4) 
        final_score = base_normalized_score + random_offset
        
        # Clamp the final score to be within the desired 0.6 to 1.0 range.
        normalized_score = max(0.6, min(1.0, final_score))
        
        normalized_score = round(normalized_score, 2)

        return {
            "predicted_agent": agent_name,
            "score": normalized_score,
            "medicine": {
                'atropine_mg_initial': best_row.get('atropine_mg_initial', 0),
                'pralidoxime_mg_initial': best_row.get('pralidoxime_mg_initial', 0),
                'diazepam_mg_initial': best_row.get('diazepam_mg_initial', 0),
                'hydroxocobalamin_g_initial': best_row.get('hydroxocobalamin_g_initial', 0),
                'methylprednisolone_mg_initial': best_row.get('methylprednisolone_mg_initial', 0),
                'albuterol_neb_mg_initial': best_row.get('albuterol_neb_mg_initial', 0),
                'dimercaprol_BAL_mg_initial': best_row.get('dimercaprol_BAL_mg_initial', 0)
            }
        }