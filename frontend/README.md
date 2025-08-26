frontend/
├── public/
│ ├── index.html
│ └── favicon.ico
├── src/
│ ├── api/ // Apollo Client GraphQL queries, mutations, and hooks
│ │ ├── auth/
│ │ │ ├── queries.ts // e.g., gql`query Login { ... }`
│ │ │ ├── mutations.ts // e.g., gql`mutation Register { ... }`
│ │ │ ├── hooks/ // e.g., useLoginQuery.ts, useRegisterMutation.ts
│ │ │ └── types.ts // GraphQL types (generated or manual)
│ │ ├── products/
│ │ │ ├── queries.ts
│ │ │ ├── mutations.ts
│ │ │ ├── hooks/
│ │ │ └── types.ts
│ │ ├── orders/
│ │ │ ├── queries.ts
│ │ │ ├── mutations.ts
│ │ │ ├── hooks/
│ │ │ └── types.ts
│ │ ├── payments/
│ │ │ ├── queries.ts
│ │ │ ├── mutations.ts
│ │ │ ├── hooks/
│ │ │ └── types.ts
│ │ ├── customers/
│ │ │ ├── queries.ts
│ │ │ ├── mutations.ts
│ │ │ ├── hooks/
│ │ │ └── types.ts
│ │ ├── reports/
│ │ │ ├── queries.ts
│ │ │ ├── hooks/
│ │ │ └── types.ts
│ │ └── client.ts // Apollo Client setup (e.g., ApolloClient instance)
│ ├── assets/
│ │ ├── images/
│ │ ├── icons/
│ │ └── fonts/
│ ├── components/
│ │ ├── ui/
│ │ │ ├── Button.tsx
│ │ │ ├── Input.tsx
│ │ │ └── ...
│ │ ├── common/
│ │ │ ├── Header.tsx
│ │ │ ├── Footer.tsx
│ │ │ └── LoadingSpinner.tsx
│ │ ├── forms/
│ │ │ ├── ProductForm.tsx
│ │ │ └── OrderForm.tsx
│ │ └── layouts/
│ │ ├── AuthLayout.tsx
│ │ ├── DashboardLayout.tsx
│ │ └── POSLayout.tsx
│ ├── config/
│ │ ├── api.ts // Apollo Client config (if not in api/client.ts)
│ │ └── env.ts
│ ├── constants/
│ │ ├── roles.ts
│ │ ├── endpoints.ts // GraphQL endpoint (if needed)
│ │ └── enums.ts
│ ├── features/
│ │ ├── pos/
│ │ │ ├── components/
│ │ │ ├── hooks/
│ │ │ ├── pages/
│ │ │ └── types.ts
│ │ ├── inventory/
│ │ │ ├── components/
│ │ │ ├── hooks/
│ │ │ ├── pages/
│ │ │ └── types.ts
│ │ ├── orders/
│ │ │ ├── components/
│ │ │ ├── hooks/
│ │ │ ├── pages/
│ │ │ └── types.ts
│ │ ├── reports/
│ │ │ ├── components/
│ │ │ ├── hooks/
│ │ │ ├── pages/
│ │ │ └── types.ts
│ │ ├── customers/
│ │ │ ├── components/
│ │ │ ├── hooks/
│ │ │ ├── pages/
│ │ │ └── types.ts
│ │ └── payments/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── pages/
│ │ └── types.ts
│ ├── hooks/
│ │ ├── useAuth.ts
│ │ ├── useDebounce.ts
│ │ └── usePOS.ts
│ ├── lib/
│ │ ├── utils.ts
│ │ ├── jwt.ts
│ │ └── receipt.ts
│ ├── pages/
│ │ ├── index.tsx
│ │ ├── 404.tsx
│ │ └── ...
│ ├── router/
│ │ ├── index.tsx
│ │ └── ProtectedRoute.tsx
│ ├── store/
│ │ ├── auth.ts
│ │ ├── cart.ts
│ │ └── index.ts
│ ├── styles/
│ │ ├── index.css
│ │ └── tailwind.css
│ ├── types/
│ │ ├── api.ts
│ │ ├── common.ts
│ │ └── user.ts
│ ├── **tests**/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── features/
│ │ └── utils/
│ ├── App.tsx
│ ├── main.tsx
│ └── vite-env.d.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── .env
├── package.json
└── README.md
