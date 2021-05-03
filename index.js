require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT;

const { constants } = require('./constants');
const {Database} = require("./db");
let database = new Database();

const {TwitchJS} = require("./twitch");
let twitchjs = new TwitchJS({database: database});

const {Square} = require("./square");
let squarejs = new Square();

twitchjs.init();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

/* respond to square calls */
app.post('/square/donos/:user', (req, res)=>{
	let signature = req.header('x-square-signature');
	let body = JSON.stringify(req.body);

	console.log("processing for: " + process.env.ENDPOINT_HOST + "square/donos/" + req.params.user);

	database.getUser(req.params.user).then((dbres)=>{
		if(dbres) {
			if(squarejs.isValid(body, process.env.ENDPOINT_HOST + "square/donos/" + req.params.user, signature, dbres.urlkey)) {
				res.send("");
				console.log(squarejs.getPaymentInfo(req.body.data));
			}
		} else {
			res.send("");
		}
	});
});

/* add user via url */
app.get( '/' + process.env.ADMIN_KEY + '/adduser/:user/:squarekey', (req, res)=>{
	console.log("adding new user: " + req.params.user);

	database.getUser(req.params.user).then((dbres)=>{
		if(dbres) {
			res.send("I already know " + req.params.user + ". <3");
		} else {database.addUser(usreq.params.userer,req.params.squarekey);
			res.send("Adding " + req.params.user + " complete.");
		}
	});
});



/* remove user via url */
app.get( '/' + process.env.ADMIN_KEY + '/removeuser/:user/:squarekey', (req, res)=>{
	console.log("adding new user: " + req.params.user);

	database.getUser(req.params.user,req.params.squarekey).then((dbres)=>{
		if(dbres) {
			database.removeUser(req.params.user).then(()=>{
				res.send("Removed " + req.params.user);
			});
		} else {
			res.send("Was not able to remove " + req.params.user);
		}			
	});
});

app.listen(port, ()=>{
	console.log("Listening on " + port);
});









