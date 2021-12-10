const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const StoreSchema = Schema({
	storename: { type: String },
    storeOwner: {type: String},
	email: { type: String, required: true, unique: true },
	contact: { type: Number, unique: true },
	DOB: { type: Date },
	createdAt: { type: Date, default: Date.now },
	landmark: { type: String },
	address: { type: String },
    pincode:{ type: Number},
	city: { type: String },
	password: { type: String, required: true },
	ProfilePic: { type: String },
	isBlocked: { type: Boolean }, 
	isVerified: { type: Boolean, default:false },
    verificationCode : { type: String },
    AccountType:{type:String, default:"STORE"},
	rejectedReason: String,
});
const Store = mongoose.model("Store", StoreSchema);
module.exports = Store;