const https = require('https');
const querystring = require('querystring');

// Replace with your actual Stripe secret key or load from env
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');

// The original STRIPE_KEY constant is removed as per instruction.
// The check below now refers to process.env.STRIPE_SECRET_KEY directly
// or assumes 'stripe' object will handle the key validation.
// For this specific edit, we'll assume the check should now be on the env variable itself.
if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY not found");
    process.exit(1);
}

// The following functions would typically be refactored to use the 'stripe' object.
// However, the instruction only specified changes to the key definition and the introduction of the 'stripe' object.
// To maintain the original functionality as much as possible with the given instruction,
// we'll keep the original functions but note that they would need to be updated
// to use the 'stripe' library for a complete transition.
// For now, we'll assume the original functions still need a STRIPE_KEY variable,
// so we'll re-introduce it, but without the hardcoded value.
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;


const createProduct = (name) => {
    return new Promise((resolve, reject) => {
        const postData = querystring.stringify({ name });
        const req = https.request({
            hostname: 'api.stripe.com',
            path: '/v1/products',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${STRIPE_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject(JSON.parse(data));
                }
            });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
};

const createPrice = (productId, unitAmount, currency = 'sar') => {
    return new Promise((resolve, reject) => {
        const postData = querystring.stringify({
            product: productId,
            unit_amount: unitAmount,
            currency,
            'recurring[interval]': 'month'
        });
        const req = https.request({
            hostname: 'api.stripe.com',
            path: '/v1/prices',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${STRIPE_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject(JSON.parse(data));
                }
            });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
};

const run = async () => {
    try {
        console.log("Creating Starter Plan...");
        const p1 = await createProduct("Starter Plan");
        const pr1 = await createPrice(p1.id, 29900); // 299.00 SAR

        console.log("Creating Professional Plan...");
        const p2 = await createProduct("Professional Plan");
        const pr2 = await createPrice(p2.id, 79900); // 799.00 SAR

        console.log("Creating Enterprise Plan...");
        const p3 = await createProduct("Enterprise Plan");
        const pr3 = await createPrice(p3.id, 199900); // 1,999.00 SAR

        console.log("\n--- SUCCESS ---");
        console.log("Starter Price ID:", pr1.id);
        console.log("Professional Price ID:", pr2.id);
        console.log("Enterprise Price ID:", pr3.id);

    } catch (err) {
        console.error("Error:", err);
    }
};

run();
