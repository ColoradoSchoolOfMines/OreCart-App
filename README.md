# Ore Cart App [![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

The master monorepo for all OreCode app software! The OreCode app includes a backend made with [FastAPI](https://fastapi.tiangolo.com), an admin dashboard built with [React](https://react.dev/)/[Vite](https://v3.vitejs.dev/guide/), and a crossplatform mobile app made with [React-Native](https://reactnative.dev).

For full documentation and project details, please see the Google Drive (ask leads for access) and [orecode.github.io](https://orecode.github.io). The frontend, frontend-admin, and backend folders have READMEs with more information about developing in each as well.

## General Environment Setup

For this project you will need [Docker](https://www.docker.com), [Node.js](https://nodejs.org/en), and [Python 3](https://www.python.org).

We use docker compose to make running the application consistent and simple. 

To start the application run: `docker compose up`.

If you want to run it in the background run: `docker compose up -d`.

If you want to rebuild the docker containers run: `docker compose build`.

To start the application in a development mode (it will restart when files are saved) run: `docker compose watch`.

*These commands should be ran at the root level of the project.*

## Contribution Guidelines

Contributors (aka "The OreCode Team") must be approved by the current [OreCode/leads](https://github.com/orgs/OreCode/teams/leads) team.
Outside contributors are not allowed unless explicit approval is granted by leads.

Do not push code directly to main -- the branch is locked for this anyways! Please use branches for each new feature and submit a pull request when ready.
Branch names should be short but descriptive, and all lowercase.

Each pull request requires a **minimum of two relevant reviewers** (leads or team members) for approval and merging.

## Legal Notices

Any references to Colorado School of Mines (aka "Mines", "CSM"), Innov8x, or official OreCode brand identity are used with
permission for this project, however, this project is not owned by Mines or Mines ACM itself. See the [LICENSE](https://github.com/OreCode/OreCode-App/blob/main/LICENSE) for more details.
