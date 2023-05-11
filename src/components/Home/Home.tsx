import { ErrorBoundary } from "react-error-boundary"
import Counter from "../../features/counter/Counter"
import Weatherstack from "../../features/weatherstack/Weatherstack"
import ErrorPlug from "../../util/ErrorPlug"
import FreeCurrencyApi from "../../features/FreeCurrencyApi/FreeCurrencyApi"

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
            <ErrorBoundary
                FallbackComponent={ErrorPlug}
            >
                <FreeCurrencyApi />
            </ErrorBoundary>
        </>
    )
}

export default Home