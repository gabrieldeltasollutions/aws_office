from typing import List, Optional
from app import db
from .tables import License, User
import time

class LicenseRepository:
    def __init__(self, db_path=None):
        pass
    
    def get_all(self) -> List[License]:
        return License.query.all()
    
    def get_by_id(self, license_id: str) -> Optional[License]:
        return License.query.get(license_id)
    
    def create(self, license_data: dict) -> License:
        new_id = str(int(time.time() * 1000))
        
        new_license = License(
            id=new_id,
            name=license_data['name'],
            email=license_data['email'],
            activation_email=license_data.get('activationEmail', ''),
            activation_password=license_data.get('activationPassword', ''),
            default_password=license_data.get('defaultPassword', ''),
            max_users=license_data.get('maxUsers', 5)
        )
        
        db.session.add(new_license)
        db.session.commit()
        return new_license
    
    def update(self, license_id: str, license_data: dict) -> Optional[License]:
        license = License.query.get(license_id)
        if not license:
            return None
        
        license.name = license_data.get('name', license.name)
        license.email = license_data.get('email', license.email)
        license.activation_email = license_data.get('activationEmail', license.activation_email)
        license.activation_password = license_data.get('activationPassword', license.activation_password)
        license.default_password = license_data.get('defaultPassword', license.default_password)
        license.max_users = license_data.get('maxUsers', license.max_users)
        
        db.session.commit()
        return license
    
    def delete(self, license_id: str) -> bool:
        license = License.query.get(license_id)
        if not license:
            return False
        
        db.session.delete(license)
        db.session.commit()
        return True
    
    def add_user(self, license_id: str, user_data: dict) -> Optional[License]:
        license = License.query.get(license_id)
        if not license:
            return None
            
        if len(license.users) >= license.max_users:
            return None
            
        new_user_id = str(int(time.time() * 1000))
        
        new_user = User(
            id=new_user_id,
            name=user_data['name'],
            email=user_data['email'],
            password=user_data.get('password', ''),
            default_password=user_data.get('defaultPassword', ''),
            license_id=license.id 
        )
        
        db.session.add(new_user)
        db.session.commit()
        return license
    
    def remove_user(self, license_id: str, user_id: str) -> Optional[License]:
        user = User.query.filter_by(id=user_id, license_id=license_id).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            
        return License.query.get(license_id)