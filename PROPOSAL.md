# move full-stack application into cloud using CI/CD and container orchestration

We are going to put an existing full-stack web application that we developed in "UE Multimediasysteme" into the cloud.
This application is called flou and serves as a focus dashboard in the web. It consists of a SvelteKit frontend, a Spring Boot backend and a PostgreSQL database.

We are planning to containerize the frontend and backend of this application using Docker, orchestrate them using Kubernetes and deploy on GCP.
The Docker images will be uploaded to DockerHub.
Furthermore, we are going to implement this with CI/CD using GitHub Actions to allow for fast deployment.

# team

Fabian Schoenberger, k12308997  
Alex Siala, k12309011  
Philipp Olivotto, k12223453

# milestones

continuous documentation (everyone)

* containerization using Docker (Fabian Schoenberger)
* automatic builds using GitHub actions (Alex Siala)
* orchestration using Kubernetes (Philipp Olivotto)
* deployment to GCP using GitHub actions (everyone)
* presentation (everyone)
