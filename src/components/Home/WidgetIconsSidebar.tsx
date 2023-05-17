import Icons from "../../assets/Icons"
import './widgeticonssidebar.css'
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentToken } from "../../features/api/auth/authSlice";
import { IWidgetListWithData } from "./Home";

// takes id of the element and scrolls it into view
// necessary for the dynamic widget list
const handleWidgetIconClick = (id: string) => {
    const element = document.getElementById(id);
        if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

const WidgetIconsSidebar = ({ widgetList }: { widgetList: IWidgetListWithData[] }) => {
    // router hook
    const navigate = useNavigate()
    const token = useAppSelector(selectCurrentToken)
    
    const content = widgetList.map((widget, index) => <div
        key={index}
        className="widgetsSideBar__widgetWrapper"
        title={widget.title}
        onClick={() => handleWidgetIconClick(widget.id)}
    >
        {widget.icon}
    </div>)

    return (
        <div className="widgetsSideBar">
            {content}
            <div
                title="Modify widgets list"
                className={token ? "widgetsSideBar__widgetWrapper widgetsSideBar__widgetWrapper--preferencesLink" : "widgetsSideBar__widgetWrapper widgetsSideBar__widgetWrapper--preferencesLink widgetsSideBar__widgetWrapper--disabled"}
                onClick={() => navigate('preferences')}
            >
                <Icons.Plus />
            </div>
        </div>
    )
}

export default WidgetIconsSidebar