const {constants} = require("./constants");
const tmi = require("tmi.js");
const {uid} = require('uid');


class TwitchJS {
	constructor(params) {
		this.client;
		this.database = params.database;
	}

	init() {
		this.client = new tmi.Client({
			connection: {
				reconnect: true
			},
			identity: {
				username: process.env.TWITCH_BOT_USERNAME,
				password: process.env.TWITCH_OAUTH_TOKEN
			},
			channels: [process.env.TWITCH_BOT_USERNAME]
		});

		this.client.connect();

		try {
			this.client.on("message", (channel, context, message) => {
				try {
					this.processMessage({
						channel,
						user: context.username,
						message
					});
				} catch(e) {
					console.log(e);
				}
			});
		} catch(e) {
			console.log(e);
		}
		

		console.log("Listening on Twitch");
	}

	//{ channel: '#platyswebbot', user: 'platyswebbot', message: 'test' }
	processMessage(data) {
		switch(data.message) {
			case constants.COMMANDS.ADD:
				this.addUser(data.channel, data.user);
			break;
			case constants.COMMANDS.REMOVE:
				this.removeUser(data.channel, data.user);
			break;
			case constants.COMMANDS.TEST:
				this.sendTest(data.channel, data.user);
			break;
		}
	}

	addUser(channel, user) {
		this.database.getUser(user).then((dbres)=>{
			if(dbres) {
				this.say(channel, "I already know " + user + ". <3");
			} else {
				let uidStr = uid();

				this.database.addUser(user,uidStr);
				//this.say(channel, "I will whisper your code to you " + user + ". SeemsGood");
				this.whisper(channel, user, "(will be whisper once verified)Your url code is: " + uidStr + " Do not share this code.");
			}
		});		
	}

	removeUser(channel, user) {
		this.database.getUser(user).then((dbres)=>{
			if(dbres) {
				this.database.removeUser(user).then(()=>{
					this.say(channel, "Bye " + user + " :D");
				});
			} else {
				this.say(channel, "I don't know you like that " + user + " FBBlock");
			}			
		});
	}

	sendTest(channel, user) {
		this.database.getUser(user).then((dbres)=>{
			if(dbres) {
				this.say(channel, "I'll say hi now " + user + " R)");
				this.say("#" + user, "Hi there " + user + " B)");
			} else {
				this.say(channel, "I don't know you like that " + user + " FBBlock");
			}			
		});
	}

	triggerMessage(user, code, msgType, data) {
		this.database.getUser(user, code).then((dbres)=>{
			if(dbres) {
				switch(msgType) {
					case constants.MESSAGETYPES.SQUARE:
						this.squareMessage(user, code, data);
					break;
				}
			}			
		});
	}

	squareMessage(user, code, data) {
		//console.log(user, code, data);
		if(data.streamName.length > 0) {
			this.say("#" + user, "@" + data.streamName + " just donated " + data.amount + "  (" + data.currencySymbol + ")!!! Thank you.");
		}		
	}

	say(channel, msg) {
		this.client.say(channel, msg);
	}

	whisper(channel, user,msg) {
		//this.client.whisper(user,msg);
		this.client.say(channel, msg);		
	}
}

exports.TwitchJS = TwitchJS;