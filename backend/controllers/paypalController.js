// controllers/paypalController.js
const { client } = require('../paypalClient');
const paypal = require('@paypal/checkout-server-sdk');
const { Order } = require('../models');


// 创建支付订单
const createOrder = async (req, res) => {
    const orderId = req.body.orderId; // 从前端传入 orderId

    try {
        // 从数据库中获取订单信息
        const order = await Order.findOne({ where: { id: orderId } });

        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }

        const totalAmount = parseFloat(order.totalAmount);

        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'EUR', // 根据需要修改货币代码
                        value: totalAmount.toFixed(2), // 从数据库中获取订单金额
                    },
                },
            ],
        });

        // 调用 PayPal API 创建订单
        const response = await client().execute(request);
        res.status(200).json({
            id: response.result.id, // 返回订单 ID，用于前端支付
            status: response.result.status,
        });
    } catch (err) {
        console.error('Impossible de créer la commande:', err);
        res.status(500).json({ error: 'Impossible de créer la commande' });
    }
};


// 捕获支付订单
const captureOrder = async (req, res) => {
    const orderId = req.params.orderId;

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
        const response = await client().execute(request);
        res.status(200).json({
            status: 'success',
            captureId: response.result.id,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Le paiement de la commande a échoué' });
    }
};

module.exports = { createOrder, captureOrder };