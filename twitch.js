const {constants} = require("./constants");
const tmi = require("tmi.js");


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

		this.client.on("message", async (channel, context, message) => {
			this.processMessage({
				channel,
				user: context.username,
				message
			});
		});

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
				this.database.addUser(user);
				this.say(channel, "I am now aware of " + user + ". SeemsGood");
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

	triggerMessage(user,msgType, data) {
		this.database.getUser(user).then((dbres)=>{
			if(dbres) {
				switch(msgType) {
					case constants.MESSAGETYPES.SQUARE:
						this.squareMessage(user, data);
					break;
				}
			}			
		});
	}

	squareMessage(user, data) {
		console.log(user, data);
		//this.say("#" + user, "Testing msg type 1");
	}

	say(channel, msg) {
		this.client.say(channel, msg);
	}
}

exports.TwitchJS = TwitchJS;