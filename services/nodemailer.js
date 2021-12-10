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




module.exports.sendVerificationMail = async (email, verificationCode) => {
    try{
        const accessToken = await Oauth2Client.getAccessToken();
						const transporter = await nodemailer.createTransport({
							service: "gmail",
							auth: {
								type: "OAUTH2",
								user: "noreply.medimpact@gmail.com",
								clientId: CLIENT_ID,
								clientSecret: CLIENT_SECRET,
								refreshToken: REFRESH_TOKEN,
								accessToken: accessToken,
							},
						});
    
            await transporter.sendMail(
                {
                    to: email,
                    from: "no-reply@medimpact.in",
                    subject: "Please confirm your account",
                    html: `<h3>Email Confirmation</h3>
                      <p>Please confirm your email by clicking on the following link</p>
                      <a href=http://localhost:3000/verification/${verificationCode}> Click here</a>
                      </div>`,
                },
                (err, response) => {
                    if (err) {
                        console.log(err);
                       
                    } else {
                        console.log("success");
                    }
                    transporter.close();
                }
            );
    }
    catch(error){
        console.log(error);
    }
};