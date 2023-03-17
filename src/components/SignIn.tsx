import './signin.css'
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { useLoginMutation } from "../features/auth/authApiSlice"
import { selectCurrentEmail, setCredentials } from "../features/auth/authSlice"
import Spinner from "../util/Spinner"
import classNames from 'classnames'

const SignIn = () => {
    const [hidden, setHidden] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [login, { data, isLoading, isSuccess, isError, error }] = useLoginMutation()
    const dispatch = useAppDispatch()
    const storedEmail = useAppSelector(selectCurrentEmail) 

    const handleSubmit = async (event: React.FormEvent<HTMLElement>) => {
        event.preventDefault()
        const signInData = await login({ email, password }).unwrap()
        dispatch(setCredentials({ email, token: signInData.accessToken }))
        setEmail('')
        setPassword('')
    }

    let content
    if(isLoading) {
        content = <Spinner embed={false} width="100%" height="5em" />
    } else if (isError) {
        content = <pre>{JSON.stringify(error)}</pre>
    } else if (isSuccess) {
        content = <p>{storedEmail}</p>
    } else {
        content = (
            <>
                <p onClick={() => setHidden(prev => !prev)}>Sign In ^</p>
                <div className={classNames("signIn__dropMenu--wrapper", { dropMenuHidden: hidden })}>
                    <form className="signIn__form">
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
                        <button>Sign in</button>
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