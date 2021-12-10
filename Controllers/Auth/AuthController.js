require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const Donor = require("../../Models/Donor");
const Store = require("../../Models/Store");

const nodemailer = require('../../services/nodemailer')

const SaltRound = 10;

exports.Register = async (req, res) => {
    try {
        
        console.log(req.body)
        const { email, password, type } = req.body;
        if(type === 'Donor'){
            const user = await Donor.findOne({ email })
            // 422 If resource already exists.
            if (!user) {
                const newUser = new Donor({ email, password });
                const salt = await bcrypt.genSalt(SaltRound);
                newUser.password = await bcrypt.hash(password, salt);
                const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
                newUser.verificationCode = token;
                await newUser.save();
                nodemailer.sendVerificationMail(newUser.email, token);
                return res.status(200).json({ message: 'Account Registered! Please verify your email' });
            }
            else{
               res.status(400).send({ message: "Email already exists!" });
            }
        }
        else if(type === 'Store'){
            const user = await Store.findOne({ email })
            // 422 If resource already exists.
            if (!user) {
                const newUser = new Store({ email, password });
                const salt = await bcrypt.genSalt(SaltRound);
                newUser.password = await bcrypt.hash(password, salt);
                const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
                newUser.verificationCode = token;
                await newUser.save();
                nodemailer.sendVerificationMail(newUser.email, token);
                return res.status(200).json({ message: 'Account Registered! Please verify your email' });
            }
            else{
               res.status(400).send({ message: "Email already exists!" });
            }
        }
        
        
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error!' })
    }
}


exports.Login = async (req, res) => {
    let {type} = req.body;

    if(type === 'Donor'){
        let { name, email, password, landmark, address, city, pincode, phone } = req.body;
        email = email.toLowerCase();
        let FoundUser = await Donor.findOne({ email });
        if (FoundUser) {
            if(bcrypt.compareSync(password, FoundUser.password)){
    
                if(FoundUser?.landmark?.length === 0 || FoundUser?.landmark === undefined){
                    FoundUser.name = name
                    FoundUser.contact = phone
                    FoundUser.landmark = landmark
                    FoundUser.address = address
                    FoundUser.city = city
                    FoundUser.pincode = pincode
                    await FoundUser.save()
                    const token = jwt.sign({ id: FoundUser._id, accountType:'DONOR' }, process.env.JWT_SECRET, {
                        expiresIn: 86400,
                      })
                
                      res.status(200).send({Message:"Details Added Successfully",
                        Authorization: token,
                        type:"DONOR"
                      })
                }
                else{
                    const token = jwt.sign({ id: FoundUser._id }, process.env.JWT_SECRET, {
                        expiresIn: 86400,
                      })
                
                      res.status(200).send({Message:"Logged In!",
                        Authorization: token,
                        type:"DONOR"
                      })
                }
            }
                 else {
                    return res
                        .status(400)
                        .send({ message: "Password Did not Match,please try again" });
                }
            
        }  else {
                return res
                    .status(400)
                    .send({ message: "No user with this email was found" });
            }
    }
    else if(type === 'Store'){
        let {  email, password, landmark, address, city, pincode, phone, storeName, storeOwner } = req.body;
        email = email.toLowerCase();
        let FoundUser = await Store.findOne({ email });
        if (FoundUser) {
            if(bcrypt.compareSync(password, FoundUser.password)){
    
                if(FoundUser?.landmark?.length === 0 || FoundUser?.landmark === undefined){
                    FoundUser.contact = phone
                    FoundUser.storeName = storeName
                    FoundUser.storeOwner = storeOwner
                    FoundUser.landmark = landmark
                    FoundUser.address = address
                    FoundUser.city = city
                    FoundUser.pincode = pincode
                    await FoundUser.save()
                    const token = jwt.sign({ id: FoundUser._id, accountType: 'STORE' }, process.env.JWT_SECRET, {
                        expiresIn: 86400,
                      })
                
                      res.status(200).send({Message:"Details Added Successfully",
                        Authorization: token,
                        type: "STORE"
                      })
                }
                else{
                    const token = jwt.sign({ id: FoundUser._id }, process.env.JWT_SECRET, {
                        expiresIn: 86400,
                      })
                
                      res.status(200).send({Message:"Logged In!",
                        Authorization: token,
                        type:"STORE"
                      })
                }
            }
                 else {
                    return res
                        .status(400)
                        .send({ message: "Password Did not Match,please try again" });
                }
            
        }  else {
                return res
                    .status(400)
                    .send({ message: "No user with this email was found" });
            }
    }

}

module.exports.verify = async (req,res) => {
    try {
        
        const donor = await Donor.findOne({
            verificationCode: req.params.token
        });
        if (!donor){
            const store = await Store.findOne({
                verificationCode: req.params.token
            })

            if(store){       
                store.isVerified = true;
                await store.save()
                return res.status(200).send({ message: "Confirmed" });
            }
            else{
                return res.status(404).send({ message: "User doesn't exist!!" });
            }
     
        }
        else{
            donor.isVerified = true;
            await donor.save();
            return res.status(200).send({ message: "Confirmed" });
        }
        
       
    } catch (error) {
        res.status(500).send({ message: "Internal server error " });
    }
}
