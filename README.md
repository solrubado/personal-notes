# Personal Notes
REST API backend application that can be used to manage personal notes in a multi-user environment

#How to run the API

This API is deployed in Heroku 

``https://thirdfort-personal-notes.herokuapp.com/``

so you can test it without needing to run anything manually.


In case you want to run it manually, you need to have Node installed. 

Then in the console

Clone the repo:

`git clone https://github.com/solrubado/personal-notes.git`

Install the repositories

`npm install`

Initialize Mongo DB

`mongod`

Finally

`npm run start`

Now the API will be running in 

`http://localhost:3000/`


#How to use the API

This API lets an user create a note, update and delete it. 

Each note has a title, a text (required) and a status that could be : 'ongoing' (default) or 'archived'

Each user has a first_name, a last_name, an username, an email (required) and a password (required).

Once a user is logged the API returns a token that will authorize the user to use the notes endpoints.
So the user can only see, update and delete his own notes.

The API has a Postman collection to understand how it works. 

`https://www.getpostman.com/collections/5d67d6e5ccbb75432d86`.

To use this collection you need to:

    - Open Postman.
    - Click the button Import that you can find in the top left of the screen.
    - Select the tab "Import from Link"
    - Copy the link https://www.getpostman.com/collections/5d67d6e5ccbb75432d86
    - You will now find in the Collections tab a "Personal Notes" folder with all the endpoints inside
    divided in categories (Login, Users, Notes).
    
    - Once you selected an endpoint you will have on the right: 
        - The endpoint name (if you click it, it will show you a small description)
        - The endpoint url and the method (get, post)
        - Authorization Tab (in which you will be required to put a 'Token {token} in the secured endpoints)
        - Body Tab (that is populated with some data, so you know wich parameters to send to the API)
    
    - Now you have all the data to understand and test the API.
    

Any doubts refer to: sol.rubado@gmail.com

#Tech Stack

This API was made using Node.js, Express and MongoDB.

They were chosen because they can be written completely in javascript. 
MongoDB is a NoSQL database which makes it extremely flexible to use and 
Node.js is fast and scalable, supporting thousands of concurrent connections.

#Future Features

    - Let the user share his notes with other users.
    - Let the user get an email with the note at certain time he chooses.
    