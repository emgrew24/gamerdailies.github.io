const fs = require('fs');
const path = require('path');
const http = require('http');

// Website link hosted on Vercel: https://gamer-dailies.vercel.app/

// May need to refresh the page once or twice to get the database data 
// to load in properly. I couldn't figure out how to fix that yet


// Connecting the index.js to Vercel so it will launch from here 
// instead of directly from the html to allow the routing.

// Getting MongoDB setup
const {MongoClient} = require('mongodb');
require('dotenv').config();

// In order for this to work properly with Vercel you need to add the MONGO_URI
// as an environment variable in your Vercel project settings. 
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
    }

}

// Creating the server 
const server = http.createServer ((req, res)=>{

    // Main landing page
    if(req.url === '/' || req.url === ''){
        fs.readFile( 
            path.join(process.cwd(), 'index.html'),
                (err, content)=>{
                    if(err){
                        res.writeHead(500, {'Content-Type': 'text/html'});
                        res.end("<h1> Error loading page</h1>");
                        return
                    }

                    res.writeHead(200,{'Content-Type': 'text/html'});
                    res.end(content);
                });
    }
    // Redirects the user to the MongoDB database data instead of file data
    else if (req.url === '/api' && req.method === 'GET'){
        packageData.find({}).toArray().then(
        results => {
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(JSON.stringify(results));
        }
       ).catch(err => {
        console.error("API error: ", err) // Test line
            res.writeHead(500, {'Content-Type': 'application/json'})
            res.end(JSON.stringify({error: "Failed to fetch package data"}))
       })
    }
    else{
        res.writeHead(404,{'Content-Type': 'text/html'});
        res.end("<h1> Nothing is here </h1>");
    }

}); 

// Fires off the connection to the database
connectDB()


// Note for myself ======
// Had to add a build specifically for the assets folder because Vercel wouldnt
// recognize it or use it (which is why I had so many issues with the images... grumble grumble...)
// Also had to add a specific route for the assets folder that came BEFORE the index.js route 
// so Vercel could get the static folder beforehand.


// Exporting the server for Vercel to grab it
module.exports = server