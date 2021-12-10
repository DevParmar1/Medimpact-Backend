// Dependencies
require("./DB/mongoConnect.js");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

// Configuring app
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

// Routes
const authRoutes = require("./Routes/authRoutes")

app.use("/auth", authRoutes);



app.get("*", (req, res) => {
	res.send("hi");
});


module.exports = app;