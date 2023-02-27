import { Link } from "react-router-dom"

const Header = () => {
    return (
        <section className="header">
            <nav>
                <Link to='/'>Home</Link>
            </nav>
        </section>
    )
}

export default Header