import './spinner.css'
interface ISpinner {
    embed: boolean;
    width?: string;
    height?: string;
}

const Spinner = ({ embed, width, height }: ISpinner) => {
    return embed
        ? <Animation />
        : <section className='loading-placeholder' style={{ width: width, height: height }}>
            <Animation />
        </section>
}

const Animation = () => {
    return (
        <div className="spinner">
            <div className="spinner__block-cover"></div>
            <div className="spinner__pommel-top-left outer-pommel"></div>
            <div className="spinner__pommel-top-right outer-pommel"></div>
            <div className="spinner__pommel-left-left outer-pommel"></div>
            <div className="spinner__pommel-left-right outer-pommel"></div>
            <div className="spinner__pommel-bottom-left outer-pommel"></div>
            <div className="spinner__pommel-bottom-right outer-pommel"></div>
            <div className="spinner__pommel-right-left outer-pommel"></div>
            <div className="spinner__pommel-right-right outer-pommel"></div>

            <div className="spinner__inner-circle"></div>
        </div>
    )
}

export default Spinner