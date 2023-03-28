import classNames from "classnames"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { apiSlice, IRTKQuery } from "../features/api/apiSlice"
import { logOut, selectUserData } from "../features/auth/authSlice"
import Spinner from "../util/Spinner"

const AuthorizedUserMenu = ({ logout, isLoading }: IRTKQuery) => {
    // user data from the store
    const idToken = useAppSelector(selectUserData)
    // menu hidden state
    const [hidden, setHidden] = useState(true)
    const dispatch = useAppDispatch()
    
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
        // location.reload()
    }
    return isLoading ? <Spinner embed={false} width="5em" height="2em" />
    :(
        <>
            <button onClick={() => setHidden(prev => !prev)}>{idToken?.name}</button>
            <div className={classNames("signIn__dropMenu--wrapper formLike userMenu", { dropMenuHidden: hidden })}>
                <p style={{ color: idToken?.email_confirmed ? 'lightgreen' : 'coral' }}>{idToken?.email}</p>
                <p>{idToken?.name}</p>
                <p>{idToken?.surname}</p>
                <button onClick={() => handleLogout()}>Logout</button>
            </div>
            {!hidden && <div className="signIn--overlay" onClick={() => handleOverlayClick()}></div>}
        </>
    )
}

export default AuthorizedUserMenu