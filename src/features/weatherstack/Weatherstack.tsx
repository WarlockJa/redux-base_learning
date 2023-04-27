import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { changeStatusToIdle, fetchWeatherstackData, saveWeatherDataToState, selectWeatherStackData } from "./weatherstackSlice"
import Spinner from "../../util/Spinner"

const Weatherstack = () => {
    const dispatch = useAppDispatch()
    const weatherstack = useAppSelector(selectWeatherStackData)

    // checking if there's weatherstack data in local storage on load
    useEffect(() => {
        const weatherstackLocalData = localStorage.getItem('DP_weatherstack')
        weatherstackLocalData ? dispatch(saveWeatherDataToState(JSON.parse(weatherstackLocalData))) : dispatch(changeStatusToIdle())
    },[])

    // fetching data for the current category
    useEffect (() => {
        // fetching data
        if(weatherstack.status === 'idle') {
            const fetchRequest = {
                API_URL: `${import.meta.env.VITE_APP_WEATHERSTACK_URL}&type=IP&query=fetch:ip`
            }

            console.log('fetching weather data')

            dispatch(fetchWeatherstackData(fetchRequest))
        } else if (weatherstack.status === 'succeeded') {
            localStorage.setItem('DP_weatherstack', JSON.stringify(weatherstack))
        }
    },[dispatch, weatherstack.status])

    let content
    if(weatherstack.status === 'loading') {
        content = <Spinner embed={false} height='12em' width="100%" />
    } else if (weatherstack.status === 'failed') {
        content = <p>Error: {weatherstack.error}</p>
    } else if (weatherstack.status === 'succeeded') {
        content = <pre>{JSON.stringify(weatherstack.current, null, 2)}</pre>
    }

    return (
        <section>
            <h2>Weatherstack</h2>
            {content}
        </section>
    )
}

export default Weatherstack