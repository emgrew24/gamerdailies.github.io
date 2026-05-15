# This is where information/notes about the project live

========================
# Packages Installed

* `Node.js version` -------------------------------------------
- npm init (not a package but obv to initalize the project)
- npm install dotenv mongodb nodemon

* `Express.js version` ----------------------------------------
- npm init
- npm install express dotenv mongoose bcryptjs jsonwebtoken express-async-handler

=======================


The program is being hosted on Vercel (through the github repo)
- https://gamer-dailies.vercel.app/


Uses NodeJS* and is attached to a MongoDB database 
* Now uses Express.js

If you don't have access to the users database here is a login for the admin page
- Username: Admin
- Password: password123
(super secure I know!)

# ------- Alt Logins ------- #
- User: Fish
- Password: shark456

- User: svsu
- Password: cardinal


# --------
I plan to go back and make detailed comments on everything
but since im turning this in as an assignment and am slightly
pressed for time that will have to happen at a later date


# --------
Realized that I never applied the font I was using on the entire site to 
the buttons so now I fixed that. Also applied it to all the inputs - 5/15/2026



# ------------------------------------------------------ #
# ================== Important !! ====================== #

- As of 4/28/2026 I have started refactoring the program to be centered
around using Express.js instead of Node.js for my final project
- The previous versions of all the js files written with Node.js
can be found in the folder `node_js_files` 
- I have also completly changed the file structure (again)
so it will look entierly different than before




===========================================================
# ------------------ Vercel Notes ----------------------- #

vercel is stupid and i dont like using it... but whatever im in too deep now

# Using ExpressJS ---
Here is a good link to Vercel's documentation about using ExpressJS
- https://vercel.com/docs/frameworks/backend/express


# Adding new folders to the project ---
Any new folders that are used need to be added to the `vercel.json` so that Vercel 
will actually see them and use them in deployment. Do not need to add the folders
within that folder, just needs to be able to see whatever new folder is in the root. 

# Using MongoDB ---
In order for this to work properly with Vercel you need to add the MONGO_URI
as an `environment variable` in your Vercel `project settings`.

`!!! THIS APPLIES TO ANY ENV VARIABLE THAT IS USED IN THE PROJECT !!!`
(found that out the hard way...)