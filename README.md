# Office 365 Hub - Gerenciamento de Licenças

Sistema de gerenciamento de licenças Office 365 com frontend React (Vite + TypeScript) e backend Python Flask.

## 📁 Estrutura do Projeto

```
.
├── backend/              # Backend Python (Flask)
│   ├── app.py            # Aplicação principal
│   ├── config.py         # Configurações
│   ├── routes.py         # Rotas da API
│   ├── models/           # Modelos de dados
│   ├── controllers/      # Controladores (lógica de negócio)
│   └── requirements.txt  # Dependências Python
│
├── office-365-hub/       # Frontend React (Vite)
│   └── src/
│       └── services/     # Serviço de API (ver `src/services/api.ts`)
│
└── deploy/               # Scripts de deploy e config do servidor
    ├── setup.sh
    ├── deploy.sh
    └── nginx.conf
```

## Visão geral da conexão Frontend ↔ Backend

- O backend expõe a API em `/api/*` (por padrão `http://localhost:5000/api`).
- O frontend usa a variável de ambiente `VITE_API_URL` para apontar a base da API.
- Em desenvolvimento, defina `VITE_API_URL=http://localhost:5000/api` no `.env` do frontend.
- O `backend/app.py` já habilita CORS para `/api/*`; em produção restrinja `origins` ao seu domínio.

## ▶️ Como rodar localmente (passo-a-passo)

### 1) Backend

```bash
cd backend
python -m venv venv
# Linux/macOS
source venv/bin/activate
# Windows PowerShell
venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

O backend ficará disponível em `http://localhost:5000` (rotas sob `/api`).

### 2) Frontend

```bash
cd office-365-hub
npm install
# Antes de rodar, crie/edite .env com VITE_API_URL
# Exemplo: VITE_API_URL=http://localhost:5000/api
npm run dev
```

O frontend (Vite) normalmente roda em `http://localhost:5173` ou porta semelhante; a UI fará requisições para o backend via `VITE_API_URL`.

## Variáveis de ambiente úteis

- `backend/.env` (exemplo em `backend/.env.example`)
  - `SECRET_KEY` — chave secreta do Flask
  - `DATABASE_URL` — string de conexão do banco (p.ex. `sqlite:///office365.db`)

- `office-365-hub/.env` (exemplo em `office-365-hub/.env.example`)
  - `VITE_API_URL` — base URL da API (deve terminar em `/api`)

## Deploy (resumo)

- Em produção o backend pode rodar por Gunicorn + systemd (veja `deploy/office365-backend.service`).
- O Nginx serve o frontend estático e faz proxy para o backend em `/api/`.
- Garanta que `VITE_API_URL` aponte para `https://seu-dominio.com/api` e que o Nginx proxie `/api/` para o serviço do backend.

## Troubleshooting rápido

- Erro CORS: confirme `backend/app.py` e a origem configurada em CORS.
- Frontend aponta para `localhost` e backend em outra máquina: ajuste `VITE_API_URL` para o IP/host correto.
- Erro 4xx/5xx: abra o developer tools do browser para inspecionar requisições e o log do backend.

## Referência de endpoints

- `GET /api/licenses`
- `GET /api/licenses/:id`
- `POST /api/licenses`
- `PUT /api/licenses/:id`
- `DELETE /api/licenses/:id`
- `POST /api/licenses/:licenseId/users`
- `DELETE /api/licenses/:licenseId/users/:userId`
- `GET /api/stats`

---

Se quiser, eu posso:
- criar `backend/.env.example` e `office-365-hub/.env.example` (faço agora),
- adicionar instruções de deploy Nginx/Gunicorn mais detalhadas,
- ou alterar `backend/app.py` para restringir CORS em production.
# Office 365 Hub - Gerenciamento de Licenças

Sistema de gerenciamento de licenças Office 365 com frontend React e backend Python Flask.

## 📁 Estrutura do Projeto

