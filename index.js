require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const { constants } = require('./constants');
const {Database} = require("./db");
let database = new Database();

const {TwitchJS} = require("./twitch");
let twitchjs = new TwitchJS({database: database});

twitchjs.init();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/:user/:mtype', (req, res)=>{
	twitchjs.triggerMessage(req.params.user, req.params.mtype, req.body);
	res.send("");
});

app.listen(port, ()=>{
	console.log("Listening on " + port);
});









