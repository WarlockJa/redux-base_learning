import './weatherform.css'
import DayClear from '../../assets/images/weatherform/day_clear.jpg'
import DayCloudy from '../../assets/images/weatherform/day_clouds.jpg'
import { IWeatherStackState } from './weatherstackSlice'
import Compass from './Compass'

const WeatherForm = ({ weatherData }: { weatherData: IWeatherStackState }) => {
    return (
        <section className="weatherForm" style={{ backgroundImage: `url(${DayClear})` }}>
            <div className='weatherForm__header weatherForm__section'>
                <img className='weatherForm__header--weatherIcon' src={weatherData.current?.weather_icons[0]} alt="weather icon" />
                <p className='weatherForm__header--p'>{weatherData.current?.temperature}°C</p>
                <p className='weatherForm__header--p'>{weatherData.location?.name}</p>
            </div>
            <div className='weatherForm__body weatherForm__section'>
                <div className='weatherForm__body--windSection'>
                    <p>wind</p>
                    <p>{weatherData.current?.wind_speed} m/s</p>
                    {/* Make compass arrow */}
                    {weatherData.current?.wind_degree && <Compass angle={weatherData.current?.wind_degree} />}
                    {/* <p>{weatherData.current?.wind_dir}</p>
                    <p>{weatherData.current?.wind_degree}</p> */}
                </div>
                <div className='weatherForm__body--temperatureFeelsLike'>
                    <p>{weatherData.current?.feelslike}</p>
                </div>
                <div className='weatherForm__body--pressure'>
                    <p>{weatherData.current?.pressure}</p>
                </div>
                <div className='weatherForm__body--precipitation'>
                    <p>{weatherData.current?.precip}</p>
                </div>
                <div className='weatherForm__body--coverUV'>
                    <p>{weatherData.current?.cloudcover}</p>
                    <p>{weatherData.current?.uv_index}</p>
                    <p>{weatherData.current?.visibility}</p>
                </div>
            </div>
            <pre>{JSON.stringify(weatherData, null, 2)}</pre>
        </section>
    )
}

export default WeatherForm