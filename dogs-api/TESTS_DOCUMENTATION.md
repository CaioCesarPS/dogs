# Testes de Integração

Este projeto inclui testes de integração (e2e) completos para todos os controllers da API.

## Estrutura dos Testes

### BreedsController Tests (`test/breeds.e2e-spec.ts`)

**GET /api/breeds**

- ✅ Deve retornar um array de nomes de raças
- ✅ Deve tratar erros de serviço adequadamente

**GET /api/breeds/:breed/images**

- ✅ Deve retornar um array de URLs de imagens para uma raça válida
- ✅ Deve retornar erro 404 quando a raça não for encontrada
- ✅ Deve tratar erros de serviço adequadamente

### FavoritesController Tests (`test/favorites.e2e-spec.ts`)

**GET /api/favorites**

- ✅ Deve retornar um array de raças favoritas
- ✅ Deve retornar array vazio quando não há favoritos

**POST /api/favorites**

- ✅ Deve adicionar uma nova raça favorita
- ✅ Deve retornar erro 400 para body de requisição inválido
- ✅ Deve tratar erros de serviço adequadamente

**DELETE /api/favorites/:breed**

- ✅ Deve remover uma raça favorita
- ✅ Deve tratar erros de serviço adequadamente
- ✅ Deve lidar com raças com caracteres especiais

## Configuração dos Testes

### Mocks

Os testes utilizam mocks dos services para isolar o comportamento dos controllers:

```typescript
const mockBreedsService = {
  getAllBreeds: jest.fn(),
  getBreedImages: jest.fn(),
};

const mockFavoritesService = {
  getFavorites: jest.fn(),
  addFavorite: jest.fn(),
  removeFavorite: jest.fn(),
};
```

### Validação

Os testes incluem validação de DTOs usando `class-validator`:

- Validação de campos obrigatórios
- Validação de tipos de dados
- Retorno de erros 400 para dados inválidos

### Setup e Teardown

- **beforeEach**: Configura o módulo de teste e inicializa a aplicação
- **afterEach**: Fecha a aplicação e limpa os mocks
- Cada teste é isolado e não afeta os outros

## Como Executar os Testes

```bash
# Executar todos os testes e2e
npm run test:e2e

# Executar com output verboso
npm run test:e2e -- --verbose

# Executar testes específicos
npm run test:e2e -- breeds.e2e-spec.ts
npm run test:e2e -- favorites.e2e-spec.ts
```

## Cobertura de Testes

Os testes cobrem:

- ✅ **Cenários de sucesso**: Todos os endpoints funcionando corretamente
- ✅ **Tratamento de erros**: Validação, serviços indisponíveis, recursos não encontrados
- ✅ **Validação de entrada**: DTOs com campos obrigatórios e tipos corretos
- ✅ **Códigos de status HTTP**: 200, 201, 400, 404, 500
- ✅ **Formato de resposta**: Estrutura correta dos dados retornados

## Ferramentas Utilizadas

- **Jest**: Framework de testes
- **Supertest**: Testes HTTP de integração
- **@nestjs/testing**: Utilities específicas do NestJS
- **class-validator**: Validação de DTOs
- **Mocks**: Isolamento de dependências

## Benefícios

1. **Confiabilidade**: Garante que os endpoints funcionam conforme esperado
2. **Regressão**: Detecta quebras quando código é modificado
3. **Documentação**: Os testes servem como documentação viva da API
4. **Qualidade**: Força boas práticas de tratamento de erro e validação
