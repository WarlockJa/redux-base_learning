import './signin.css'
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { useRef, useState } from "react"
import { useAppDispatch } from "../app/hooks"
import { IAuth, setCredentials } from "../features/auth/authSlice"
import Spinner from "../util/Spinner"
import classNames from 'classnames'
import { Link, useNavigate } from 'react-router-dom'
import LineBreak from '../util/LineBreak'
import { faArrowAltCircleDown, faArrowAltCircleUp } from '@fortawesome/fontawesome-free-solid'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { IRTKQuery, isApiAuthError } from '../features/api/apiSlice'

const MyLoginButton = ({ callback }: { callback: () => void}) => {
    return <button onClick={() => callback()}>Sign in with Google</button>
}

const SignIn = ({ login, isLoading, isError, error }: IRTKQuery) => {
    // flag for hiding sign in and options menus
    const [hidden, setHidden] = useState(true)
    // flag for showing/hiding sign in and options menu messages
    const [signInCoverVisible, setSignInCoverVisible] = useState(true)
    // sign in authorization data
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // RTK Query method for authorization
    // const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation()
    // redux store methods to store user data
    const dispatch = useAppDispatch()
    // react router
    const navigate = useNavigate()
    // routing to registration form
    const handleRegisterClick = () => {
        setHidden(true)
        navigate('/register')
    }

    // reattaching focus to the sign in menu on error cover close
    const formPassRef = useRef<HTMLInputElement>(null)
    const formEmailRef = useRef<HTMLInputElement>(null)
    const handleErrorClick = () => {
        setSignInCoverVisible(false)
        // verifying that error is from the API by checking its type. If so focusing appropriate fields based on error message
        isApiAuthError(error) && error.data.message === 'Password incorrect'
            ? formPassRef.current && formPassRef.current.focus()
            : formEmailRef.current && formEmailRef.current.focus()
    }

    // sign in form data submission
    const handleSubmit = async (event: React.FormEvent<HTMLElement>) => {
        event.preventDefault()
        setSignInCoverVisible(true)
        const signInData: IAuth = login && await login({ email, password }).unwrap()
        dispatch(setCredentials({ accessToken: signInData.accessToken, idToken: signInData.idToken }))
        setEmail('')
        setPassword('')
    }

    // closing sign in menu on overlay click and hiding sign in cover
    const handleOverlayClick = () => {
        setHidden(true)
        setSignInCoverVisible(false)
    }

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

    // content for sign in and options menu
    const content = (
        <>
            <button
                className='signIn--button'
                onClick={() => setHidden(prev => !prev)}
                // onBlur={() => handleSignInMenuButtonFocusLost()}
            ><span>Sign In <FontAwesomeIcon
                                style={{ backgroundColor: 'transparent' }}
                                icon={hidden ? faArrowAltCircleDown as IconProp : faArrowAltCircleUp as IconProp}/></span>
            </button>
            <div className={classNames("signIn__dropMenu--wrapper noBackground", { dropMenuHidden: hidden, sendToBackground: hidden })}>
                <form className="signIn__form">
                    {isLoading && <div className="signin__form--cover"><Spinner embed={false}/></div>}
                    {isError && signInCoverVisible && <div onClick={() => handleErrorClick()} className="signin__form--cover">{isApiAuthError(error) ? error.data.message : JSON.stringify(error)}</div>}
                    <label htmlFor="signIn__form--email">email</label>
                    <input
                        ref={formEmailRef}
                        id="signIn__form--email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        maxLength={50}
                        required
                    />
                    <label htmlFor="signIn__form--password">password</label>
                    <input
                        ref={formPassRef}
                        id="signIn__form--password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        maxLength={50}
                        required
                    />
                    <button disabled={isLoading}>Sign in</button>
                    <LineBreak />
                    <button type='button'><span style={{ backgroundColor: "transparent" }}><FontAwesomeIcon style={{ backgroundColor: "transparent" }} icon={faGoogle}/> sign in</span></button>
                    <LineBreak />
                    <Link className='signIn__form--registerLink' to='/register'><button onClick={() => setHidden(true)} className='signin__form--registerButton' type='button'>Register</button></Link>
                </form>
            </div>
            {!hidden && <div className="signIn--overlay" onClick={() => handleOverlayClick()}></div>}
        </>
    )

    return (
        <section className="signIn" onSubmit={(e) => handleSubmit(e)}>
            {content}
        </section>
    )
}

export default SignIn