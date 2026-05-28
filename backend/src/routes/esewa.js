import express from 'express';
import crypto from 'crypto';

const router = express.Router();

router.post('/initiate', (req, res) => {
    const { amount, orderId } = req.body;

    const totalAmount = Number(amount).toFixed(2);

    const transactionUuid = orderId || `YARSA-${Date.now()}`;

    const productCode = 'EPAYTEST';

    const secretKey = '8gBm/:&EnhH.1/q';

    const signedFieldNames = 'total_amount,transaction_uuid,product_code';

    const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;

    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(message)
        .digest('base64');

    res.json({
        amount: totalAmount,
        tax_amount: '0',
        total_amount: totalAmount,
        transaction_uuid: transactionUuid,
        product_code: productCode,
        product_service_charge: '0',
        product_delivery_charge: '0',

        // ✅ FIXED URLS
        success_url: 'https://yarsa.vercel.app/payment-success',

        failure_url: 'https://yarsa.vercel.app/payment-failed',

        signed_field_names: signedFieldNames,
        signature,
    });
});

export default router;
