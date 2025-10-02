# trainer.py
import pandas as pd
import joblib
from sklearn.preprocessing import MultiLabelBinarizer, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import StandardScaler

df = pd.read_csv("cwa_dataset_augmented.csv")
# ensure symptom lists are proper lists
import ast
def ensure_list(x):
    if isinstance(x, list): return x
    try:
        return ast.literal_eval(x)
    except:
        return []
df['symptom_list'] = df['symptom_list'].apply(ensure_list)

# create symptom multi-hot
mlb = MultiLabelBinarizer()
symptom_matrix = mlb.fit_transform(df['symptom_list'])
symptom_df = pd.DataFrame(symptom_matrix, columns=[f"sym_{s}" for s in mlb.classes_])
df2 = pd.concat([df.reset_index(drop=True), symptom_df.reset_index(drop=True)], axis=1)
# drop columns that are not features
drop_cols = ['symptom_list','symptoms']  # keep agent
for c in drop_cols:
    if c in df2.columns: df2 = df2.drop(columns=c)

# Choose features
numeric_cols = ["exposure_estimate","time_since_exposure_min","age","weight_kg",
                "heart_rate","respiratory","systolic_bp","oxygen","gcs"]
cat_cols = ["gender","comorbidity","exposure_route","severity","human_system"]
# keep symptom columns
symptom_cols = [c for c in df2.columns if c.startswith("sym_")]

# Ensure columns exist
numeric_cols = [c for c in numeric_cols if c in df2.columns]
cat_cols = [c for c in cat_cols if c in df2.columns]

X = df2[numeric_cols + cat_cols + symptom_cols]
y = df2['agent']

# Preprocessor
num_pipe = Pipeline([("imputer", SimpleImputer(strategy="median")), ("scaler", StandardScaler())])
cat_pipe = Pipeline([("imputer", SimpleImputer(strategy="most_frequent")), ("ohe", OneHotEncoder(handle_unknown="ignore"))])

pre = ColumnTransformer([
    ("num", num_pipe, numeric_cols),
    ("cat", cat_pipe, cat_cols)
], remainder='passthrough')  # passthrough symptoms (they are already numeric 0/1)

clf = Pipeline([
    ("pre", pre),
    ("rf", RandomForestClassifier(n_estimators=200, class_weight="balanced", random_state=42))
])

X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.15, stratify=y, random_state=42)
clf.fit(X_train, y_train)
y_pred = clf.predict(X_val)
print("Accuracy:", accuracy_score(y_val, y_pred))
print(classification_report(y_val, y_pred))

# Save artifacts
artifact = {
    "pipeline": clf,
    "mlb_classes": mlb.classes_.tolist(),
    "feature_columns": X.columns.tolist()
}
joblib.dump(artifact, "model_artifact.joblib")
print("Saved model_artifact.joblib")
