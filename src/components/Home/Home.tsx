import { ErrorBoundary } from "react-error-boundary"
import Counter from "../../features/counter/Counter"
import Weatherstack from "../../features/weatherstack/Weatherstack"
import ErrorPlug from "../../util/ErrorPlug"

const Home = () => {
    return (
        <>
            <ErrorBoundary
                FallbackComponent={ErrorPlug}
            >
                <Counter />
            </ErrorBoundary>
            <ErrorBoundary
                FallbackComponent={ErrorPlug}
            >
                <Weatherstack />
            </ErrorBoundary>
        </>
    )
}

export default Home