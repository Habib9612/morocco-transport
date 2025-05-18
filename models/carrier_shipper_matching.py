"""
Carrier-Shipper Matching ML Model

This module provides a machine learning algorithm to match carriers with shippers
based on multiple factors:
- Load size compatibility
- Destination/route preferences
- Historical reliability metrics
- Cost efficiency

The model uses a combination of collaborative filtering and gradient boosting
to provide intelligent recommendations.
"""

import numpy as np
import pandas as pd
import joblib
import os
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# Constants
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'carrier_shipper_model.joblib')


class CarrierShipperMatcher:
    """Main class for carrier-shipper matching algorithm"""
    
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.features = [
            'load_size', 'distance', 'carrier_reliability_score', 
            'carrier_cost_efficiency', 'shipper_payment_speed',
            'carrier_location', 'destination'
        ]
    
    def preprocess_data(self, data):
        """Preprocess data for model training or inference"""
        # Define preprocessing steps for numerical and categorical features
        numerical_features = ['load_size', 'distance', 'carrier_reliability_score', 
                              'carrier_cost_efficiency', 'shipper_payment_speed']
        categorical_features = ['carrier_location', 'destination']
        
        numerical_transformer = Pipeline(steps=[
            ('scaler', StandardScaler())
        ])
        
        categorical_transformer = Pipeline(steps=[
            ('onehot', OneHotEncoder(handle_unknown='ignore'))
        ])
        
        # Create preprocessor
        self.preprocessor = ColumnTransformer(
            transformers=[
                ('num', numerical_transformer, numerical_features),
                ('cat', categorical_transformer, categorical_features)
            ])
        
        return self.preprocessor.fit_transform(data[self.features])
    
    def train(self, historical_data):
        """Train the model with historical matching data"""
        print("Training carrier-shipper matching model...")
        
        # Extract features and target
        X = historical_data[self.features]
        y = historical_data['match_success']  # Boolean indicating if match was successful
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Preprocess data
        X_train_processed = self.preprocess_data(X_train)
        
        # Initialize and train the model
        self.model = GradientBoostingClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_train_processed, y_train)
        
        # Evaluate model
        X_test_processed = self.preprocessor.transform(X_test)
        y_pred = self.model.predict(X_test_processed)
        
        # Print metrics
        print(f"Model Accuracy: {accuracy_score(y_test, y_pred):.4f}")
        print(f"Model Precision: {precision_score(y_test, y_pred):.4f}")
        print(f"Model Recall: {recall_score(y_test, y_pred):.4f}")
        print(f"Model F1 Score: {f1_score(y_test, y_pred):.4f}")
        
        # Save the model
        self.save_model()
        
        return {
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred),
            'recall': recall_score(y_test, y_pred),
            'f1': f1_score(y_test, y_pred)
        }
    
    def predict_matches(self, carrier_data, shipper_data):
        """
        Find the best matches between carriers and shippers
        
        Parameters:
        carrier_data (pd.DataFrame): DataFrame containing carrier information
        shipper_data (pd.DataFrame): DataFrame containing shipper and load information
        
        Returns:
        List of (carrier_id, shipper_id, score) tuples sorted by matching score
        """
        if self.model is None:
            self.load_model()
            
        matches = []
        
        for _, carrier in carrier_data.iterrows():
            for _, shipment in shipper_data.iterrows():
                # Create feature vector for this carrier-shipment pair
                features = pd.DataFrame({
                    'load_size': [shipment['load_size']],
                    'distance': [self._calculate_distance(carrier['location'], shipment['destination'])],
                    'carrier_reliability_score': [carrier['reliability_score']],
                    'carrier_cost_efficiency': [carrier['cost_efficiency']],
                    'shipper_payment_speed': [shipment['shipper_payment_speed']],
                    'carrier_location': [carrier['location']],
                    'destination': [shipment['destination']]
                })
                
                # Preprocess and predict
                X = self.preprocessor.transform(features)
                score = self.model.predict_proba(X)[0][1]  # Probability of successful match
                
                matches.append((carrier['carrier_id'], shipment['shipment_id'], score))
        
        # Sort matches by score in descending order
        matches.sort(key=lambda x: x[2], reverse=True)
        return matches
    
    def save_model(self):
        """Save model to disk"""
        if self.model is not None and self.preprocessor is not None:
            joblib.dump({
                'model': self.model,
                'preprocessor': self.preprocessor
            }, MODEL_PATH)
            print(f"Model saved to {MODEL_PATH}")
    
    def load_model(self):
        """Load model from disk"""
        if os.path.exists(MODEL_PATH):
            loaded = joblib.load(MODEL_PATH)
            self.model = loaded['model']
            self.preprocessor = loaded['preprocessor']
            print(f"Model loaded from {MODEL_PATH}")
            return True
        else:
            print(f"No model found at {MODEL_PATH}")
            return False
    
    def _calculate_distance(self, location1, location2):
        """
        Calculate distance between two locations
        In a real implementation, this would use geocoding and distance APIs
        For simplicity, we'll assume this returns a numerical distance
        """
        # Placeholder implementation - would use geocoding APIs in production
        # For training data, we can assume this field is already calculated
        return 100  # Placeholder value
        

