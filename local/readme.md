# Local Testing

## Overview

This directory contains files that help you setup a local testing environment to run services.

## Prerequisites

Make sure you have Docker and Docker Compose installed on your machine.

- [Docker Installation Guide](https://docs.docker.com/get-docker/)
- [Docker Compose Installation Guide](https://docs.docker.com/compose/install/)

## Getting Started

You can start a container with a docker-compose file using this command:

```bash
docker-compose -f '<filename>' up -d
```

## Useful Commands

- Check if db is running:

    ```bash
    docker-compose ps
    ```

    Ensure that the service is listed and in the "Up" state.

- Stop and remove started container:

    ```bash
    docker-compose down
    ```

    This will stop and remove the container, cleaning up the local environment.

- Clean up volumes (including data):

    ```bash
    docker-compose down -v
    ```

    This will stop the containers and remove associated volumes, ensuring a clean slate for the next run.

## Notes

- The default MongoDB connection string for local testing is `mongodb://localhost:27017`.

