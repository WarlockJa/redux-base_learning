import { ErrorBoundary } from "react-error-boundary"
import ErrorPlug from "../../util/ErrorPlug"
import WidgetIconsSidebar from "./WidgetIconsSidebar"
import { useAppSelector } from "../../app/hooks"
import { selectCurrentToken } from "../../features/api/auth/authSlice"
import Icons from "../../assets/Icons"
import Counter from "../../features/counter/Counter"
import Weatherstack from "../../features/weatherstack/Weatherstack"
import FreeCurrencyApi from "../../features/freeCurrencyApi/FreeCurrencyApi"

interface IWidgetList {
    id: string;
    showStatus: boolean;
}

export interface IWidgetListWithData extends IWidgetList {
    title: string;
    icon: JSX.Element;
    widget: JSX.Element;
    requiresRegistration: boolean;
}

const widgetList: IWidgetListWithData[] = [
    {
        id: 'reduxshowcase',
        title: 'Redux store showcase',
        icon: <Icons.ReduxLogo />,
        widget: <Counter />,
        requiresRegistration: false,
        showStatus: true
    },
    {
        id: 'weatherstack',
        title: 'Weather report',
        icon: <Icons.Weather />,
        widget: <Weatherstack />,
        requiresRegistration: true,
        showStatus: true
    },
    {
        id: 'freecurrencyapi',
        title: 'Currency exchange',
        icon: <Icons.Exchange />,
        widget: <FreeCurrencyApi />,
        requiresRegistration: true,
        showStatus: true
    },
]

const Home = () => {
    // user data from the store
    const token = useAppSelector(selectCurrentToken)
    // forming content for widget icons sidebar
    const filteredList = token ? [...widgetList] : widgetList.filter(widget => !widget.requiresRegistration)

    const content = filteredList.map((widget, index) => <ErrorBoundary key={index} FallbackComponent={ErrorPlug}>{widget.widget}</ErrorBoundary>)
    return (
        <>
            <WidgetIconsSidebar widgetList={filteredList} />
            {content}
        </>
    )
}

export default Home