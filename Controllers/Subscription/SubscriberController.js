const { forEach } = require("lodash");
const Donor = require("../../Models/Donor");
const Store = require("../../Models/Store");
const Subscription = require("../../Models/Subscriptions");
const {sendDonorsNotifyMail, sendSubscriptionMail, sendMedicineNotifyMail} = require("../../services/nodemailer");

exports.Subscribe = async (req,res) => {
    try{
		const {email, name, medicine, bloodGroup, lat, lng} = req.body;
		await sendSubscriptionMail(email, name)

		const newSubscription = new Subscription({email, name, lat, lng})
        
        if(bloodGroup){
            newSubscription.bloodGroup = bloodGroup
            newSubscription.need = "Blood"
        }
        if(medicine){
            newSubscription.medicines = medicine
            newSubscription.need = "Medicine"
        }
        await newSubscription.save()
		res.status(200).send("Subscribed successfully")
	}
	catch(error){
        console.log(error)
		res.status(400).send({status:false, messsage:"Error Occured"})
	}

}

exports.donorUpdate = async () => {
    try{
        const subscriptions = await Subscription.find({need:"Blood"});
        console.log(subscriptions)
        if(subscriptions){
            for(let i = 0;i<subscriptions.length;i++){
                let donors = await Donor.find({bloodGroup:subscriptions[i].bloodGroup})
    
                if(donors){
                    function calcCrow(lat1, lon1, lat2, lon2) 
                    {
                    var R = 6371; 
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
    
                    donors = donors.filter((d)=>{
                        var r  = calcCrow(subscriptions[i].lat, subscriptions[i].lng, d.lat, d.lng).toFixed(1);
                        console.log(r);
                           if (calcCrow(subscriptions[i].lat, subscriptions[i].lng, d.lat, d.lng).toFixed(1) <= 10){
                             return true;
                           } else {
                             return false;
                           }
                    })
    
                    if(donors.length>0){
                        console.log(subscriptions[i].email)
                        await sendDonorsNotifyMail(subscriptions[i].email, subscriptions[i].name, subscriptions[i].bloodGroup)
                    }
                }
            }
        }
       

        
    }
    catch(error){
        console.log(error)
    }
}

exports.medicineUpdate = async () => {
    try{
        const subscriptions = await Subscription.find({need:"Medicine"})
        console.log(subscriptions)
        if(subscriptions){
            for(let i = 0;i<subscriptions.length;i++){
                let stores = await Store.find({'medicines': {
                    $elemMatch: {
                        $regex : `.*${subscriptions[i].medicines}.*`,  $options : 'i'
                    }
                }})
    
                if(stores){
                    function calcCrow(lat1, lon1, lat2, lon2) 
                    {
                    var R = 6371; 
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
    
                    stores = stores.filter((d)=>{
                        var r  = calcCrow(subscriptions[i].lat, subscriptions[i].lng, d.lat, d.lng).toFixed(1);
                        console.log(r);
                           if (calcCrow(subscriptions[i].lat, subscriptions[i].lng, d.lat, d.lng).toFixed(1) <= 10){
                             return true;
                           } else {
                             return false;
                           }
                    })
    
                    if(stores.length>0){
                        console.log(subscriptions[i].email)
                        await sendMedicineNotifyMail(subscriptions[i].email, subscriptions[i].name, subscriptions[i].medicines)
                    }
                }
            }
        }
        

        
    }
    catch(error){
        console.log(error)
    }
}