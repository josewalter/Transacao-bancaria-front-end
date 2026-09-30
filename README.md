# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
# Transacao-bancaria-front-end

The structure follows a division into layers independent of frameworks, ensuring testability and ease of maintenance:

```text
src/
├── domain/                  # [Regras de Negócio Core] Entidades e Objetos de Valor
│   ├── entities/            # Account, Transaction
│   └── value-objects/       # Money, AccountId, TransactionId
├── use-cases/               # [Casos de Uso] Regras da Aplicação
│   ├── transfer-money.ts    # Caso de uso de transferência em tempo real
│   └── get-balance.ts       # Consulta de saldo com locking
├── adapters/                # [Interfaces / Adaptadores]
│   ├── controllers/         # Mapeamento REST / Websockets
│   └── repositories/        # Interfaces dos Reposositórios
└── infrastructure/          # [Detalhes de Frameworks e Drivers]
    ├── database/            # Implementação TypeORM/Prisma (Com Locking)
    ├── websockets/          # Servidor WS para notificações em tempo real
    └── http/                # Express/Fastify ou NestJS
```
