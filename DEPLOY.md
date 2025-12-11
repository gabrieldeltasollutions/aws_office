# 🚀 Guia de Deploy - Office 365 Hub

## Pré-requisitos

- Instância EC2 (Ubuntu 20.04 ou superior)
- Acesso SSH à instância
- Domínio configurado (opcional, mas recomendado)

## Passo a Passo

### 1. Conectar à EC2

```bash
ssh -i sua-chave.pem ubuntu@seu-ip-ec2
```

### 2. Clonar o Repositório

```bash
cd /home/ubuntu
git clone <seu-repositorio> office365-hub
cd office365-hub
```

### 3. Executar Setup Inicial

```bash
cd deploy
chmod +x setup.sh
./setup.sh
```

Este script irá:
- Instalar Python, Node.js, Nginx
- Configurar diretórios
- Configurar Nginx
- Configurar systemd service

### 4. Configurar Variáveis de Ambiente

**Backend:**
```bash
cd /home/ubuntu/office365-hub/backend
cp .env.example .env
nano .env
```

Edite e salve:
```
SECRET_KEY=gerar-uma-chave-secreta-forte-aqui
DATABASE_URL=sqlite:///office365.db
```

**Frontend:**
```bash
cd /home/ubuntu/office365-hub/frontend
cp .env.example .env
nano .env
```

Para produção, use o domínio da sua EC2:
```
VITE_API_URL=http://seu-ip-ou-dominio/api
```

### 5. Executar Deploy

```bash
cd /home/ubuntu/office365-hub/deploy
chmod +x deploy.sh
./deploy.sh
```

### 6. Verificar Status

```bash
# Verificar backend
sudo systemctl status office365-backend

# Verificar nginx
sudo systemctl status nginx

# Ver logs
sudo journalctl -u office365-backend -f
```

### 7. Acessar Aplicação

Abra no navegador:
```
http://seu-ip-ec2
```

## Comandos Úteis

### Reiniciar Serviços
```bash
sudo systemctl restart office365-backend
sudo systemctl restart nginx
```

### Ver Logs
```bash
# Backend
sudo journalctl -u office365-backend -f

# Nginx
sudo tail -f /var/log/nginx/error.log
```

### Atualizar Aplicação
```bash
cd /home/ubuntu/office365-hub
git pull
cd deploy
./deploy.sh
```

## Configurar HTTPS (Opcional mas Recomendado)

### Usando Certbot (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

O Certbot irá configurar automaticamente o SSL.

## Troubleshooting

### Backend não inicia
```bash
# Verificar logs
sudo journalctl -u office365-backend -n 50

# Verificar se o diretório data existe
ls -la /home/ubuntu/office365-hub/backend/data

# Verificar permissões
sudo chown -R ubuntu:ubuntu /home/ubuntu/office365-hub
```

### Nginx retorna 502
```bash
# Verificar se o backend está rodando
sudo systemctl status office365-backend

# Verificar porta
sudo netstat -tlnp | grep 5000
```

### Frontend não carrega
```bash
# Verificar se o build foi feito
ls -la /var/www/office365-hub/dist

# Verificar permissões
sudo chown -R ubuntu:ubuntu /var/www/office365-hub
```

## Estrutura de Diretórios no Servidor

```
/home/ubuntu/office365-hub/
├── backend/
│   ├── data/              # Dados JSON (criado automaticamente)
│   ├── venv/              # Ambiente virtual Python
│   └── ...
├── frontend/
│   └── ...
└── deploy/
    └── ...

/var/www/office365-hub/
└── dist/                  # Build do frontend
```

## Segurança

1. **Firewall**: Configure o Security Group da EC2 para permitir apenas:
   - Porta 22 (SSH)
   - Porta 80 (HTTP)
   - Porta 443 (HTTPS)

2. **SECRET_KEY**: Use uma chave forte e única

3. **HTTPS**: Configure SSL/TLS em produção

4. **Atualizações**: Mantenha o sistema atualizado
   ```bash
   sudo apt-get update && sudo apt-get upgrade
   ```




