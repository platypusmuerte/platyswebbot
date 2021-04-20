const {constants} = require("./constants");
const path = require('path');
const fs = require('fs-extra');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');


class Database {
	constructor(params) {
		const adapter = new FileSync('db.json');
		this.db = low(adapter);
	}

	setDefaults() {
		this.db.defaults({v: 1, users: []}).write();
	}

	getUsers() {
		return this.db.get("users").value();
	}

	getUser(user) {
		return this.db.get("users").find({user}).value();
	}

	addUser(user) {
		this.db.get("users").push({user}).write();
	}

	removeUser(user) {
		this.db.get("users").remove({user}).write();
	}

	
}

exports.Database = Database;