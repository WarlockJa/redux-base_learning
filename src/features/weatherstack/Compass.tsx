import './compass.css'

const Compass = ({ angle }: { angle: number; }) => {
    return (
        <div className='compass'>
            <div className='compass__arrows'>
                <div className='compass__arrows--arrowNorth'>
                    <div className='compass__arrows__arrowNorth--clip'></div>
                </div>
                <div className='compass__arrows--arrowSouth'>
                    <div className='compass__arrows__arrowSouth--clip'></div>
                </div>
            </div>
        </div>
    )
}

export default Compass