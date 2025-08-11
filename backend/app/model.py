import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import LabelEncoder

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

        # Encode existing columns with label encoders
        for col in ['gender', 'symptoms', 'human_system']:
            le = self.label_encoders.get(col)
            if le:
                self.df[col] = le.transform(self.df[col].astype(str))
            else:
                self.df[col] = 0

        # *** Add label encoder for 'agent' column ***
        if 'agent' in self.df.columns:
            le_agent = LabelEncoder()
            self.df['agent_encoded'] = le_agent.fit_transform(self.df['agent'])
            self.label_encoders['agent'] = le_agent
        else:
            # If 'agent' column not present, fallback
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
            score = model.predict(X_pred_df)[0]
            scores[agent] = score
        return scores

    def find_best_row_among_agents(self, X_pred, agents_list):
        # Filter rows for given agents
        # Use 'agent' column to match string agent names here (not encoded)
        df_candidates = self.df[self.df['agent'].isin(agents_list)].copy()
        if df_candidates.empty:
            return None

        # Preprocess candidate features same as dataset columns
        feature_matrix_candidates = df_candidates[self.features].to_numpy()

        distances = np.linalg.norm(feature_matrix_candidates - X_pred.to_numpy()[0], axis=1)
        idx = np.argmin(distances)
        best_row = df_candidates.iloc[idx]
        return best_row

    def predict(self, input_data: dict, top_n=3):
        X_pred_df = self.preprocess_input(input_data)
        scores = self.predict_agent_scores(X_pred_df)
        top_agents = sorted(scores, key=scores.get, reverse=True)[:top_n]
        best_row = self.find_best_row_among_agents(X_pred_df, top_agents)
        if best_row is None:
            raise Exception("No matching data found for top agents")

        raw_score = scores[best_row['agent']]
        min_score = 0
        max_score = 3
        normalized_score = (raw_score - min_score) / (max_score - min_score)
        normalized_score = round(normalized_score, 2)

        return {
            "predicted_agent": best_row['agent'],
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
