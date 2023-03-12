import { nanoid } from "@reduxjs/toolkit"
import { useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import { addTodo } from "./todosSlice"
import DateTimePicker from 'react-datetime-picker'
import './datetimepicker.css';
import './calendar.css';

const AddTodo = ({ visibility }: { visibility: boolean }) => {
    const [title, setTitle] = useState('')
    const [dueDate, setDueDate] = useState(new Date())
    const [reminder, setReminder] = useState(false)

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
                <label htmlFor="addTodo__todoTitle">Todo Title</label>
                <input
                    id="addTodo__todoTitle"
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <label htmlFor="addTodo__todoDescription">Todo Description</label>
                <textarea
                    className="addTodo__todoDescription"
                    id="addTodo__todoDescription"
                    rows={5}
                    maxLength={500}
                ></textarea>
                <div className="addTodo__dueDate">
                    <div className="addTodo__dueDate--reminderBlock">
                        <label htmlFor="addTodo__dueDate--reminderCheckBox">Set reminder</label>
                        <input value={reminder ? "on" : "unchecked"} onChange={() => setReminder((prev) => !prev)} type="checkbox" id="addTodo__dueDate--reminderCheckBox" />
                    </div>
                    <label>Select due date</label>
                    <DateTimePicker disabled={!reminder} value={dueDate} onChange={setDueDate} disableClock minDate={new Date()} />
                </div>
                <button type="button" onClick={handleSubmit}>Add Todo</button>
            </form>
        </section>
    )
}

export default AddTodo