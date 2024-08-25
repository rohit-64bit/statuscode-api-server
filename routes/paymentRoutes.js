const express = require('express');
const errorLooger = require('../utils/errorLooger');
const verifyUser = require('../middlewares/verifyUser');
const router = express.Router();
const Agent = require('../models/Agent');
const instance = require('../utils/payments/razorpay');
const Payment = require('../models/Payment');
const crypto = require('node:crypto');


router.get('/health', verifyUser, (req, res) => {

    try {

        res.status(200).json({
            status: "OK",
            key: process.env.RAZORPAY_KEY_ID,
        })

    } catch (error) {

        errorLooger(error, req, res);

    }

});

router.post('/order-create', verifyUser, async (req, res) => {

    try {

        const { agentID } = req.body;

        const validateAgent = await Agent.findById(agentID);

        if (!validateAgent) {
            return res.status(404).json({
                success: false,
                error: 'Agent not found'
            })
        }

        const options = {
            amount: Number(validateAgent.commission) * 100,
            currency: "INR",
            receipt: `receipt_order_${agentID}`,
            payment_capture: 1
        }

        const order = await instance.orders.create(options);

        const paymentData = await Payment({
            paymentToAgentID: agentID,
            paymentByUserID: req.user.profile._id,
            orderID: order.id,
            amount: Number(validateAgent.commission),
            status: 'created'
        })

        res.status(200).json({
            success: true,
            order
        })

    } catch (error) {

        errorLooger(error, req, res);

    }

})

router.post('/order-verify', async (req, res) => {

    try {

        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
        } = req.body;

        const paymentData = await Payment.findOne({ orderID: razorpay_order_id });

        if (!paymentData) {
            return res.status(404).json({
                success: false,
                error: 'Payment not found'
            })
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isSignatureValid = expectedSignature === razorpay_signature;

        const orderData = await instance.orders.fetch(razorpay_order_id);

        if (!isSignatureValid || orderData.isCaptured === false) {

            paymentData.paymentID = razorpay_payment_id;

            paymentData.paymentStatus = orderData.status;

            await paymentData.save();

            return res.status(400).json({ message: "Invalid Payment Signature" })

        }

        paymentData.paymentID = razorpay_payment_id;

        paymentData.status = orderData.status;

        await paymentData.save();

        res.redirect(`http://localhost:5173/payment-confirmation/${razorpay_payment_id}/${paymentData.paymentToAgentID}`);

    } catch (error) {

        errorLooger(error, req, res);

    }

})

module.exports = router;