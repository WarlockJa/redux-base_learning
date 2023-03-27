import { NavLink } from "react-router-dom"
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google"
import Spinner from "../util/Spinner"
import { useLoginMutation, useLogoutMutation, useReauthMutation } from "../features/auth/authApiSlice"
import SignIn from "./SignIn"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { selectCurrentToken, setCredentials } from "../features/auth/authSlice"
import { useEffect } from "react"
import AuthorizedUserMenu from "./AuthorizedUserMenu"
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks"
import { BaseQueryFn, MutationDefinition } from "@reduxjs/toolkit/dist/query"

const MyLoginButton = ({ callback }: { callback: () => void}) => {
    return <button onClick={() => callback()}>Sign in with Google</button>
}

export interface IRTKQuery {
    login?: MutationTrigger<MutationDefinition<any, BaseQueryFn<any, unknown, unknown, {}, {}>, "Todos" | "Auth", any, "api">>
    logout?: MutationTrigger<MutationDefinition<any, BaseQueryFn<any, unknown, unknown, {}, {}>, "Todos" | "Auth", any, "api">>
    isLoading: boolean;
    isError?: boolean;
    error?: unknown;
}

const Header = () => {
    // logout api call
    const [logout, { isLoading: isLoadingLogout }] = useLogoutMutation()
    // autologin with existing refreshtoken on page reload
    const [reauth, { isLoading: isLoadingReauth, isSuccess: isSuccessReauth }] = useReauthMutation()
    // const { data, isLoading: isLoadingReauth, isSuccess: isSuccessReauth } = useReauthQuery()
    // login api call
    const [login, { isLoading: isLoadingLogin, isSuccess: isSuccessLogin, isError: isErrorLogin, error: errorLogin }] = useLoginMutation()
    const token = useAppSelector(selectCurrentToken)

    const dispatch = useAppDispatch()

    // relogin user upon page reaload with stored refresh token
    useEffect(() => {
        const handleUserReauth = async () => {
            const reauthData = await reauth({}).unwrap()
            dispatch(setCredentials({ accessToken: reauthData.accessToken, idToken: { ...reauthData.idToken } }))
            // dispatch(setCredentials({ accessToken: data.accessToken, idToken: { ...data.idToken } }))
        }
        
        handleUserReauth()

        return () => {}

    },[])

    // let authContent = (
    //     // <MyLoginButton callback={useGoogleLogin({ onSuccess: tokenResponse => login(tokenResponse)})} />
    //     <SignIn />
    //     // <GoogleLogin
    //     //     onSuccess={credentialResponse => {
    //     //         login(credentialResponse)
    //     //     }}

    //     //     theme='filled_blue'
    //     //     shape='pill'
    //     //     text='signin'
    //     //     useOneTap

    //     //     onError={() => {
    //     //         console.log('Login failed')
    //     //     }}
    //     // />
    // )

    let authContent
    if(isLoadingLogout || isLoadingReauth) {
        authContent = <Spinner embed={false} width="5em" height="2em" />
    } else if(isSuccessReauth || isSuccessLogin) {
        authContent = <AuthorizedUserMenu logout={logout} isLoading={isLoadingLogout}/>
    } else {
        authContent = <SignIn login={login} isLoading={isLoadingLogin} isError={isErrorLogin} error={errorLogin} />
    }
    // if (isError) {
    //     authContent = <pre>{JSON.stringify(error)}</pre>
    // } else if (isSuccess) {
    //     console.log(data?.content)
    //     if (data) authContent = <p>{data?.content.name}</p>
    //     // if (data) authContent = <img src={data?.content.picture} />
    // }

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