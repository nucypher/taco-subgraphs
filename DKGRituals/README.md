# TACo's DKG Rituals subgraph

The status of DKG Rituals is managed by
[Coordinator contract](https://polygonscan.com/address/0xe74259e3dafe30baa8700238e324b47ac98fe755).

This subgraph collects the DKG Ritual-related events, keeping track of the status of each event.

This subgraph is used by [tacoscan.com](https://tacoscan.com/)

This subgraph has been deployed using [Alchemy subgraphs](https://subgraphs.alchemy.com/).

GraphQL API

> https://subgraph.satsuma-prod.com/735cd3ac7b23/nucypher-ops/DKGRituals/api

## Contributing
### Installation
Install NPM packages from this folder:

```bash
cd DKGRituals
yarn install
```

### Generate subgraph's code
This must be done everytime the subgraph code is modified:

```bash
yarn codegen && yarn build
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
