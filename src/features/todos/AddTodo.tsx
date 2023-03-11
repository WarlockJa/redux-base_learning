import { nanoid } from "@reduxjs/toolkit"
import { useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import { addTodo } from "./todosSlice"

const AddTodo = ({ visibility }: { visibility: boolean }) => {
    const [title, setTitle] = useState('')

    const dispatch = useAppDispatch()

    const handleSubmit = () => {
        // if(title) {
        //     dispatch(addTodo({
        //         id: nanoid(),
        //         title: title,
        //         userId: 1,
        //         completed: false
        //     }))

        //     setTitle('')
        // }
    }

    return (
        <section className="addTodo" visible={visibility ? 1 : 0}>
            <form>
                <h3>Add Todo</h3>
                <label htmlFor="addTodo__todoTitle">Todo title</label>
                <input
                    id="addTodo__todoTitle"
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