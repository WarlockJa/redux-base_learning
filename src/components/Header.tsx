import { NavLink } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { useAuthUserMutation } from "../features/api/apiSlice"

const Header = () => {
    const [authUser, { isLoading, isError, error }] = useAuthUserMutation()

    return (
        <section className="header">
            <nav>
                <NavLink to='/'>Home</NavLink>
                <NavLink to={'posts'}>News</NavLink>
                <NavLink to='todos'>Todos</NavLink>
            </nav>
            <div className="header__loginSection">
                <GoogleLogin
                    onSuccess={credentialResponse => {
                        authUser(credentialResponse)
                        console.log(credentialResponse)
                    }}

                    theme='filled_blue'
                    shape='pill'
                    text='signin'

                    onError={() => {
                        console.log('Login failed')
                    }}
                />
            </div>
        </section>
    )
}

export default Header 