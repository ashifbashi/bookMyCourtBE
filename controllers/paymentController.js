const COURT_SCHEDULES = require('../Models/courtSchedules')
const Razorpay = require('razorpay')
const crypto = require('crypto')
const nodemailer = require("nodemailer");

const orders = async (req, res) => {

    console.log("inside of the payment control", req.body.slotId);
    const slotData = await COURT_SCHEDULES.findOne({ _id: req.body.slotId })

    if (slotData?.bookedBy) {
        res.status(400).json({ message: "Slot already booked" })
    } else {

        try {
            const instance = new Razorpay({
                key_id: 'rzp_test_cx9B8rETmWVZI6',
                key_secret: '1UlFRxTsFlnEMxSkyrEaJZKH',
            });

            const options = {
                amount: slotData.cost*100, // amount in smallest currency unit
                currency: "INR",
                receipt: slotData._id,
            };

            const order = await instance.orders.create(options);

            if (!order) return res.status(500).send("Some error occured");

            res.json(order);
        } catch (error) {
            res.status(500).send(error);
        }

    }

}


const paymentSuccess=async(req,res)=>{

    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            slotId,
        } = req.body;

        // Creating our own digest
        // The format should be like this:
        // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
        const shasum = crypto.createHmac("sha256", "1UlFRxTsFlnEMxSkyrEaJZKH");

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        // THE PAYMENT IS LEGIT & VERIFIED 
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

        await COURT_SCHEDULES.updateOne({_id:slotId}, {$set:{bookedBy:req.userId}, $push:{paymentOrders:{userId:req.userId,razorpayPaymentId,timeStamp:new Date()}} })
        initiateEmail(slotId,razorpayPaymentId)

        res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

}

const initiateEmail=async(id,razorpayPaymentId,)=>{

    const slotData= await COURT_SCHEDULES.findOne({_id:id}).populate('bookedBy').populate("courtId")
    const {date,slot,cost,bookedBy,courtId}=slotData

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: "ashifktashifkt4697@gmail.com",
          pass: "gxjl sdzw wsqp dpzm",   //need to creat app.password
        },
      });


      
      // async..await is not allowed in global scope, must use a wrapper

        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: 'testashifkt@gmail.com', // sender address
          to: bookedBy.email, // list of receivers
          subject: "Booking confirmed", // Subject line
          text: "Thank you for booking with us !", // plain text body
          html: `<b>Hello ${bookedBy.fname+' '+bookedBy.lname}</b>
          <p>Your booking at  ${courtId.name} on ${new Date(date)} has been confirmed with payment id ${razorpayPaymentId}</p>
          `, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        //
        // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
        //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
        //       <https://github.com/forwardemail/preview-email>



}



module.exports = { orders, paymentSuccess }