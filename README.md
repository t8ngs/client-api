
# T8ngs/client-api
> Cliente de API para testar endpoints HTTP. Utiliza superagent internamente.

Este projeto é um cliente de API desenvolvido pela T8ngs para facilitar testes de endpoints HTTP, suportando múltiplos formatos de conteúdo e recursos avançados para automação de testes.

## Principais funcionalidades
- Suporte a múltiplos tipos de conteúdo: `application/json`, `application/x-www-form-urlencoded` e `multipart`.
- Upload de arquivos.
- Leitura e escrita de cookies, com opção para registrar serializadores personalizados.
- Hooks de ciclo de vida: útil para persistir e carregar dados de sessão durante as requisições.
- Envio de headers, query-string e suporte a redirecionamentos.
- Registro de serializadores e parsers personalizados para o corpo da requisição.

## Instalação
Instale o pacote via npm:

```sh
npm install @t8ngs/client-api

yarn add @t8ngs/client-api
```

## Uso
Você pode utilizar o cliente de API em conjunto com seu runner de testes:

```ts
import { apiClient } from '@t8ngs/client-api'
import { configure } from '@t8ngs/runner'

configure({
	plugins: [apiClient({ baseURL: 'http://localhost:3333' })]
})
```

Após configurar, acesse a propriedade `client` no contexto do teste:

```ts
test('deve retornar sucesso', async ({ client }) => {
	const response = await client.get('/')
	// suas asserções aqui
})
```

## Documentação
Consulte a documentação completa na pasta `/docs` do projeto ou entre em contato com a equipe T8ngs para dúvidas e suporte.

## Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE.md para mais detalhes.
