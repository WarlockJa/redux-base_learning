import { IFreeCurrencyApiData } from "./freeCurrencyApiSlice"

type IFreeCurrencyTransformResult = Record<string, number | string>

// transforming api data into array used by graph
// correct performance tested at transformApiHistoricalDataToGraphFormat.test.ts
const transformApiHistoricalDataToGraphFormat = (historicalData: IFreeCurrencyApiData | undefined, baseCurrency: string) => {
    // checking if historical data exists
    if (historicalData && baseCurrency) {
        // parsing through historical data object { "date":{ currencies }, "date+1":{ currencies } }
        // and adding field ' name: "date" ' inside currencies for graph to display
        const result: IFreeCurrencyTransformResult[] = Object.entries(historicalData).map((keyData) => {
            // creating resulting object for a date inside historical data
            const newObj: IFreeCurrencyTransformResult = { ...keyData[1] }
            
            // calculating graph data relative to provided base currency
            Object.entries(newObj).map((keyCurrency) =>
                newObj[keyCurrency[0]] = Number((Number(keyCurrency[1]) / Number(keyData[1][baseCurrency])).toFixed(6))
            )
            
            // adding object's key as a value for graph axes to display
            newObj["name"] = keyData[0]
    
            return newObj
        })

        return result
    } else return undefined
}

export default transformApiHistoricalDataToGraphFormat