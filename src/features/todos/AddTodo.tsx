import { nanoid } from "@reduxjs/toolkit"
import { useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import { addTodo } from "./todosSlice"

const AddTodo = () => {
    const [title, setTitle] = useState('')

    const dispatch = useAppDispatch()

    const handleSubmit = () => {
        if(title) {
            dispatch(addTodo({
                id: nanoid(),
                title: title,
                userId: 1,
                completed: false
            }))

            setTitle('')
        }
    }

    return (
        <section>
            <form>
                <h3>Add Todo</h3>
                <label htmlFor="todoTitle">Todo title</label>
                <input
                    id="todoTitle"
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <button type="button" onClick={handleSubmit}>Add Todo</button>
            </form>
        </section>
    )
}

export default AddTodo