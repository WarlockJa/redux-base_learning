import './preferences.css'
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useSendConfirmEmailMutation } from "../../features/auth/authApiSlice"
import { selectUserData } from "../../features/auth/authSlice"
import collapsingMenu from './collapsingMenu'

const Preferences = () => {
    // user data from the store
    const idToken = useAppSelector(selectUserData)
    const dispatch = useAppDispatch()
    const [sendConfirmEmail] = useSendConfirmEmailMutation()
    // default settings for the menu
    const DEFAULT_HEADER_OFFSET = 32

    // Cascading collapsing menus. Eachs section returns JSX element and its current height in px
    // Sum of previous elements heights is used to calculate offset for each menu item
    // user preferences menu section
    const userPreferencesForm = <form>
        <p>{idToken?.name}</p>
        <p>{idToken?.surname}</p>
        <p style={{ color: idToken?.email_confirmed ? 'lightgreen' : 'coral' }}>{idToken?.email}</p>
        {!idToken?.email_confirmed && <p className="textButton" onClick={() => dispatch(sendConfirmEmail)}>re-send verification email</p>}
        <p></p>
    </form>

    const userPreferences = collapsingMenu({
        defaultHeaderOffset: DEFAULT_HEADER_OFFSET,
        headerContent: 'User Preferences',
        headerTitle: 'Open/close user preferences menu',
        formContent: userPreferencesForm,
        verticalOffset: 0
    })

    // widget preferences menu section
    const widgetPreferencesForm = <form>
        <p>{idToken?.name}</p>
    </form>

    const widgetPreferences = collapsingMenu({
        defaultHeaderOffset: DEFAULT_HEADER_OFFSET,
        headerContent: 'Widget Preferences',
        headerTitle: 'Open/close widget preferences menu',
        formContent: widgetPreferencesForm,
        verticalOffset: userPreferences.currentHeight
    })

    // test menu 
    const testMenuForm = <form>
        <p>{idToken?.name}</p>
    </form>

    const testPreferences = collapsingMenu({
        defaultHeaderOffset: DEFAULT_HEADER_OFFSET,
        headerContent: 'Widget Preferences',
        headerTitle: 'Open/close widget preferences menu',
        formContent: widgetPreferencesForm,
        verticalOffset: userPreferences.currentHeight + widgetPreferences.currentHeight
    })
    // test menu2
    const testMenuForm2 = <form>
        <p>{idToken?.name}</p>
    </form>

    const testPreferences2 = collapsingMenu({
        defaultHeaderOffset: DEFAULT_HEADER_OFFSET,
        headerContent: 'Widget Preferences',
        headerTitle: 'Open/close widget preferences menu',
        formContent: widgetPreferencesForm,
        verticalOffset: userPreferences.currentHeight + widgetPreferences.currentHeight + testPreferences.currentHeight
    })

    return (
        <section>
            {userPreferences.menuItem}
            {widgetPreferences.menuItem}
            {testPreferences.menuItem}
            {testPreferences2.menuItem}
        </section>
    )
}

export default Preferences