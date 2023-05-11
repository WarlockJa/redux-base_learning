import './weatherform.css'
import DayClear from '../../assets/images/weatherform/day_clear.jpg'                                // 1
import DayCloudy from '../../assets/images/weatherform/day_clouds.jpg'                              // 1
import DayPartiallyCloudy from '../../assets/images/weatherform/day_partiallyclouds.jpg'            // 2
import DayRainy from '../../assets/images/weatherform/day_rain.jpg'                                 // 1
import DayThunderstorm from '../../assets/images/weatherform/day_thrunderstorm.jpg'                 // 2
import DaySnow from '../../assets/images/weatherform/day_snow.jpg'                                  // 2

import TwilightClear from '../../assets/images/weatherform/twilight_clear.jpg'                      // 2
import TwilightCloudy from '../../assets/images/weatherform/twilight_clouds.jpg'                    // 2
import TwilightPartiallyCloudy from '../../assets/images/weatherform/twilight_partiallyclouds.jpg'  // 2
import TwilightRainy from '../../assets/images/weatherform/twilight_rain.jpeg'                      // 2
import TwilightThunderstorm from '../../assets/images/weatherform/twilight_thunderstorm.jpg'        // 1
import TwilightSnow from '../../assets/images/weatherform/twilight_snow.jpg'                        // 1

import NightClear from '../../assets/images/weatherform/night_clear.jpg'                            // 1
import NightCloudy from '../../assets/images/weatherform/night_clouds.jpg'                          // 1
import NightPartiallyCloudy from '../../assets/images/weatherform/night_partiallyclouds.jpg'        // 1
import NightRainy from '../../assets/images/weatherform/night_rain.jpg'                             // 1
import NightThunderstorm from '../../assets/images/weatherform/night_thunderstorm.jpg'              // 1
import NightSnow from '../../assets/images/weatherform/night_snow.jpg'                              // 1

import { IWeatherStackState } from './weatherstackSlice'
import Compass from './Compass'

const weatherType = ({ weatherCode }: { weatherCode: number }) => {
    const timeOfTheDay = new Date().getHours()
    // return { bgImage: DayPartiallyCloudy, fontStyle: 2 }
    // weather code is an API code for weather types
    // night time
    if (timeOfTheDay > 20 && timeOfTheDay < 6) {
        return  weatherCode === 116 ? { bgImage: NightPartiallyCloudy, fontStyle: 1 }
        : weatherCode === 119 || weatherCode === 122 || weatherCode === 143 || weatherCode === 248 || weatherCode === 260 ? { bgImage: NightCloudy, fontStyle: 1 }
        : weatherCode === 200 || weatherCode === 386 || weatherCode === 389 || weatherCode === 392 || weatherCode === 395 ? { bgImage: NightThunderstorm, fontStyle: 1 }
        : weatherCode === 176 || weatherCode === 185 || weatherCode === 263 || weatherCode === 266 || weatherCode === 281 || weatherCode === 293 || weatherCode === 299 || weatherCode === 302 || weatherCode === 284 || weatherCode === 296 || weatherCode === 305 || weatherCode === 308 || weatherCode === 311 || weatherCode === 314 || weatherCode === 353 || weatherCode === 359 ? { bgImage: NightRainy, fontStyle: 1 }
        : weatherCode === 179 || weatherCode === 182 || weatherCode === 227 || weatherCode === 230 || weatherCode === 317 || weatherCode === 320 || weatherCode === 323 || weatherCode === 326 || weatherCode === 329 || weatherCode === 332 || weatherCode === 335 || weatherCode === 338 || weatherCode === 350 || weatherCode === 356 || weatherCode === 362 || weatherCode === 365 || weatherCode === 368 || weatherCode === 371 || weatherCode === 374 || weatherCode === 377 ? { bgImage: NightSnow, fontStyle: 1 }
        : { bgImage: NightClear, fontStyle: 1 }
    }
    // day time
    else if (timeOfTheDay > 9 && timeOfTheDay < 17) {
        return  weatherCode === 116 ? { bgImage: DayPartiallyCloudy, fontStyle: 2 }
                : weatherCode === 119 || weatherCode === 122 || weatherCode === 143 || weatherCode === 248 || weatherCode === 260 ? { bgImage: DayCloudy, fontStyle: 1 }
                    : weatherCode === 200 || weatherCode === 386 || weatherCode === 389 || weatherCode === 392 || weatherCode === 395 ? { bgImage: DayThunderstorm, fontStyle: 2 }
                        : weatherCode === 176 || weatherCode === 185 || weatherCode === 263 || weatherCode === 266 || weatherCode === 281 || weatherCode === 293 || weatherCode === 299 || weatherCode === 302 || weatherCode === 284 || weatherCode === 296 || weatherCode === 305 || weatherCode === 308 || weatherCode === 311 || weatherCode === 314 || weatherCode === 353 || weatherCode === 359 ? { bgImage: DayRainy, fontStyle: 1 }
                            : weatherCode === 179 || weatherCode === 182 || weatherCode === 227 || weatherCode === 230 || weatherCode === 317 || weatherCode === 320 || weatherCode === 323 || weatherCode === 326 || weatherCode === 329 || weatherCode === 332 || weatherCode === 335 || weatherCode === 338 || weatherCode === 350 || weatherCode === 356 || weatherCode === 362 || weatherCode === 365 || weatherCode === 368 || weatherCode === 371 || weatherCode === 374 || weatherCode === 377 ? { bgImage: DaySnow, fontStyle: 2 }
                            : { bgImage: DayClear, fontStyle: 1 }
    }
    // twilight
    else {
        return  weatherCode === 116 ? { bgImage: TwilightPartiallyCloudy, fontStyle: 2 }
                : weatherCode === 119 || weatherCode === 122 || weatherCode === 143 || weatherCode === 248 || weatherCode === 260 ? { bgImage: TwilightCloudy, fontStyle: 2 }
                    : weatherCode === 200 || weatherCode === 386 || weatherCode === 389 || weatherCode === 392 || weatherCode === 395 ? { bgImage: TwilightThunderstorm, fontStyle: 1 }
                        : weatherCode === 176 || weatherCode === 185 || weatherCode === 263 || weatherCode === 266 || weatherCode === 281 || weatherCode === 293 || weatherCode === 299 || weatherCode === 302 || weatherCode === 284 || weatherCode === 296 || weatherCode === 305 || weatherCode === 308 || weatherCode === 311 || weatherCode === 314 || weatherCode === 353 || weatherCode === 359 ? { bgImage: TwilightRainy, fontStyle: 1 }
                            : weatherCode === 179 || weatherCode === 182 || weatherCode === 227 || weatherCode === 230 || weatherCode === 317 || weatherCode === 320 || weatherCode === 323 || weatherCode === 326 || weatherCode === 329 || weatherCode === 332 || weatherCode === 335 || weatherCode === 338 || weatherCode === 350 || weatherCode === 356 || weatherCode === 362 || weatherCode === 365 || weatherCode === 368 || weatherCode === 371 || weatherCode === 374 || weatherCode === 377 ? { bgImage: TwilightSnow, fontStyle: 2 }
                            : { bgImage: TwilightClear, fontStyle: 2 }
    }
}

