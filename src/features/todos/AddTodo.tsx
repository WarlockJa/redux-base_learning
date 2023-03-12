import './datetimepicker.css';
import './calendar.css';
import { useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import DateTimePicker from 'react-datetime-picker'
import { useAddTodoMutation } from "../api/apiSlice"
import { switchAddTodo } from './todosSlice';

const AddTodo = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState(new Date())
    const [reminder, setReminder] = useState(false)

    // redux store state for the addTodo menu
    // const addTodoMenuState = useAppSelector(selectAddTodoState)
    const dispatch = useAppDispatch()
    // RTK Query method for posting new todo
    const [addTodo, { isLoading }] = useAddTodoMutation()

    const canSave = [title].every(Boolean) && !isLoading

    const handleSubmit = async () => {
        if(canSave) {
            try {
                await addTodo({ userid: 1, title, description, reminder, date_due: dueDate }).unwrap()
                setTitle('')
                setDescription('')
                setDueDate(new Date())
                setReminder(false)
                dispatch(switchAddTodo()) // closing addTodo menu by changing redux state
            } catch (error) {
                console.error('Failed to save the post: ', error)
            }
        }
    }

    return (
        <section className="addTodo">
        {/* <section className="addTodo" visible={visibility ? 1 : 0}> */}
            <form>
                <h3>Add Todo</h3>
                <label htmlFor="addTodo__todoTitle">Todo Title</label>
                <input
                    id="addTodo__todoTitle"
                    className={title ? '' : 'invalid'}
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
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                ></textarea>
                <div className="addTodo__dueDate">
                    <div className="addTodo__dueDate--reminderBlock">
                        <label htmlFor="addTodo__dueDate--reminderCheckBox">Set reminder</label>
                        <input value={reminder ? "on" : "unchecked"} onChange={() => setReminder((prev) => !prev)} type="checkbox" id="addTodo__dueDate--reminderCheckBox" />
                    </div>
                    <label>Select date</label>
                    <DateTimePicker disabled={!reminder} value={dueDate} onChange={setDueDate} disableClock minDate={new Date()} />
                </div>
                <button type="button" onClick={handleSubmit}>Add Todo</button>
            </form>
        </section>
    )
}

export default AddTodo