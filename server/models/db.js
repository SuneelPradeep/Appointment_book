const sql = require('sqlite3').verbose()
const { error, log } = require('console')
const path = require('path')

const dbLoc = path.resolve(__dirname,'../db/wound.db')
const db = new sql.Database(dbLoc,(err)=>{
    err ?
        error('DB connection failed')
     : log('Connected to DB')

})

module.exports = db;
