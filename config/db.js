const mongoose = require('mongoose')

const connectDb = async () => {
    try { 
        // BJtsngYbfdbwC9gR  new pass atlas
        // mongodb+srv://ashifktashifkt4697:LsI6Gf8bUw4BXKL0@cluster0.mcvsobd.mongodb.net/?retryWrites=true&w=majority
        
        const connection = await mongoose.connect('mongodb://127.0.0.1:27017/bookmycourt', {
            useNewUrlParser: 'true'
        })
        console.log("Mongodb database Connected!");

    }
    catch (err) {
        console.log(err);
    }
}


module.exports=connectDb;