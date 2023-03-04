import { Link } from "react-router-dom"

const Header = () => {
    return (
        <section className="header">
            <nav>
                <Link to='/'>Home</Link>
                <Link to='posts'>News</Link>
                <Link to='todos'>Todos</Link>
            </nav>
        </section>
    )
}

export default Header 