import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { IWeatherStackState, changeStatusToIdle, fetchWeatherstackData, saveWeatherDataToState, selectWeatherStackData } from "./weatherstackSlice"
import Spinner from "../../util/Spinner"

const Weatherstack = () => {
    const dispatch = useAppDispatch()
    const weatherstack = useAppSelector(selectWeatherStackData)

    // weatehrstack data is fetched once and stored in localStorage
    // on component or page reload data is taken from the storage
    // data is refetched if stored data older than 2 hours
    // this is done to lower amount of fetches from the API which is limited to 250 per month
    // checking if there's weatherstack data in local storage on load
    useEffect(() => {
        const localStorage_DP_weatherstack = localStorage.getItem('DP_weatherstack')
        // reading local storage for DP_weatherstack if empty initiating fetch
        if (localStorage_DP_weatherstack) {
            const weatherstackLocalData: IWeatherStackState = JSON.parse(localStorage_DP_weatherstack)
    
            // checking if saved weather data was fetched less than 2 hours ago if not inititating new fetch
            weatherstackLocalData.timestamp !== undefined && weatherstackLocalData.timestamp > Date.now() - 2 * 60 * 60 * 1000
                ? dispatch(saveWeatherDataToState(weatherstackLocalData))
                : dispatch(changeStatusToIdle())

        } else dispatch(changeStatusToIdle())

    },[])

    // fetching data for the current category
    useEffect (() => {
        // fetching data
        if(weatherstack.status === 'idle') {
            const fetchRequest = {
                API_URL: `${import.meta.env.VITE_APP_WEATHERSTACK_URL}&type=IP&query=fetch:ip`
            }

            // weatherstack data refetch indicator
            console.log('fetching weather data')

            dispatch(fetchWeatherstackData(fetchRequest))
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