import './header.css'
import { NavLink } from "react-router-dom"
import SignIn from "./SignIn"
import { useEffect } from "react"
import AuthorizedUserMenu from "./AuthorizedUserMenu"
import { useGLoginMutation, useLoginMutation, useReauthMutation } from '../../features/api/auth/authApiSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectCurrentToken, selectUserData, setCredentials } from '../../features/api/auth/authSlice'
import Spinner from '../../util/Spinner'
import SwitchDarkMode from '../../util/SwitchDarkMode'

const Header = () => {
    // autologin with existing refreshtoken on page reload
    const [reauth, { isLoading: isLoadingReauth }] = useReauthMutation()
    // login api call
    const [login, { isLoading: isLoadingLogin, isError: isErrorLogin, error: errorLogin }] = useLoginMutation()
    // google api login call
    const [gLogin, { isLoading: isLoadingGLogin, isError: isErrorGLogin, error: errorGLogin }] = useGLoginMutation()
    // store data
    const token = useAppSelector(selectCurrentToken)
    const idToken = useAppSelector(selectUserData)

    const dispatch = useAppDispatch()

    // relogin user upon page reaload with stored httpOnly refresh token cookie
    useEffect(() => {
        const handleUserReauth = async () => {
            const reauthData = await reauth({}).unwrap()
            dispatch(setCredentials({ accessToken: reauthData.accessToken, idToken: { ...reauthData.idToken } }))
        }
        
        handleUserReauth()

        return () => {}

    },[])

    // toggle light/dark mode according to user prefrences
    useEffect (() => {
        if(idToken) {
            idToken.darkmode ? document.body.classList.add('dark-theme') : document.body.classList.remove('dark-theme')
        }
    },[idToken?.darkmode])

    let authContent
    // header menu spinner on loggin out and auto relog
    if(isLoadingReauth) {
        authContent = <Spinner embed={false} width="5em" height="2em" />
    // user menu on successful login
    } else if(token) {
        authContent = <AuthorizedUserMenu />
    // sign in menu in other cases
    } else {
        authContent = <SignIn
            login={{ login, isLoading: isLoadingLogin, isError: isErrorLogin, error: errorLogin }}
            gLogin={{ gLogin, isLoading: isLoadingGLogin, isError: isErrorGLogin, error: errorGLogin }}
        />
    }

    return (
        <section className="header">
            <nav>
                <NavLink to='/'>Home</NavLink>
                <NavLink to='posts'>News</NavLink>
                {token && <NavLink to='todos'>Todos</NavLink>}
            </nav>
            <div className="header__loginSection">
                <div className='header__loginSection--themeSwitcher'>
                    <SwitchDarkMode />
                </div>
                {authContent}
            </div>
        </section>
    )
}

export default Header 