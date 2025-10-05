# Docker Compose Runner API

Uma API FastAPI que permite executar comandos Docker Compose remotamente via HTTP.

## Funcionalidades

- API REST para executar `docker compose up -d --build`
- Endpoint de health check
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

Executa o comando `docker compose up -d --build frontend app`.

#### GET /health

Health check da aplicação.

### 4. Executar localmente (sem Docker)

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

## Variáveis de Ambiente

- `PYTHONUNBUFFERED=1`: Para logs em tempo real

## Troubleshooting

1. **Erro de permissão do Docker**: Certifique-se de que o usuário tem permissão para acessar o Docker socket
2. **Timeout**: O comando Docker Compose tem timeout de 5 minutos
3. **Logs**: Use `docker-compose logs webhook-api` para debugar
