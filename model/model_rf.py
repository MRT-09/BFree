import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint
import joblib

# Load dataset
df = pd.read_csv("dataset.csv")  # Replace with actual file path

# Drop uID column (not useful for prediction)
df.drop(columns=["uID"], inplace=True)

# Separate features and target label
X = df.drop(columns=["label"])
y = df["label"]

# Split into train and test sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Standardize features (optional, but not strictly necessary for trees)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Train Random Forest model
rf_model = RandomForestClassifier(n_estimators=100, random_state=42) # (n_estimators=267, random_state=42, max_depth=50, bootstrap=True, max_features=None, min_samples_leaf=1, min_samples_split=6) provided as best by RandomizedSearchCV but give 0.68 accuracy
# (n_estimators=100, random_state=42) - Default values


rf_model.fit(X_train, y_train)

# Make predictions
y_pred = rf_model.predict(X_test)

# Evaluate model
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.4f}")
print("Classification Report:\n", classification_report(y_test, y_pred))

joblib.dump(rf_model, "rf_model.pkl") 

# Define hyperparameter grid
# param_dist = {
#     "n_estimators": randint(50, 500),  # Number of trees
#     "max_depth": [None, 10, 20, 30, 40, 50],  # Tree depth
#     "min_samples_split": randint(2, 20),  # Min samples to split a node
#     "min_samples_leaf": randint(1, 20),  # Min samples at a leaf
#     "max_features": ["sqrt", "log2", None],  # Feature selection
#     "bootstrap": [True, False],  # Bootstrapping
# }

# # Initialize RandomForestClassifier
# rf = RandomForestClassifier(random_state=42)

# # RandomizedSearchCV with 50 iterations
# random_search = RandomizedSearchCV(
#     rf, param_distributions=param_dist, n_iter=50, cv=5, scoring="accuracy", n_jobs=-1, random_state=42
# )

# # Fit the model
# random_search.fit(X_train, y_train)

# # Best parameters
# print("Best parameters from RandomizedSearchCV:", random_search.best_params_)
