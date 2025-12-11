from flask import jsonify, request
from models.license import LicenseRepository, License, User
from typing import Dict, Any

class LicenseController:
    def __init__(self):
        self.repository = LicenseRepository()
    
    def get_all_licenses(self) -> tuple:
        """Retorna todas as licenças"""
        try:
            licenses = self.repository.get_all()
            return jsonify([l.to_dict() for l in licenses]), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def get_license(self, license_id: str) -> tuple:
        """Retorna uma licença específica"""
        try:
            license = self.repository.get_by_id(license_id)
            if not license:
                return jsonify({'error': 'Licença não encontrada'}), 404
            return jsonify(license.to_dict()), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def create_license(self) -> tuple:
        """Cria uma nova licença"""
        try:
            data = request.get_json()
            
            # Validação
            if not data or not all(k in data for k in ['name', 'email', 'activationEmail', 'activationPassword']):
                return jsonify({'error': 'Dados incompletos. Requer: name, email, activationEmail, activationPassword'}), 400
            
            license = self.repository.create(data)
            return jsonify(license.to_dict()), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def update_license(self, license_id: str) -> tuple:
        """Atualiza uma licença"""
        try:
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Dados não fornecidos'}), 400
            
            license = self.repository.update(license_id, data)
            if not license:
                return jsonify({'error': 'Licença não encontrada'}), 404
            
            return jsonify(license.to_dict()), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def delete_license(self, license_id: str) -> tuple:
        """Deleta uma licença"""
        try:
            success = self.repository.delete(license_id)
            if not success:
                return jsonify({'error': 'Licença não encontrada'}), 404
            return jsonify({'message': 'Licença deletada com sucesso'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def add_user_to_license(self, license_id: str) -> tuple:
        """Adiciona um usuário a uma licença"""
        try:
            data = request.get_json()
            if not data or not all(k in data for k in ['name', 'email']):
                return jsonify({'error': 'Dados incompletos. Requer: name, email'}), 400
            
            license = self.repository.add_user(license_id, data)
            if not license:
                return jsonify({'error': 'Licença não encontrada ou sem vagas disponíveis'}), 404
            
            return jsonify(license.to_dict()), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def remove_user_from_license(self, license_id: str, user_id: str) -> tuple:
        """Remove um usuário de uma licença"""
        try:
            license = self.repository.remove_user(license_id, user_id)
            if not license:
                return jsonify({'error': 'Licença ou usuário não encontrado'}), 404
            
            return jsonify(license.to_dict()), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def get_stats(self) -> tuple:
        """Retorna estatísticas gerais"""
        try:
            licenses = self.repository.get_all()
            total_licenses = len(licenses)
            total_users = sum(len(l.users) for l in licenses)
            total_slots = sum(l.maxUsers for l in licenses)
            available_slots = total_slots - total_users
            usage_percentage = round((total_users / total_slots * 100) if total_slots > 0 else 0)
            
            return jsonify({
                'totalLicenses': total_licenses,
                'totalUsers': total_users,
                'availableSlots': available_slots,
                'usagePercentage': usage_percentage
            }), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500




