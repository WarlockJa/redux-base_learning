import React from 'react'

const freeCurrencyApiForm = () => {
    return (
        <>
            <label htmlFor="freeCurrencyApi__mainCurrency">USD</label>
            <input
                id="freeCurrencyApi__mainCurrency"
                type="number"
                value={currencyList.USD}
                onChange={(e) => setCurrencyList(handleChange(e, 'USD'))}
            />
            <div className="freeCurrentApi__exchangeCurrencyWrapper">
                <label htmlFor="exchangeCurrencyWrapper__mainCurrency">TRY</label>
                <input id="exchangeCurrencyWrapper__mainCurrency" type="text" value={currencyList.TRY} onChange={(e) => setCurrencyList(handleChange(e, 'TRY'))}/>
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
    )
}

export default freeCurrencyApiForm