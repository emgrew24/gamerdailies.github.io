const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
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


// === Session Handling ================================================
// --- (provided by Dr. Upadhayay) 

const sessions = {};
const SESSION_MAX_AGE = 60 * 60 * 1000; // 1 hour in ms

function createSession(username) {
    const sessionId = crypto.randomBytes(32).toString("hex");
    sessions[sessionId] = {
        username,
        createdAt: Date.now(),
    };
    console.log(`[SESSION] Created session for "${username}" -> ${sessionId.slice(0, 12)}...`);
    console.log(`[SESSION] Active sessions: ${Object.keys(sessions).length}`);
    return sessionId;
}

function getSession(sessionId) {
    if (!sessionId) return null;
    const session = sessions[sessionId];
    if (!session) {
        console.log(`[SESSION] Session not found: ${sessionId.slice(0, 12)}...`);
        return null;
    }
    // Check if expired
    if (Date.now() - session.createdAt > SESSION_MAX_AGE) {
        console.log(`[SESSION] Session expired for "${session.username}"`);
        delete sessions[sessionId];
        return null;
    }
    return session;
}

function destroySession(sessionId) {
    if (sessions[sessionId]) {
        console.log(`[SESSION] Destroyed session for "${sessions[sessionId].username}"`);
        delete sessions[sessionId];
    }
}


// === Cookie Helper Functions ==========================================
// --- (provided by Dr. Upadhayay) 

function parseCookies(req) {
    const cookieHeader = req.headers.cookie || "";
    const cookies = {};
    cookieHeader.split(";").forEach((cookie) => {
        const [name, ...rest] = cookie.trim().split("=");
        if (name) {
            cookies[name.trim()] = rest.join("=").trim();
        }
    });
    return cookies;
}

function setSessionCookie(res, sessionId) {
    // HttpOnly so JS can't touch it, Path=/ so it's sent on every request
    const cookie = `sid=${sessionId}; HttpOnly; Path=/; Max-Age=${SESSION_MAX_AGE / 1000}`;
    console.log(`[COOKIE] Setting cookie: sid=${sessionId.slice(0, 12)}...`);
    res.setHeader("Set-Cookie", cookie);
}

function clearSessionCookie(res) {
    console.log("[COOKIE] Clearing session cookie");
    res.setHeader("Set-Cookie", "sid=; HttpOnly; Path=/; Max-Age=0");
}


// === Helper Functions ================================================
// --- (provided by Dr. Upadhayay) 

// These just shorten the amount of code to write for each route

function readBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => resolve(body));
        req.on("error", reject);
    });
}

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

function serveFile(res, filePath, contentType) {
    console.log(`[FILE] Serving: ${filePath}`);
    fs.readFile(filePath, (err, content) => {
        if (err) {
            console.log(`[FILE] ERROR reading ${filePath}:`, err.message);
            res.writeHead(500);
            res.end("Error loading page");
            return;
        }
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
    });
}


// === MongoDB Connection ==============================================

let productData;
let userData;
async function connectDB(){
    try{
        await client.connect();
        productData = client.db("gamer_dailies").collection("services");
        userData = client.db("gamer_dailies").collection("users");
        console.log("[DB] Connected to MongoDB");
    }catch(e){
        console.error(
            "[DB] MongoDB connection failed ? :", e
        );
    }

}

// Fires off the connection to the database
connectDB()


// === Creating the server =================================================

