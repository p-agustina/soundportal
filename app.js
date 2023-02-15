// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();



// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const session = require("express-session")
const MongoStore = require("connect-mongo")

app.use(
  session({
    secret: process.env.SESS_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    })
  })
)

//FOR SHOWING CONTENT IN HBS DEPENDING IF USER IS LOGGED IN

app.use((req,res,next)=>{
  if(req.isLoggedIn) res.locals.isLoggedIn = req.isLoggedIn();
  next();
});


// default value for title local
const capitalize = require("./utils/capitalize");
const projectName = "cornudify";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const musicRoutes = require("./routes/music.routes");
app.use("/", musicRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);






module.exports = app;
