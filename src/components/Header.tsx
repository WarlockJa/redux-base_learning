import { NavLink } from "react-router-dom"

const Header = () => {
    return (
        <section className="header">
            <nav>
                <NavLink to='/'>Home</NavLink>
                <NavLink to={'posts'}>News</NavLink>
                <NavLink to='todos'>Todos</NavLink>
            </nav>
        </section>
    )
}

export default Header 