const COURTS = require('../Models/courtSchema');
const COURT_SCHEDULES = require('../Models/courtSchedules');
const USER = require('../Models/userModels');
const ObjectId = require('mongoose').Types.ObjectId


const getAllCourtsData = (req, res) => {

    COURTS.find().then((response) => {
        res.status(200).json({ response })
    })
        .catch((err) => {
            res.status(500).json(err)
        })
}

const getSingleCourtData = async (req, res) => {
    try {
        const result = await COURTS.findOne({ _id: req.query.courtid })
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
    }


}

const dayWiseTimeSlot = (req, res) => {
    // console.log(req.query.courtId, req.query.date);
    let currentHour = new Date(req.query.date).getHours()
    let currentDate = new Date(new Date(req.query.date).setUTCHours(0, 0, 0, 0))
    // console.log(currentDate);


    COURT_SCHEDULES.aggregate([{
        $match: {
            courtId: new ObjectId(req.query.courtId),
            date: currentDate,
            'slot.id': { $gt: currentHour + 1 }
        },
    },
    { $lookup: {
        from:'courts',
        localField:'courtId',
        foreignField:'_id',
        as:'court'
    } },
    {$project:{
        court: { $arrayElemAt: ["$court", 0] },
        _id:1,
        date:1,
        slot:1,
        cost:1,
        bookedBy:1
    }},
    ]).then((response) => {
        // console.log(response);
        res.status(200).json(response)
    })
        .catch((err) => {
            console.log(err);
        })

}


const getMyBookingData=(req,res)=>{
  const currentDate= new Date()// date
  const slotHour = currentDate.getHours()// slotid/hour
   currentDate.setUTCHours(0,0,0,0)

   COURT_SCHEDULES.aggregate([
       {$match:{

        bookedBy:new ObjectId(req.userId),
        $expr:{
            $or:[
                {$gt:["$date",currentDate]},
                {
                    $and:[
                        {$eq:["$date",currentDate]},
                        {$gte:["$slot.id",slotHour]}
                    ],
                },
            ],
        },
       }},
      
       {$lookup:{
           from:'courts',
           localField:'courtId',
           foreignField:'_id',
           as:'courts'
       }},
       {$project:{
           _id:1,
           date:1,
           slot:1,
           courtData:{$arrayElemAt:['$courts',0]}
       }}
   ]).then((response)=>{
       console.log(response);
       res.status(200).json(response)
   })

}


const updateUser =async(req,res)=>{
    console.log(req.file.filename, req.query, "hahahahahah")

    try {
     
       await USER.updateOne({_id:req.query.userId}, {$set:{userpic: req.file.filename}}).then((response)=>{
            res.status(200).json({ message: "user image updated" })
        })

        
    } catch (error) {
        res.status(500).json({ message: "user image updating filed" })
       console.log(error)
    }
}

const userData =async(req,res)=>{
    try {
       await USER.findOne({_id:req.query.userId}).then((response)=>{
             res.status(200).json({response})
        })
    } catch (error) {
        res.status(400).json({message:"user data not fount"})
    }
  
}


module.exports = { getAllCourtsData, getSingleCourtData, dayWiseTimeSlot,getMyBookingData, updateUser, userData }