from flask import Flask
from flask_cors import CORS
from config import Config
from routes import api_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Habilitar CORS para o frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Registrar blueprints
    app.register_blueprint(api_bp, url_prefix='/api')
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)

