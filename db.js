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

	getQuery(q,vars) {
		let qvars = [{t: "{DBNAME}", v: process.env.DB_NAME}, {t: "{TABLENAME}", v: process.env.DB_TABLE}, ...vars];
		let query = q;

		qvars.forEach((qv)=>{
			query = query.replace(qv.t, qv.v);
		});

		return query;
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
			conn.query(this.getQuery(constants.QUERIES.CREATETABLE,[])).then(rows => {
				this.setInitialized(true);
				resolve();
			}).catch(err =>{
				console.log("sql error: " + err);
				resolve();
			});
		});		
	}

	getUser(user, code) {
		let q = (code) ? this.getQuery(constants.QUERIES.GET_USER_BY_CODE,[{t: "{USER}", v:user},{t: "{URLKEY}", v:code}]):this.getQuery(constants.QUERIES.GET_USER,[{t: "{USER}", v:user}]);

		return new Promise((resolve, reject)=>{
			this.connect().then((conn)=>{
				conn.query(q).then(rows => {
					resolve(rows[0]);
				}).catch(err =>{
					console.log("sql error: " + err);
				});
			});
		});		
	}

	addUser(user, urlkey) {
		return new Promise((resolve, reject)=>{
			this.connect().then((conn)=>{
				conn.query(this.getQuery(constants.QUERIES.ADD_USER,[{t: "{USER}", v:user},{t: "{URLKEY}", v: urlkey}])).then(rows => {
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
				conn.query(this.getQuery(constants.QUERIES.REMOVE_USER,[{t: "{USER}", v:user}])).then(rows => {
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