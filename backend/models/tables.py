from extensions import db

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(200), default="")
    default_password = db.Column(db.String(200), default="")
    
    license_id = db.Column(db.String(50), db.ForeignKey('licenses.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'password': self.password,
            'defaultPassword': self.default_password
        }

class License(db.Model):
    __tablename__ = 'licenses'

    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    activation_email = db.Column(db.String(120), default="")
    activation_password = db.Column(db.String(200), default="")
    default_password = db.Column(db.String(200), default="")
    max_users = db.Column(db.Integer, default=5)
    
    users = db.relationship('User', backref='license', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'activationEmail': self.activation_email,
            'activationPassword': self.activation_password,
            'defaultPassword': self.default_password,
            'maxUsers': self.max_users,
            'users': [u.to_dict() for u in self.users]
        }