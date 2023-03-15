import { FallbackProps } from "react-error-boundary"

const ErrorPlug = ({ error, resetErrorBoundary }: FallbackProps) => {
    return (
        <article>
            <h3>There was an error</h3>
            <pre>{error.name}: {error.message}</pre>
            {resetErrorBoundary && <button onClick={resetErrorBoundary}>Go back</button>}
        </article>
    )
}

export default ErrorPlug