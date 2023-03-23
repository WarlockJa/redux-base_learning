import { NavLink } from "react-router-dom"
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google"
import Spinner from "../util/Spinner"
import { useLoginMutation } from "../features/auth/authApiSlice"
import SignIn from "./SignIn"
import { useAppSelector } from "../app/hooks"
import { selectCurrentToken } from "../features/auth/authSlice"

const MyLoginButton = ({ callback }: { callback: () => void}) => {
    return <button onClick={() => callback()}>Sign in with Google</button>
}

const Header = () => {
    const [login, { data, isLoading, isSuccess, isError, error }] = useLoginMutation()
    const token = useAppSelector(selectCurrentToken)

    let authContent = (
        // <MyLoginButton callback={useGoogleLogin({ onSuccess: tokenResponse => login(tokenResponse)})} />
        <SignIn />
        // <GoogleLogin
        //     onSuccess={credentialResponse => {
        //         login(credentialResponse)
        //     }}

        //     theme='filled_blue'
        //     shape='pill'
        //     text='signin'
        //     useOneTap

        //     onError={() => {
        //         console.log('Login failed')
        //     }}
        // />
    )
    if(isLoading) {
        authContent = <Spinner embed={false} width="5em" height="2em" />
    } else if (isError) {
        authContent = <pre>{JSON.stringify(error)}</pre>
    } else if (isSuccess) {
        console.log(data?.content)
        if (data) authContent = <p>{data?.content.name}</p>
        // if (data) authContent = <img src={data?.content.picture} />
    }

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