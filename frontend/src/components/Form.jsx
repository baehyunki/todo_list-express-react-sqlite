import { forwardRef } from "react"
import { BiEdit, BiPlus } from "react-icons/bi"
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
// eslint-disable-next-line react/display-name
const Form = forwardRef(
  ({ setFocus, edit, setEdit, setList, value, setValue }, ref) => {
    /**
     * @description 입력 형식을 위한 핸들러 함수
     * @param {Event} e - 이벤트 객체
     * @param {number} id - todo 아이디
     * @returns {void}
     */
    const submitHandler = (e, id) => {
      e.preventDefault() // 기본 폼 동작 방지

      if (value === undefined || value.trim().length === 0) {
        // 값이 비어있는지 확인
        setFocus()
        return toast("값을 입력해주세요", { type: "error" })
      }

      e.key === "Enter" && setValue("") // 엔터 키를 누르면 값 비우기

      if (edit.status) {
        // 수정 모드인지 확인
        return fetch(`http://localhost:5000/api/todos/${id}`, {
          // todo 업데이트를 위해 PUT 요청
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, value }),
        })
          .then((res) => res.json())
          .then((result) => {
            const { todos, message } = result
            setEdit((prevState) => {
              // 수정 모드 토글
              return { ...prevState, status: !prevState.status }
            })
            setList(todos) // todo 목록 업데이트
            setValue("") // 값 비우기
            toast(message, { type: "success" }) // 성공 토스트 메시지 출력
          })
      } else {
        return fetch("http://localhost:5000/api/todos/create", {
          // todo 생성을 위해 POST 요청
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
            setList((prevState) => [...prevState, result.todos]) // 새로운 todo 목록에 추가
            setValue("") // 값 비우기
            setFocus()
            toast(`${value} 추가 성공`, { type: "success" }) // 성공 토스트 메시지 출력
          })
          .catch((error) => console.log(error))
      }
    }
    /**
     * 입력값에 따라 값을 변경하는 핸들러 함수입니다.
     * @param {Event} e - 이벤트 객체
     */
    const changeHandler = (e) => {
      // 입력값에 따라 값을 변경합니다.
      setValue(e.target.value)
    }

    return (
      <form
        className={"form-group"}
        onSubmit={(e) => submitHandler(e, edit.status ? edit.id : null)}
      >
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
          <button type="submit">수정</button>
        ) : (
          <button type="submit">추가</button>
        )}
      </form>
    )
  },
)

export default Form

Form.propTypes = {
  setFocus: PropTypes.func,
  edit: PropTypes.object,
  setEdit: PropTypes.func,
  setList: PropTypes.func,
  value: PropTypes.string,
  setValue: PropTypes.func,
}
