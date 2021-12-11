const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const StoreSchema = Schema({
	storeId:{type: mongoose.Schema.Types.ObjectId, ref:"User"},
	lng:{type:Number},
	lat:{type:Number},
	medicines:[{type:String}]
});
const Store = mongoose.model("Store", StoreSchema);
module.exports = Store;