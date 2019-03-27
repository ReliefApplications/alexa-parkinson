# Backend Alexa WFP

This project is made of two parts. The main and first one is handling the requests 
made by Amazon Alexa in order to execute some actions. As of now, most of the actions are getting 
data from google sheet files and aggregate them according to the parameters the user asked for.

It is also possible to control a dashboard with the voice. The dashboard is accessible 
[here](http://wfp-pof.s3-website-ap-northeast-1.amazonaws.com/).

The .json of the Alexa skills kit is saved in vui.json.
___
The second part is a socket server that will be used to broadcast the data to the dashboard from 
the google files without having the front part to do multiple request per second in order to 
get the changes. 

## Build

In order to deploy the two servers at the same time on the reliefappstest server, a gulp file
has been created. It will create a dist folder that will then be pushed to the server.

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
    - babyparse: 0.4.6
    - express: 4.16.3
    - request: 2.88.0
    - socket.io: 2.1.1
    - socket.io-client: 2.1.1
    - ssml-builder: 0.4.3


## Architecture with use cases


## SSL Certificate

In order to use your own server to host the backend for Alexa, you have to certify your host.
You can use [this documentation](https://developer.amazon.com/docs/custom-skills/configure-web-service-self-signed-certificate.html#create-a-private-key-and-self-signed-certificate-for-testing) 
form Amazon.

The certificate for the https url does expire on the 15th of January 2019. Don't forget to renew it.

## Docker

This project works with Docker.

To start coding in a safe environment, please launch the docker container with the following command:
```
sudo docker-compose up devapp
```

If it's the first time, please run 
```
sudo ./docker-build.sh
```