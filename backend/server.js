const express = require("express")
const cors = require("cors")
const app = express()
const PORT = 5000
const sqlite3 = require("sqlite3").verbose()
const db = new sqlite3.Database("./todo.db")
const { v4: uuidv4 } = require("uuid")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: "http://localhost:5173" }))

// todos 테이블 생성
db.serialize(() => {
  db.run(
    "CREATE TABLE if not exists todos(id TEXT, title TEXT, completed BOOLEAN)",
  )
})

// 전체 할 일 조회
app.get("/api/todos", (req, res) => {
  // todos 전체 내용
  db.all("SELECT * FROM todos", (err, rows) => {
    // 에러 발생시 에러메세지
    if (err) return res.json({ message: err })
    res.json({ todos: rows, message: "" })
  })
})

// 개별 할 일 조회
app.get("/api/todos/:id", (req, res) => {
  res.json({ message: `To Do ${req.params.id}` })
})

// 새로운 할 일 추가
app.post("/api/todos/create", (req, res) => {
  const { value, completed } = req.body
  const id = uuidv4()
  // id, title, completed 데이터 추가
  db.run(
    "INSERT INTO todos(id, title, completed) VALUES(?,?,?)",
    [id, value, false],
    (err) => {
      // 에러 발생시 에러메세지
      if (err) return res.json({ message: err })
      res.json({
        todos: { id, title: value, completed },
        message: `${value} To Do 추가`,
      })
    },
  )
})

// 개별 할 일 수정
app.put("/api/todos/:id", (req, res) => {
  const { id } = req.params
  const { value } = req.body
  db.run("UPDATE todos SET title = ? WHERE id = ?", [value, id]).all(
    "SELECT * FROM todos",
    (err, rows) => {
      // 에러 발생시 에러메세지
      if (err) return res.json({ message: err })
      res.json({ todos: rows, message: `${value}로 수정 완료` })
    },
  )
})

app.patch("/api/todos/:id", (req, res) => {
  const { id } = req.params
  const { completed } = req.body
  db.run("UPDATE todos SET completed = ? WHERE id = ?", [completed, id]).all(
    "SELECT * FROM todos",
    (err, rows) => {
      // 에러 발생시 에러메세지
      if (err) return res.json({ message: err })
      res.json({ todos: rows, message: `${completed ? "완료" : "진행중"}` })
    },
  )
})

// 개별 할 일 삭제
app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params
  db.run("DELETE FROM todos WHERE id = ?", [id]).all(
    "SELECT * FROM todos",
    (err, rows) => {
      // 에러 발생시 에러메세지
      if (err) return res.json({ message: err })
      res.json({ todos: rows, message: `삭제 성공` })
    },
  )
})

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} 에서 서버 실행중`)
})
