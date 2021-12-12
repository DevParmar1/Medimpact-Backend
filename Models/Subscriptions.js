const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SubscriptionSchema = Schema({
    email:{type: String},
    name:{type:String},
	lng:{type:Number},
	lat:{type:Number},
	medicines:{type:String},
    bloodGroup:{type:String},
    need:{type:String}
});
const Subscription = mongoose.model("Subscription", SubscriptionSchema);
module.exports = Subscription;