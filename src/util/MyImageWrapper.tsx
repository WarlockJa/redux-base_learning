import { useEffect, useState } from "react";

export interface IMyImageWrapper {
    src: string;
    loadingComponent: JSX.Element;
    alt?: string;
    className?: string;
    onClick?: () => void;
}

const MyImageWrapper = ({ src, alt, className, loadingComponent, onClick }: IMyImageWrapper) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false)

    useEffect(() => {
        const image = new Image();
        image.onload = () => setIsImageLoaded(true);
        image.src = src;
    
        return () => {
            image.onload = null;
        };
    }, []);

    return isImageLoaded
        ? <img className={className} src={src} alt={alt} onClick={onClick} />
        : <div className='myImageWrapper'>
            <img className={className} src={src} alt={alt} onClick={onClick} />
            <div className="myImageWrapper__blurCover"></div>
            {loadingComponent}
        </div>
}

export default MyImageWrapper