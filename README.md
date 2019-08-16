# Backend Alexa Skill Parkinson

This project was built to handle the requests made by Amazon Alexa in order to execute some actions.
The .json of the Alexa skills kit is saved in vui.json.

## Build

A gulp file has been created in order to deploy on the reliefappstest server. It will create a dist folder that will then be pushed to the server.

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

### Account setup
It's suggested to create two new accounts on a new deploy: an 'admin' one and a 'user' one.
In MongoDB any account must be "linked" to a specific database, but this linking does **NOT** determine the authorizations on the databases. Thus, in our case server both accounts are saved on the "admin" database, but they have different authorizations level (the "user" can only modify the "user" collection on the app's proper database and the admin has - of course - super powers)

The command to create new users is
```
use databaseName   # or whatever database you want to link to the user

db.createUser(
    {
        user: "username",
        pwd: "password",
        roles: [
            { role: "read", db: "dbname" },
            { role: "readWrite", db: "otherdb" },
            
            # Use this role for an admin account
            { role: "userAdminAnyDatabase", db: "admin" }
        ]
    }
)
```

### Insert new data from a csv file

This command is used to import data into the db from a csv file. Look at ``` mongoimport --help ``` for more options.

Because of the relative forms of input (any user could use different names for the medicines, especially for the special characters as slash and/or commas in numbers), a new column called "formatted_name" file must be created on the csv. In the column every special character is replaced with a whitespace. This way it's possible to make more precise queries for names.

In order to format the csv file, a script called ```csv-format.py``` has been created. It's not perfectly written, thus to use it it should probably be modified a bit (requires very basic python knowledge such as strings and lists)

**BEWARE** the file must be with COMMA (,) separated values, **NOT** COLUMNS (:). Plus, in the command below we are supposing that the first line is the table header.

```
mongoimport --db=parkinson --collection=medicine --username=<database_user> --password=<database_password> --authenticationDatabase=<database_for_auth> --type=csv --headerline parkinson.csv
```

### Setup the collection data
After importing the data you must create a new text index on the database that covers every needed field (for now it seems usless to cover the 'side_effects' field, but we never know).

1. Access the database on the remote machine as shown above
2. Move to the 'admin' database and autenticate with ``` db.auth(username, password)```
3. Create the text index with the command. This will create a text index on every column. In MongoDB text indexes may cover any number of columns, but there can be only one text index per collection.
```
db.medicine.createIndex({ formatted_name: "text", product: "text", active_principle: "text", color: "text", shape: "text", number: "text", side_effects: "text" })
```

It's important to know that with a text index it is possible to easily get a query that searches among all the columns and get a "score" for each document that indicates how much that document matches the query (see getMedicineByFormattedName function for an example).


## Source code structure

The conversation with alexa is handled with a tree. Whenever the user enters an intent, the tree of the user navigates to a specific child node. If the node we're looking for does not exists, it tries to find it from the root of the tree. If it doesn't exists, it throws an error.

For now the tree is shared among the users. 
In a future implementation every user should have its own tree.

### /lib/database
Has any service that has to do with the database.

general.js - just a function to open the database connection and return a reference to it.

medicinedata.js - service that holds the function to get medicine informations

userdata.js - service that holds the function to get user's informations

### /lib/dialogue
Has any file to handle the dialogue with alexa

- alexa-dialogue.js - puts together all the dialogue branches into "scenarios"
- dialogue-tree.js - has the definitions for the dialogue tree, the basic structure that handles a full dialogue

### /lib/dialogue/scenarios
Has any module that handles a branch of the dialogue tree


### /lib/tempdata
Has any module that saves temporary data that doesn't need to be saved on the database. We could use the db itself for that, but an implementation with something like Redis would be interesting.

For now (22/07/2019) it has only two simple wrapping functions to hold the medicines the user is dealing with between two requests.


# Upcoming features
- Possibility to add doses and quantities of a certain medicines
- Closing phrases said by the device ("Thanks for using parkinson skill")
- Different possible sentences (said randomly) to not be repetitive
- (POSSIBLE) dashboard webapp for the caregiver
- Call to the association or the neurologist
- Take an appointment with association/neurologist (there are centers with proper API)

