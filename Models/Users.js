const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = Schema({
	name: { type: String },
	email: { type: String, required: true, unique: true },
	contact: { type: Number },
	DOB: { type: Date },
	createdAt: { type: Date, default: Date.now },
	landmark: { type: String },
	address: { type: String },
    pincode:{ type: Number},
	city: { type: String },
	password: { type: String, required: true },
	ProfilePic: { type: String },
	isBlocked: { type: Boolean }, 
	isVerified: { type: Boolean, default:false},
    verificationCode : { type: String },
	accountType:{type:String},
	rejectedReason: String,
});
const User = mongoose.model("User", UserSchema);
module.exports = User;