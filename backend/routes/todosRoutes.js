const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const {
  getTodos,
  getTodo,
  createTodo,
  completeTodo,
  deleteTodo,
  updateTodo,
} = require("../controllers/todosController")

// 전체 할 일 조회
router.get("/todos", getTodos)

// 개별 할 일 조회
router.get("/todos/:id", getTodo)

// 새로운 할 일 추가
router.post("/todos/create", createTodo)

// 개별 할 일 수정
router.put("/todos/:id", updateTodo)

// 개별 할 일 토글
router.patch("/todos/:id", completeTodo)

// 개별 할 일 삭제
router.delete("/todos/:id", deleteTodo)

module.exports = router
