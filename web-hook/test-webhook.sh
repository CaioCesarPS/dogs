#!/bin/bash

# Script para testar o webhook de docker compose up
# Certifique-se de que o webhook está rodando antes de executar este script

echo "🚀 Testando webhook docker compose up..."

# URL do webhook (ajuste se necessário)
WEBHOOK_URL="http://localhost:8000"

# Teste de saúde primeiro
echo "📊 Verificando saúde da API..."
curl -X GET "$WEBHOOK_URL/health" || {
    echo "❌ API não está respondendo. Certifique-se de que o webhook esteja rodando."
    exit 1
}

echo ""
echo "✅ API está funcionando!"
echo ""

# Teste do docker compose up
echo "🐳 Executando docker compose up..."
curl -X POST "$WEBHOOK_URL/docker/up" \
    -H "Content-Type: application/json" \
    -d '{}' || {
    echo "❌ Falha ao executar docker compose up"
    exit 1
}

echo ""
echo "✅ Comando executado! Verifique os logs do container para mais detalhes."
echo ""

# Verificar status dos containers
echo "📋 Verificando status dos containers..."
curl -X GET "$WEBHOOK_URL/docker/status"

echo ""
echo "🎉 Teste concluído!"