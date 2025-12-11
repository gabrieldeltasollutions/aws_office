from typing import List, Optional
from dataclasses import dataclass, asdict
from datetime import datetime
import json
import os

@dataclass
class User:
    id: str
    name: str
    email: str

@dataclass
class License:
    id: str
    name: str
    email: str
    key: str
    users: List[User]
    maxUsers: int
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'key': self.key,
            'users': [{'id': u.id, 'name': u.name, 'email': u.email} for u in self.users],
            'maxUsers': self.maxUsers
        }

class LicenseRepository:
    def __init__(self, db_path: str = 'data/licenses.json'):
        self.db_path = db_path
        self._ensure_data_dir()
        self._load_data()
    
    def _ensure_data_dir(self):
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
    
    def _load_data(self):
        if os.path.exists(self.db_path):
            with open(self.db_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.licenses = [self._dict_to_license(d) for d in data]
        else:
            self.licenses = []
            self._save_data()
    
    def _save_data(self):
        with open(self.db_path, 'w', encoding='utf-8') as f:
            json.dump([l.to_dict() for l in self.licenses], f, indent=2, ensure_ascii=False)
    
    def _dict_to_license(self, d: dict) -> License:
        users = [User(**u) for u in d.get('users', [])]
        return License(
            id=d['id'],
            name=d['name'],
            email=d['email'],
            key=d['key'],
            users=users,
            maxUsers=d.get('maxUsers', 5)
        )
    
    def get_all(self) -> List[License]:
        return self.licenses
    
    def get_by_id(self, license_id: str) -> Optional[License]:
        for license in self.licenses:
            if license.id == license_id:
                return license
        return None
    
    def create(self, license_data: dict) -> License:
        import time
        new_license = License(
            id=str(int(time.time() * 1000)),
            name=license_data['name'],
            email=license_data['email'],
            key=license_data['key'],
            users=[],
            maxUsers=license_data.get('maxUsers', 5)
        )
        self.licenses.append(new_license)
        self._save_data()
        return new_license
    
    def update(self, license_id: str, license_data: dict) -> Optional[License]:
        license = self.get_by_id(license_id)
        if not license:
            return None
        
        license.name = license_data.get('name', license.name)
        license.email = license_data.get('email', license.email)
        license.key = license_data.get('key', license.key)
        license.maxUsers = license_data.get('maxUsers', license.maxUsers)
        
        if 'users' in license_data:
            license.users = [User(**u) for u in license_data['users']]
        
        self._save_data()
        return license
    
    def delete(self, license_id: str) -> bool:
        license = self.get_by_id(license_id)
        if not license:
            return False
        
        self.licenses.remove(license)
        self._save_data()
        return True
    
    def add_user(self, license_id: str, user_data: dict) -> Optional[License]:
        license = self.get_by_id(license_id)
        if not license:
            return None
        
        if len(license.users) >= license.maxUsers:
            return None
        
        import time
        new_user = User(
            id=str(int(time.time() * 1000)),
            name=user_data['name'],
            email=user_data['email']
        )
        license.users.append(new_user)
        self._save_data()
        return license
    
    def remove_user(self, license_id: str, user_id: str) -> Optional[License]:
        license = self.get_by_id(license_id)
        if not license:
            return None
        
        license.users = [u for u in license.users if u.id != user_id]
        self._save_data()
        return license



