const {constants} = require("./constants");
const mariadb = require("mariadb");


class Database {
	constructor(params) {
		this.connect();
		this.initialized = false;
	}

	setInitialized(b) {
		this.initialized = b;
	}

	connect() {
		let initialized = this.initialized;

		return new Promise((resolve, reject)=>{
			mariadb.createConnection({
				host: process.env.DB_HOST,
				user: process.env.DB_USER,
				password: process.env.DB_PASSWORD
			}).then(conn => {
				if(!initialized) {
					this.createTable(conn).then(()=>{
						resolve(conn);
					});
				} else {
					resolve(conn);
				}
			}).catch(err =>{
				console.log("sql error: " + err);
			});
		});		
	}

	createTable(conn) {
		return new Promise((resolve, reject)=>{
			conn.query("create table if not exists " + process.env.DB_NAME + "." + process.env.DB_TABLE + "(userid int auto_increment, username varchar(100) not null, primary key(userid));").then(rows => {
				this.setInitialized(true);
				resolve();
			}).catch(err =>{
				console.log("sql error: " + err);
				resolve();
			});
		});		
	}

	getUser(user) {
		return new Promise((resolve, reject)=>{
			this.connect().then((conn)=>{
				conn.query("select username from " + process.env.DB_NAME + "." + process.env.DB_TABLE + " where username='" + user + "';").then(rows => {
					resolve(rows[0]);
				}).catch(err =>{
					console.log("sql error: " + err);
				});
			});
		});		
	}

	addUser(user) {
		return new Promise((resolve, reject)=>{
			this.connect().then((conn)=>{
				conn.query("insert into " + process.env.DB_NAME + "." + process.env.DB_TABLE + " (username) values ('" + user + "');").then(rows => {
					console.log("Added " + user);
					resolve();
				}).catch(err =>{
					console.log("sql error: " + err);
				});
			});
		});	
	}

	removeUser(user) {
		return new Promise((resolve, reject)=>{
			this.connect().then((conn)=>{
				conn.query("delete from " + process.env.DB_NAME + "." + process.env.DB_TABLE + " where username='" + user + "';").then(rows => {
					console.log("Removed " + user);
					resolve();
				}).catch(err =>{
					console.log("sql error: " + err);
				});
			});
		});
	}

	
}

exports.Database = Database;