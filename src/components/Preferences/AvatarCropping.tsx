import { useEffect, useRef, useState } from "react";
import "./avatarcropping.css";
import ReactCrop, { Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import imageCompression from "browser-image-compression";
import Spinner from "../../util/Spinner";
import { useTranslation } from "react-i18next";

// compressing image blob
const handleImageCompression = async (
  imageFile: Blob
): Promise<string | undefined> => {
  const options = {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 180,
  };

  try {
    // while Blob lacks several attributes of a File
    // it is incosequential for image compression and therefore can be ignored
    const fileAsBlob = imageFile as File;
    const compressedFile = await imageCompression(fileAsBlob, options);

    // convert compressed image blob to base64 string
    const base64Image = await imageCompression.getDataUrlFromFile(
      compressedFile
    );

    return base64Image;
  } catch (error) {
    console.log(error);
  }
};

// creates Blob image based on the original image and the crop data
function getCroppedImg(
  image: HTMLImageElement,
  pixelCrop: Crop,
  fileName: string
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // scale factor of the original image resolution to the image on the screen
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // devicePixelRatio slightly increases sharpness on retina devices
  // at the expense of slightly slower render times and needing to
  // size the image back down if you want to download/upload and be
  // true to the images natural size.
  const pixelRatio = window.devicePixelRatio;

  // canvas dimensions
  canvas.width = Math.floor(pixelCrop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(pixelCrop.height * scaleY * pixelRatio);

  // setting the ctx scale
  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  // getting crop data for the actual image reolsution
  const cropX = pixelCrop.x * scaleX;
  const cropY = pixelCrop.y * scaleY;

  // calculating image center
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // 3) Rotate around the origin
  // ctx.rotate(rotateRads)
  // 2) Scale the image
  // ctx.scale(scale, scale)
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);

  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();

  // As Base64 string
  // const base64Image = canvas.toDataURL('image/jpeg');
  // console.log(base64Image)

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) {
        // file.name = fileName;
        resolve(file);
      }
    }, "image/jpeg");
  });
}

// forming http string from image blob
// it is dynamically cleared to prevent memory leaks
let imageToHttpBlob: string;

// crop the image interface with compression
// imports Blob file and methods on cancel edit and accept cropped image
const AvatarCropping = ({
  imageFile,
  cancelEdit,
  acceptEdit,
}: {
  imageFile: File;
  cancelEdit: () => void;
  acceptEdit: (avatar: string) => void;
}) => {
  const { t } = useTranslation();
  // crop state
  const [crop, setCrop] = useState<Crop>();
  // crop ref
  const cropRef = useRef<any>(null);
  // flag for the initial crop window
  const [loadFlag, setLoadFlag] = useState(true);
  // loading flag for avatar cropping process
  const [avatarIsCropping, setAvatarIsCropping] = useState(false);

  // checking if URL for blob object already exist and clear it if so
  if (imageToHttpBlob) URL.revokeObjectURL(imageToHttpBlob);
  imageToHttpBlob = URL.createObjectURL(imageFile);

  // processing new avatar and saving result
  const handleAccept = async () => {
    if (crop && cropRef.current) {
      setAvatarIsCropping(true);
      // acceptEdit(crop)
      const croppedImg = await getCroppedImg(
        cropRef.current.mediaRef.current.firstChild,
        crop,
        "croppedimage.jpg"
      );
      // console.dir(cropRef.current.mediaRef.current.firstChild)
      // console.log(croppedImg)
      const compressedImage = await handleImageCompression(croppedImg);
      if (compressedImage) {
        // acceptEdit(URL.createObjectURL(compressedImage))
        acceptEdit(compressedImage);
      } else {
        setAvatarIsCropping(false);
      }
    }
  };

  // processing enter command or escape keypress
  const handleKeyDown = async (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleAccept();
    } else if (event.key === "Escape") {
      cancelEdit();
    }
  };

  // listening for a keypdown handling Enter and Esc keys
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // placing initial crop window on image load
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (loadFlag) {
      const { width, height } = e.currentTarget;
      const crop = centerCrop(
        makeAspectCrop(
          {
            // You don't need to pass a complete crop into
            // makeAspectCrop or centerCrop.
            unit: "px",
            width: Math.floor(width / 2),
          },
          1,
          width,
          height
        ),
        width,
        height
      );

      setCrop(crop);
      setLoadFlag(false);
    }
  }

  return (
    <section className="avatarCropping">
      {avatarIsCropping && <Spinner embed={true} />}
      <div className="avatarCropping__reactCrop">
        <ReactCrop
          ref={cropRef}
          crop={crop}
          onChange={(c) => setCrop(c)}
          aspect={1}
          disabled={avatarIsCropping}
          keepSelection
        >
          <img src={imageToHttpBlob} onLoad={onImageLoad} />
        </ReactCrop>
        <div className="avatarCropping__controls">
          <button
            className="avatarCropping__controls--cancel"
            onClick={() => cancelEdit()}
          >
            {t("cancel")}
          </button>
          <button
            className="avatarCropping__controls--accept"
            onClick={() => handleAccept()}
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AvatarCropping;
