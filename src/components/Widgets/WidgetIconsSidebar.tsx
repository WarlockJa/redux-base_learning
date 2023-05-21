import Icons from "../../assets/Icons"
import './widgeticonssidebar.css'
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCurrentToken, setWidgets } from "../../features/api/auth/authSlice";
import { IWidgetListWithData } from "./widgetsSlice";
import { useUpdateUserMutation } from "../../features/api/user/userApiSlice";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";

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
    // store
    const dispatch = useAppDispatch()
    const token = useAppSelector(selectCurrentToken)
    // update DB
    const [updateUser] = useUpdateUserMutation()
    // drag and drop pointers
    // const [dragNDrop, setDragNDrop] = useState<{ drag: number | undefined, drop: number | undefined }>({ drag: undefined, drop: undefined })

    // drag and drop methods
    // const dragStart = (position: number) => {
    //     // dragItem[position].current = position
    //     setDragNDrop({ ...dragNDrop, drag: position })
    //     // console.log(e.target.innerHTML)
    // }
    
    // const dragEnter = (position: number) => {
    //     // dragOverItem.current = position
    //     // dragItem[position].current = position
    //     setDragNDrop({ ...dragNDrop, drop: position })
    //     // console.log(e.target.innerHTML)
    // }

    // const dragDrop = async () => {
    //     if(dragNDrop.drag !== undefined && dragNDrop.drop !== undefined) {
    //         const newWidgetsList = widgetList.map(widget => widget.id)
    //         const dragItemContent = newWidgetsList[dragNDrop.drag]
    //         newWidgetsList.splice(dragNDrop.drag, 1)
    //         newWidgetsList.splice(dragNDrop.drop, 0, dragItemContent)
    //         setDragNDrop({ drag: undefined, drop: undefined })
            
    //         dispatch(setWidgets({ widgets: newWidgetsList }))

    //         // updating DB
    //         const result = await updateUser({ widgets: JSON.stringify(newWidgetsList) }).unwrap()
    //             if(result.status !== 200) console.log(result)
    //     }
    // }

    const handleDrop = async (droppedItem: DropResult) => {
        // Ignore drop outside droppable container
        if (!droppedItem.destination) return;
        const updatedList = widgetList.map(widget => widget.id)
        // Remove dragged item
        const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1)
        // Add dropped item
        updatedList.splice(droppedItem.destination.index, 0, reorderedItem)
        // Update State
        dispatch(setWidgets({ widgets: updatedList }))
        // updating DB
        const result = await updateUser({ widgets: JSON.stringify(updatedList) }).unwrap()
        if(result.status !== 200) console.log(result)
    }
    
    // const content = widgetList.map((widget, index) => <div
    //     key={index}
    //     className="widgetsSideBar__widgetWrapper"
    //     title={widget.title}
    //     onClick={() => handleWidgetIconClick(widget.id)}
    //     onDragStart={() => dragStart(index)}
    //     onDragEnter={() => dragEnter(index)}
    //     onDragEnd={() => dragDrop()}
    //     draggable
    // >
    //     {widget.icon}
    // </div>)

    return (
        <div className="widgetsSideBar" >
            {/* {content} */}

            <DragDropContext onDragEnd={handleDrop}>
                <Droppable droppableId="list-container">
                {(provided) => (
                    <div
                        className="list-container"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {widgetList.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided) => (
                                    <div
                                        className="item-container widgetsSideBar__widgetWrapper"
                                        title={item.title}
                                        onClick={() => handleWidgetIconClick(item.id)}
                                        ref={provided.innerRef}
                                        {...provided.dragHandleProps}
                                        {...provided.draggableProps}
                                    >
                                        {item.icon}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
                </Droppable>
            </DragDropContext>
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