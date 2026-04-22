const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
// Getting MongoDB setup
const {MongoClient} = require('mongodb');
require('dotenv').config();

// Website link hosted on Vercel: https://gamer-dailies.vercel.app/

// May need to refresh the page once or twice to get the database data 
// to load in properly. I couldn't figure out how to fix that yet


// Connecting the index.js to Vercel so it will launch from here 
// instead of directly from the html to allow the routing.


// In order for this to work properly with Vercel you need to add the MONGO_URI
// as an environment variable in your Vercel project settings. 
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

let productData;
async function connectDB(){
    try{
        await client.connect();
        productData = client.db("gamer_dailies").collection("services");
        console.log("[DB] Connected to MongoDB");
    }catch(e){
        console.error(
            "[DB] MongoDB connection failed ? :", e
        );
    }

}

// Fires off the connection to the database
connectDB()

// Creating the server 
const server = http.createServer ((req, res)=>{

    // Main landing page
    if(req.url === '/' || req.url === ''){
        fs.readFile( 
            path.join(process.cwd(), 'public', 'index.html'),
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
        productData.find({}).toArray().then(
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
    else if (req.url === '/login'){
        fs.readFile( 
            path.join(process.cwd(), 'public', 'login.html'),
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
    else{
        res.writeHead(404,{'Content-Type': 'text/html'});
        res.end("<h1> Nothing is here </h1>");
    }

}); 



// Exporting the server for Vercel to grab it
module.exports = server