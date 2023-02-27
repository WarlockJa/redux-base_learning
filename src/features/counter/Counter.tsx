import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { increment, decrement, reset, incrementByAmount } from "./counterSlice"

const Counter = () => {
    const count = useAppSelector((state) => state.counter.value)
    const dispatch = useAppDispatch()
    
    const amountChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(Number(e.target.value))
    
    const [value, setValue] = useState(0)
    return (
        <section>
            <div className="changeByOne">
                <button aria-label="decrement the value" onClick={() => dispatch(decrement())}>-</button>
                <p>{count}</p>
                <button aria-label="increment the value" onClick={() => dispatch(increment())}>+</button>
            </div>
            <div className="changeByAmount">
                <label htmlFor="addByAmount">Amount to add</label>
                <input type="number" id="addByAmount" value={value} onChange={(e) => amountChange(e)} />
                <button onClick={() => dispatch(incrementByAmount(value))}>Increment By Amount</button>
            </div>
            <button onClick={() => dispatch(reset())}>Reset</button>
        </section>
    )
}

export default Counter