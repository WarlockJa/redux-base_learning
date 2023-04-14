import './preferences.css'
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useDeleteUserMutation, useSendConfirmEmailMutation, useUpdateUserMutation } from "../../features/api/user/userApiSlice"
import { logOut, selectUserData, setIdToken } from "../../features/api/auth/authSlice"
import collapsingMenu from './collapsingMenu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faCheck } from '@fortawesome/fontawesome-free-solid'
import Icons from '../../assets/Icons'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { apiSlice } from '../../features/api/apiSlice'
import SwitchDarkMode from '../../util/SwitchDarkMode'

const Preferences = () => {
    // user data from the store
    const idToken = useAppSelector(selectUserData)
    const dispatch = useAppDispatch()
    const [sendConfirmEmail] = useSendConfirmEmailMutation()
    const [updateUser, { isLoading, isSuccess, isError, error }] = useUpdateUserMutation()
    const [deleteUser, { isLoading: isLoadingDeleteUser, isSuccess: isSuccessDeleteUser, isError: isErrorDeleteUser, error: errorDeleteUser }] = useDeleteUserMutation() // TODO add check for success
    // default settings for the menu
    const DEFAULT_HEADER_OFFSET = 32
    // user prefrences menu states
    const [userDataChanged, setUserDataChanged] = useState(false)
    // user name states
    const [userName, setUserName] = useState<string>(idToken.name ? idToken.name : '')
    const [userNameEdit, setUserNameEdit] = useState(false)
    const [userNameIfCancelEdit, setUserNameIfCancelEdit] = useState<string>('')
    // user surname states
    const [userSurname, setUserSurname] = useState<string|null>(idToken.surname)
    const [userSurnameEdit, setUserSurnameEdit] = useState(false)
    const [userSurnameIfCancelEdit, setUserSurnameIfCancelEdit] = useState<string|null>(idToken.surname)
    // user email states
    const [userEmail, setUserEmail] = useState(idToken.email)
    const [userEmailEdit, setUserEmailEdit] = useState(false)
    // user password states
    const [userPasswordChangeFormState, setUserPasswordChangeFormState] = useState(false)
    // user locale states
    const [userLocale, setUserLocale] = useState(idToken.locale)
    const [userLocaleEdit, setuserLocalEdit] = useState(false)
    const [userLocalIfCancelEdit, setUserLocalIfCancelEdit] = useState(idToken.locale)

    // detecting is changes were made in user preferences menu
    useEffect(() => {
        idToken.name === userName
            ? idToken.surname === userSurname
                ? idToken.email === userEmail
                    ? setUserDataChanged(false)
                    : setUserDataChanged(true)
                : setUserDataChanged(true)
            : setUserDataChanged(true)
    },[userName, userSurname, userEmail])

    // exiting user name editing mode on Enter or Esc clicked
    const handleUserNameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter') {
            console.log(userName)
            if(userName) setUserNameEdit(false)
        } else if (event.key === 'Escape') {
            setUserNameEdit(false)
            setUserName(userNameIfCancelEdit)
        }
    }

    // exiting user surname editing mode on Enter or Esc clicked
    const handleUserSurnameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter') {
          setUserSurnameEdit(false)
        } else if (event.key === 'Escape') {
            setUserSurnameEdit(false)
            setUserSurname(userSurnameIfCancelEdit)
        }
    }

    // confirming that name is not empty on userName input focus lost event. Restoring saved value if so
    const handleUserNameBlur = () => {
        if(userName === '') {
            setUserName(userNameIfCancelEdit)
        }
        setUserNameEdit(false)
    }

    // edit user name click handler
    const handleUserNameEditClick = () => {
        setUserNameEdit(true)
        setUserNameIfCancelEdit(userName)
    }

    // edit user surname click handler
    const handleUserSurnameEditClick = () => {
        setUserSurnameEdit(true)
        setUserSurnameIfCancelEdit(userSurname)
    }

    // disabling default form submit event
    const handleFormSubmit = (event: React.FormEvent<HTMLElement>) => {
        event.preventDefault()
    }

    // updating user data
    const handleUpdateUser = async () => {
        // TODO update changed fields
        const result = await updateUser({ name: userName, surname: userSurname }).unwrap()
        const newIdToken = {
            ...idToken,

            // email: string | null;
            // email_confirmed: boolean;
            // locale: 'en-US';
            name: userName,
            surname: userSurname ? userSurname : ''
            // picture: string | null;
            // authislocal: boolean | null;
            // darkmode: string | null;
        }
        if(result.status === 200) {
            dispatch(setIdToken({ idToken: newIdToken }))
            setUserDataChanged(false)
        }
    }

    // handle delete user
    const handleDeleteUser = async () => {
        // TODO add confirmation screen
        const result = await deleteUser({ email: idToken.email }).unwrap()
        if(result.status === 200 || result.status === 204) {
            // clearing out user store data
            dispatch(logOut())
            // resetting apiSlice todos data
            dispatch(apiSlice.util.resetApiState())
        }
    }

    // Cascading collapsing menus. Eachs section returns JSX element and its current height in px
    // Sum of previous elements heights is used to calculate offset for each subsequent menu item
    // generating user preferences form
    const userPreferencesForm = <form onSubmit={e => handleFormSubmit(e)} className={classNames('preferencesItem__userForm', { translucent: isLoading })}>
        <div className='preferencesItem__userForm--editBlock'>
            {idToken.picture
                ? <div>
                    <img className='preferencesItem__userForm--avatar' src={idToken.picture} alt="" />
                </div>
                : <div>
                    <Icons.Person className='preferencesItem__userForm--avatar'/>
                </div>
            }
            {userDataChanged && <button onClick={() => handleUpdateUser()}>Update</button>}
        </div>
        {userNameEdit
            ? <input
                type="text"
                autoFocus
                className={classNames({ invalid: userName === '' })}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onBlur={() => handleUserNameBlur()}
                onKeyDown={(e) => handleUserNameKeyDown(e)}
                maxLength={254}
            ></input>
            : <div className='preferencesItem__userForm--editBlock'>
                <p className='preferencesItem__userForm--p'>{userName}</p>
                <button type='button' className='preferencesItem__userForm--editButton' onClick={() => handleUserNameEditClick()} title='Edit'>· · ·</button>
            </div>
        }
        {userSurnameEdit
            ? <input
                type="text"
                autoFocus
                // className={classNames('todoItem__body--title', { invalid: !title })}
                value={userSurname ? userSurname : ''}
                onChange={(e) => setUserSurname(e.target.value)}
                onBlur={() => setUserSurnameEdit(false)}
                onKeyDown={(e) => handleUserSurnameKeyDown(e)}
                maxLength={254}
            ></input>
            : userSurname
                ? <div className='preferencesItem__userForm--editBlock'>
                    <p className='preferencesItem__userForm--p'>{userSurname}</p>
                    <button type='button' className='preferencesItem__userForm--editButton' onClick={() => handleUserSurnameEditClick()} title='Edit'>· · ·</button>
                </div>
                : <div className='preferencesItem__userForm--editBlock'>
                    <p className='preferencesItem__userForm--p emptyField'>Surname</p>
                    <button type='button' className='preferencesItem__userForm--editButton' onClick={() => handleUserSurnameEditClick()} title='Edit'>· · ·</button>
                </div>
        }
        <div className='preferencesItem__userForm--email'>
            <p className='preferencesItem__userForm--p' style={{ color: idToken.email_confirmed ? 'lightgreen' : 'coral' }}>{idToken.email}</p>
            {idToken.email_confirmed
                ? <FontAwesomeIcon title="Email verified" icon={faCheck as IconProp} />
                : <p className="textButton" onClick={() => dispatch(sendConfirmEmail)}>re-send verification email</p>
            }
        </div>  
        {!idToken.email_confirmed && <p className="textButton" onClick={() => dispatch(sendConfirmEmail)}>re-send verification email</p>}
        <div className='preferencesItem__userForm--editBlock'>
            <p className='preferencesItem__userForm--p'>Color scheme:</p>
            <SwitchDarkMode />
        </div>
        <div className='preferencesItem__userForm--editBlock'>
            <p>Locale</p>
            
        </div>
        <button className='preferencesItem__userForm--deleteButton' onClick={() => handleDeleteUser()}>Delete user</button>
    </form>

    // wrapping user preferences form in a collapsing menu function
    const userPreferences = collapsingMenu({
        defaultHeaderOffset: DEFAULT_HEADER_OFFSET,
        headerContent: 'User Preferences',
        headerTitle: 'Open/close user preferences menu',
        formContent: userPreferencesForm,
        verticalOffset: 0
    })

    // generating widgets preferences menu form
    const widgetPreferencesForm = <form>
        <p>{idToken.name}</p>
    </form>

    // wrapping widgets form in a collapsing menu function
    const widgetPreferences = collapsingMenu({
        defaultHeaderOffset: DEFAULT_HEADER_OFFSET,
        headerContent: 'Widget Preferences',
        headerTitle: 'Open/close widget preferences menu',
        formContent: widgetPreferencesForm,
        verticalOffset: userPreferences.currentHeight
    })

    return (
        <section>
            {userPreferences.menuItem}
            {widgetPreferences.menuItem}
        </section>
    )
}

export default Preferences