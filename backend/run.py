from flask_cors import CORS
from flask import Flask
from data import models 
from data.astrology_db import Base, engine
from routes.astrology_routes import astrology_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(astrology_bp)
    Base.metadata.create_all(bind=engine)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
