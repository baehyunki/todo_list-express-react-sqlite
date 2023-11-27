const { v4: uuidv4 } = require("uuid")

const db = require("../db")

/**
 * @description todos를 가져오는 함수
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 */
const getTodos = (req, res) => {
  // todos 테이블에서 모든 데이터를 가져옴
  db.all("SELECT * FROM todos", (err, rows) => {
    // 에러가 발생한 경우 에러 메시지를 반환
    if (err) return res.json({ message: err })
    // 가져온 todos 데이터와 빈 메시지를 응답으로 반환
    res.json({ todos: rows, message: "" })
  })
}
/**
 * getTodo 함수는 요청된 ID를 이용하여 할 일 정보를 반환합니다.
 *
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @returns {Object} - 할 일 정보를 포함하는 JSON 응답
 */
const getTodo = (req, res) => {
  // 요청된 ID를 이용하여 할 일 정보를 생성합니다.
  const todo = { message: `할 일 ${req.params.id}` }

  // 할 일 정보를 JSON 형태로 응답합니다.
  res.json(todo)
}

/**
 * 할 일을 생성하는 함수입니다.
 * @param {*} req - 요청 객체
 * @param {*} res - 응답 객체
 */
const createTodo = (req, res) => {
  const { value, completed } = req.body // 요청 바디에서 value와 completed 추출
  const id = uuidv4() // UUID 생성

  // todos 테이블에 새로운 데이터 추가
  db.run(
    "INSERT INTO todos(id, title, completed) VALUES(?,?,?)", // SQL 쿼리문
    [id, value, false], // 쿼리에 전달할 파라미터
    (err) => {
      // 에러 발생시 에러메세지 반환
      if (err) return res.json({ message: err })

      // 응답으로 전송할 데이터와 메세지 반환
      res.json({
        todos: { id, title: value, completed },
        message: `${value} To Do 추가`,
      })
    },
  )
}
/**
 * 할 일을 업데이트하는 함수
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 */
const updateTodo = (req, res) => {
  const { id } = req.params // 요청 파라미터에서 id 추출
  const { value } = req.body // 요청 바디에서 value 추출

  // todos 테이블에서 해당 id의 title을 value로 업데이트
  db.run("UPDATE todos SET title = ? WHERE id = ?", [value, id]).all(
    "SELECT * FROM todos",
    (err, rows) => {
      // 에러 발생시 에러메세지 응답
      if (err) return res.json({ message: err })
      res.json({ todos: rows, message: `${value}로 수정 완료` }) // 수정 완료 메세지와 업데이트된 todos 목록 응답
    },
  )
}

/**
 * 완료된 할일을 업데이트하는 함수입니다.
 *
 * @param {Object} req - 요청 객체
 * @param {Object} req.params - 요청 파라미터 객체
 * @param {string} req.params.id - 할일 아이디
 * @param {Object} req.body - 요청 바디 객체
 * @param {boolean} req.body.completed - 할일 완료 여부
 * @param {Object} res - 응답 객체
 */
const completeTodo = (req, res) => {
  // 요청 파라미터와 요청 바디에서 필요한 정보를 추출합니다.
  const { id } = req.params
  const { completed } = req.body

  // 할일 테이블의 해당 아이디의 완료 여부를 업데이트합니다.
  db.run("UPDATE todos SET completed = ? WHERE id = ?", [completed, id]).all(
    "SELECT * FROM todos",
    (err, rows) => {
      // 에러가 발생하면 에러 메시지를 응답합니다.
      if (err) return res.json({ message: err })

      // 업데이트된 할일 목록과 완료 여부에 따른 메시지를 응답합니다.
      res.json({ todos: rows, message: `${completed ? "완료" : "진행중"}` })
    },
  )
}
/**
 * 할 일 삭제 함수
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 */
const deleteTodo = (req, res) => {
  const { id } = req.params // 요청 파라미터에서 id 추출

  // todos 테이블에서 해당 id의 할 일을 삭제
  db.run("DELETE FROM todos WHERE id = ?", [id]).all(
    "SELECT * FROM todos",
    (err, rows) => {
      // 에러 발생시 에러메세지 응답
      if (err) return res.json({ message: err })

      // 삭제된 할 일 목록과 삭제 성공 메세지 응답
      res.json({ todos: rows, message: `삭제 성공` })
    },
  )
}

module.exports = {
  getTodos,
  getTodo,
  createTodo,
  completeTodo,
  deleteTodo,
  updateTodo,
}
