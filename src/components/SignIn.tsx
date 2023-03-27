import './signin.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { useRef, useState } from "react"
import { useAppDispatch } from "../app/hooks"
import { IAuth, setCredentials } from "../features/auth/authSlice"
import Spinner from "../util/Spinner"
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import LineBreak from '../util/LineBreak'
import { faArrowAltCircleDown, faArrowAltCircleUp } from '@fortawesome/fontawesome-free-solid'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { IRTKQuery } from './Header'

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

    interface ILoginApiError {
        data: {
            message: string;
        }
    }
    // confirming that login error came from the API by verifying its type
    function isApiError(error: unknown): error is ILoginApiError {
        return (
            typeof error === "object" &&
            error != null &&
            "data" in error &&
            typeof (error as any).data === "object" &&
            "message" in (error as any).data &&
            typeof (error as any).data.message === "string"
        )
    }

    // reattaching focus to the sign in menu on error cover close
    const formPassRef = useRef<HTMLInputElement>(null)
    const formEmailRef = useRef<HTMLInputElement>(null)
    const handleErrorClick = () => {
        setSignInCoverVisible(false)
        // verifying that error is from the API by checking its type. If so focusing appropriate fields based on error message
        isApiError(error) && error.data.message === 'Password incorrect'
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
            <div className={classNames("signIn__dropMenu--wrapper", { dropMenuHidden: hidden, sendToBackground: hidden })}>
                <form className="signIn__form">
                    {isLoading && <div className="signin__form--cover"><Spinner embed={false}/></div>}
                    {isError && signInCoverVisible && <div onClick={() => handleErrorClick()} className="signin__form--cover">{isApiError(error) ? error.data.message : JSON.stringify(error)}</div>}
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
                    <button><span style={{ backgroundColor: "transparent" }}><FontAwesomeIcon style={{ backgroundColor: "transparent" }} icon={faGoogle}/> sign in</span></button>
                    <LineBreak />
                    <button onClick={() => handleRegisterClick()}>Register</button>
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