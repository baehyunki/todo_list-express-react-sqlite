const sqlite3 = require("sqlite3").verbose()
const db = new sqlite3.Database("./todo.db")
// todos 테이블 생성
db.serialize(() => {
  db.run(
    "CREATE TABLE if not exists todos(id TEXT, title TEXT, completed BOOLEAN)",
  )
})
module.exports = db
