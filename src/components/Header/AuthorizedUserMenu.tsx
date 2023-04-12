import './usermenu.css'
import classNames from "classnames"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { apiSlice } from "../../features/api/apiSlice"
import { logOut, selectUserData } from "../../features/api/auth/authSlice"
import Spinner from "../../util/Spinner"
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/fontawesome-free-solid"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import LineBreak from '../../util/LineBreak'
import Toggle from 'react-toggle'
import useSystemColorSchemeIsDark from '../../util/useSystemColorSchemeIsDark'
import '../../util/react-toggle.css'
import { useLogoutMutation } from '../../features/api/user/userApiSlice'

const AuthorizedUserMenu = () => {
    // logout api call
    const [logout, { isLoading }] = useLogoutMutation()
    // user data from the store
    const idToken = useAppSelector(selectUserData)
    // menu hidden state
    const [hidden, setHidden] = useState(true)
    const dispatch = useAppDispatch()
    // dark theme
    const defaultDarkTheme = idToken ? idToken.preferredtheme : useSystemColorSchemeIsDark()
    
    // closing sign in menu on overlay click and hiding sign in cover
    const handleOverlayClick = () => {
        setHidden(true)
    }

    const handleLogout = async () => {
        // removing refresh token from the DB and issuing expired httpOnly cookie to the client from the backend
        logout && await logout(null).unwrap()
        // clearing out user store data
        dispatch(logOut())
        // resetting apiSlice todos data
        dispatch(apiSlice.util.resetApiState())
    }

    return isLoading ? <Spinner embed={false} width="5em" height="2em" />
    :(
        <>
            <button className="userMenu--button" onClick={() => setHidden(prev => !prev)}>
                {/* {idToken?.picture && <img className="userMenu__button--avatar" src={idToken.picture} alt="user avatar" />} */}
                {idToken?.name}
            </button>
            <div className={classNames("headerMenu__dropMenu--wrapper formLike userMenu", { dropMenuHidden: hidden })}>
                <Link className='headerMenu__dropMenu--menuItem' onClick={() => setHidden(true)} to='/preferences'>Preferences <FontAwesomeIcon icon={faEdit as IconProp}/></Link>
                
                <button onClick={() => document.body.classList.toggle('dark-theme')}>Theme</button>
                <Toggle
                    defaultChecked={defaultDarkTheme}
                />

                <LineBreak />
                <button className='headerMenu__dropMenu--logoutButton' onClick={() => handleLogout()}>Logout</button>
            </div>
            {!hidden && <div className="headerMenu--overlay" onClick={() => handleOverlayClick()}></div>}
        </>
    )
}

export default AuthorizedUserMenu