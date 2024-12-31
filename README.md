# 1. Architecture

The previous architecture used a simple monolithic approach with a server-side rendered frontend and a large backend, which is responsible for every feature.  

![old architecture](./.markdown/architecture%20(old).png)

This means adding new features or updating existing ones would require significant downtime;
Also, as the backend grows in features, complexity makes finding issues and improving on said features more complicated.

Splitting the backend into multiple microservices can help mitigate these problems.

Our approach to splitting the backend was to factor out different features and determine their dependencies.
This approach led us to the following architecture.

![architecture](./.markdown/architecture.png)

The previous monolithic backend was split into two microservices since these are the only features that require a backend.
Obviously, as the number of features grow, so would the count of microservices.  

The ToDo microservice needs to match ToDos to a user, meaning it depends on the authentication service.  
This is solved using the following approach.

![ToDo Service authentication](./.markdown/todo%20service%20authentication.png)

The frontend only needed minor adjustments due to the modular nature of our API handling.

# 2. Docker builds

## backends

To prepare the build of either backend, execute the following in the respective directory:

```shell
./gradlew dependencies
./gradlew bootJar
```

This downloads dependencies and builds the application.

To build the image execute the following:

```shell
docker build -t <name> .
```

## frontend

To prepare the build of the frontend execute the following in its directory:

```shell
npm clean-install
npm run build
```

This downloads dependencies according to `package-lock.json` and builds the application.

To build the image execute the following:

```shell
docker build -t <name> .
```

# 3. Github Actions

The project uses two separate workflows, build.yml and deploy.yml, to ensure a clean and structured CI/CD pipeline.

## Workflow Overview

- **build.yml**: Responsible for building and pushing Docker images for the project's components.
- **deploy.yml**: Handles deployment of the application to a Kubernetes cluster on Google Cloud Platform (GCP).

## build.yml

The `build.yml` workflow build an pushes Docker images.
Each image is tagged with the Git tag that triggered the workflow (`github.ref_name`).
Ensures consistency between code versions and image versions.

1. **Triggered By**: 
   - A `push` to any version tag (`v*`).
   
2. **Actions**:
   - Checks out the code.
   - Sets up Docker Buildx.
   - Logs in to Docker Hub using saved secrets.
   - Builds and pushes Docker images for:
     - **Authentication Service**
     - **Frontend**
     - **ToDo Service**

3. **Required Secrets**:
   - `DOCKER_USERNAME`: Your Docker Hub username.
   - `DOCKER_PASSWORD`: Your Docker Hub password or access token.

## deploy.yml

The `deploy.yml` workflow ensures the application is deployed to a Kubernetes cluster.
Utilizes Kubernetes manifests (`k8s/*.yaml`) to deploy the application.
Ensures the latest Docker images (built in `build.yml`) are used.

1. **Triggered By**: 
   - Depends on the successful completion of the `build.yml` workflow.

2. **Actions**:
   - Checks out the code.
   - Sets up the Google Cloud SDK.
   - Authenticates with GCP using a Service Account.
   - Deploys the application using Kubernetes manifests:
     - **Authentication Deployment**
     - **Frontend Deployment**
     - **ToDo Deployment**

3. **Required Secrets**:
   - `GCP_PROJECT_ID`: The Google Cloud project ID.
   - `GCP_SA_KEY`: A JSON key for a Google Cloud Service Account with permissions for Kubernetes Engine.


## Prerequisites

Ensure the following secrets are configured in your GitHub repository:
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`
   - `GCP_PROJECT_ID`
   - `GCP_SA_KEY`
  
- Ensure all Kubernetes manifests (`k8s/*.yaml`) are correctly configured with the appropriate Docker image paths.
- Tags (`v*`) should follow a semantic versioning convention to maintain clarity.
- Both workflows work together, but `deploy.yml` is dependent on the success of `build.yml`.
