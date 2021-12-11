const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = Schema({
	donorName: { type: String },
	storeName: {type:String},
	storeOwner: {type:String},
	email: { type: String, required: true, unique: true },
	contact: { type: Number },
	DOB: { type: Date },
	createdAt: { type: Date, default: Date.now },
	landmark: { type: String },
	address: { type: String },
    pincode:{ type: Number},
	city: { type: String },
	country:{type:String, default:"India"},
	password: { type: String, required: true },
	latitude:{ type:Number},
	longitude:{ type:Number },
	ProfilePic: { type: String },
	isBlocked: { type: Boolean }, 
	isVerified: { type: Boolean, default:false},
    verificationCode : { type: String },
	accountType:{type:String},
	rejectedReason: String,
});
const User = mongoose.model("User", UserSchema);
module.exports = User;