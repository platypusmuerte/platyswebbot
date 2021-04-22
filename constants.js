exports.constants = {
	COMMANDS: {
		ADD: "!addme",
		TEST: "!test",
		REMOVE: "!removeme"
	},
	MESSAGETYPES: {
		SQUARE: "square"
	},
	QUERIES: {
		ADD_USER: "insert into {DBNAME}.{TABLENAME} (username, urlkey) values ('{USER}','{URLKEY}');",
		CREATETABLE: "create table if not exists {DBNAME}.{TABLENAME}(userid int auto_increment, username varchar(100) not null, urlkey varchar(100) not null, primary key(userid));",
		GET_USER: "select username, urlkey from {DBNAME}.{TABLENAME} where username='{USER}';",
		GET_USER_BY_CODE: "select username, urlkey from {DBNAME}.{TABLENAME} where username='{USER}' and urlkey='{URLKEY}';",
		REMOVE_USER: "delete from {DBNAME}.{TABLENAME} where username='{USER}';"
	}
};