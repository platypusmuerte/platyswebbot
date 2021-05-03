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

app.get('/:user/:code/:mtype', (req, res)=>{
	twitchjs.triggerMessage(req.params.user, req.params.code, req.params.mtype, req.body);
	res.send("");
});

app.post('/square/donos/:user', (req, res)=>{
	let signature = req.header('x-square-signature');
	let body = JSON.stringify(req.body);

	console.log("processing for: " + process.env.ENDPOINT_HOST + "square/donos/" + req.params.user);

	database.getUser(req.params.user).then((dbres)=>{
		if(dbres) {
			if(squarejs.isValid(body, process.env.ENDPOINT_HOST + "square/donos/" + req.params.user, signature, dbres.urlkey)) {
				console.log(req.body);
			}
		} else {
			res.send("");
		}
	});
});

app.listen(port, ()=>{
	console.log("Listening on " + port);
});









