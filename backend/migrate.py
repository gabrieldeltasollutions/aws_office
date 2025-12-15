import json
import os
from app import create_app
from extensions import db
from models.tables import License, User

app = create_app()

def migrate():
    json_path = 'data/licenses.json'
    
    if not os.path.exists(json_path):
        json_path = 'licenses.json'
        if not os.path.exists(json_path):
            print(f" Erro: Arquivo licenses.json não encontrado em 'data/' nem na raiz.")
            return

    print(f" Lendo arquivo: {json_path}")

    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f" Erro ao ler JSON: {e}")
        return

    with app.app_context():
        db.create_all()
        
        licenses_added = 0
        users_added = 0
        skipped = 0

        print(" Iniciando migração...")

        for item in data:
            if License.query.get(item['id']):
                print(f"   ⚠️  Pular licença {item['id']} (já existe)")
                skipped += 1
                continue

            new_license = License(
                id=str(item['id']),
                name=item.get('name', 'Sem Nome'),
                email=item.get('email', ''),
                activation_email=item.get('activationEmail', ''),
                activation_password=item.get('activationPassword', ''),
                default_password=item.get('defaultPassword', ''),
                max_users=item.get('maxUsers', 5)
            )
            
            db.session.add(new_license)
            licenses_added += 1

            users_list = item.get('users', [])
            for u in users_list:
                new_user = User(
                    id=str(u['id']),
                    name=u.get('name', ''),
                    email=u.get('email', ''),
                    password=u.get('password', ''),
                    default_password=u.get('defaultPassword', ''),
                    license=new_license 
                )
                db.session.add(new_user)
                users_added += 1

        try:
            db.session.commit()
            print("\n" + "="*40)
            print(" MIGRAÇÃO CONCLUÍDA COM SUCESSO!")
            print("="*40)
            print(f" Resumo:")
            print(f"   - Licenças importadas: {licenses_added}")
            print(f"   - Usuários importados: {users_added}")
            print(f"   - Licenças ignoradas (já existiam): {skipped}")
            print("="*40)
        except Exception as e:
            db.session.rollback()
            print(f" Erro crítico ao salvar no banco: {e}")

if __name__ == '__main__':
    migrate()