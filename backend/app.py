# Arquivo: backend/app.py
from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db  

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    with app.app_context():
        from models.tables import License, User
        db.create_all()

    from routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=False)