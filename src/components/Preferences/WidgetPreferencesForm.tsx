import classNames from "classnames"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectUserData, setIdToken } from "../../features/api/auth/authSlice"
import { useUpdateUserMutation } from "../../features/api/user/userApiSlice"
import { selectAllWidgets } from "../Widgets/widgetsSlice"

const WidgetPreferencesForm = () => {
    // store data
    const dispatch = useAppDispatch()
    const idToken = useAppSelector(selectUserData)
    const storeWidgetList = useAppSelector(selectAllWidgets)
    // update DB
    const [updateUser] = useUpdateUserMutation()

    // changing store and DB on menu change
    const handleChange = async (id: string) => {
        const newWidgetsList = idToken.widgets.findIndex(widget => widget === id) === -1
            ? [...idToken.widgets, id]
            : [...idToken.widgets].filter(item => item !== id)
        dispatch(dispatch(setIdToken({ idToken: { ...idToken, widgets: newWidgetsList } })))
        // updating DB
        const result = await updateUser({ widgets: JSON.stringify(newWidgetsList) }).unwrap()
            if(result.status !== 200) console.log(result)
    }

    // generating content from the list of widgets
    const content = storeWidgetList.map(item => (
        <div key={item.id}>
            <p>{item.title}</p>
            <input
                type="checkbox"
                defaultChecked={!!idToken.widgets.find(widget => widget === item.id)}
                onChange={() => handleChange(item.id)}
            />
        </div>
    ))

    return (
        <div className="formLike">
            {content}
        </div>
    )
}

export default WidgetPreferencesForm