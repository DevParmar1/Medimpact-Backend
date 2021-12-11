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
const authRoutes = require("./Routes/authRoutes");
const storeRoutes = require("./Routes/storeRoutes");
const donorRoute = require("./Routes/donorRoute");
const { maps } = require("./services/maps.js");

app.get("/maps",async (req,res)=>{
const data = await maps("F-4/ Bhanujit Apartment", "Vijay Dalwada Center", "Ahmedabad", 380022);
res.send(data.items[0].position);
})

app.use("/auth", authRoutes);
app.use("/store", storeRoutes);
app.use("/donor", donorRoute);



app.get("*", (req, res) => {
	res.send("hi");
});


module.exports = app;