import { NavLink } from "react-router-dom"
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google"
import Spinner from "../util/Spinner"
import { useGetIdTokenMutation, useLoginMutation, useRefreshTokenMutation } from "../features/auth/authApiSlice"
import SignIn from "./SignIn"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { selectCurrentEmail, selectCurrentToken, setCredentials } from "../features/auth/authSlice"
import { useEffect } from "react"
import Cookies from "js-cookie"

const MyLoginButton = ({ callback }: { callback: () => void}) => {
    return <button onClick={() => callback()}>Sign in with Google</button>
}

const Header = () => {
    const [getIdToken, { data, isLoading, isSuccess, isError, error }] = useGetIdTokenMutation()
    const [refreshToken, { isLoading: refreshTokenLoading, isSuccess: refreshTokenSuccess}] = useRefreshTokenMutation()
    const token = useAppSelector(selectCurrentToken)
    const storedEmail = useAppSelector(selectCurrentEmail)

    const dispatch = useAppDispatch()

    // relogin user with stored user data and refresh token
    useEffect(() => {
        const handleUserRelog = async () => {
            const storedUserData = Cookies.get('dp-user')

            if(storedUserData) {
                const accessToken = await refreshToken({}).unwrap();
                dispatch(setCredentials({ accessToken: accessToken }))
                const result = await getIdToken({}).unwrap()
                const idToken = result.idToken
                dispatch(setCredentials({ email: idToken.email, accessToken: accessToken }))
            }
        }
        
        handleUserRelog()

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
    if(isLoading || refreshTokenLoading) {
        authContent = <Spinner embed={false} width="5em" height="2em" />
    } else if(isSuccess) {
        authContent = <p>{storedEmail}</p>
    } else {
        authContent = <SignIn />
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
                <div>
                    {authContent}
                </div>
            </div>
        </section>
    )
}

export default Header 