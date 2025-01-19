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

# 3. GitHub Actions

The project uses one workflow file with two jobs to ensure a clean and structured CI/CD pipeline.
The file is located in the .github folder.

## Workflow Overview

**buildAndDeploy.yml**
- Responsible for building and pushing Docker images for the project's components.
- Handles deployment of the application to a Kubernetes cluster on Google Cloud Platform (GCP).

## Prerequisites

Ensure the following secrets are configured in your GitHub repository:
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `GCP_PROJECT_ID`
- `GCP_SA_KEY`

- Ensure all Kubernetes manifests (`k8s/*.yaml`) are correctly configured with the appropriate Docker image paths.
- Tags (`v*`) should follow a semantic versioning convention to maintain clarity - for example v1.0.0
- Both jobs of the workflow work together, but `Deploy` is dependent on the success of `Build`.


## Build Job

The Build Job builds and pushes Docker images.
Each image is tagged with the Git tag that triggered the workflow (`github.ref_name`).
The job ensures consistency between code versions and image versions.

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

## Deploy Job

The Deploy Job ensures the application is deployed to a Kubernetes cluster.
Utilizes Kubernetes manifests (`k8s/*.yaml`) to deploy the application.
Ensures the latest Docker images (built in the Build Job) are used.

1. **Triggered By**: 
   - Depends on the successful completion of the Build Job of this workflow.

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


# 2. Google Cloud Platform
To deploy the application on Google Cloud Platform (GCP), we need a GCP Project with a GKE (Kubernetes) cluster and two PostgreSQL databases.
Follow these steps to prepare the environment:

1. Create a New Project\
   Start by creating a new project in GCP named `flou`. Note down the generated `GCP_PROJECT_ID`, as it will be required in later steps.

2. Set Up a Service Account and get the SA_KEY\
   Navigate to `IAM & Admin > Service Accounts` in the GCP Console. Create a service account with permissions to access and manage the GKE cluster (Kubernetes Engine Service Agent role).
   Once the service account is created, generate a JSON key for it. Securely store this key file, as it will be used later as the `GCP_SA_KEY`.

Now the preparations are done and we can setup the rest.

## Databases
First we create a PostgeSQL instance with CloudSQL in GCP. We keep the default settings (if wanted change the region).
We name the instance 'flou-postgres-instance'. Then we navigate to the instance and create two databases, one for the authentication-service and one for the todo-service.
We name the databases 'flou-auth' and 'flou-todo' respectively. We also create a user for each database, with the same name as the corresponding database, and set a password.
Now we navigate to the 'Connections' tab and add the IP '0.0.0.0/0' to the authorized networks. This allows all IP addresses to connect to the database.
In our case this means that the pods in the GKE cluster can connect to the database.
This is definitely not recommended for production, but for our purposes it is sufficient to keep the setup simple.

One should follow this guide for the recommended approach: https://cloud.google.com/sql/docs/postgres/connect-kubernetes-engine.

Now we have a running PostgreSQL instance with two databases, which can be accessed from the GKE cluster.
We find the public IP of the instance in the 'Overview' tab under 'Public IP address.
It is also possible to connect from a PostgreSQL client (e.g. pgAdmin), by using the public IP of the instance and the user credentials.

Note down the public IP, the credentials and the database names, as they will be needed later for GKE secrets.

## GKE Cluster
Now we create a GKE Cluster in GCP using the webpage. When creating the cluster we use the 'Standard mode'. We change it's
name to `flou-cluster-1` and keep all the other settings at default.
This will create a Kubernetes cluster with 3 nodes, which is then used to host all of our services (frontend-service, todo-service, authentication-service).

Now we manually add some secrets to the cluster, which can be used by the pods as environment variables.
For that we first connect to the cluster in the `Google Cloud Shell`: (The command can be accessed from the Webpage)
```shell
gcloud container clusters get-credentials flou-cluster-1 --zone your-cluster-zone --project your-project-id
```
Now kubectl is configured for our cluster and we can add needed secrets.
```shell
kubectl create secret generic weather-api-key --from-literal=WEATHER_API_KEY=your-weather-api-key
kubectl create secret generic temp-ics --from-literal=TEMP_ICS=your-temp-ics
kubectl create secret generic todo-db-credentials --from-literal=username="flou-todo" --from-literal=password="<user-password>" --from-literal=db_host="jdbc:postgresql://<db_instance_public_ip>:5432/flou-todo"
kubectl create secret generic auth-db-credentials --from-literal=username="flou-auth" --from-literal=password="<user-password>" --from-literal=db_host="jdbc:postgresql://<db_instance_public_ip>:5432/flou-auth"
```

## Domain name
Just for the sake of completeness, we also bought a domain name from Google Domains. This is not necessary for the setup, but it is nice to have.
We can use this domain name to access the frontend-service, instead of the IP address of the load balancer.
For this we put the external IP address of the frontend-service into the A-Record of the domain name.
Now it's possible to access our application via `http://f-lou.com`.


## 5. Accessing the Web Application
In our case it is possible to access the application via http://f-lou.com.\
Alternatively, the frontend-service can be accessed via the external IP address of the load balancer.

## 6. Dynatrace Implementation
Due to time constraints, we left out the implementation of Dynatrace monitoring.\
It would have benefited the project by providing insights into the performance and health of the application.

## 7. Lessons Learned

### Benefits of Microservices Architecture
-Scalability of single services.\
-Maintainability: Services are simple

### The Role of CI/CD Pipelines
-Automation Reduces Errors: Automating build, test, and deployment pipelines through GitHub Actions ensured consistent deployments.\
-Semantic Versioning: Strict adherence to semantic versioning (v*) improved traceability and coordination.\
-GitHub Actions: Easy to set up and integrate.

### Challenges in Cloud Setup
The decision to allow all IPs (0.0.0.0/0) for database connections simplified the setup but could lead to security vulnerabilities. This highlighted the trade-offs between convenience and security, especially in non-production environments.\
Manually adding secrets and configuring clusters was educational but also demonstrated the importance of automating these tasks with tools like Terraform or Helm for efficiency and repeatability.\
Our docker images are public, which made it easy to pull them in the GKE cluster. If this is not wanted, it could be more useful to use the registry of GCP, to keep the flow more simple.

### Importance of Documentation
Detailed step-by-step instructions on setting up services, databases, and CI/CD pipelines ensured clarity for future team members or contributors.

### Logging and Observability
Logging is crucial to detect problems in the services / GitHub actions. We had problems with the database connection from GKE which was hard to debug, due to no monitoring and no custom logs.
