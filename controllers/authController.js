const USERS = require('../Models/userModels')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');



const doSignUp =async (req, res) => {

    const users = await USERS.findOne({email:req.body.email})

    if(users){
        res.status(200).json({ message: "Email already exist" })
        return
    }

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        console.log(hash)

        USERS({
            fname: req.body.fName,
            lname: req.body.lName,
            email: req.body.email,
            password: hash
        }).save().then((response) => {
            res.status(200).json({ message: "signup successfulll" })
        })

    });


}



const doLogin =async (req, res)=>{
     console.log(req.body, "step 1")

     
     const user = await USERS.findOne({email:req.body.email})
     console.log(user, "step 2")  

     if(user){
       bcrypt.compare(req.body.password,user.password, (err, hashRes)=>{
         console.log(hashRes, "step 3")

         if(hashRes){
             console.log(" cred true step 4 ", process.env.JWT_PASSWORD)

             const token = jwt.sign({userId:user._id, email:user.email, fname:user.fname, lname:user.lname, role:user?.role},process.env.JWT_PASSWORD,{expiresIn:'2d'})
             res.status(200).json({message:'Login successfull', token:token, user})
            }
       })
     }else{
         res.status(200).json({message:"Invalid credential", token:null})
     }
}




module.exports = { doSignUp, doLogin }