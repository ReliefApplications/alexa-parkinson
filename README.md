# Backend Alexa Skill Parkinson

This project was built to handle the requests made by Amazon Alexa in order to execute some actions.
The .json of the Alexa skills kit is saved in vui.json.

## Build

In order to deploy on the reliefappstest server, a gulp file has been created. It will create a dist folder that will then be pushed to the server.

``` gulp build ``` will only copy the files needed in the dist folder 
and ``` gulp push ``` will only push the files to the server.

## Deployment on test server

You can use ``` gulp deploy ``` to build and push to the server.

## Local deployment
The two projects are dockerized so if you want to run them locally you simply have to execute the
command ``` ./docker-build.sh ```.

## Further help

For the Amazon Skill part : [Amazon - Create the Interaction Model for Your Skill](https://developer.amazon.com/docs/custom-skills/create-the-interaction-model-for-your-skill.html)

For the self hosting part : [Amazon - Host a Custom Skill as a Web Service](https://developer.amazon.com/docs/custom-skills/host-a-custom-skill-as-a-web-service.html)

For the alexa-app package doc : [npm alexa-app](https://github.com/alexa-js/alexa-app)

## Dependencies and languages

    - alexa-app: 4.2.2
    - dotenv: 6.1.0,
    - express: 4.16.3
    - ssml-builder: 0.4.3

## SSL Certificate

In order to use your own server to host the backend for Alexa, you have to certify your host.
You can use [this documentation](https://developer.amazon.com/docs/custom-skills/configure-web-service-self-signed-certificate.html#create-a-private-key-and-self-signed-certificate-for-testing) 
form Amazon.

## Docker

This project works with Docker.

To start coding in a safe environment, please launch the docker container with the following command:
```
sudo docker-compose up devapp
```

If it's the first time, run 
```
sudo ./docker-build.sh
```

## Database information

The database is into a container unreachable from outside the container itself and the devapp container. Thus, to access its command line, data, and to manage it directly by hand you must ssh into the server and access the container with
```
sudo docker-compose exec db bash
```
(obviously after it has been started)

### Insert new data from a csv file

This command is used to import data into the db from a csv file. Look at ``` mongoimport --help ``` for more options.

**BEWARE** it must be with COMMA (,) separated values, NOT COLUMNS (:). Plus, in this command we are supposing that the first line is the table header.

```
mongoimport --db=parkinson --collection=medicine --username=<database_user> --password=<database_password> --authenticationDatabase=<database_for_auth> --type=csv --headerline parkinson.csv
```
