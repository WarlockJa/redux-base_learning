import { formatDistanceToNow, parseISO } from "date-fns"

const TimeAgo = (timestamp: string) => {
    return (
        <span>{timestamp}</span> //formatDistanceToNow
    )
}

export default TimeAgo