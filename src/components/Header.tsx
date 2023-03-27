import { NavLink } from "react-router-dom"
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google"
import Spinner from "../util/Spinner"
import { useReauthMutation } from "../features/auth/authApiSlice"
import SignIn from "./SignIn"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { selectCurrentEmail, selectCurrentToken, setCredentials } from "../features/auth/authSlice"
import { useEffect } from "react"

const MyLoginButton = ({ callback }: { callback: () => void}) => {
    return <button onClick={() => callback()}>Sign in with Google</button>
}

const Header = () => {
    const [reauth, { isLoading, isSuccess }] = useReauthMutation()
    const token = useAppSelector(selectCurrentToken)
    const storedEmail = useAppSelector(selectCurrentEmail)

    const dispatch = useAppDispatch()

    // relogin user upon page reaload with stored refresh token
    useEffect(() => {
        const handleUserReauth = async () => {
            const reauthData = await reauth({}).unwrap()
            dispatch(setCredentials({ accessToken: reauthData.accessToken, ...reauthData.idToken }))
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
    if(isLoading) {
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