const server = http.createServer (async (req, res)=>{

    // --- (provided by Dr. Upadhayay) ------------------------------

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    console.log(`\n[REQ] ${req.method} ${pathname}`);

    // Parse cookies on every request
    const cookies = parseCookies(req);
    const sessionId = cookies.sid;
    const session = getSession(sessionId);

    // session check was here

    // --------------------------------------------------------------


    // Main landing page
    if(pathname === '/' || pathname === ''){
        // fs.readFile( 
        //     path.join(process.cwd(), 'public', 'index.html'),
        //         (err, content)=>{
        //             if(err){
        //                 res.writeHead(500, {'Content-Type': 'text/html'});
        //                 res.end("<h1> Error loading page</h1>");
        //                 return
        //             }

        //             res.writeHead(200,{'Content-Type': 'text/html'});
        //             res.end(content);
        //         });
        console.log("[ROUTE] Serving main page");
        serveFile(res, path.join(process.cwd(), "public", "index.html"), 'text/html');
        return;
    }

    // --- (provided by Dr. Upadhayay) ------------------------------

    // Check session AFTER loading the main page
    if (session) {
        console.log(`[AUTH] Valid session for "${session.username}"`);
    } else {
        console.log("[AUTH] No valid session");
    }

    // The login page -----------------------------------------------
    if (pathname === "/login" && req.method === "GET") {
        console.log("[ROUTE] Serving login page");
        // If already logged in, redirect to /admin
        if (session) {
            console.log("[ROUTE] Already logged in, redirecting to /admin");
            res.writeHead(302, { Location: "/admin" });
            res.end();
            return;
        }
        serveFile(res, path.join(process.cwd(), "public", "login.html"), "text/html");
        return;
    }

    // The login API ------------------------------------------------
    if (pathname === "/login" && req.method === "POST") {
        console.log("[ROUTE] Login attempt...");
        const body = await readBody(req);
        let parsed;
        try {
            parsed = JSON.parse(body);
        } catch {
            console.log("[LOGIN] Bad JSON in request body");
            sendJSON(res, 400, { error: "Invalid JSON" });
            return;
        }

        const { username, password } = parsed;
        console.log(`[LOGIN] Trying username="${username}"`);

        // See if the user exists in the database
        const user = await userData
        .findOne({username: username, password: password})

        if (!user) {
            console.log(`[LOGIN] FAILED for username="${username}"`);
            sendJSON(res, 401, { error: "Invalid username or password" });
            return;
        }

        console.log(`[LOGIN] SUCCESS for username="${username}"`);
        const newSessionId = createSession(user.username);
        setSessionCookie(res, newSessionId);
        sendJSON(res, 200, { success: true, username: user.username });
        return;
    }


    // Logout ---------------------------------------------------------
    if (pathname === "/logout") {
        console.log("[ROUTE] Logout");
        if (sessionId) destroySession(sessionId);
        clearSessionCookie(res);
        res.writeHead(302, { Location: "/login" });
        res.end();
        return;
    }

    // authentication was here

    // === API Routes ===================================================

    // GET all product data -------------------------------------------
    if (pathname === '/api' && req.method === 'GET'){
        console.log("[API] GET all product data");
        productData
        .find({})
        .toArray()
        .then((results) => {
            console.log(`[API] Found ${results.length} products`);
            sendJSON(res, 200, results);
        }
       ).catch(err => {
            console.log("[API] ERROR fetching products:", err.message);
            sendJSON(res, 500, { error: "Failed to fetch products" });
       });
       return;
    }

    // Must have authentication after the GET route so database data can 
    // still be accessed on the main page (without a session!)

    // Authentication -------------------------------------------------
    // --- Everything below requires login ----------------------------

    if (!session) {
        if (pathname.startsWith("/api")) {
            console.log("[AUTH] Blocked API request - no session");
            sendJSON(res, 401, { error: "Unauthorized. Please log in." });
            return;
        }
        console.log("[AUTH] Blocked page request - redirecting to /login");
        res.writeHead(302, { Location: "/login" });
        res.end();
        return;
    }

    // Admin page -----------------------------------------------------
    if (pathname === "/admin" && req.method === "GET") {
        console.log("[ROUTE] Serving admin page (admin.html)");
        serveFile(res, path.join(process.cwd(), "public", "admin.html"), "text/html");
        return;
    }


    // Back to API routes ----------

    // POST new product -------------------------------------------------
    if (pathname === "/api" && req.method === "POST") {
        console.log("[API] POST new product");
        const body = await readBody(req);
        let service;
        try {
            service = JSON.parse(body);
        } catch {
            console.log("[API] Bad JSON in POST body");
            sendJSON(res, 400, { error: "Invalid JSON" });
            return;
        }
        service.addedBy = session.username;
        console.log(`[API] Adding product: "${service.service_title}" (user: ${session.username})`);
        productData
            .insertOne(service)
            .then((result) => {
                console.log("[API] Product inserted:", result.insertedId);
                sendJSON(res, 201, result);
            })
            .catch((err) => {
                console.log("[API] ERROR inserting product:", err.message);
                sendJSON(res, 500, { error: "Failed to add product" });
            });
        return;
    }


    // PUT update product -------------------------------------------------
    if (pathname.startsWith("/api/") && req.method === "PUT") {
        const id = Number(pathname.split("/")[2]);
        console.log(`[API] PUT update product id=${id}`);
        const body = await readBody(req);
        let updates;
        try {
            updates = JSON.parse(body);
        } catch {
            console.log("[API] Bad JSON in PUT body");
            sendJSON(res, 400, { error: "Invalid JSON" });
            return;
        }
        delete updates._id;
        delete updates.id;
        console.log("[API] Updates:", updates);

        productData
            .updateOne({ id: id }, { $set: updates })
            .then((result) => {
                console.log(`[API] Updated: matchedCount=${result.matchedCount}, modifiedCount=${result.modifiedCount}`);
                sendJSON(res, 200, result);
            })
            .catch((err) => {
                console.log("[API] ERROR updating product:", err.message);
                sendJSON(res, 500, { error: "Failed to update product" });
            });
        return;
    }

    // DELETE a product ---------------------------------------------------
     if (pathname.startsWith("/api/") && req.method === "DELETE") {
        const id = Number(pathname.split("/")[2]);
        console.log(`[API] DELETE product id=${id}`);

        productData
            .deleteOne({ id: id })
            .then((result) => {
                console.log(`[API] Deleted: deletedCount=${result.deletedCount}`);
                sendJSON(res, 200, result);
            })
            .catch((err) => {
                console.log("[API] ERROR deleting product:", err.message);
                sendJSON(res, 500, { error: "Failed to delete product" });
            });
        return;
    }

    // 404 Error -----------------------------------------------------------
    console.log(`[ROUTE] 404 - nothing matched for ${pathname}`);
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>404 nothing is here</h1>");

    // --------------------------------------------------------------

}); 


// Exporting the server for Vercel to grab it
module.exports = server