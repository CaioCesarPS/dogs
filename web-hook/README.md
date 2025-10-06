# Docker Compose Runner API

Uma API FastAPI que permite executar comandos Docker Compose remotamente via HTTP.

## Funcionalidades

- API REST para executar `docker compose up -d --build`
- Execução automática de `git pull` antes do deploy
- Endpoint de health check
- Status dos containers Docker
- Interface web automática via FastAPI (Swagger UI)

## Estrutura

```
.
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── run.py
└── README.md
```

## Como usar

### 0. Configuração inicial (importante!)

#### Para repositórios públicos:
```bash
# Se o repositório usa SSH, converta para HTTPS primeiro
../convert-to-https.sh

# Ou manualmente:
git remote set-url origin https://github.com/CaioCesarPS/dogs.git
```

#### Para repositórios privados:
```bash
# Configure as credenciais Git primeiro
../setup-git-auth.sh

# Depois converta para HTTPS se necessário
../convert-to-https.sh
```

### 1. Build e executar com Docker Compose

```bash
# Build e iniciar os serviços
docker-compose up -d --build

# Verificar logs
docker-compose logs -f webhook-api

# Parar os serviços
docker-compose down
```

### 2. Acessar a API

- API: http://localhost:8000
- Documentação Swagger: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### 3. Endpoints disponíveis

#### GET /

Verifica se a API está funcionando.

#### POST /docker/up

Executa o processo completo de atualização e deploy:

1. Para os containers existentes (`docker compose down`)
2. Executa `git pull` para atualizar o código
3. Executa `docker compose up -d --build frontend app` para rebuildar e iniciar os containers

#### POST /docker/down

Para e remove todos os containers.

#### GET /docker/status

Verifica o status dos containers Docker.

#### GET /health

Health check da aplicação.

### 4. Script de teste

Um script de teste está disponível para testar a funcionalidade:

```bash
./test-webhook.sh
```

### 5. Executar localmente (sem Docker)

```bash
# Instalar dependências
pip install -r requirements.txt

# Executar a aplicação
python run.py
```

## Segurança

- O container possui acesso ao Docker socket para executar comandos Docker
- Inclui um proxy de socket Docker para maior segurança
- Usuário não-root dentro do container
- Health checks configurados

## Pré-requisitos

- O diretório pai deve ser um repositório Git válido
- O repositório deve ter acesso de leitura/escrita (sem `ro` no volume mount)
- Git deve estar instalado no container (incluído no Dockerfile)
- **Para repositórios privados**: Personal Access Token configurado (ver seção de Autenticação)

## Autenticação Git (Repositórios Privados)

Se seu repositório for privado, você precisa configurar credenciais:

### Método 1: Script Automático (Recomendado)
```bash
# Execute o script de configuração
../setup-git-auth.sh
```

### Método 2: Manual
1. Gere um Personal Access Token em: https://github.com/settings/tokens
2. Selecione permissões: `repo` (Full control of private repositories)
3. Crie um arquivo `.env` no diretório `web-hook/`:
```bash
GIT_USERNAME=seu-username
GIT_TOKEN=ghp_seu_token_aqui
GIT_EMAIL=seu-email@exemplo.com  # opcional
```

### Variáveis de Ambiente
- `GIT_USERNAME`: Seu username do GitHub
- `GIT_TOKEN`: Personal Access Token (não sua senha!)
- `GIT_EMAIL`: Seu email Git (opcional)

## Variáveis de Ambiente

- `PYTHONUNBUFFERED=1`: Para logs em tempo real

## Troubleshooting

1. **Erro de permissão do Docker**: Certifique-se de que o usuário tem permissão para acessar o Docker socket
2. **Timeout**: O comando Docker Compose tem timeout de 5 minutos
3. **Git safe.directory error**: O sistema tenta corrigir automaticamente, mas se persistir, rebuilde o container
4. **SSH/Git errors (Permission denied, Host key verification failed)**: 
   - Execute `../convert-to-https.sh` para converter de SSH para HTTPS
   - O sistema tenta converter automaticamente, mas é melhor fazer manualmente
   - HTTPS não requer chaves SSH no container
5. **Logs**: Use `docker-compose logs webhook-api` para debugar
