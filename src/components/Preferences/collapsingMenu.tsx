import './preferences.css'
import { ReactComponent as OpenAddTodoIcon } from '../../assets/plus-circle.svg'
import { ReactComponent as CloseAddTodoIcon } from '../../assets/minus-circle.svg'
import { useLayoutEffect, useRef, useState } from "react"

interface ICollapsingMenuProps {
    defaultHeaderOffset: number;
    headerTitle: string;
    headerContent: string;
    formContent: JSX.Element;
    verticalOffset: number;
}

const collapsingMenu = ({ defaultHeaderOffset, headerTitle, headerContent, formContent, verticalOffset }: ICollapsingMenuProps) => {
    // menu section states
    const collapsingMenuItemRef = useRef<HTMLDivElement>(null)
    const [collapsingMenuItemState, setCollapsingMenuItemState] = useState(false)
    const [collapsingMenuItemMenuHeight, setCollapsingMenuItemMenuHeight] = useState(defaultHeaderOffset)

    // calculating current menu offset
    useLayoutEffect(() => {
        collapsingMenuItemState
            ? setCollapsingMenuItemMenuHeight(collapsingMenuItemRef.current!.children[0].clientHeight + defaultHeaderOffset)
            : setCollapsingMenuItemMenuHeight(defaultHeaderOffset)
    },[collapsingMenuItemState])

    const menuItem = 
        <div className="preferencesItem" style={{ transform: `translateY(${verticalOffset}px)`}}>
            <h3 className='preferencesItem--header' onClick={() => setCollapsingMenuItemState(prev => !prev)}>{headerContent} <span title={headerTitle}>
                    {collapsingMenuItemState
                        ? <CloseAddTodoIcon className='todos__button--addTodo svg-negative' />
                        : <OpenAddTodoIcon className='todos__button--addTodo svg-positive' />
                    }
                </span>
            </h3>
            <div className="preferencesItem--formWrapper" ref={collapsingMenuItemRef} visible={collapsingMenuItemState ? 1 : 0}>
                {formContent}
            </div>
        </div>
    
    const currentHeight = collapsingMenuItemMenuHeight

    return { menuItem, currentHeight }
}

export default collapsingMenu