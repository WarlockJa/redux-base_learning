import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { IFreeCurrencyApiData, IFreeCurrencyState, changeStatusToIdle, fetchFreeCurrencyData, saveFreeCurrencyDataToState, selectFreeCurrencyStackData } from "./freeCurrencyApiSlice"
import Spinner from "../../util/Spinner"

// type CurrencyCodeType = "AUD" | "BGN" | "BRL" | "CAD" | "CHF" | "CNY" | "CZK" | "DKK" | "EUR" | "GBP" | "HKD" | "HRK" | "HUF" | "IDR" | "ILS" | "INR" | "ISK" | "JPY" | "KRW" | "MXN" | "MYR" | "NOK" | "NZD" | "PHP" | "PLN" | "RON" | "RUB" | "SEK" | "SGD" | "THB" | "TRY" | "USD" | "ZAR"
// type IAPI_CurrencyList = Record<string, Record<string, number>>
type IFreeCurrencyTransformResult = Record<string, number | string>

const transformApiHistoricalDataToGraphFormat = (historicalData: IFreeCurrencyApiData | undefined) => {
    if (historicalData) {
        const result: IFreeCurrencyTransformResult[] = Object.entries(historicalData).map((key) => {
            const newObj: IFreeCurrencyTransformResult = { ...key[1] }
            
            Object.entries(newObj).map((key) =>
                newObj[key[0]] = Number((1 / Number(key[1])).toFixed(6))
            )
            
            newObj["name"] = key[0]
    
            return newObj
        })
    
        return result
    } else return undefined
}

// const data = [
//   {
//     name: 'Page A',
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: 'Page B',
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: 'Page C',
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: 'Page D',
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: 'Page E',
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: 'Page F',
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: 'Page G',
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];

const FreeCurrencyApi = () => {
	const dispatch = useAppDispatch()
	const freeCurrency = useAppSelector(selectFreeCurrencyStackData)
    const [currencyList, setCurrencyList] = useState<Record<string, number>>()

	// checking if currency data present in local storage. saving it to the store or initiating new fetch upon result
	useEffect(() => {
		const localStorage_DP_freeCurrency = localStorage.getItem('DP_freeCurrency')

		// const dateYesterday = new Date()
		// dateYesterday.setDate(dateYesterday.getDate() - 1)
		// const dateMonthAgo = new Date()
		// dateMonthAgo.setDate(dateMonthAgo.getDate() - 31)
		// console.log(dateYesterday.toLocaleDateString())
		// console.log(dateMonthAgo.toLocaleDateString())

		// console.log(new Date(freeCurrency.timestamp).toLocaleDateString())

        // reading local storage for DP_weatherstack if empty initiating fetch
        if (localStorage_DP_freeCurrency) {
            const freeCurrencyLocalData: IFreeCurrencyState = JSON.parse(localStorage_DP_freeCurrency)
            
            // console.log(((weatherstackLocalData.timestamp + 6 * 60 * 60 * 1000) - Date.now()) / (1000 * 60 * 60))
			// if(new Date(freeCurrencyLocalData.timestamp).toLocaleDateString() !== new Date().toLocaleDateString()) {
			// 	console.log('Feck')
			// } else {
			// 	console.log('Yep')
			// }
    
            const dateToday = new Date().toLocaleDateString()
            const dateSaved = freeCurrencyLocalData.timestamp ? new Date(freeCurrencyLocalData.timestamp).toLocaleDateString() : 'error'
            const dateYesterday = new Date()
            dateYesterday.setDate(dateYesterday.getDate() - 1)
            const dateYesterdayString = dateYesterday.toLocaleDateString()
            // checking if saved weather data was fetched less than 6 hours ago if not inititating new fetch
            if (dateSaved !== dateToday || !freeCurrencyLocalData.data) {
                dispatch(changeStatusToIdle())
            } else {
				dispatch(saveFreeCurrencyDataToState(freeCurrencyLocalData))
				setCurrencyList(freeCurrencyLocalData.data[dateYesterdayString])
			}

        } else dispatch(changeStatusToIdle())

	}, [])

	// processing store freeCurrency status change
	useEffect (() => {
		// fetching data
        if(freeCurrency.status === 'idle') {
			// getting dates range for fetch request
			const dateYesterday = new Date()
			dateYesterday.setDate(dateYesterday.getDate() - 1)
			const dateMonthAgo = new Date()
			dateMonthAgo.setDate(dateMonthAgo.getDate() - 31)

            const fetchRequest = {
                API_URL: `${import.meta.env.VITE_APP_FREECURRENCYAPI_URL}?date_from=${dateYesterday.toLocaleDateString()}&date_to=${dateMonthAgo.toLocaleDateString()}`,
				apikey: import.meta.env.VITE_APP_FREECURRENCYAPI_KEY
            }

            // freeCurrencyApi data refetch indicator
            console.log('fetching freeCurrency data')

            dispatch(fetchFreeCurrencyData(fetchRequest))
        }
	}, [dispatch, freeCurrency.status])

	// handling currency amount change 
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, currencyCode: string) => {

        const dateYesterday = new Date()
		dateYesterday.setDate(dateYesterday.getDate() - 1)

        let newCurrencyList = {...freeCurrency.data![dateYesterday.toLocaleDateString()]}
        const newValue = Number(event.target.value)

        if(!isNaN(newValue) && currencyList) {
            Object.entries(currencyList).map((key) =>
                key[0] === currencyCode
                    ? newCurrencyList[key[0]] = newValue
                    : newCurrencyList[key[0]] = Number((key[1] / currencyList[currencyCode] * newValue).toFixed(4))
            )
        }

        return newCurrencyList
    }

    // transformApiHistoricalDataToGraphFormat(HISTORICAL_DATA)
    const data = transformApiHistoricalDataToGraphFormat(freeCurrency.data)

    let content
    if(freeCurrency.status === 'loading'){
        content = <Spinner embed={false} height='12em' width="100%" />
    } else if (freeCurrency.status === 'failed') {
        content = <p>Error: {freeCurrency.error}</p>
    } else if (freeCurrency.status === 'succeeded') {
        content = <>
            <label htmlFor="freeCurrencyApi__mainCurrency">USD</label>
            <input
                id="freeCurrencyApi__mainCurrency"
                type="number"
                value={currencyList ? currencyList.USD : 0}
                onChange={(e) => setCurrencyList(handleChange(e, 'USD'))}
            />
            <div className="freeCurrentApi__exchangeCurrencyWrapper">
                <label htmlFor="exchangeCurrencyWrapper__mainCurrency">TRY</label>
                <input id="exchangeCurrencyWrapper__mainCurrency" type="text" value={currencyList ? currencyList.TRY : 0} onChange={(e) => setCurrencyList(handleChange(e, 'TRY'))}/>
            </div>
            {data && <AreaChart
                width={500}
                height={200}
                data={data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={['dataMin', 'dataMax']} />
                    <Tooltip />
                    <Area type="monotone" dataKey="TRY" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>}
        </>
    }

    return (
        <section className="freeCurrencyApi">
            <h2>Currency Exchange</h2>
            {content}
        </section>
    )
}

export default FreeCurrencyApi