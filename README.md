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
frontend/                                   <- Complete React interface
    ├── Dockerfile                          <- React Frontend Dockerfile
    ├── nginx.conf                          <- Proxy/server configurationNginx
    ├── src/
    │   ├── components/
    │   │   ├── AccountCard.tsx
    │   │   ├── TransferForm.tsx
    │   │   └── StressTestPanel.tsx
    │   ├── hooks/
    │   │   └── useRealtimeAccount.ts
    │   └── App.tsx
    └── package.json               
     # Express/Fastify ou NestJS
```
## 🚀 Getting Started

. Local Development Prerequisites

. Node.js: v18+ or v20+

Package Manager: npm or yarn

1. **Install Dependencies**

Navigate to the frontend/ directory and install the required modules:

npm install


### 2. Start Development Server

Run the local Vite development server:

npm run dev


* **The application will be accessible at** ` http://localhost:5173.` 

### 🐳 Docker Deployment

The frontend uses a multi-stage Docker build:

Build Stage: Compiles TypeScript & bundles React via Vite using Node.js.

Production Stage: Serves optimized static assets using a lightweight Nginx server on port 80.

Option A: Standard Docker Container Run

Build the Docker Image:
```bash
docker build -t react-transferenciabancaria .
```

Run the Container:
```bash
docker run -d -p 80:80 --name react-transferenciabancaria react-transferenciabancaria
```

Option B: Isolated Run within Docker Network Subnet

To attach the frontend container to an existing custom network (transferenciabancaria-network) alongside the backend API and MySQL database:

Create Subnet Network (if not already created):
```bash
docker network create --driver bridge --subnet 172.28.0.0/16 transferenciabancaria-network
```

Run Frontend with Static IP:
```bash
docker run -d \
  --name react-transferenciabancaria \
  --network transferenciabancaria-network \
  --ip 172.28.0.4 \
  -p 80:80 \
  react-transferenciabancaria
```

## 🛠️ Features Included

Real-time Balance updates: Integrated EventSource/SSE via useRealtimeAccount.ts.

Idempotency Protection: Ensures duplicate key prevention when executing money transfers.

Concurrency Stress Testing: Trigger multiple parallel requests directly from StressTestPanel.tsx to validate backend lock ordering and deadlock safety.