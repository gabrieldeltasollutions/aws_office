from flask import Blueprint
from controllers.license_controller import LicenseController

api_bp = Blueprint('api', __name__)
controller = LicenseController()

# Rotas de licenças
api_bp.add_url_rule('/licenses', 'get_all_licenses', controller.get_all_licenses, methods=['GET'])
api_bp.add_url_rule('/licenses', 'create_license', controller.create_license, methods=['POST'])
api_bp.add_url_rule('/licenses/<license_id>', 'get_license', controller.get_license, methods=['GET'])
api_bp.add_url_rule('/licenses/<license_id>', 'update_license', controller.update_license, methods=['PUT'])
api_bp.add_url_rule('/licenses/<license_id>', 'delete_license', controller.delete_license, methods=['DELETE'])

# Rotas de usuários
api_bp.add_url_rule('/licenses/<license_id>/users', 'add_user', controller.add_user_to_license, methods=['POST'])
api_bp.add_url_rule('/licenses/<license_id>/users/<user_id>', 'remove_user', controller.remove_user_from_license, methods=['DELETE'])

# Rotas de estatísticas
api_bp.add_url_rule('/stats', 'get_stats', controller.get_stats, methods=['GET'])



