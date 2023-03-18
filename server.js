const path = require("path");
const express = require("express");
const app = express();


const apiRouter = require("./routes/api.js");



/*  view engine setup   */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


/*  routing */
app.use("/api", apiRouter);

/*  use static folder   */
app.use(express.static("public"));



module.exports = app;

/*  connect to database */
const mongoose = require("mongoose");
const mongodb = "mongodb+srv://NewAdmin:badauth@tasks.ovwgffx.mongodb.net/?retryWrites=true&w=majority";
mongoose
    .connect(mongodb)
    .then(console.log("Database Connected"))
    .catch((err) => console.log(err));

app.listen("8000", () => {
    console.log("listend in 8000!");
})
