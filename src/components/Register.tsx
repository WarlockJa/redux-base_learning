const Register = () => {
    return (
        <section className="register">
            <h1>Register</h1>
            <form>
                <label htmlFor="register__email">E-Mail</label>
                <input id="register__email" type="email" required />
                <label htmlFor="register__name">Name</label>
                <input id="register__name" type="text" required />
                <label htmlFor="register__password">Password</label>
                <input id="register__password" type="password" required />
            </form>
        </section>
    )
}

export default Register