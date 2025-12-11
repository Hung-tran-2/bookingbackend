const crypto = require('crypto');
const moment = require('moment');
const querystring = require('querystring');

/**
 * Sort object by keys
 */
function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();

    keys.forEach(key => {
        sorted[key] = obj[key];
    });

    return sorted;
}

/**
 * Create VNPay payment URL (followed spec to avoid format errors)
 */
const createVNPayUrl = ({ amount, orderId, orderInfo, returnUrl, ipAddr = '127.0.0.1' }) => {
    const tmnCode = process.env.VNP_TMN_CODE;
    const hashSecret = process.env.VNP_HASH_SECRET;
    const baseUrl = process.env.VNP_BASE_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

    // Defensive checks so VNPay never receives malformed data
    if (!tmnCode || !hashSecret) {
        throw new Error('Missing VNPay credentials (VNP_TMN_CODE/VNP_HASH_SECRET)');
    }
    if (!returnUrl) {
        throw new Error('Missing returnUrl for VNPay');
    }

    const normalizedAmount = Math.round(Number(amount));
    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
        throw new Error('Invalid amount for VNPay');
    }

    // Fix IP Address for localhost
    if (ipAddr === '::1') {
        ipAddr = '127.0.0.1';
    }

    // Sanitize Order Info (remove special chars AND spaces to be safe)
    // VNPay often rejects special characters in OrderInfo
    const cleanOrderInfo = orderInfo.replace(/[^a-zA-Z0-9]/g, '');

    let vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId.toString(),
        vnp_OrderInfo: cleanOrderInfo,
        vnp_OrderType: 'other',
        vnp_Amount: normalizedAmount * 100, // VNPay requires amount in xu
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: moment().format('YYYYMMDDHHmmss')
    };

    // SORT params alphabetically (required by VNPay)
    vnp_Params = sortObject(vnp_Params);

    // Build signData string - use querystring to ensure standard encoding
    const signData = querystring.stringify(vnp_Params, '&', '=');

    console.log('VNPay Sign Data:', signData);

    // Create HMAC SHA512 signature
    const hmac = crypto.createHmac('sha512', hashSecret);
    const vnp_SecureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    console.log('VNPay Signature:', vnp_SecureHash);

    // Build final payment URL
    const paymentUrl = `${baseUrl}?${signData}&vnp_SecureHash=${vnp_SecureHash}`;

    console.log('VNPay Payment URL:', paymentUrl);

    return paymentUrl;
};

/**
 * Verify VNPay signature (CHUẨN)
 */
const verifyVNPaySignature = (vnpParams) => {
    const secureHash = vnpParams['vnp_SecureHash'];

    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    // Sort params alphabetically
    vnpParams = sortObject(vnpParams);

    // Build signData - MUST encode values to match signature creation
    const signData = querystring.stringify(vnpParams, '&', '=');

    // Create signature to compare
    const hmac = crypto.createHmac('sha512', process.env.VNP_HASH_SECRET);
    const checkSum = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    console.log('Verify - Expected:', secureHash);
    console.log('Verify - Calculated:', checkSum);

    return secureHash === checkSum;
};

module.exports = {
    createVNPayUrl,
    verifyVNPaySignature
};
