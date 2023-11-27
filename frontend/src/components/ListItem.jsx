import React from "react"
import { GiCancel } from "react-icons/gi"
import { BiEdit } from "react-icons/bi"
import { AiFillDelete } from "react-icons/ai"
import { toast } from "react-hot-toast"

const ListItem = ({
  todo,
  list,
  setList,
  editHandler,
  edit,
  setEdit,
  setValue,
}) => {
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
  )
}

export default ListItem
