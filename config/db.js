const mongoose = require('mongoose')

const connectDb = async () => {
    try { 
        // BJtsngYbfdbwC9gR  new pass atlas
        // mongodb+srv://ashifktashifkt4697:LsI6Gf8bUw4BXKL0@cluster0.mcvsobd.mongodb.net/?retryWrites=true&w=majority
        
        const connection = await mongoose.connect('mongodb+srv://ashifktashifkt4697:NA9ABSsVSONdfLxH@cluster0.v6xkndu.mongodb.net/', {
            useNewUrlParser: 'true'
        })
        console.log("Mongodb database Connected!");

    }
    catch (err) {
        console.log(err);
    }
}


module.exports=connectDb;