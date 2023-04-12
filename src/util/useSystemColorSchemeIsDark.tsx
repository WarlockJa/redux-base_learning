// checking if system is set to dark mode
const useSystemColorSchemeIsDark = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export default useSystemColorSchemeIsDark