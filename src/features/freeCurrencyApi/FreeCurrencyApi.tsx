import './freecurrencyapi.css'
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { IFreeCurrencyState, changeStatusToIdle, fetchFreeCurrencyData, saveFreeCurrencyDataToState, selectFreeCurrency } from "./freeCurrencyApiSlice"
import Spinner from "../../util/Spinner"
import FreeCurrencyApiForm from "./FreeCurrencyApiForm"

const FreeCurrencyApi = () => {
    // store data
	const dispatch = useAppDispatch()
	const { status, error, data } = useAppSelector(selectFreeCurrency)

    // checking if currency data present in local storage. saving it to the store or initiating new fetch upon result
	useEffect(() => {
		const localStorage_DP_freeCurrency = localStorage.getItem('DP_freeCurrency')

        // reading local storage for DP_weatherstack if empty initiating fetch
        if (localStorage_DP_freeCurrency) {
            const freeCurrencyLocalData: IFreeCurrencyState = JSON.parse(localStorage_DP_freeCurrency)
            
            const dateToday = new Date().toLocaleDateString()
            const dateSaved = freeCurrencyLocalData.timestamp ? new Date(freeCurrencyLocalData.timestamp).toLocaleDateString() : 'error'

            // checking if saved weather data was fetched less than 6 hours ago if not inititating new fetch
            if (dateSaved !== dateToday || !freeCurrencyLocalData.data) {
                dispatch(changeStatusToIdle())
            } else {
				dispatch(saveFreeCurrencyDataToState(freeCurrencyLocalData))
				// setCurrencyList(freeCurrencyLocalData.data[dateYesterdayString])
			}

        } else dispatch(changeStatusToIdle())

	}, [])

	// processing store freeCurrency status change, fetching new data
	useEffect (() => {
		// fetching data
        if(status === 'idle') {
			// getting dates range for fetch request
			const dateYesterday = new Date()
			dateYesterday.setDate(dateYesterday.getDate() - 1)
			const dateMonthAgo = new Date()
			dateMonthAgo.setDate(dateMonthAgo.getDate() - 31)

            const fetchRequest = {
                API_URL: `${import.meta.env.VITE_APP_FREECURRENCYAPI_URL}?date_from=${dateMonthAgo.toLocaleDateString()}&date_to=${dateYesterday.toLocaleDateString()}`,
				apikey: import.meta.env.VITE_APP_FREECURRENCYAPI_KEY
            }

            // freeCurrencyApi data refetch indicator
            console.log('fetching freeCurrency data')

            dispatch(fetchFreeCurrencyData(fetchRequest))
        }
	}, [dispatch, status])

    // assembling content for the component
    let content
    if(status === 'loading'){
        content = <Spinner embed={false} height='12em' width="100%" />
    } else if (status === 'failed') {
        content = <p>Error: {error}</p>
    } else if (status === 'succeeded') {
        content = data ? <FreeCurrencyApiForm data={data} /> : <p>No data found</p>
    }

    return (
        <section id='freecurrencyapi' className="freeCurrencyApi">
            <h2>Currency Exchange</h2>
            {content}
        </section>
    )
}

export default FreeCurrencyApi