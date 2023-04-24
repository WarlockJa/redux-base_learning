import axios from "axios";

export const getGeodata = async()=>{
    const res = await axios.get('https://geolocation-db.com/json/')
    return res
}

export default { getGeodata }