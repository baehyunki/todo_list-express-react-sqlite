import { useEffect, useRef, useState } from "react"
import "./App.css"
import { Toaster } from "react-hot-toast"
import "./App.css"
import Form from "./components/Form.jsx"
import ListItem from "./components/ListItem.jsx"
const App = () => {
  const [list, setList] = useState([])
  const [value, setValue] = useState("")
  const [edit, setEdit] = useState({ id: "", status: false })
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)

  const setFocus = () => {
    ref.current.focus()
  }

  const editHandler = (id, title) => {
    setEdit((prevState) => {
      return { ...prevState, id, status: !prevState.status }
    })
    setValue(title)
    ref.current.focus()
  }

  const addItemHandler = (todos) =>
    setList((prevState) => [...prevState, todos])

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
      <Form
        ref={ref}
        setFocus={setFocus}
        edit={edit}
        value={value}
        setValue={setValue}
        addItemHandler={addItemHandler}
        editHandler={editHandler}
        setList={setList}
      />

      {list.length === 0 && (
        <div style={{ padding: "var(--size-fluid-1)" }}>할 일이 없습니다</div>
      )}

      <ul>
        {list &&
          list.map((todo) => (
            <ListItem
              edit={edit}
              todo={todo}
              editHandler={editHandler}
              setEdit={setEdit}
              list={list}
              setList={setList}
              key={todo.id}
              setValue={setValue}
            />
          ))}
      </ul>
      <Toaster position={"bottom-right"} />
    </div>
  )
}

export default App
