const {constants} = require("./constants");
const crypto = require('crypto');

class Square {
	constructor() {

	}

	isValid(body, url, signature, signatureKey) {
		const combined = url + body;
		const hmac = crypto.createHmac('sha1', signatureKey);

		hmac.write(combined);
		hmac.end();

		const checkHash = hmac.read().toString('base64');

		return (checkHash === signature);
	}

	getPaymentInfo(data) {
		let amount = data.object.invoice.payment_requests[0].total_completed_amount_money.amount;
		let currencySymbol = data.object.invoice.payment_requests[0].total_completed_amount_money.currency;
		let streamName = data.object.invoice.custom_fields[0].value;

		return {amount, currencySymbol, streamName};
	}
}


exports.Square = Square;