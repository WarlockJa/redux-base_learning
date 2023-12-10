import { useTranslation } from "react-i18next";
import "./myimagewrapper.css";
import { useEffect, useState } from "react";

export interface IMyImageWrapper {
  src: string;
  loadingComponent: JSX.Element;
  loadingBgImg?: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
}

const MyImageWrapper = ({
  src,
  alt,
  className,
  loadingComponent,
  loadingBgImg,
  onClick,
}: IMyImageWrapper) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const image = new Image();
    image.onload = () => setIsImageLoaded(true);
    image.src = src;

    return () => {
      image.onload = null;
    };
  }, []);

  return isImageLoaded ? (
    <>
      <img
        className={className}
        src={src}
        alt={alt}
        onClick={onClick}
        title={alt === "large" ? t("title_close")! : t("title_open")!}
      />
    </>
  ) : loadingBgImg ? (
    <div className="myImageWrapper">
      <img
        className={className}
        src={loadingBgImg}
        alt={alt}
        onClick={onClick}
      />
      <div className="myImageWrapper__blurCover"></div>
      {loadingComponent}
    </div>
  ) : (
    <div className="myImageWrapper">
      <img className={className} src={src} alt={alt} onClick={onClick} />
      <div className="myImageWrapper__blurCover"></div>
      {loadingComponent}
    </div>
  );
};

export default MyImageWrapper;
