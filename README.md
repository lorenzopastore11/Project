# PROGETTO TAW

Author: Lorenzo Pastore, matriculation number: 885812
University: Ca' Foscari of Venice
Course: [CT0142] TECHNOLOGIES AND WEB APPLICATIONS (CT3)

This project is a web application for order management in a restaurant.

The application is built using:

Angular as the frontend framework
Node.js as the backend framework with:
- Express as routing service
- MongoDB as the database and Mongoose as the database driver


If you want to set the environment using Docker pulling images, follows step 1:;
if you want to set environment using Docker and manually building images, follow step 2:;
if you want to set environment manually without Docker, follow step 3:.



***********************************************************************************************
1: WITH DOCKER PULLING IMAGES
***********************************************************************************************

1. create project folder
2. Copy docker-compose.yml inside it
3. run: docker pull mongo
4. run: docker pull lorenzopastore885812/taw-frontend
5. run: docker pull lorenzopastore885812/taw-backend
6. run: docker-compose up
7. run: http://localhost:8080 on browser


***********************************************************************************************
2: WITH DOCKER BUILDING IMAGES
***********************************************************************************************

To install frontend image:
docker build . -t lorenzopastore885812/taw-frontend 

To install backend image:
docker build . -t lorenzopastore885812/taw-backend

To upload database:
docker pull mongo


To start all images:
docker-compose up


This will start the frontend, backend and database services. The frontend will be available at localhost:8080 and the backend at localhost:3000. It is important that you build docker images 
inside correct folder; instead, run docker-compose up ouside backend and frontend folders.


***********************************************************************************************
3: WITHOUT DOCKER
***********************************************************************************************

# Prerequisites

1. MongoDB installed
2. Server is listening on port 3000. 

# Frontend

To run frontend, follow this steps:
1. npm install
2. npm install -g @angular/cli
3. npm install jwt-decode
4. npm install pdf-lib
5. npm install rxjs
6. npm install tslib
7. npm install zone.js
8. ng serve 
CTRL + click on the URL generated


# Backend

To run backend, follows this steps:
1. npm install cors
2. npm install dotenv
3. npm install express
4. npm install typescript
5. npx ts-node src/server.ts
You should see 'Server listening on port 3000'


# Options

The server URL is stored in './environment/environment.ts'. The port of the server is 3000 and
it is not modifiable.




