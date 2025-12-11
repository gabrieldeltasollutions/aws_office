#!/bin/bash

set -e

echo "🔧 Configurando servidor EC2 para Office 365 Hub..."

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Atualizar sistema
echo -e "${YELLOW}📦 Atualizando sistema...${NC}"
sudo apt-get update
sudo apt-get upgrade -y

# 2. Instalar dependências
echo -e "${YELLOW}📥 Instalando dependências...${NC}"
sudo apt-get install -y python3 python3-pip python3-venv nginx nodejs npm git

# 3. Criar diretórios
echo -e "${YELLOW}📁 Criando diretórios...${NC}"
PROJECT_DIR="/home/ubuntu/office365-hub"
sudo mkdir -p /var/www/office365-hub/dist
sudo chown -R ubuntu:ubuntu /var/www/office365-hub

# 4. Configurar Nginx
echo -e "${YELLOW}🌐 Configurando Nginx...${NC}"
sudo cp nginx.conf /etc/nginx/sites-available/office365-hub
sudo ln -sf /etc/nginx/sites-available/office365-hub /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# 5. Configurar systemd service
echo -e "${YELLOW}⚙️  Configurando serviço systemd...${NC}"
sudo cp office365-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable office365-backend

# 6. Configurar firewall
echo -e "${YELLOW}🔥 Configurando firewall...${NC}"
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw --force enable

echo -e "${GREEN}✅ Configuração inicial concluída!${NC}"
echo -e "${YELLOW}📝 Próximos passos:${NC}"
echo "1. Faça upload do código para $PROJECT_DIR"
echo "2. Configure o arquivo .env no backend"
echo "3. Execute: ./deploy.sh"



