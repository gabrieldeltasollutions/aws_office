#!/bin/bash

set -e

echo "🚀 Iniciando deploy do Office 365 Hub..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Diretórios
PROJECT_DIR="/home/ubuntu/office365-hub"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# 1. Atualizar código
echo -e "${YELLOW}📥 Atualizando código...${NC}"
cd $PROJECT_DIR
git pull origin main || echo "Git pull falhou, continuando..."

# 2. Backend Setup
echo -e "${YELLOW}🐍 Configurando backend...${NC}"
cd $BACKEND_DIR

# Criar venv se não existir
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Criar diretório de dados se não existir
mkdir -p data

# 3. Frontend Setup
echo -e "${YELLOW}⚛️  Configurando frontend...${NC}"
cd $FRONTEND_DIR

# Instalar dependências
npm install

# Build do frontend
npm run build

# Copiar build para nginx
sudo cp -r dist/* /var/www/office365-hub/dist/

# 4. Reiniciar serviços
echo -e "${YELLOW}🔄 Reiniciando serviços...${NC}"
sudo systemctl daemon-reload
sudo systemctl restart office365-backend
sudo systemctl restart nginx

# 5. Verificar status
echo -e "${YELLOW}✅ Verificando status...${NC}"
sudo systemctl status office365-backend --no-pager -l
sudo systemctl status nginx --no-pager -l

echo -e "${GREEN}✨ Deploy concluído com sucesso!${NC}"




