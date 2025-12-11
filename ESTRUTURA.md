# 📁 Estrutura do Projeto - Office 365 Hub

## Organização dos Diretórios

```
aws/
├── backend/                    # Backend Python (Flask) - MVC
│   ├── app.py                 # Aplicação principal Flask
│   ├── config.py              # Configurações
│   ├── routes.py              # Definição de rotas da API
│   ├── requirements.txt       # Dependências Python
│   ├── .env.example          # Exemplo de variáveis de ambiente
│   ├── .gitignore            # Arquivos ignorados pelo Git
│   ├── models/                # Modelos de dados (MVC)
│   │   ├── __init__.py
│   │   └── license.py        # Modelo License e Repository
│   └── controllers/           # Controladores (MVC)
│       ├── __init__.py
│       └── license_controller.py  # Lógica de negócio
│
├── office-365-hub/            # Frontend React (projeto original)
│   ├── src/
│   │   ├── pages/
│   │   │   └── Index.tsx     # Página principal (atualizada para usar API)
│   │   ├── components/
│   │   │   ├── LicenseCard.tsx      # Card de licença (atualizado)
│   │   │   ├── AddLicenseDialog.tsx
│   │   │   └── AddUserDialog.tsx
│   │   └── services/
│   │       └── api.ts        # Serviço de API (NOVO)
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example          # Variáveis de ambiente do frontend
│
└── deploy/                    # Scripts e configurações para EC2
    ├── setup.sh              # Script de configuração inicial
    ├── deploy.sh             # Script de deploy
    ├── nginx.conf            # Configuração do Nginx
    └── office365-backend.service  # Systemd service
```

## 🔄 Mudanças Realizadas

### Backend (Python Flask - MVC)

1. **Estrutura MVC criada:**
   - `models/license.py`: Modelos de dados e repositório
   - `controllers/license_controller.py`: Lógica de negócio
   - `routes.py`: Definição de rotas (Views)

2. **API REST implementada:**
   - GET `/api/licenses` - Listar licenças
   - POST `/api/licenses` - Criar licença
   - GET `/api/licenses/:id` - Obter licença
   - PUT `/api/licenses/:id` - Atualizar licença
   - DELETE `/api/licenses/:id` - Deletar licença
   - POST `/api/licenses/:id/users` - Adicionar usuário
   - DELETE `/api/licenses/:id/users/:userId` - Remover usuário
   - GET `/api/stats` - Estatísticas

3. **Armazenamento:**
   - Dados salvos em JSON (`backend/data/licenses.json`)
   - Persistência automática

### Frontend (React)

1. **Serviço de API criado:**
   - `src/services/api.ts`: Cliente HTTP para comunicação com backend

2. **Componentes atualizados:**
   - `Index.tsx`: Agora usa API ao invés de estado local
   - `LicenseCard.tsx`: Integrado com API para adicionar/remover usuários

3. **Melhorias:**
   - Loading states
   - Tratamento de erros com toast notifications
   - Estatísticas carregadas do backend

### Deploy (EC2)

1. **Scripts criados:**
   - `setup.sh`: Configuração inicial do servidor
   - `deploy.sh`: Deploy automatizado

2. **Configurações:**
   - `nginx.conf`: Proxy reverso para frontend e backend
   - `office365-backend.service`: Serviço systemd para backend

## 🚀 Como Usar

### Desenvolvimento Local

**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Frontend:**
```bash
cd office-365-hub
npm install
npm run dev
```

### Produção (EC2)

Ver `DEPLOY.md` para instruções completas.

## 📝 Notas Importantes

1. **Separação Front/Back:**
   - Backend roda na porta 5000
   - Frontend roda na porta 8080 (dev) ou servido pelo Nginx (prod)
   - Comunicação via API REST

2. **Padrão MVC:**
   - **Models**: Estrutura de dados e persistência
   - **Views**: Respostas JSON da API
   - **Controllers**: Lógica de negócio e validação

3. **Variáveis de Ambiente:**
   - Backend: `backend/.env`
   - Frontend: `office-365-hub/.env`

4. **Dados:**
   - Armazenados em `backend/data/licenses.json`
   - Criado automaticamente na primeira execução



