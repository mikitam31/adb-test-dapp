This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Connectors

It lists all connectors by now, but I tested only Metamask for now. Other connectors are configured, but need to set correct env variables to make it work correctly.

## Environment variable

Create `.env.local` with below content and run the app. If the env variable is changed, you have to restart app.
```
NEXT_PUBLIC_RPC_URL_1=https://mainnet.infura.io/v3/84842078b09946638c03157f83405213
NEXT_PUBLIC_RPC_URL_4=https://rinkeby.infura.io/v3/84842078b09946638c03157f83405213
NEXT_PUBLIC_FORTMATIC_API_KEY=pk_test_A6260FCBAA2EBDFB
NEXT_PUBLIC_MAGIC_API_KEY=pk_test_398B82F5F0E88874
NEXT_PUBLIC_PORTIS_DAPP_ID=e9be171c-2b7f-4ff0-8db9-327707511ee2
```

## Further improvements

### Move all logics into Redux

- Move balance update with Redux Thunk action
- Move transaction trigger, error, pending status to redux store
- Move connector status to redux

### Project Structure

Since it's one page test app, I didn't create container components and wrapper components to separate dapp and redux side. 

- Move defi related to logics to wrapper(root) component
- Create container components for redux
- Create common components based on Material UI components to make it transparent
