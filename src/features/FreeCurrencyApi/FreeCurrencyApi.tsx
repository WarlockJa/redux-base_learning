import { useState } from "react"

const API_CURRENCY = {
    "AUD": 1.474587,
    "BGN": 1.780507,
    "BRL": 4.944405,
    "CAD": 1.337287,
    "CHF": 0.889341,
    "CNY": 6.93331,
    "CZK": 21.36103,
    "DKK": 6.77951,
    "EUR": 0.910441,
    "GBP": 0.792018,
    "HKD": 7.83229,
    "HRK": 6.859718,
    "HUF": 336.590361,
    "IDR": 14698.020149,
    "ILS": 3.647784,
    "INR": 81.920257,
    "ISK": 136.470185,
    "JPY": 134.092184,
    "KRW": 1318.402578,
    "MXN": 17.552221,
    "MYR": 4.449507,
    "NOK": 10.501511,
    "NZD": 1.569747,
    "PHP": 55.640096,
    "PLN": 4.114008,
    "RON": 4.484014,
    "RUB": 77.700095,
    "SEK": 10.218669,
    "SGD": 1.324602,
    "THB": 33.640058,
    "TRY": 19.544722,
    "USD": 1,
    "ZAR": 18.863437
}

const FreeCurrencyApi = () => {
    const [currencyList, setCurrencyList] = useState(API_CURRENCY)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(Object.entries(currencyList))

        return event.target.value
    }

    return (
        <section className="freeCurrencyApi">
            <label htmlFor="freeCurrencyApi__mainCurrency">USD</label>
            <input id="freeCurrencyApi__mainCurrency" type="text" defaultValue={currencyList.USD} onChange={(e) => handleChange(e)}/>
            <div className="freeCurrentApi__exchangeCurrencyWrapper">
                <label htmlFor="exchangeCurrencyWrapper__mainCurrency">TRY</label>
                <input id="exchangeCurrencyWrapper__mainCurrency" type="text" defaultValue={currencyList.TRY} onChange={(e) => handleChange(e)}/>
            </div>
        </section>
    )
}

export default FreeCurrencyApi