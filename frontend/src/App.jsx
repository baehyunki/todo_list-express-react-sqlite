import { useEffect, useRef, useState } from "react"
import { toast, Toaster } from "react-hot-toast"
import "./App.css"
import Form from "./components/Form.jsx"
import ListItem from "./components/ListItem.jsx"
import { GrGithub } from "react-icons/gr"
import Footer from "./components/Footer.jsx"
const App = () => {
  const [list, setList] = useState([]) // 빈 배열로 초기화된 list 상태를 생성
  const [value, setValue] = useState("") // 빈 문자열로 초기화된 value 상태를 생성
  const [edit, setEdit] = useState({ id: "", status: false }) // 빈 id와 false 상태를 가지는 객체로 초기화된 edit 상태를 생성
  const [loading, setLoading] = useState(true) // true로 초기화된 loading 상태를 생성
  const [error, setError] = useState({ message: "", status: false }) // false로 초기화된 error 상태를 생성
  const ref = useRef(null) // 요소에 대한 참조를 저장하기 위해 ref를 생성

  /**
   * @description `ref`로 참조된 요소에 포커스를 설정합니다.
   */
  const setFocus = () => {
    // `ref`로 참조된 요소에 포커스를 설정합니다.
    ref.current.focus()
  }

  // 컴포넌트가 마운트될 때 API 서버에서 데이터를 가져옵니다.
  useEffect(() => {
    fetch("http://localhost:5000/api/todos") // API 서버에서 데이터를 가져옵니다.
      .then((data) => data.json()) // 받은 데이터를 JSON으로 변환합니다.
      .then((result) => setList(result.todos)) // 받은 todos로 list 상태를 업데이트합니다.
      .catch((error) => setError({ message: error.message, status: true })) // fetch 작업 중 발생한 오류를 로그에 기록합니다.
      .finally(() => setLoading(false)) // fetch 작업이 완료되면 loading 상태를 false로 설정합니다.
  }, [])

  if (error.status) return <div>404</div>

  // 데이터를 가져오는 동안 로딩 메시지를 표시합니다.
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className={"container"}>
        {/* Form 컴포넌트를 렌더링합니다. */}
        <Form
          ref={ref}
          setFocus={setFocus}
          edit={edit}
          setEdit={setEdit}
          value={value}
          setValue={setValue}
          setList={setList}
        />

        {/* list가 비어있을 때 메시지를 표시합니다. */}
        {list.length === 0 && (
          <div
            style={{
              padding: "var(--size-fluid-1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                width: "fit-content",
                textAlign: "center",
                fontSize: "var(--font-size-fluid-1)",
                lineHeight: "var(--line-height-fluid-1)",
                fontWeight: "var(--font-weight-6)",
                color: "var(--teal-5)",
              }}
            >
              새로운 할 일을 추가해주세요
            </h2>
            <img src="nodata.png" alt="empty" />
          </div>
        )}

        <ul>
          {/* list의 각 항목을 렌더링합니다. */}
          {list &&
            list.map((todo) => (
              <ListItem
                key={todo.id}
                todo={todo}
                edit={edit}
                setEdit={setEdit}
                list={list}
                setList={setList}
                setValue={setValue}
                setFocus={setFocus}
              />
            ))}
        </ul>
        {/* Toaster 컴포넌트를 렌더링합니다. */}
        <Toaster position={"bottom-right"} />
      </div>
      <Footer />
    </>
  )
}

export default App