```
.
├── backend/              # Backend Python (Flask)
│   ├── app.py          # Aplicação principal
│   ├── config.py       # Configurações
│   ├── routes.py        # Rotas da API
│   ├── models/         # Modelos de dados
│   ├── controllers/    # Controladores (lógica de negócio)
│   └── requirements.txt # Dependências Python
│
├── frontend/            # Frontend React (Vite)
│   └── src/
│       ├── pages/      # Páginas
│       ├── components/ # Componentes React
│       └── services/   # Serviços de API
│
└── deploy/              # Scripts de deploy para EC2
    ├── setup.sh        # Configuração inicial do servidor
    ├── deploy.sh       # Script de deploy
    ├── nginx.conf      # Configuração Nginx
    └── office365-backend.service # Systemd service
```

## 🚀 Deploy na EC2

### 1. Configuração Inicial do Servidor

Conecte-se à sua instância EC2 e execute:

```bash
# Clone o repositório
git clone <seu-repositorio> /home/ubuntu/office365-hub

# Execute o script de setup
cd /home/ubuntu/office365-hub/deploy
chmod +x setup.sh
./setup.sh
```

### 2. Configurar Variáveis de Ambiente

**Backend:**
```bash
cd /home/ubuntu/office365-hub/backend
cp .env.example .env
nano .env
```

Configure:
```
SECRET_KEY=sua-chave-secreta-aqui
DATABASE_URL=sqlite:///office365.db
```

**Frontend:**
```bash
cd /home/ubuntu/office365-hub/frontend
cp .env.example .env
nano .env
```

Configure:
```
VITE_API_URL=http://seu-dominio.com/api
# ou para desenvolvimento local:
# VITE_API_URL=http://localhost:5000/api
```

### 3. Deploy

```bash
cd /home/ubuntu/office365-hub/deploy
chmod +x deploy.sh
./deploy.sh
```

## 🛠️ Desenvolvimento Local

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

O backend estará rodando em `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará rodando em `http://localhost:8080`

## 📡 API Endpoints

### Licenças

- `GET /api/licenses` - Listar todas as licenças
- `GET /api/licenses/:id` - Obter uma licença específica
- `POST /api/licenses` - Criar nova licença
- `PUT /api/licenses/:id` - Atualizar licença
- `DELETE /api/licenses/:id` - Deletar licença

### Usuários

- `POST /api/licenses/:licenseId/users` - Adicionar usuário à licença
- `DELETE /api/licenses/:licenseId/users/:userId` - Remover usuário da licença

### Estatísticas

- `GET /api/stats` - Obter estatísticas gerais

## 🏗️ Arquitetura

### Backend (MVC)

- **Models**: `models/license.py` - Modelos de dados e repositório
- **Views**: Respostas JSON da API
- **Controllers**: `controllers/license_controller.py` - Lógica de negócio
- **Routes**: `routes.py` - Definição de rotas

### Frontend

- **React + TypeScript**: Interface moderna e responsiva
- **Vite**: Build tool rápida
- **Shadcn/ui**: Componentes UI
- **React Query**: Gerenciamento de estado e cache

## 🔧 Manutenção

### Ver logs do backend

```bash
sudo journalctl -u office365-backend -f
```

### Reiniciar serviços

```bash
sudo systemctl restart office365-backend
sudo systemctl restart nginx
```

### Verificar status

```bash
sudo systemctl status office365-backend
sudo systemctl status nginx
```

## 📝 Notas

- Os dados são armazenados em JSON no diretório `backend/data/`
- O backend usa Gunicorn em produção
- O frontend é servido pelo Nginx
- CORS está habilitado para permitir requisições do frontend

## 🔒 Segurança

- Configure uma SECRET_KEY forte no `.env` do backend
- Use HTTPS em produção (certificado SSL)
- Configure firewall adequadamente
- Mantenha dependências atualizadas




