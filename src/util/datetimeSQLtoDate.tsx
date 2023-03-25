const datetimeSQLtoDate = (datetimeSQL: string) => {
    const date = datetimeSQL.replace(/[-]/g, '/')
    return new Date(Date.parse(date))
}

export default datetimeSQLtoDate