const express = require('express')
const app = express()
const PORT = 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 전체 할 일 조회
app.get('/api/todos', (req, res) => {
    res.json({message:"전체 To Do List"})
})

// 개별 할 일 조회
app.get('/api/todos/:id', (req, res) => {
    res.json({message:`To Do ${req.params.id}`})
})

// 새로운 할 일 추가
app.post('/api/todos/create', (req, res) => {
    res.json({message:"To Do 생성"})
})

// 개별 할 일 수정
app.put('/api/todos/:id', (req, res) => {
    res.json({message:`${req.params.id} To Do 수정`})
})

// 개별 할 일 삭제
app.delete('/api/todos/:id', (req, res) => {
    res.json({message:`${req.params.id} To Do 삭제`})
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT} 에서 서버 실행중`)
})

