from flask import Blueprint, request, jsonify
from business.astrology_bo import generate_astrology_response

astrology_bp = Blueprint("astrology", __name__)

@astrology_bp.route("/astrology/<mode>", methods=["POST"])
def astrology_route(mode):
    if mode not in ["insight", "fortune"]:
        return jsonify({"error": "Invalid mode"}), 400
    
    data = request.get_json()
    result = generate_astrology_response(data, mode)
    return jsonify(result)
