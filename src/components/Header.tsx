import { NavLink } from "react-router-dom"
import Spinner from "../util/Spinner"
import { useGLoginMutation, useLoginMutation, useReauthMutation } from "../features/auth/authApiSlice"
import SignIn from "./SignIn"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { selectCurrentToken, setCredentials } from "../features/auth/authSlice"
import { useEffect } from "react"
import AuthorizedUserMenu from "./AuthorizedUserMenu"

const Header = () => {
    // autologin with existing refreshtoken on page reload
    const [reauth, { isLoading: isLoadingReauth, isSuccess: isSuccessReauth }] = useReauthMutation()
    // login api call
    const [login, { isLoading: isLoadingLogin, isSuccess: isSuccessLogin, isError: isErrorLogin, error: errorLogin }] = useLoginMutation()
    // google api login call
    const [gLogin, { isLoading: isLoadingGLogin, isSuccess: isSuccessGLogin, isError: isErrorGLogin, error: errorGLogin }] = useGLoginMutation()
    const token = useAppSelector(selectCurrentToken)

    const dispatch = useAppDispatch()

    // relogin user upon page reaload with stored refresh token
    useEffect(() => {
        const handleUserReauth = async () => {
            const reauthData = await reauth({}).unwrap()
            dispatch(setCredentials({ accessToken: reauthData.accessToken, idToken: { ...reauthData.idToken } }))
        }
        
        handleUserReauth()

        return () => {}

    },[])

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
                {authContent}
            </div>
        </section>
    )
}

export default Header 