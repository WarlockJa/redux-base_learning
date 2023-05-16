import { useEffect, useState } from 'react'

const useGetYesterdayDate = (dayToday: number) => {
    const [yesterday, setYesterday] = useState<string>('')
    
    useEffect(() => {
        const dateYesterday = new Date()
        dateYesterday.setDate(dateYesterday.getDate() - 1)
        const dateYesterdayString = dateYesterday.toLocaleDateString()
        setYesterday(dateYesterdayString)
    }, [dayToday])

    return { yesterday }
}

export default useGetYesterdayDate