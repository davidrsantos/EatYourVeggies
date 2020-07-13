

# Eat Your Veggies Sawtooth Supply Chain

This distributed application runs on top of Hyperledger
Sawtooth, an enterprise blockchain. To learn more about Hyperledger Sawtooth
please see its
[sawtooth-core repo](https://github.com/hyperledger/sawtooth-core) or its
[published docs](https://sawtooth.hyperledger.org/docs/).

## Contents

- [Components](#components)
- [Usage](#usage)
  - [Start Up](#start-up)
  - [Create User](#create-user)
  - [Restarting Components](#restarting-components)
- [Documentation](#documentation)
- [License](#license)

## Components

Running alongside the core components from Hyperledger Sawtooth, Supply Chain
includes a number of elements customizing the blockchain and user interaction
with it:

- a **transaction processor** which handles transaction logic
- a **server** which provides an HTTP/JSON API for actions
- a **ledger sync** which syncs blockchain data to a local database
- the **EYV Client** website
- a **shell** container with the dependencies to run any commands and scripts


## Usage

This project utilizes [Docker](https://www.docker.com/what-docker) to simplify
dependencies and deployment. After cloning this repo, follow the instructions
specific to your OS to install and run whatever components are required to use
`docker` and `docker-compose` from your command line. This is only dependency
required to run Eat Your Veggies Supply Chain components.

## Start Up

Once Docker is installed and you've cloned this repo, navigate to the root
project directory and run:

```bash
docker-compose up
```

This will take awhile the first time it runs, but when complete will be running
all required components in separate containers. Many of the components will be
available through HTTP endpoints, including:

- EYV Client Website will be at **http://localhost/**
- The Eat Your Veggies Supply Chain REST API will be at **http://localhost:8020**
- RethinkDB's admin panel will be available at **http://localhost:8023**
- Sawtooth's blockchain REST API will be available at **http://localhost:8024**

## Create User
You can sign up with a user of your choice.
But then you need to login with 
```
    username: administrator
    password: administrator
```
And with the administrator account you can activate the new user that you create.

## The blockchain already has users and products
but all of the users are desactivated e need to activate them

### Destroy the EYV


In bash you can shutdown these components with the key combination: `ctrl-C`.
You can shutdown _and_ remove the containers (destroying their data), with the
command:

```bash
docker-compose down
```


## Restarting Components

The default Docker containers use the `volumes` command to link directly to the
source code on your host machine. As a result any changes you make will
immediately be reflected in Supply Chain components without having to rebuild
them. However, typically you _will_ have to restart a component before it can
take advantage of any changes. Rather than restarting every container, you can
restart a single component from separate terminal using the container name. For
example:

```bash
docker restart supply-server
```

The available container names include:
- supply-shell
- supply-processor
- supply-server
- supply-rethink
- supply-validator
- supply-settings-tp
- supply-rest-api
- evy-client


## License

Hyperledger Sawtooth software is licensed under the
[Apache License Version 2.0](LICENSE) software license.

Hyperledger Sawtooth Supply Chain documentation in the [docs](docs)
subdirectory is licensed under a Creative Commons Attribution 4.0 International
License.  You may obtain a copy of the license at:
http://creativecommons.org/licenses/by/4.0/.


