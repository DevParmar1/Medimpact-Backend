const Store = require("../../Models/Store")
const User = require("../../Models/Users");

exports.addMedicines = async (req, res) => {
try{
    const { medicines} = req.body;
    console.log(req.user_id)
    const store = await Store.findOne({storeId:req.user_id});
    if(store){
        console.log(store)
        medicines.map((m)=>{
            store.medicines.push(m)
        })
        await store.save()
        return res.status(200).send({success:true, message:"Medicines added successfully"})
    }
    else{
        const newStore = new Store({storeId:req.user_id, medicines: medicines})
        await newStore.save()
        return res.status(200).send({success:true, message:"Store Medicines added successfully"})
    }
}
catch(error){
console.log(error);
}   
}

exports.nearestStore = async (req,res) => {
    try{
        const {lat,lng,medicine} = req.body;
        var stores = await Store.find({'medicines': {
            $elemMatch: {
                $regex : `.*${medicine}.*`,  $options : 'i'
            }
        }})

    
    function calcCrow(lat1, lon1, lat2, lon2) 
    {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

   
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }
        
        stores = stores.filter((s)=>{
           var r  = calcCrow(s.lat, s.lng, lat, lng).toFixed(1);
           console.log(r);
              if (calcCrow(s.lat, s.lng, lat, lng).toFixed(1) <= 10){
                return true;
              } else {
                return false;
              }
        })

        data = []
        data = await Promise.all(
			data.concat(
				stores.map(async (a) => {
					const storeDetail = {
						lat: "",
						lng: "",
						storeName: "",
						storeOwner: "",
						email: "",
						contact: null,
						city: null,
                        landmark: null,
                        address: null,
                        pincode:null
					};
					if (a.lat && a.lng) {
						const s = await User.findOne({ _id: a.storeId });
						if (s) {
							storeDetail.storeName = s.storeName;
                            storeDetail.storeOwner = s.storeOwner;
							storeDetail.email = s.email;
							storeDetail.contact = s.contact;
                            storeDetail.address = s.address;
                            storeDetail.city = s.city;
                            storeDetail.landmark = s.landmark;
                            storeDetail.lng = a.lng;
                            storeDetail.lat = a.lat;
                            storeDetail.pincode = s.pincode;

							return storeDetail;
						}
					}
				})
			)
		);
		console.log(data);
		data = data.filter((a) => {
			return a !== undefined;
		});

        res.status(200).send(data);
       
    }
    catch(error){
        console.log(error)
    }
}