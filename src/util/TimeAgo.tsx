import { formatDistanceToNow, parseISO } from "date-fns"

const TimeAgo = (timestamp: string) => {
    return (
        <span>{formatDistanceToNow(parseISO(timestamp))} ago</span>
    )
}

export default TimeAgo