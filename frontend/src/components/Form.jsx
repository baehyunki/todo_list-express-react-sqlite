import React, { forwardRef, useState } from "react"
import { BiEdit, BiPlus } from "react-icons/bi"
import { toast } from "react-hot-toast"

const Form = forwardRef(
  (
    { setFocus, edit, editHandler, setList, value, setValue, addItemHandler },
    ref,
  ) => {
    const submitHandler = (e) => {
      // form 기본 동작 실행 방지
      e.preventDefault()

      // value 값이 비어있을 경우
      if (value === undefined || value.trim().length === 0) {
        setFocus()
        return toast("내용을 입력해주세요", { type: "error" })
      }
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
          addItemHandler(result.todos)
          toast(`${value} 추가 성공`, { type: "success" })
        })
        .catch((error) => console.log(error))

      e.key === "Enter" && setValue("")
      setValue("")
      setFocus()
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
          editHandler(id, value)
          setList(todos)
          setValue("")
          setFocus()
          toast(message, { type: "success" })
        })
    }
    return (
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
    )
  },
)

export default Form
