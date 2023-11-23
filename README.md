# Ore Cart App [![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

The master monorepo for all OreCart app software! The OreCart app includes a backend made with [FastAPI](https://fastapi.tiangolo.com) and a crossplatform mobile app made with [React-Native](https://reactnative.dev).

For full documentation and project details, please see the Google Drive (ask leads for access) and [orecart.github.io](https://orecart.github.io). The frontend and backend folders have READMEs with more information about developing in each as well.

## General Environment Setup

For this project you will need [Docker](https://www.docker.com), [Node.js](https://nodejs.org/en), and [Python 3](https://www.python.org).

To start up the PostgreSQL database, run `docker compose up -d`.

To stop the PostgreSQL database, run `docker compose down`.

## Contribution Guidelines

Contributors (aka "The OreCart Team") must be approved by the current [OreCart/leads](https://github.com/orgs/OreCart/teams/leads) team.
Outside contributors are not allowed unless explicit approval is granted by leads.

Do not push code directly to main -- the branch is locked for this anyways! Please use branches for each new feature and submit a pull request when ready.
Branch names should be short but descriptive, and all lowercase.

Each pull request requires a **minimum of two relevant reviewers** (leads or team members) for approval and merging.

## Legal Notices

Any references to Colorado School of Mines (aka "Mines", "CSM"), Innov8x, or official OreCart brand identity are used with
permission for this project, however, this project is not owned by Mines or Mines ACM itself. See the [LICENSE](https://github.com/OreCart/OreCart-App/blob/main/LICENSE) for more details.
