import React, { useEffect, useState } from 'react'
import { IFreeCurrencyApiData, IFreeCurrencyState, changeStatusToIdle, saveFreeCurrencyDataToState, selectFreeCurrencyStackData } from './freeCurrencyApiSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type IFreeCurrencyTransformResult = Record<string, number | string>

const currencyNames = {
    "AUD": 'Australian Dollar',
    "BGN": 'Bulgarian Lev',
    "BRL": 'Brazilian Real',
    "CAD": 'Canadian Dollar',
    "CHF": 'Swiss Franc',
    "CNY": 'Yuan Renminbi',
    "CZK": 'Czech Koruna',
    "DKK": 'Danish Krone',
    "EUR": 'Euro',
    "GBP": 'Pound Sterling',
    "HKD": 'Hong Kong Dollar',
    "HRK": 'Croatian Kuna',
    "HUF": 'Hungarian Forint',
    "IDR": 'Indonesian Rupiah',
    "ILS": 'New Israeli Sheqel',
    "INR": 'Indian Rupee',
    "ISK": 'Iceland Krona',
    "JPY": 'Japanese Yen',
    "KRW": 'South Korean Won',
    "MXN": 'Mexican Peso',
    "MYR": 'Malaysian Ringgit',
    "NOK": 'Norwegian Krone',
    "NZD": 'New Zealand Dollar',
    "PHP": 'Philippine Peso',
    "PLN": 'Polish Zloty',
    "RON": 'Romanian Leu',
    "RUB": 'Russian Ruble',
    "SEK": 'Swedish Krona',
    "SGD": 'Singapore Dollar',
    "THB": 'Thai Baht',
    "TRY": 'Turkish Lira',
    "USD": 'US Dollar',
    "ZAR": 'South African Rand',
}

// const currencyOptions = Object.entries(currencyNames).map(item => item[0] === 'USD' ? <option key={item[0]} value={item[0]} selected>{item[1]}</option> : <option key={item[0]} value={item[0]}>{item[1]}</option>)
const currencyOptions = Object.entries(currencyNames).map(item => <option key={item[0]} value={item[0]}>{item[1]}</option>)

// transforming api data into format used by graph component
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

const FreeCurrencyApiForm = () => {
    // store data
    // const dispatch = useAppDispatch()
    const freeCurrency = useAppSelector(selectFreeCurrencyStackData)
    // data used by graph
    const [currencyList, setCurrencyList] = useState<Record<string, number>>()//getLatestCurrencyData(freeCurrency.data))
    // initializing FreeCurrencyApiForm state data with data from store
    useEffect(() =>{
        console.log('test')
        const dateYesterday = new Date()
        dateYesterday.setDate(dateYesterday.getDate() - 1)
        const dateYesterdayString = dateYesterday.toLocaleDateString()
        setCurrencyList(freeCurrency.data![dateYesterdayString])

    },[])
    // data used by currency inputs
    const [firstCurrency, setFirstCurrency] = useState('USD')
    const [secondCurrency, setSecondCurrency] = useState('TRY')

    // // checking if currency data present in local storage. saving it to the store or initiating new fetch upon result
	// useEffect(() => {
	// 	const localStorage_DP_freeCurrency = localStorage.getItem('DP_freeCurrency')

    //     // reading local storage for DP_weatherstack if empty initiating fetch
    //     if (localStorage_DP_freeCurrency) {
    //         const freeCurrencyLocalData: IFreeCurrencyState = JSON.parse(localStorage_DP_freeCurrency)
            
    //         const dateToday = new Date().toLocaleDateString()
    //         const dateSaved = freeCurrencyLocalData.timestamp ? new Date(freeCurrencyLocalData.timestamp).toLocaleDateString() : 'error'
    //         const dateYesterday = new Date()
    //         dateYesterday.setDate(dateYesterday.getDate() - 1)
    //         const dateYesterdayString = dateYesterday.toLocaleDateString()

    //         // checking if saved weather data was fetched less than 6 hours ago if not inititating new fetch
    //         if (dateSaved !== dateToday || !freeCurrencyLocalData.data) {
    //             dispatch(changeStatusToIdle())
    //         } else {
	// 			dispatch(saveFreeCurrencyDataToState(freeCurrencyLocalData))
	// 			setCurrencyList(freeCurrencyLocalData.data[dateYesterdayString])
	// 		}

    //     } else dispatch(changeStatusToIdle())

	// }, [])

    // handling currency amount change 
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, currencyCode: string) => {

        const dateYesterday = new Date()
		dateYesterday.setDate(dateYesterday.getDate() - 1)

        let newCurrencyList = {...freeCurrency.data![dateYesterday.toLocaleDateString()]}
        const newValue = Number(event.target.value)

        if(!isNaN(newValue) && newValue > 0.0001 && currencyList) {
            Object.entries(currencyList).map((key) =>
                key[0] === currencyCode
                    ? newCurrencyList[key[0]] = newValue
                    : newCurrencyList[key[0]] = Number((key[1] / currencyList[currencyCode] * newValue).toFixed(4))
            )
        }

        return newCurrencyList
    }

    // preparing data for the graph
    const data = transformApiHistoricalDataToGraphFormat(freeCurrency.data)

    return (
        <div className='freeCurrencyApi__formWrapper'>
            <div className='formWrapper__inputsWrapper'>
                <h3 className='formWrapper__inputsWrapper--h3'>{firstCurrency} {'=>'} {secondCurrency}</h3>
                <div className='inputsWrapper__currency inputsWrapper__firstCurrency'>
                    <input
                        className='inputsWrapper__currency--input'
                        value={currencyList ? currencyList[firstCurrency] : 0}
                        onChange={(e) => setCurrencyList(handleChange(e, firstCurrency))}
                    />
                    <select
                        className='inputsWrapper__currency--select'
                        defaultValue={firstCurrency}
                        onChange={(e) => setFirstCurrency(e.target.value)}
                    >
                        {currencyOptions}
                    </select>
                </div>
                <div className='inputsWrapper__currency inputsWrapper__secondCurrency'>
                    <input
                        className='inputsWrapper__currency--input'
                        value={currencyList ? currencyList[secondCurrency] : 0}
                        onChange={(e) => setCurrencyList(handleChange(e, secondCurrency))}
                    />
                    <select
                        className='inputsWrapper__currency--select'
                        defaultValue={secondCurrency}
                        onChange={(e) => setSecondCurrency(e.target.value)}
                    >
                        {currencyOptions}
                    </select>
                </div>
            </div>
            <ResponsiveContainer
                width="100%"
                height={150}
            >
                <AreaChart
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
                        <Tooltip contentStyle={{ backgroundColor: '#444', fontSize: '0.8rem', textAlign: 'center', borderRadius: '4px' }} itemStyle={{ margin: 0 }} />
                        {/* TODO add green/red fill for growing/falling exchange rate */}
                        <Area type="monotone" dataKey={secondCurrency} stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default FreeCurrencyApiForm