import "./spinner.css";
interface ISpinner {
  embed: boolean;
  width?: string;
  height?: string;
  small?: boolean;
}

const Spinner = ({ embed, width, height, small }: ISpinner) => {
  return embed ? (
    <Animation small={small} />
  ) : (
    <section
      className="loading-placeholder"
      style={{ width: width, height: height }}
    >
      <Animation small={small} />
    </section>
  );
};

const Animation = ({ small }: { small: boolean | undefined }) => {
  return (
    <div className={small ? "lds-spinner lds-spinner-small" : "lds-spinner"}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    // <div className="spinner">
    //     <div className="spinner__block-cover"></div>
    //     <div className="spinner__pommel-top-left outer-pommel"></div>
    //     <div className="spinner__pommel-top-right outer-pommel"></div>
    //     <div className="spinner__pommel-left-left outer-pommel"></div>
    //     <div className="spinner__pommel-left-right outer-pommel"></div>
    //     <div className="spinner__pommel-bottom-left outer-pommel"></div>
    //     <div className="spinner__pommel-bottom-right outer-pommel"></div>
    //     <div className="spinner__pommel-right-left outer-pommel"></div>
    //     <div className="spinner__pommel-right-right outer-pommel"></div>

    //     <div className="spinner__inner-circle"></div>
    // </div>
  );
};

export default Spinner;