const WeatherForm = ({ weatherData }: { weatherData: IWeatherStackState }) => {
    const { bgImage, fontStyle } = weatherType({ weatherCode: weatherData.current?.weather_code ? weatherData.current?.weather_code : 0 })
    const weatherFormFontColor = fontStyle === 2 ? 'var(--clr-bg-main)' : ''
    const weatherFormBgColor = fontStyle === 2 ? 'var(--clr-bg-weatherForm-light)' : ''

    return (
        <section className="weatherForm" style={{ backgroundImage: `url(${bgImage})`, color: weatherFormFontColor}}>
            <div className='weatherForm__header weatherForm__section' style={{ backgroundColor: weatherFormBgColor }}>
                <img className='weatherForm__header--weatherIcon' src={weatherData.current?.weather_icons[0]} alt="weather icon" />
                <p className='weatherForm__header--p'>{weatherData.current?.temperature}°C</p>
                <p className='weatherForm__header--p'>{weatherData.location?.name}</p>
            </div>
            <div className='weatherForm__body weatherForm__section' style={{ backgroundColor: weatherFormBgColor }}>
                <div className='weatherForm__body--item'>
                    <p>Wind</p>
                    <p>{weatherData.current?.wind_speed}m/s</p>
                    {weatherData.current?.wind_degree && <Compass angle={weatherData.current?.wind_degree} />}
                </div>
                <div className='weatherForm__body--item'>
                    <p>Feels like</p>
                    <p>{weatherData.current?.feelslike}°C</p>
                </div>
                <div className='weatherForm__body--item'>
                    <p>Pressure</p>
                    <p>{weatherData.current?.pressure}mb</p>
                </div>
                <div className='weatherForm__body--item'>
                    <p>Precipitation</p>
                    <p>{weatherData.current?.precip}%</p>
                </div>
                <div className='weatherForm__body--item'>
                    <p>Cloud cover</p>
                    <p>{weatherData.current?.cloudcover}%</p>
                </div>
                <div className='weatherForm__body--item'>
                    <p>UV</p>
                    <p>{weatherData.current?.uv_index}</p>
                </div>
            </div>
            {/* <pre>{JSON.stringify(weatherData, null, 2)}</pre> */}
        </section>
    )
}

export default WeatherForm