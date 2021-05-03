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
}


exports.Square = Square;