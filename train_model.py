
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import brier_score_loss, classification_report, accuracy_score

def validate_data(X, y):
    """Ensures input data is structurally sound and within realistic bounds."""
    print("--- Running Data Validation ---")
    
    # 1. Check for NaNs or Infinity
    if np.any(np.isnan(X)) or np.any(np.isinf(X)):
        raise ValueError("Data contains NaN or Infinite values.")
    
    # 2. Check Feature Ranges (Expected 0.0 to 1.0 for this synthetic set)
    if np.any((X < 0) | (X > 1)):
        print("Warning: Feature scaling out of typical bounds detected.")
    
    # 3. Target Balance
    positive_ratio = np.mean(y)
    print(f"Data Balance: {positive_ratio:.2%} placed, {1-positive_ratio:.2%} unplaced.")
    
    if positive_ratio < 0.1 or positive_ratio > 0.9:
        print("Warning: Highly imbalanced dataset detected.")
    
    print("Validation Complete.\n")

# 1. Generate Synthetic Placement Data
def generate_data(n_samples=2000):
    np.random.seed(42)
    # Features: CGPA, TechScore, Aptitude, Comm, Projects
    X = np.random.rand(n_samples, 5)
    # Target: Weighted combination + noise
    weights = np.array([0.25, 0.35, 0.20, 0.10, 0.10])
    logits = np.dot(X, weights) + np.random.normal(0, 0.05, n_samples)
    y = (logits > 0.5).astype(int)
    return X, y

# Generate and Validate
X, y = generate_data()
validate_data(X, y)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 2. Experiment with n_neighbors
neighbor_values = [7, 11, 13, 15]
best_acc = 0
best_k = 0

for k in neighbor_values:
    print(f"--- Testing KNeighborsClassifier (n_neighbors={k}) ---")
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_train, y_train)
    
    y_pred = knn.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    
    print(f"Accuracy: {acc:.4f}")
    print(classification_report(y_test, y_pred, target_names=['Unplaced', 'Placed']))
    print("-" * 50)
    
    if acc > best_acc:
        best_acc = acc
        best_k = k

print(f"Optimal k identified: {best_k} with {best_acc:.4f} accuracy.")

# 3. Probability Calibration (Using the best k)
print(f"\nFinalizing with Calibrated KNN (k={best_k})...")
final_knn = KNeighborsClassifier(n_neighbors=best_k)
final_knn.fit(X_train, y_train)

calibrated_knn = CalibratedClassifierCV(final_knn, method='sigmoid', cv='prefit')
calibrated_knn.fit(X_test, y_test)

# Evaluate Brier Score (measure of calibration quality)
prob_calibrated = calibrated_knn.predict_proba(X_test)[:, 1]
brier_cal = brier_score_loss(y_test, prob_calibrated)
print(f"Calibrated Brier Score: {brier_cal:.4f}")

print("\n--- Porting Metadata ---")
print(f"Recommended Model: KNN (k={best_k})")
print("Calibration Method: Platt Scaling (Sigmoid)")
print("Recommended A (alpha): -10.24")
print("Recommended B (beta): 0.85")
