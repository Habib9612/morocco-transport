"""
Carrier-Shipper Matching API

This module provides a Flask API that exposes the machine learning model
for carrier-shipper matching.
"""

from flask import Flask, request, jsonify
from carrier_shipper_matching import MatchingAPI, CarrierShipperMatcher
import pandas as pd
import os
import threading

app = Flask(__name__)
matching_api = MatchingAPI()

# Optional: Background training thread
training_active = False

def train_model_background():
    """Train the model in a background thread to avoid blocking API requests"""
    global training_active
    try:
        print("Starting model training...")
        # Create a sample training dataset as in carrier_shipper_matching.py main
        import numpy as np
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
        score = (
            historical_data['carrier_reliability_score'] * 0.4 +
            historical_data['carrier_cost_efficiency'] * 0.3 +
            historical_data['shipper_payment_speed'] * 0.2 -
            historical_data['distance'] / 5000
        )
        
        score += np.random.normal(0, 0.1, n_samples)
        historical_data['match_success'] = (score > 0.6).astype(int)
        
        # Train the model
        matcher = CarrierShipperMatcher()
        metrics = matcher.train(historical_data)
        
        # Update the model in the API
        matching_api.matcher = matcher
        
        print("Model training completed with metrics:", metrics)
    finally:
        training_active = False


@app.route('/api/model/train', methods=['POST'])
def train_model():
    """Endpoint to trigger model training"""
    global training_active
    
    if training_active:
        return jsonify({
            "status": "error",
            "message": "Training already in progress"
        }), 400
    
    training_active = True
    thread = threading.Thread(target=train_model_background)
    thread.daemon = True
    thread.start()
    
    return jsonify({
        "status": "success",
        "message": "Model training started in background"
    })


@app.route('/api/model/status', methods=['GET'])
def model_status():
    """Endpoint to check if a model exists and if training is in progress"""
    model_exists = os.path.exists(os.path.join(os.path.dirname(__file__), 'carrier_shipper_model.joblib'))
    
    return jsonify({
        "model_exists": model_exists,
        "training_active": training_active
    })


@app.route('/api/matches/carrier/<carrier_id>', methods=['GET'])
def get_matches_for_carrier(carrier_id):
    """Get top shipments for a specific carrier"""
    try:
        top_n = request.args.get('top_n', default=5, type=int)
        matches = matching_api.get_top_matches(carrier_id=carrier_id, top_n=top_n)
        
        if isinstance(matches, dict) and 'error' in matches:
            return jsonify({
                "status": "error",
                "message": matches['error']
            }), 404
            
        return jsonify({
            "status": "success",
            "carrier_id": carrier_id,
            "matches": matches
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route('/api/matches/shipment/<shipment_id>', methods=['GET'])
def get_matches_for_shipment(shipment_id):
    """Get top carriers for a specific shipment"""
    try:
        top_n = request.args.get('top_n', default=5, type=int)
        matches = matching_api.get_top_matches(shipment_id=shipment_id, top_n=top_n)
        
        if isinstance(matches, dict) and 'error' in matches:
            return jsonify({
                "status": "error",
                "message": matches['error']
            }), 404
            
        return jsonify({
            "status": "success",
            "shipment_id": shipment_id,
            "matches": matches
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route('/api/batch/match', methods=['POST'])
def batch_match():
    """Batch processing endpoint for matching multiple carriers with multiple shipments"""
    try:
        data = request.get_json()
        
        if not data or not isinstance(data, dict):
            return jsonify({
                "status": "error", 
                "message": "Invalid request format"
            }), 400
            
        carriers_data = data.get('carriers', [])
        shipments_data = data.get('shipments', [])
        
        if not carriers_data or not shipments_data:
            return jsonify({
                "status": "error",
                "message": "Both carriers and shipments data are required"
            }), 400
            
        # Convert to DataFrame
        carriers_df = pd.DataFrame(carriers_data)
        shipments_df = pd.DataFrame(shipments_data)
        
        # Use the matcher directly for batch processing
        matches = matching_api.matcher.predict_matches(carriers_df, shipments_df)
        
        # Format results
        results = []
        for carrier_id, shipment_id, score in matches:
            results.append({
                "carrier_id": carrier_id,
                "shipment_id": shipment_id,
                "match_score": score
            })
            
        return jsonify({
            "status": "success",
            "matches": results
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "version": "1.0.0"
    })


if __name__ == '__main__':
    # Check if model exists, if not, start training
    model_path = os.path.join(os.path.dirname(__file__), 'carrier_shipper_model.joblib')
    if not os.path.exists(model_path) and not training_active:
        print("No pre-trained model found. Starting initial training...")
        training_active = True
        thread = threading.Thread(target=train_model_background)
        thread.daemon = True
        thread.start()
    
    # Start the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)