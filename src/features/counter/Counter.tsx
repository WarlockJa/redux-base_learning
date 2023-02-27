import logo from '../../logo.svg'
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { increment, decrement, reset, incrementByAmount, incrementAsync } from "./counterSlice"

const Counter = () => {
    const count = useAppSelector((state) => state.counter.value)
    const dispatch = useAppDispatch()
    
    const amountChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(Number(e.target.value))
    
    const [value, setValue] = useState(0)
    return (
        <section className='counter'>
            <img src={logo} alt="redux logo" className='app-logo' />
            <div className="counter-controlSection">
                <button aria-label="increment the value" onClick={() => dispatch(increment())}>+</button>
                <p>{count}</p>
                <button aria-label="decrement the value" onClick={() => dispatch(decrement())}>-</button>
            </div>
            <div className="counter-controlSection flex-wide">
                <label htmlFor="addByAmount">Amount to add</label>
                <input type="number" id="addByAmount" value={value} onChange={(e) => amountChange(e)} />
                <button onClick={() => dispatch(incrementByAmount(value))}>Increment By Amount</button>
            </div>
            <button onClick={() => dispatch(reset())}>Reset</button>
            <button className='asyncButton' onClick={() => dispatch(incrementAsync(value))}>Async Increment</button>
        </section>
    )
}

export default Counter