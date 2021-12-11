const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const StoreSchema = Schema({
	donorId:{type: mongoose.Schema.Types.ObjectId, ref:"User"},
	lat:{type:Number},
	lng:{type:Number},
	bloodGroup:{type:String}
});
const Donor = mongoose.model("Donor", StoreSchema);
module.exports = Donor;