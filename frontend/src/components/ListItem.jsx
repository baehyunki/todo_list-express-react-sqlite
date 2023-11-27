import { GiCancel } from "react-icons/gi"
import { BiEdit } from "react-icons/bi"
import { AiFillDelete } from "react-icons/ai"
import { toast } from "react-hot-toast"
import PropTypes from "prop-types"

/**
 * @description 특정 할 일 아이템을 나타내는 컴포넌트
 * @param {object} props - 컴포넌트에 전달되는 속성들
 * @param {object} props.todo - 할 일 아이템 객체
 * @param {Array} props.list - 할 일 목록 배열
 * @param {Function} props.setList - 할 일 목록을 업데이트하는 함수
 * @param {object} props.edit - 편집 상태를 나타내는 객체
 * @param {Function} props.setEdit - 편집 상태를 업데이트하는 함수
 * @param {Function} props.setValue - 입력 값(state)을 업데이트하는 함수
 * @param {Function} props.setFocus - 입력 필드에 포커스하는 함수
 * @returns {JSX.Element} 할 일 아이템을 나타내는 JSX 요소
 */
const ListItem = ({
  todo,
  list,
  setList,
  edit,
  setEdit,
  setValue,
  setFocus,
}) => {
  /**
   * @description 체크박스 클릭 이벤트를 처리하는 함수
   * @param {string} id - 할 일 아이템의 ID
   * @param {boolean} completed - 할 일 완료 여부
   */
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
        toast(
          message === "완료" ? "완료로 상태 변경" : "진행중으로 상태 변경",
          { type: "success" },
        )
      })
      .catch((error) => console.log(error))
  }

  /**
   * @description 삭제 버튼 클릭 이벤트를 처리하는 함수
   * @param {string} id - 할 일 아이템의 ID
   */
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

  return (
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
            <GiCancel color={"var(--orange-6)"} />
          </button>
        ) : (
          <button
            onClick={() => {
              setEdit((prevState) => {
                return {
                  id: todo.id,
                  title: todo.title,
                  status: !prevState.status,
                }
              })
              setFocus()
              setValue(todo.title)
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
  )
}

export default ListItem

ListItem.propTypes = {
  todo: PropTypes.object,
  list: PropTypes.array,
  setList: PropTypes.func,
  edit: PropTypes.object,
  setEdit: PropTypes.func,
  setValue: PropTypes.func,
  setFocus: PropTypes.func,
}
