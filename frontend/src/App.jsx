import { useEffect, useRef, useState } from "react"
import "./App.css"
import { toast, Toaster } from "react-hot-toast"
import "./App.css"
import { AiFillDelete, AiFillEdit } from "react-icons/ai"
import { BiEdit, BiPlus } from "react-icons/bi"
import { CgAdd } from "react-icons/cg"
import { MdAddTask, MdOutlineAddTask } from "react-icons/md"
const App = () => {
  const [list, setList] = useState([])
  const [value, setValue] = useState("")
  const [edit, setEdit] = useState({ id: "", status: false })
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)

  const submitHandler = (e) => {
    // form 기본 동작 실행 방지
    e.preventDefault()

    // value 값이 비어있을 경우
    if (value === undefined || value.trim().length === 0) {
      ref.current.focus()
      return toast("내용을 입력해주세요", { type: "error" })
    }

    // 서버에 내용 추가 요청
    fetch("http://localhost:5000/api/todos/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value,
        completed: false,
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        setList((prevState) => [...prevState, result.todos])
        toast(`${value} 추가 성공`, { type: "success" })
      })
      .catch((error) => console.log(error))

    e.key === "Enter" && setValue("")
    setValue("")
    ref.current.focus()
  }

  const changeHandler = (e) => {
    setValue(e.target.value)
  }
  const updateHandler = (id) => {
    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, value }),
    })
      .then((res) => res.json())
      .then((result) => {
        const { todos, message } = result
        setList(todos)
        setEdit((prevState) => {
          return { ...prevState, status: false }
        })
        setValue("")
        ref.current.focus()
        toast(message, { type: "success" })
      })
  }

  const checkHandler = (id, completed) => {
    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        completed: !completed,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const { todos, message } = result
        setList(todos)
        toast(message, { type: "success" })
      })
      .catch((error) => console.log(error))
  }

  const deleteHandler = (id) => {
    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((result) => {
        const { todos, message } = result
        const getItem = list.find((todo) => todo.id === id)
        const filteredList = todos.filter((todo) => todo.id !== id)
        setList(filteredList)
        toast(getItem.title + message, { type: "success" })
      })
      .catch((error) => console.log(error))
  }
  const editHandler = (id, title) => {
    setEdit((prevState) => {
      return { ...prevState, id, status: true }
    })
    setValue(title)
    ref.current.focus()
  }

  useEffect(() => {
    // 5000번 포트 API 서버로부터 데이터 수신
    fetch("http://localhost:5000/api/todos")
      .then((data) => data.json() /* 수신된 데이터를 json 형식으로 */)
      .then((result) => setList(result.todos) /* 수신 데이터를 list 배열로 */)
      .catch((error) => console.log(error) /* 에러 발생시 에러 출력 */)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className={"container"}>
      <form className={"form-group"} onSubmit={submitHandler}>
        <label htmlFor="add-todo">
          {edit.status ? <BiEdit /> : <BiPlus />}
        </label>
        <input
          ref={ref}
          id="add-todo"
          type="text"
          onChange={changeHandler}
          value={value}
        />
        {edit.status ? (
          <button type="button" onClick={() => updateHandler(edit.id)}>
            수정
          </button>
        ) : (
          <button type="submit">추가</button>
        )}
      </form>
      {list.length === 0 && "할 일이 없습니다"}
      <ul>
        {list &&
          list.map((todo) => (
            <li key={todo.id}>
              <input
                id={todo.id}
                type="checkbox"
                checked={todo.completed}
                onChange={() => checkHandler(todo.id, todo.completed)}
              />
              <label htmlFor={todo.id}>{todo.title}</label>
              <div className="button-group">
                {edit.id === todo.id && edit.status ? (
                  <button
                    onClick={() => {
                      setEdit((prevState) => {
                        return { ...prevState, status: false }
                      })
                      setValue("")
                    }}
                  >
                    취소
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      editHandler(todo.id, todo.title)
                    }}
                  >
                    <BiEdit color={"var(--teal-6)"} />
                  </button>
                )}

                <button onClick={() => deleteHandler(todo.id)}>
                  <AiFillDelete color={"var(--pink-6)"} />
                </button>
              </div>
            </li>
          ))}
      </ul>
      <Toaster position={"top-right"} />
    </div>
  )
}

export default App