# Create a simple API wrapper for the model
class MatchingAPI:
    def __init__(self):
        self.matcher = CarrierShipperMatcher()
        # Try to load existing model
        self.matcher.load_model()
    
    def get_top_matches(self, carrier_id=None, shipment_id=None, top_n=5):
        """
        Get top matches for a carrier or a shipment
        
        Parameters:
        carrier_id: If provided, get top shipments for this carrier
        shipment_id: If provided, get top carriers for this shipment
        top_n: Number of top matches to return
        
        Returns:
        List of matches with scores
        """
        # This would access a database in a real implementation
        # For demonstration, we'll create sample data
        
        if carrier_id:
            # Get available shipments
            shipments = self._get_available_shipments()
            carrier = self._get_carrier(carrier_id)
            
            if carrier is None:
                return {"error": "Carrier not found"}
                
            carrier_df = pd.DataFrame([carrier])
            
            matches = self.matcher.predict_matches(carrier_df, shipments)
            return [{"shipment_id": m[1], "score": m[2]} for m in matches[:top_n]]
            
        elif shipment_id:
            # Get available carriers
            carriers = self._get_available_carriers()
            shipment = self._get_shipment(shipment_id)
            
            if shipment is None:
                return {"error": "Shipment not found"}
                
            shipment_df = pd.DataFrame([shipment])
            
            matches = self.matcher.predict_matches(carriers, shipment_df)
            return [{"carrier_id": m[0], "score": m[2]} for m in matches[:top_n]]
            
        else:
            return {"error": "Either carrier_id or shipment_id must be provided"}
    
    def _get_available_carriers(self):
        """Mock function to get available carriers from database"""
        # In a real implementation, this would query the database
        return pd.DataFrame([
            {"carrier_id": "C1", "location": "New York", "reliability_score": 0.95, "cost_efficiency": 0.85},
            {"carrier_id": "C2", "location": "Los Angeles", "reliability_score": 0.88, "cost_efficiency": 0.92},
            {"carrier_id": "C3", "location": "Chicago", "reliability_score": 0.91, "cost_efficiency": 0.78},
        ])
    
    def _get_available_shipments(self):
        """Mock function to get available shipments from database"""
        # In a real implementation, this would query the database
        return pd.DataFrame([
            {"shipment_id": "S1", "load_size": 1500, "destination": "Boston", "shipper_payment_speed": 0.89},
            {"shipment_id": "S2", "load_size": 2200, "destination": "Miami", "shipper_payment_speed": 0.95},
            {"shipment_id": "S3", "load_size": 950, "destination": "Denver", "shipper_payment_speed": 0.82},
        ])
    
    def _get_carrier(self, carrier_id):
        """Mock function to get a specific carrier"""
        # In a real implementation, this would query the database
        carriers = self._get_available_carriers()
        carrier = carriers[carriers["carrier_id"] == carrier_id]
        return carrier.to_dict('records')[0] if not carrier.empty else None
    
    def _get_shipment(self, shipment_id):
        """Mock function to get a specific shipment"""
        # In a real implementation, this would query the database
        shipments = self._get_available_shipments()
        shipment = shipments[shipments["shipment_id"] == shipment_id]
        return shipment.to_dict('records')[0] if not shipment.empty else None
    

# If running as a script, execute a simple demo
if __name__ == "__main__":
    # Create a sample training dataset
    print("Creating sample dataset for demonstration...")
    
    # Generate mock historical data
    np.random.seed(42)
    n_samples = 1000
    
    locations = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego"]
    destinations = ["Boston", "Miami", "Denver", "Seattle", "Detroit", "Portland", "Austin", "Dallas"]
    
    historical_data = pd.DataFrame({
        'load_size': np.random.uniform(500, 5000, n_samples),
        'distance': np.random.uniform(50, 2000, n_samples),
        'carrier_reliability_score': np.random.uniform(0.5, 1.0, n_samples),
        'carrier_cost_efficiency': np.random.uniform(0.5, 1.0, n_samples),
        'shipper_payment_speed': np.random.uniform(0.5, 1.0, n_samples),
        'carrier_location': np.random.choice(locations, n_samples),
        'destination': np.random.choice(destinations, n_samples)
    })
    
    # Generate target variable (match success)
    # A simple rule: higher reliability and efficiency scores with reasonable distance lead to successful matches
    score = (
        historical_data['carrier_reliability_score'] * 0.4 +
        historical_data['carrier_cost_efficiency'] * 0.3 +
        historical_data['shipper_payment_speed'] * 0.2 -
        historical_data['distance'] / 5000  # Normalize distance to be between 0 and ~0.4
    )
    
    # Add some randomness
    score += np.random.normal(0, 0.1, n_samples)
    historical_data['match_success'] = (score > 0.6).astype(int)
    
    # Train the model
    matcher = CarrierShipperMatcher()
    metrics = matcher.train(historical_data)
    
    print("\nModel training completed with the following metrics:")
    for key, value in metrics.items():
        print(f"{key.capitalize()}: {value:.4f}")
    
    # Demo the API
    print("\nDemonstrating API...")
    api = MatchingAPI()
    
    # Get top matches for a carrier
    carrier_matches = api.get_top_matches(carrier_id="C1")
    print("\nTop shipments for carrier C1:")
    for match in carrier_matches:
        print(f"Shipment {match['shipment_id']}: Match score {match['score']:.4f}")
    
    # Get top matches for a shipment
    shipment_matches = api.get_top_matches(shipment_id="S2")
    print("\nTop carriers for shipment S2:")
    for match in shipment_matches:
        print(f"Carrier {match['carrier_id']}: Match score {match['score']:.4f}")