require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const User = require("../../Models/Users");
const Store = require("../../Models/Store");
const Donor = require("../../Models/Donor");

const {maps} = require("../../services/maps");
const nodemailer = require('../../services/nodemailer');


const SaltRound = 10;

exports.Register = async (req, res) => {
    try {
        
        console.log(req.body)
        const { email, password, type } = req.body;
        
            const user = await User.findOne({ email })
            // 422 If resource already exists.
            if (!user) {
                const newUser = new User({ email, password, accountType:type });
                const salt = await bcrypt.genSalt(SaltRound);
                newUser.password = await bcrypt.hash(password, salt);
                const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
                newUser.verificationCode = token;
                await newUser.save();
                nodemailer.sendVerificationMail(newUser.email, token);
                return res.status(200).json({success:true, message: 'Account Registered! Please verify your email' });
            }
            else{
               res.status(400).send({ success:false, message: "Email already exists!" });
            }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success:false, message: 'Internal server error!' })
    }
}


exports.Login = async (req, res) => {
   
        let { email, password} = req.body;
        email = email.toLowerCase();
        let FoundUser = await User.findOne({ email });
        if (FoundUser) {

            if(!FoundUser.isVerified) return res.status(201).send({ message: 'Please verify your email first then login!' });

            if(bcrypt.compareSync(password, FoundUser.password)){
                const token = jwt.sign({ id: FoundUser._id, accountType: FoundUser.accountType, email:FoundUser.email }, process.env.JWT_SECRET, {
                    expiresIn: 86400,
                  })
    
                if(FoundUser?.landmark?.length === 0 || FoundUser?.landmark === undefined){
                   
                      res.status(200).send({
                        success:true,  
                        Message:"Logged In!",
                        Authorization: token,
                        type:FoundUser.accountType,
                        isFirstLogin:true,
                        data:FoundUser
                      })
                }
                else{
                      res.status(200).send({
                        success:true,  
                        Message:"Logged In!",
                        Authorization: token,
                        type:FoundUser.accountType,
                        isFirstLogin:false,
                        data:FoundUser
                      })
                }
            }
                 else {
                    return res
                        .status(400)
                        .send({ success:false, message: "Password Did not Match,please try again" });
                }
            
        }  else {
                return res
                    .status(400)
                    .send({ success:false, message: "No user with this email was found" });
            }
    
}

exports.addDetails = async (req,res) => {
    let {storeOwner, storeName, name, phone, landmark, city, address, pincode, bloodGroup} = req.body

    const _id = req.user_id;
    
    const user = await User.findOne({_id})

    if(user){
        if(user.accountType === "Store"){
            user.contact = phone
            user.landmark = landmark
            user.storeName = storeName
            user.storeOwner = storeOwner
            user.city = city
            user.address = address
            user.pincode = pincode

            const data = await maps(address, landmark, city, pincode);
            

            if(data){
                const {lat,lng} = data?.items[0]?.position
                if(lat && lng){
                    const store = new Store({storeId:_id, lat, lng})
                    await store.save()
                }
                
            }
            await user.save()
            return res.status(200).send({success:true, message:"Details added successfully"})
        }
        else if(user.accountType === "Donor"){
            user.contact = phone
            user.landmark = landmark
            user.donorName = name
            user.city = city
            user.address = address
            user.pincode = pincode

            const data = await maps(address, landmark, city, pincode);
            
            if(data){
                const {lat,lng} = data?.items[0]?.position
                if(lat && lng){
                    const donor = new Donor({donorId:user._id, lat, lng, bloodGroup})
                    await donor.save()
                }
               
            }
            
            await user.save()
            return res.status(200).send({success:true, message:"Details added successfully"})
        }
        else{
            return res.status(404).send({success:false, message:"User type does not exists"})
        }
        
    }
}


module.exports.verify = async (req,res) => {
    try {
        
        const user = await User.findOne({
            verificationCode: req.params.token
        });
        if (!user){
            return res.status(404).send({ message: "User doesn't exist!!" });     
        }
        else{
            user.isVerified = true;
            await user.save();
            return res.status(200).send({ message: "Confirmed" });
        }
        
       
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Internal server error " });
    }
}
