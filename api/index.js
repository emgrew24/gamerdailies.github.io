const fs = require('fs');
const path = require('path');

// Website link hosted on Vercel: https://gamer-dailies.vercel.app/


// Connecting the index.js to Vercel so it will launch from here 
// instead of directly from the html to allow the routing.

// Getting MongoDB setup
const {MongoClient} = require('mongodb');
require('dotenv').config();
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

let packageData;
async function connectDB(){
    try{
        await client.connect();
        packageData = client.db("gamer_dailies").collection("services");
        console.log("Server -- Connected to MongoDB");
    }catch(e){
        console.error(
            "Server -- MongoDB connection failed ? :", e
        );
        // Exit from program if database fails
        process.exit(1);
    }

}

// Creating the server (second attempt with some research)
module.exports = (req, res)=>{

    // Main landing page
    if(req.url === '/' || req.url === ''){
        fs.readFile( 
            path.join(process.cwd(), 'index.html'),
                (err, content)=>{
                    if(err) throw err;

                    res.writeHead(200,{'Content-Type': 'text/html'});
                    res.end(content);
                });
    }
    // Redirects the user to the MongoDB database 
    else if (req.url === '/api' && req.method === 'GET'){
       packageData.find({}).toArray().then(
        results => {
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(JSON.stringify(results));
        }
       ).catch(err => {
            res.writeHead(500, {'Content-Type': 'application/json'})
            res.end(JSON.stringify({error: "Failed to fetch package data"}))
       })
    }
    else{
        res.writeHead(404,{'Content-Type': 'text/html'});
        res.end("<h1> Nothing is here </h1>");
    }

}; 
