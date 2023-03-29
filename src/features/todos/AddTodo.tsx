import './datetimepicker.css';
import './calendar.css';
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import DateTimePicker from 'react-datetime-picker'
import { switchAddTodo } from './todosSlice';
import classNames from 'classnames';
import { useAddTodoMutation } from './todoApiSlice';
import dateToSqlDatetime from '../../util/dateToSQLdatetime';
import { selectCurrentEmail } from '../auth/authSlice';

const AddTodo = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState(new Date)
    const [reminder, setReminder] = useState(false)

    // redux store state for the addTodo menu
    // const addTodoMenuState = useAppSelector(selectAddTodoState)
    const dispatch = useAppDispatch()
    const useremail = useAppSelector(selectCurrentEmail)
    // RTK Query method for posting new todo
    const [addTodo, { isLoading, isError, error }] = useAddTodoMutation()

    // add todo improper data saveguards
    const dueDateIsValid = !reminder || new Date < dueDate

    const canSave = [title, dueDateIsValid].every(Boolean) && !isLoading

    // adding todo
    const handleSubmit = async () => {
        if(canSave) {
            try {
                if(useremail) await addTodo({ useremail: useremail, title, description, reminder, date_due: dateToSqlDatetime(dueDate) }).unwrap()
                setTitle('')
                setDescription('')
                setDueDate(new Date())
                setReminder(false)
            } catch (error) {
                console.log(error)
            }
            dispatch(switchAddTodo()) // closing addTodo menu by changing redux state
        }
    }
    
    if(isError) return (
        <section className='addTodo'>
            <p>{`Failed to save the post: ${error}`}</p>
        </section>
    )

    return (
        <section className="addTodo">
            <form>
                <h3>Add Todo</h3>
                <label htmlFor="addTodo__todoTitle">Todo Title</label>
                <input
                    id="addTodo__todoTitle"
                    className={title ? '' : 'invalid'}
                    title="Task title"
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <label htmlFor="addTodo__todoDescription">Todo Description</label>
                <textarea
                    className="addTodo__todoDescription"
                    id="addTodo__todoDescription"
                    title='Task description'
                    rows={5}
                    maxLength={500}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                ></textarea>
                <div title={!dueDateIsValid ? `Chosen date must be after ${new Date}` : "Set reminder"} className={classNames('addTodo__dueDate', { invalid: !dueDateIsValid })}>
                    <div className="addTodo__dueDate--reminderBlock">
                        <label htmlFor="addTodo__dueDate--reminderCheckBox">Set reminder</label>
                        <input checked={reminder} onChange={() => setReminder((prev) => !prev)} type="checkbox" id="addTodo__dueDate--reminderCheckBox" />
                    </div>
                    <label>Select date</label>
                    <DateTimePicker disabled={!reminder} value={new Date(dueDate)} onChange={setDueDate} disableClock minDate={new Date()} format="dd-MM-y hh:mm" />
                </div>
                <button className={!canSave ? 'translucent' : undefined} disabled={!canSave} title={!canSave ? 'Required fields are missing' : 'All good!'} type="button" onClick={handleSubmit}>Add Todo</button>
            </form>
        </section>
    )
}

export default AddTodo