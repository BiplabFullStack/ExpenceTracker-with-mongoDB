const Order = require('../model/purchase')
const Rozarpay=require('razorpay');
const { generateAccessToken } = require('../service/tokengenerate')
const purchasePremium = async (req, res, next) => {
    try {
      
        const rzp = new Rozarpay({
            key_id: process.env.razorPay_key_id,
            key_secret: process.env.razorPay_key_secret
        });

       
        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }

            // await req.user.createOrder({ orderid: order.id, status: 'PENDING' });
            await Order.create({ orderid: order.id, status: 'PENDING',userId:req.user._id,paymentid:'null'});

            return res.status(201).json({ order, key_id: rzp.key_id });
        });
    } catch (err) {
        console.error(err);
        res.status(403).json({ message: "Something went wrong", error: err.message });
    }
};


const updateTransactionStatus = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const firstName = req.user.firstName;
        const email = req.user.email
        const { payment_id, order_id } = req.body;

        console.log("Is the payment successful?", payment_id);
        console.log("Payment ID and Order ID:", payment_id, order_id);

        // Find the order by its order_id
        const order = await Order.findOne({ orderid: order_id });

        if (!order) {
            // If the order is not found, return a 404 response
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (payment_id === null) {
            // If payment_id is null, it means the payment failed

            // Update the order status to 'FAILED'
            order.paymentid = payment_id;
            order.status = 'FAILED';
            await order.save();

            // Update the user's premium status to 'false'
            req.user.ispremium = false;
            await req.user.save();

            // Return a 202 response indicating the transaction status
            return res.status(202).json({ success: false, message: 'Transaction failed' });
        } else {
            // If payment_id is not null, it means the payment was successful

            // Update the order status to 'SUCCESSFUL'
            order.paymentid = payment_id;
            order.status = 'SUCCESSFUL';
            await order.save();

            // Update the user's premium status to 'true'
            req.user.ispremium = true;
            await req.user.save();

            // Generate a new access token for the user (assuming you have a function for this)
            const token = generateAccessToken(userId, firstName, email);

            // Return a 202 response indicating the transaction status, along with the new access token
            return res.status(202).json({
                success: true,
                message: 'Transaction successful',
                token: token
            });
        }
    } catch (err) {
        // Handle any unexpected errors that occur
        console.log(err);
        return res.status(500).json({ success: false, message: 'Transaction update failed' });
    }
};

module.exports = {purchasePremium, updateTransactionStatus}