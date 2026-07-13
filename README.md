# dn-fe

npm workspaces monorepo for SvelteKit applications.

## Structure

```
dn-fe/
├── apps/
│   └── auth-server/   # Authentication SvelteKit app
└── package.json       # Root workspace config
```

## Getting Started

Install all dependencies from the root:

```sh
npm install
```

## Development

```sh
# Run a specific app
npm run dev:auth

# Run all apps
npm run dev:all
```

## Building

```sh
# Build a specific app
npm run build:auth

# Build all apps
npm run build:all
```

## Adding a New App

```sh
cd apps
npx sv create my-new-app
```

Then run `npm install` from the root again to hoist dependencies.
