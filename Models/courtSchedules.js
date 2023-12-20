const mongoose=require('mongoose')


const courtScheduleSchema=mongoose.Schema({

    date:{
        type:Date,
        requireed:true,
    },
    slot:{
        type:Object,
        requireed:true,
    },
    cost:{
        type:Number,
        requireed:true,
    },
    bookedBy:{
        type:mongoose.Types.ObjectId,
        ref:'users'
    },
    cancellation:{
        type:Array, //[{userId, peyment}]
    },
    courtId:{
        type:mongoose.Types.ObjectId
    },
    paymentOrders:{
        type:Array
    }

})


const courtSchedules = mongoose.model('courtSchedules', courtScheduleSchema)
module.exports=courtSchedules