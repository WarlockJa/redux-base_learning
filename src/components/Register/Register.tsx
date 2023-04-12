import '../Header/headerMenu.css'
import { FormEvent, useState } from "react"
import { useLoginMutation, useRegisterMutation } from "../../features/api/auth/authApiSlice"
import Spinner from "../../util/Spinner"
import { apiSlice, isApiRegisterError } from "../../features/api/apiSlice"
import classNames from 'classnames'
import { IAuth, selectUserData, setCredentials } from '../../features/api/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useSendConfirmEmailMutation } from '../../features/api/user/userApiSlice'

const returnErrorMessage = (error: unknown) => {
    if(isApiRegisterError(error)) {
        switch (error.originalStatus) {
            case 409:
                return 'Email already registered'
                break;
        
            default:
                return JSON.stringify(error)
        }
    }
}

const Register = () => {
    const dispatch = useAppDispatch()
    const idToken = useAppSelector(selectUserData) 
    // register form fields and cover states
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [registerCoverVisible, setRegisterCoverVisible] = useState(true)
    const [register, { isSuccess, isLoading, isError, error }] = useRegisterMutation()
    const [login, { isLoading: isLoadingLogin }] = useLoginMutation()
    const [sendConfirmEmail] = useSendConfirmEmailMutation()
    const [emailVerificationCoverVisible, setEmailVerificationCoverVisible] = useState(false)
    
    // attempt to register a new user
    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setRegisterCoverVisible(true)
        const result = await register({ email, name, password, darkmode: idToken?.darkmode }).unwrap()
        if(!isApiRegisterError(result)) {
            // showing alert for email verification
            setEmailVerificationCoverVisible(true)
            dispatch(sendConfirmEmail)
        }
    }
    
    // handling click on cover screen with an error message
    const handleErrorClick = () => {
        setRegisterCoverVisible(false)
    }
    
    // handling click on the successful registration cover screen
    const handleVerificationCoverClick = async () => {
        // clearing out apiSlice flags
        dispatch(apiSlice.util.resetApiState())
        // sign in user upon registration
        const signInData: IAuth = await login({ email, password }).unwrap()
        dispatch(setCredentials({ accessToken: signInData.accessToken, idToken: signInData.idToken }))
        // clearing out registration form data
        setEmail('')
        setName('')
        setPassword('')
    }

    const canSave = [email, name, password].every(Boolean) && !isLoading

    return (
        <section className="register">
            <h1>Register</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                {(isLoading || isLoadingLogin) && <div className="headerMenu__form--cover"><Spinner embed={false}/></div>}
                {isError && registerCoverVisible && <div onClick={() => handleErrorClick()} className="headerMenu__form--cover">{returnErrorMessage(error)}</div>}
                {emailVerificationCoverVisible && <div onClick={() => handleVerificationCoverClick()} className="headerMenu__form--cover">Verification email was sent to your address</div>}
                <label htmlFor="register__email">E-Mail</label>
                <input
                    id="register__email"
                    className={classNames({ invalid: !email })}
                    type="email"
                    autoComplete="new-password"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={emailVerificationCoverVisible}
                    required
                    />
                <label htmlFor="register__name">Name</label>
                <input
                    id="register__name"
                    className={classNames({ invalid: !name })}
                    type="text"
                    value={name}
                    autoComplete="new-password"
                    onChange={(e) => setName(e.target.value)}
                    disabled={emailVerificationCoverVisible}
                    required
                    />
                <label htmlFor="register__password">Password</label>
                <input
                    id="register__password"
                    className={classNames({ invalid: !password })}
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,60}$"
                    onChange={(e) => setPassword(e.target.value)}
                    title="Password requires 5-60 symbols, at least one uppercase letter, a lowercase letter, and a digit"
                    disabled={emailVerificationCoverVisible}
                    required
                />
                <button disabled={!canSave} title={canSave ? 'Press to register' : 'Fill all required fields'}>Register</button>
            </form>
        </section>
    )
}

export default Register