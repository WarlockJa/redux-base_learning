import transformApiHistoricalDataToGraphFormat from "../../../features/freeCurrencyApi/transformApiHistoricalDataToGraphFormat"

const inputData = {
    "date1": {
        "baseCurrency": 1,      // base currency value. Always 1
        "testCurrency1": 2,     // currency ratio i.e. 2 testCurrency1 for 1 baseCurrency
        "testCurrency2": 4
    },
    "date2": {
        "baseCurrency": 1,
        "testCurrency1": 4,
        "testCurrency2": 2
    },
    "date3": {
        "baseCurrency": 1,
        "testCurrency1": 0.5,
        "testCurrency2": 0.2
    },
}

test('Conversion using base currency', () => {
    expect(transformApiHistoricalDataToGraphFormat(inputData, 'baseCurrency')).toStrictEqual([
        {
            "baseCurrency": 1,
            "testCurrency1": 2,
            "testCurrency2": 4,
            name: "date1"
        },
        {
            "baseCurrency": 1,
            "testCurrency1": 4,
            "testCurrency2": 2,
            name: "date2"
        },
        {
            "baseCurrency": 1,
            "testCurrency1": 0.5,
            "testCurrency2": 0.2,
            name: "date3"
        },
    ])
})

test('Conversion using non-base currency', () => {
    expect(transformApiHistoricalDataToGraphFormat(inputData, 'testCurrency1')).toStrictEqual([
        {
            "baseCurrency": 0.5,
            "testCurrency1": 1,
            "testCurrency2": 2,
            name: "date1"
        },
        {
            "baseCurrency": 0.25,
            "testCurrency1": 1,
            "testCurrency2": 0.5,
            name: "date2"
        },
        {
            "baseCurrency": 2,
            "testCurrency1": 1,
            "testCurrency2": 0.4,
            name: "date3"
        },
    ])
})