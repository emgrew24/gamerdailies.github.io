const http = require('http');
const fs = require('fs');
const path = require('path');

// Website link: http://localhost:5959/

// Creating the server
const server = http.createServer( (req, res)=>{

    // Main landing page
    if(req.url === '/'){
        fs.readFile( 
            path.join(__dirname, 'index.html'),
                (err, content)=>{
                    if(err) throw err;

                    res.writeHead(200,{'Content-Type': 'text/html'});
                    res.end(content);
                });
    }
    // Redirects the user to the json database 
    else if (req.url === '/api'){
        fs.readFile(
            path.join(__dirname, 'db.json'), 'utf-8',
                    (err, content) => {
                        if (err) throw err;

                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(content);
                    }
        );
    }
    else{
        res.end("<h1> Nothing is here </h1>");
    }

}); 


const PORT = process.env.PORT || 5959;

server.listen(PORT, ()=> console.log('Server is running on port: ' +PORT));