import './signin.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { useLoginMutation } from "../features/auth/authApiSlice"
import { selectCurrentEmail, setCredentials } from "../features/auth/authSlice"
import Spinner from "../util/Spinner"
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import LineBreak from '../util/LineBreak'
import { faArrowAltCircleDown, faArrowAltCircleUp } from '@fortawesome/fontawesome-free-solid'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

const SignIn = () => {
    // flag for hiding sign in and options menus
    const [hidden, setHidden] = useState(true)
    // flag for showing/hiding sign in and options menu messages
    const [signInCoverVisible, setSignInCoverVisible] = useState(true)
    // sign in authorization data
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // RTK Query method for authorization
    const [login, { data, isLoading, isSuccess, isError, error }] = useLoginMutation()
    // redux store methods to store user data
    const dispatch = useAppDispatch()
    const storedEmail = useAppSelector(selectCurrentEmail)
    // react router
    const navigate = useNavigate()
    const handleRegisterClick = () => {
        setHidden(true)
        navigate('/register')
    }

    // reattaching focus to the sign in menu on error cover close
    const formRef = useRef(null)
    const handleErrorClick = () => {
        setSignInCoverVisible(false)
        formRef.current?.focus()
    }

    // sign in form data submission
    const handleSubmit = async (event: React.FormEvent<HTMLElement>) => {
        event.preventDefault()
        setSignInCoverVisible(true)
        const signInData = await login({ email, password }).unwrap()
        console.log(email, ' - ', signInData)
        dispatch(setCredentials({ email, accessToken: signInData.accessToken }))
        setEmail('')
        setPassword('')
    }

    // content for sign in and options menu
    let content
    // if(isLoading) {
    //     content = <div className='signIn__loading'><Spinner embed={false} width='2em' height='2em' /></div>
    // } else if (isError) {
    //     content = <pre>{JSON.stringify(error)}</pre>
    // } else 
    if (isSuccess) {
        content = <p>{storedEmail}</p>
    } else {
        content = (
            <>
                <button
                    className='signIn--button'
                    onClick={() => setHidden(prev => !prev)}
                    onBlur={() => setHidden(true)}
                ><span>Sign In <FontAwesomeIcon
                                    style={{ backgroundColor: 'transparent' }}
                                    icon={hidden ? faArrowAltCircleDown as IconProp : faArrowAltCircleUp as IconProp}/></span>
                </button>
                <div className={classNames("signIn__dropMenu--wrapper", { dropMenuHidden: hidden, translucent: isLoading })}>
                    <form ref={formRef} onFocus={() => setHidden(false)} onBlur={() => setHidden(true)} className="signIn__form">
                        {isLoading && <div className="signin__form--cover"><Spinner embed={false}/></div>}
                        {isError && signInCoverVisible && <div onClick={() => handleErrorClick()} className="signin__form--cover">{error?.data.message}</div>}
                        <label htmlFor="signIn__form--email">email</label>
                        <input
                            id="signIn__form--email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            maxLength={50}
                            required
                        />
                        <label htmlFor="signIn__form--password">password</label>
                        <input
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
            </>
        )
    }

    return (
        <section className="signIn" onSubmit={(e) => handleSubmit(e)}>
            {content}
        </section>
    )
}

export default SignIn