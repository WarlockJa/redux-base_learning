import "./weatherstack.css";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    changeStatusToIdle,
    fetchWeatherstackData,
    selectWeatherStackData,
} from "./weatherstackSlice";
import Spinner from "../../util/Spinner";
import WeatherForm from "./WeatherForm";

const Weatherstack = () => {
    const dispatch = useAppDispatch();
    const weatherstack = useAppSelector(selectWeatherStackData);

    // on component reload
    // checking if 6 hours has pssed since last weatherstack data fetch
    useEffect(() => {
        if (
            weatherstack.timestamp === undefined ||
            weatherstack.timestamp + 6 * 60 * 60 * 1000 < Date.now()
        )
            dispatch(changeStatusToIdle());
    });

    // fetching weather data
    useEffect(() => {
        // fetching data
        if (weatherstack.status === "idle") {
            const fetchRequest = {
                API_URL: `${
                    import.meta.env.VITE_APP_WEATHERSTACK_URL
                }&type=IP&query=fetch:ip`,
            };

            // weatherstack data refetch indicator
            console.log("fetching weather data");

            dispatch(fetchWeatherstackData(fetchRequest));
        }
    }, [dispatch, weatherstack.status]);

    let content;
    if (weatherstack.status === "loading") {
        content = <Spinner embed={false} height="12em" width="100%" />;
    } else if (weatherstack.status === "failed") {
        content = <p>Error: {weatherstack.error}</p>;
    } else if (weatherstack.status === "succeeded") {
        content = <WeatherForm weatherData={weatherstack} />;
    }

    return (
        <section id="weatherstack" className="weatherstack widget">
            <h2>Weatherstack</h2>
            {content}
        </section>
    );
};

export default Weatherstack;
