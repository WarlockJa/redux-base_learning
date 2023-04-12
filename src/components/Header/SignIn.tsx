import './headerMenu.css'
import { useGoogleLogin } from "@react-oauth/google"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { useRef, useState } from "react"
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { faArrowAltCircleDown, faArrowAltCircleUp } from '@fortawesome/fontawesome-free-solid'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { IRTKQuery, isApiAuthError } from '../../features/api/apiSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { IAuth, selectUserData, setCredentials } from '../../features/api/auth/authSlice'
import Spinner from '../../util/Spinner'
import LineBreak from '../../util/LineBreak'

const SignIn = ({ login, gLogin }: { login: IRTKQuery, gLogin: IRTKQuery }) => {
    // flag for hiding sign in and options menus
    const [hidden, setHidden] = useState(true)
    // flag for showing/hiding sign in and options menu messages
    const [signInCoverVisible, setSignInCoverVisible] = useState(true)
    // sign in authorization data
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // redux store methods to store user data
    const dispatch = useAppDispatch()
    const idToken = useAppSelector(selectUserData) 
    // reattaching focus to the sign in menu on error cover close
    const formPassRef = useRef<HTMLInputElement>(null)
    const formEmailRef = useRef<HTMLInputElement>(null)
    const handleErrorClick = () => {
        setSignInCoverVisible(false)
        // verifying that error is from the API by checking its type. If so focusing appropriate fields based on error message
        isApiAuthError(login.error) && login.error.data.message === 'Password incorrect'
            ? formPassRef.current && formPassRef.current.focus()
            : formEmailRef.current && formEmailRef.current.focus()
    }

    // sign in form data submission
    const handleSubmit = async (event: React.FormEvent<HTMLElement>) => {
        event.preventDefault()
        setSignInCoverVisible(true)
        const signInData: IAuth = login.login && await login.login({ email, password }).unwrap()
        dispatch(setCredentials({ accessToken: signInData.accessToken, idToken: signInData.idToken }))
        setEmail('')
        setPassword('')
    }

    // closing sign in menu on overlay click and hiding sign in cover
    const handleOverlayClick = () => {
        setHidden(true)
        setSignInCoverVisible(false)
    }

    // sign in with google
    const loginGoogle = useGoogleLogin({
        onSuccess: async tokenResponse => {
            const signInData: IAuth = gLogin.gLogin && await gLogin.gLogin({ ...tokenResponse, darkmode: idToken?.darkmode }).unwrap()
            dispatch(setCredentials({ accessToken: signInData?.accessToken, idToken: signInData?.idToken }))
        },
    });

    // content for sign in and options menu
    const content = (
        <>
            <button
                className='headerMenu--button'
                onClick={() => setHidden(prev => !prev)}
            ><span>Sign In <FontAwesomeIcon
                                style={{ backgroundColor: 'transparent' }}
                                icon={hidden ? faArrowAltCircleDown as IconProp : faArrowAltCircleUp as IconProp}/></span>
            </button>
            <div className={classNames("headerMenu__dropMenu--wrapper noBackground", { dropMenuHidden: hidden, sendToBackground: hidden })}>
                <form className="headerMenu__form">
                    {(login.isLoading || gLogin.isLoading) && <div className="headerMenu__form--cover"><Spinner embed={false}/></div>}
                    {(login.isError || gLogin.isError) && signInCoverVisible && <div onClick={() => handleErrorClick()} className="headerMenu__form--cover">{
                        login.isError
                            ? isApiAuthError(login.error) ? login.error.data.message : JSON.stringify(login.error)
                            : isApiAuthError(gLogin.error) ? gLogin.error.data.message : JSON.stringify(gLogin.error)}
                        </div>}
                    <label htmlFor="headerMenu__form--email">email</label>
                    <input
                        ref={formEmailRef}
                        id="headerMenu__form--email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        maxLength={50}
                        required
                    />
                    <label htmlFor="headerMenu__form--password">password</label>
                    <input
                        ref={formPassRef}
                        id="headerMenu__form--password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        maxLength={50}
                        required
                    />
                    <button disabled={login.isLoading || gLogin.isLoading}>Sign in</button>
                    <LineBreak />
                    <button onClick={() => loginGoogle()} type='button'><span style={{ backgroundColor: "transparent" }}><FontAwesomeIcon style={{ backgroundColor: "transparent" }} icon={faGoogle}/> sign in</span></button>
                    <LineBreak />
                    <Link className='headerMenu__form--registerLink' to='/register'><button onClick={() => setHidden(true)} className='headerMenu__form--registerButton' type='button'>Register</button></Link>
                </form>
            </div>
            {!hidden && <div className="headerMenu--overlay" onClick={() => handleOverlayClick()}></div>}
        </>
    )

    return (
        <section className="headerMenu" onSubmit={(e) => handleSubmit(e)}>
            {content}
        </section>
    )
}

export default SignIn