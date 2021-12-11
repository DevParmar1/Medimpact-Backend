const Donor = require("../../Models/Donor")
const User = require("../../Models/Users");

exports.nearestDonor = async (req,res) => {
    try{
        const {lat,lng,bloodGroup} = req.body;
        var donors = await Donor.find({bloodGroup})
        console.log(donors)
    
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
        
        donors = donors.filter((s)=>{
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
				donors.map(async (a) => {
					const donorDetail = {
						lat: "",
						lng: "",
						donorName: "",
						email: "",
						contact: null,
						city: null,
                        landmark: null,
                        address: null,
                        pincode:null
					};
					if (a.lat && a.lng) {
						const s = await User.findOne({ _id: a.donorId });
						if (s) {
                            console.log("Owner", s)
							donorDetail.donorName = s.donorName
							donorDetail.email = s.email;
							donorDetail.contact = s.contact;
                            donorDetail.address = s.address;
                            donorDetail.city = s.city;
                            donorDetail.landmark = s.landmark;
                            donorDetail.lng = a.lng;
                            donorDetail.lat = a.lat;
                            donorDetail.pincode = s.pincode;

							return donorDetail;
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