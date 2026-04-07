import catchAsync from 'express-async-handler';
import SSLCommerzPayment from 'sslcommerz-lts';
import Order from '../models/orderModel.js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = process.env.IS_LIVE === 'true' || false;

// @desc    Initialize SSLCommerz Payment
// @route   GET /api/payment/init/:orderId
// @access  Private
const initPayment = catchAsync(async (req, res) => {
    const order = await Order.findById(req.params.orderId).populate('user', 'name email');

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    const transactionId = uuidv4();

    const data = {
        total_amount: order.totalPrice,
        currency: 'BDT',
        tran_id: transactionId,
        success_url: `${process.env.CLIENT_URL || 'https://miazi-shop.vercel.app'}/api/payment/success?tran_id=${transactionId}&orderId=${order._id}`,
        fail_url: `${process.env.CLIENT_URL || 'https://miazi-shop.vercel.app'}/api/payment/fail`,
        cancel_url: `${process.env.CLIENT_URL || 'https://miazi-shop.vercel.app'}/api/payment/cancel`,
        ipn_url: `${process.env.CLIENT_URL || 'https://miazi-shop.vercel.app'}/api/payment/ipn`,
        shipping_method: 'Courier',
        product_name: 'E-commerce Product',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: order.user.name,
        cus_email: order.user.email,
        cus_add1: order.shippingAddress.address,
        cus_add2: 'Dhaka',
        cus_city: order.shippingAddress.city,
        cus_state: 'Dhaka',
        cus_postcode: order.shippingAddress.postalCode,
        cus_country: order.shippingAddress.country,
        cus_phone: order.shippingAddress.phone,
        cus_fax: order.shippingAddress.phone,
        ship_name: order.user.name,
        ship_add1: order.shippingAddress.address,
        ship_add2: 'Dhaka',
        ship_city: order.shippingAddress.city,
        ship_state: 'Dhaka',
        ship_postcode: order.shippingAddress.postalCode,
        ship_country: order.shippingAddress.country,
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL;
        res.status(200).json({ url: GatewayPageURL });
    });
});

// @desc    Payment success callback
// @route   POST /api/payment/success
// @access  Public
const paymentSuccess = catchAsync(async (req, res) => {
    const { orderId, tran_id } = req.query;

    const order = await Order.findById(orderId);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: tran_id,
            status: 'success',
            update_time: new Date().toISOString(),
            email_address: order.user.email,
        };
        order.orderStatus = 'Processing';

        await order.save();

        // Redirect to frontend success page
        res.redirect(`${process.env.CLIENT_URL || 'https://miazi-shop.vercel.app'}/order/${orderId}?payment=success`);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Payment fail callback
// @route   POST /api/payment/fail
// @access  Public
const paymentFail = catchAsync(async (req, res) => {
    res.redirect(`${process.env.CLIENT_URL || 'https://miazi-shop.vercel.app'}/cart?payment=fail`);
});

// @desc    Payment cancel callback
// @route   POST /api/payment/cancel
// @access  Public
const paymentCancel = catchAsync(async (req, res) => {
    res.redirect(`${process.env.CLIENT_URL || 'https://miazi-shop.vercel.app'}/cart?payment=cancel`);
});

export { initPayment, paymentSuccess, paymentFail, paymentCancel };
