import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

// list of currencies based on the available free data from freeCurrencyApi
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

const useGetCurrencyOptions = () => {
    const [currencyOptions, setCurrencyOptions] = useState<JSX.Element[]>()
    const { t, i18n } = useTranslation(['freecurrencyapi'])

    useEffect(() => {
        // creating list of options based on available translations for the currencyNames with fallbak as EN
        setCurrencyOptions(Object.entries(currencyNames).map(item => <option key={item[0]} value={item[0]}>{t([item[0]])}</option>))
    },[i18n.language])
    
    return currencyOptions
}

export default useGetCurrencyOptions