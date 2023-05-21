import './counter.css'
import { useState } from "react"
import ReduxLogo from '../../assets/reduxlogo.svg'
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { increment, decrement, reset, incrementByAmount, incrementAsync } from "./counterSlice"
import { useTranslation } from 'react-i18next'

const Counter = () => {
    // store
    const count = useAppSelector((state) => state.counter.value)
    const dispatch = useAppDispatch()
    // i18next
    const { t } = useTranslation('reduxshowcase')
    
    const amountChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(Number(e.target.value))
    
    const [value, setValue] = useState(0)
    return (
        <section id='reduxshowcase' className='counter widget'>
            <h2>{t('title')}</h2>
            <img src={ReduxLogo} alt="redux logo" className='app-logo' />
            <div className="counter-controlSection">
                <button aria-label="increment the value" onClick={() => dispatch(increment())}>+</button>
                <p>{count}</p>
                <button aria-label="decrement the value" onClick={() => dispatch(decrement())}>-</button>
            </div>
            <div className="counter-controlSection flex-wide">
                <label htmlFor="addByAmount">{t('addvalue')}</label>
                <input type="number" id="addByAmount" value={value} onChange={(e) => amountChange(e)} />
                <button onClick={() => dispatch(incrementByAmount(value))}>{t('increment')}</button>
            </div>
            <button onClick={() => dispatch(reset())}>{t('reset')}</button>
            <button className='asyncButton' onClick={() => dispatch(incrementAsync(value))}>{t('async')}</button>
        </section>
    )
}

export default Counter 