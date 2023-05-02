import './compass.css'

const Compass = ({ angle }: { angle: number; }) => {
    return (
        <div className='compass'>
            <div className='compass--coverVertical compass--cover'></div>
            <div className='compass--coverHorizontal compass--cover'></div>
            <div className='compass--indicatorNorth compass--direction'>N</div>
            <div className='compass--indicatorEast compass--direction'>E</div>
            <div className='compass--indicatorWest compass--direction'>W</div>
            <div className='compass--indicatorSouth compass--direction'>S</div>
            <div className='compass__arrows'>
                <div className='compass__arrows--arrowNorth' style={{ transform: `rotateZ(${angle}deg) scaleY(0.9)` }}>
                    <div className='compass__arrows__arrowNorth--clip'></div>
                    <div className='compass__arrows__arrowNorth--pommel'></div>
                </div>
            </div>
        </div>
    )
}

export default Compass