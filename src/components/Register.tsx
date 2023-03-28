import './signin.css'
import { FormEvent, useState } from "react"
import { useLoginMutation, useRegisterMutation } from "../features/auth/authApiSlice"
import Spinner from "../util/Spinner"
import { apiSlice, isApiRegisterError } from "../features/api/apiSlice"
import { useNavigate } from "react-router-dom"
import classNames from 'classnames'
import { IAuth, setCredentials } from '../features/auth/authSlice'
import { useAppDispatch } from '../app/hooks'

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
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    // register form fields and cover states
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [registerCoverVisible, setRegisterCoverVisible] = useState(true)
    const [register, { isSuccess, isLoading, isError, error }] = useRegisterMutation()
    const [login, { isLoading: isLoadingLogin }] = useLoginMutation()
    
    // attempt to register a new user
    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setRegisterCoverVisible(true)
        const result = await register({ email, name, password }).unwrap()
        if(!isApiRegisterError(result)) {
            // clearing out registartion form data
            setEmail('')
            setName('')
            setPassword('')
            // clearing out apiSlice flags
            dispatch(apiSlice.util.resetApiState())
            // sign in user upon registration
            const signInData: IAuth = await login({ email, password }).unwrap()
            dispatch(setCredentials({ accessToken: signInData.accessToken, idToken: signInData.idToken }))
            navigate('/')
        }
    }

    const handleErrorClick = () => {
        setRegisterCoverVisible(false)
    }

    const canSave = [email, name, password].every(Boolean) && !isLoading

    return (
        <section className="register">
            <h1>Register</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                {(isLoading || isLoadingLogin) && <div className="signin__form--cover"><Spinner embed={false}/></div>}
                {isError && registerCoverVisible && <div onClick={() => handleErrorClick()} className="signin__form--cover">{returnErrorMessage(error)}</div>}
                <label htmlFor="register__email">E-Mail</label>
                <input
                    id="register__email"
                    className={classNames({ invalid: !email })}
                    type="email"
                    autoComplete="new-password"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    required
                />
                <button disabled={!canSave} title={canSave ? 'Press to register' : 'Fill all required fields'}>Register</button>
            </form>
        </section>
    )
}

export default Register