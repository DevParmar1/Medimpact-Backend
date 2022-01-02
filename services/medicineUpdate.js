const nodemailer = require("nodemailer");
require("dotenv").config();
const { google } = require("googleapis");

const CLIENT_ID = process.env.ClientAuthId;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const CLIENT_SECRET = process.env.ClientSecret;
const REFRESH_TOKEN = process.env.GoogleRefresh;


const Oauth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URI
);
Oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

exports.medicineUpdate = async (req,res) => {
    
}