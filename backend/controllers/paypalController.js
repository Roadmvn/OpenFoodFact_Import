// controllers/paypalController.js
const { client } = require('../paypalClient');
const paypal = require('@paypal/checkout-server-sdk');
const { Order } = require('../models');

const createOrder = async (req, res) => {
    const localOrderId = req.body.localOrderId; // 从前端传入的本地订单 ID

    // 检查 localOrderId 是否存在
    if (!localOrderId) {
        return res.status(400).json({ error: 'localOrderId est requis pour créer une commande avec PayPal' });
    }

    try {
        // 查询本地订单信息
        const order = await Order.findOne({ where: { id: localOrderId } });

        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }

        const totalAmount = parseFloat(order.totalAmount); // 计算订单的总金额

        // 调用 PayPal API 创建支付订单
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'EUR',
                        value: totalAmount.toFixed(2), // 格式化金额为小数点后2位
                    },
                },
            ],
        });

        const response = await client().execute(request);

        // 将 PayPal 订单 ID 保存到数据库中
        order.paypalTransactionId = response.result.id; // 保存 PayPal 返回的订单 ID
        await order.save(); // 保存订单更新

        res.status(200).json({
            paypalTransactionId: response.result.id, // 返回给前端的 PayPal 订单 ID
            status: response.result.status, // 返回 PayPal 的订单状态
        });
    } catch (err) {
        console.error('Impossible de créer la commande:', err);
        res.status(500).json({ error: 'Impossible de créer la commande' });
    }
};

const captureOrder = async (req, res) => {
    const paypalOrderId = req.params.paypalOrderId;// 从请求 URL 中获取 PayPal 的订单 ID

    console.log('PayPal Order ID:', req.params.paypalOrderId);


    // 检查 PayPal Order ID 是否存在
    if (!paypalOrderId) {
        return res.status(400).json({ error: 'paypalOrderId est requis pour capturer une commande' });
    }

    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    request.requestBody({});

    try {
        // 调用 PayPal 客户端捕获订单支付
        const response = await client().execute(request);

        // 确保支付捕获成功
        if (response.result && response.result.status === 'COMPLETED') {
            // 查询数据库中关联的订单
            const order = await Order.findOne({ where: { paypalTransactionId: paypalOrderId } });

            if (!order) {
                return res.status(404).json({
                    error: 'La commande associée à cet ID PayPal n\'existe pas',
                });
            }

            // 更新订单支付状态
            order.status = 'completed';
            order.paypalPayment = true; // 标记为 PayPal 支付
            await order.save(); // 保存更新

            res.status(200).json({
                status: 'success',
                message: 'Le paiement de la commande a été capturé avec succès',
                captureId: response.result.id, // 返回 PayPal 捕获 ID
            });
        } else {
            return res.status(400).json({
                error: 'Le paiement de la commande n\'a pas pu être saisi avec succès',
            });
        }
    } catch (err) {
        console.error('Erreur lors de la capture de la commande:', err);
        res.status(500).json({
            error: 'La capture du paiement de la commande a échoué',
        });
    }
};

module.exports = { createOrder, captureOrder };