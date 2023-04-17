import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import './avatarcropping.css'
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'

// const handleImageCompression = async (imageFile: File) => {
//     const options = {
//         maxSizeMB: 0.2,
//         maxWidthOrHeight: 180
//     }

//     try {
//         const compressedFile = await imageCompression(imageFile, options);
//         console.log(compressedFile.size);
//         // dispatch(setIdToken({ ...idToken, picture: compressedFile }))
//         setAvatarFile(compressedFile)
//     } catch (error) {
//         console.log(error);
//     }
// }


const AvatarCropping = ({ imageFile, cancelEdit, acceptEdit }: { imageFile: File; cancelEdit: () => void; acceptEdit: (avatar: File) => void }) => {
    // crop state
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    // crop ref
    const cropRef = useRef(null)
    // flag for the initial crop window
    const [loadFlag, setLoadFlag] = useState(true)

    // processing result of the crop or cancel command
    const handleKeyDown = async (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            if (completedCrop && cropRef.current) {
                // acceptEdit(crop)
                const croppedImg = await getCroppedImg(cropRef.current.mediaRef.current.firstChild, completedCrop, 'croppedimage.jpg') as File;
                // console.dir(cropRef.current.mediaRef.current.firstChild)
                // console.log(croppedImg)
                acceptEdit(croppedImg)
                cancelEdit()
            }
        } else if (event.key === 'Escape') {
            cancelEdit()
        }
    }

    function getCroppedImg(image: HTMLImageElement, pixelCrop: Crop, fileName: string) {
 
        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');
       
        ctx!.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );
       
        // As Base64 string
        // const base64Image = canvas.toDataURL('image/jpeg');
       
        // As a blob
        return new Promise((resolve, reject) => {
            canvas.toBlob(file => {
                file.name = fileName;
                resolve(file);
            }, 'image/jpeg');
        });
    }
    
    // handling Enter and Esc keys
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
    
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    },[handleKeyDown])

    // placing initial crop window on image load
    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        if(loadFlag) {
            const { width, height } = e.currentTarget
            const crop = centerCrop(
                makeAspectCrop(
                    {
                        // You don't need to pass a complete crop into
                        // makeAspectCrop or centerCrop.
                        unit: '%',
                        width: 90,
                    },
                    1,
                    width,
                    height
                ),
                width,
                height
            )
        
            setCrop(crop)
            setLoadFlag(false)
        }
    }

    return (
        <section className="avatarCropping">
            <div
                className='avatarCropping__reactCrop'
            >
                <ReactCrop
                    ref={cropRef}
                    crop={crop}
                    onChange={c => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                    keepSelection
                >
                    <img
                        src={URL.createObjectURL(imageFile)}
                        onLoad={onImageLoad}
                    />
                </ReactCrop>
            </div>
        </section>
    )
}

export default AvatarCropping