# TACo's PolygonChild application subgraph

PolygonChild contract is part of [TACo application](https://docs.taco.build/).

This subgraph has been deployed using [Alchemy subgraphs](https://subgraphs.alchemy.com/).

GraphQL API

> <https://subgraph.satsuma-prod.com/735cd3ac7b23/nucypher-ops/PolygonChild/api>

and it is actively used by [train45](https://github.com/nucypher/train45) bot.

This subgraph collects:

- the two main events of [PolygonChild contract](https://polygonscan.com/address/0x1f5C5fd6A66723fA22a778CC53263dd3FA6851E5):

  - MessageSent
  - OwnershipTransferred

- the `released` and `releaseResent` events of [TACoChildApplication contract](https://polygonscan.com/address/0xfa07aab78062fac4c36995bf28f6d677667973f5)

## Contributing

### Installation

Install NPM packages from this folder:

```bash
cd PolygonChild
yarn install
```

### Generate subgraph's code

This must be done everytime the subgraph code is modified:

```bash
yarn codegen && yarn build
```

### Running tests

Running the tests requires Docker.

```bash
yarn test
```

### Deploying a new version

It is required an Alchemy's Deployment Key. Look for it in the NuCo Alchemy account.
Set the deployment key in a `.env` file:

```dotenv
DEPLOY_KEY=xz.........49
```

```bash
yarn deploy
```
