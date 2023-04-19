import classNames from 'classnames'
import { useDeleteUserMutation, useSendConfirmEmailMutation, useUpdateUserMutation } from '../../features/api/user/userApiSlice'
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logOut, selectUserData, setIdToken } from '../../features/api/auth/authSlice'
import { apiSlice } from '../../features/api/apiSlice'
import Icons from '../../assets/Icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faEdit } from '@fortawesome/fontawesome-free-solid'
import LanguageSwitcher from '../../util/LanguageSwitcher'
import SwitchDarkMode from '../../util/SwitchDarkMode'

const userPreferencesForm = (setAvatarFile: Dispatch<SetStateAction<File | undefined>>) => {
    // i18next
    const { t, i18n } = useTranslation()
    // user data from the store
    const idToken = useAppSelector(selectUserData)
    const dispatch = useAppDispatch()
    const [sendConfirmEmail] = useSendConfirmEmailMutation()
    const [updateUser, { isLoading, isSuccess, isError, error }] = useUpdateUserMutation()
    const [deleteUser, { isLoading: isLoadingDeleteUser, isSuccess: isSuccessDeleteUser, isError: isErrorDeleteUser, error: errorDeleteUser }] = useDeleteUserMutation() // TODO add check for success
    // user prefrences menu states
    // const [userDataChanged, setUserDataChanged] = useState(false)
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
    // user image states
    const [avatarHovered, setAvatarHovered] = useState(false)

    // detecting is changes were made in user preferences menu
    // useEffect(() => {
    //     idToken.name === userName
    //         ? idToken.surname === userSurname
    //             ? idToken.email === userEmail
    //                 ? setUserDataChanged(false)
    //                 : setUserDataChanged(true)
    //             : setUserDataChanged(true)
    //         : setUserDataChanged(true)
    // },[userName, userSurname, userEmail])

    // exiting user name editing mode on Enter or Esc clicked
    const handleUserNameKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
        if (event.key === 'Enter') {
            if(userName) {
                setUserNameEdit(false)
                const result = await updateUser({ name: userName }).unwrap()
                const newIdToken = {
                    ...idToken,
                    name: userName
                }
                if(result.status === 200) {
                    dispatch(setIdToken({ idToken: newIdToken }))
                } else { console.log(result) }
            }

        } else if (event.key === 'Escape') {
            setUserNameEdit(false)
            setUserName(userNameIfCancelEdit)
        }
    }

    // exiting user surname editing mode on Enter or Esc clicked
    const handleUserSurnameKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
        if (event.key === 'Enter') {
            setUserSurnameEdit(false)
            const result = await updateUser({ surname: userSurname }).unwrap()
            const newIdToken = {
                ...idToken,
                surname: userSurname
            }
            if(result.status === 200) {
                dispatch(setIdToken({ idToken: newIdToken }))
            } else { console.log(result) }
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
    // const handleUpdateUser = async () => {
    //     // TODO update changed fields
    //     const result = await updateUser({ name: userName, surname: userSurname }).unwrap()
    //     const newIdToken = {
    //         ...idToken,

    //         // email: string | null;
    //         // email_confirmed: boolean;
    //         // locale: 'en-US';
    //         name: userName,
    //         surname: userSurname ? userSurname : ''
    //         // picture: string | null;
    //         // authislocal: boolean | null;
    //         // darkmode: string | null;
    //     }
    //     if(result.status === 200) {
    //         dispatch(setIdToken({ idToken: newIdToken }))
    //         setUserDataChanged(false)
    //     }
    // }

    // handle delete user
    const handleDeleteUser = async () => {
        // TODO add confirmation screen
        const result = await deleteUser({ email: idToken.email }).unwrap()
        if(result.status === 200 || result.status === 204) {
            // clearing out user store data
            dispatch(logOut())
            // changing locale to browser default
            i18n.changeLanguage(navigator.language)
            // resetting apiSlice todos data
            dispatch(apiSlice.util.resetApiState())
        }
    }

    // handle avatar change
    const avatarRef = useRef<HTMLInputElement | null>(null)
    // invoking input type file method to let user choose image file
    const handleAvatarChange = () => {
        avatarRef.current?.click()
    }

    // passing image file as File to the avatarFile state
    // state is located in Preferences so it can be used by AvatarCropping component
    const handleAvatarFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            setAvatarFile(e.target.files[0])
        }
    }

    return (
        <form onSubmit={e => handleFormSubmit(e)} className={classNames('preferencesItem__userForm', { translucent: isLoading })}>
            <div className='preferencesItem__userForm--editBlock'>
                {idToken.picture
                    ? <div
                        onMouseEnter={() => setAvatarHovered(true)}
                        onMouseLeave={() => setAvatarHovered(false)}
                        >
                        <img className='preferencesItem__userForm--avatar' src={idToken.picture} alt="" />
                    </div>
                    : <div
                        onMouseEnter={() => setAvatarHovered(true)}
                        onMouseLeave={() => setAvatarHovered(false)}
                        >
                        <Icons.Person className='preferencesItem__userForm--avatar'/>
                    </div>
                }
                <input type='file' accept="image/*" ref={avatarRef} className='undisplayed' onChange={(e) => handleAvatarFileChange(e)} />
                <div
                    className={classNames('preferencesItem__userForm__avatar--editIcon', { undisplayed: !avatarHovered })}
                    onMouseEnter={() => setAvatarHovered(true)}
                    onMouseLeave={() => setAvatarHovered(false)}
                    onClick={() => handleAvatarChange()}
                ><FontAwesomeIcon title="Change avatar" icon={faEdit as IconProp} /></div>
                {/* {userDataChanged && <button onClick={() => handleUpdateUser()}>Update</button>} */}
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
            {/* {!idToken.email_confirmed && <p className="textButton" onClick={() => dispatch(sendConfirmEmail)}>re-send verification email</p>} */}
            <div className='preferencesItem__userForm--editBlock'>
                <p className='preferencesItem__userForm--p'>Color scheme:</p>
                <SwitchDarkMode />
            </div>
            <div className='preferencesItem__userForm--editBlock'>
                <p>Locale</p>
                <LanguageSwitcher
                    fullDescription={true}
                />
            </div>
            <button className='preferencesItem__userForm--deleteButton' onClick={() => handleDeleteUser()}>Delete user</button>
        </form>
    )
}

export default userPreferencesForm