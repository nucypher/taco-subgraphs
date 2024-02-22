# TACo's PolygonChild application subgraph

PolygonChild contract is part of [TACo application](https://docs.threshold.network/applications/threshold-access-control).

This subgraph collects the two main events of this contract:

- MessageSent
- OwnershipTransferred

This contract lives in Polygon mainnet:

https://polygonscan.com/address/0x1f5C5fd6A66723fA22a778CC53263dd3FA6851E5

This subgraph has been deployed using [Alchemy subgraphs](https://subgraphs.alchemy.com/).

GraphQL API

> https://subgraph.satsuma-prod.com/735cd3ac7b23/nucypher-ops/PolygonChild/api

## Running tests

Running the tests requires Docker.

```bash
npm run test
```

## Deploying a new version

It is required an Alchemy's Deployment Key. Look for it in the NuCo Alchemy account.
Set the deployment key in a `.env` file:

```dotenv
DEPLOY_KEY=xz.........49
```

```bash
npm run deploy
```
