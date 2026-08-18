import React, {useEffect, useState, useRef} from "react";
import "../StyleSheets/WallpaperComponent.scss"
import "../StyleSheets/PublicStyles.scss"
import {Image, message} from "antd";
import {createThemedMessage, isEmpty} from "../TypeScripts/PublicFunctions";
import {PreferenceInterface, ThemeInterface, UnsplashImageDataInterface} from "../TypeScripts/PublicInterface";
import {decode} from "blurhash";
import {wallpaperDynamicEffect} from "../TypeScripts/WallpaperComponent";

const MESSAGE_KEY = "wallpaper_loading";

interface WallpaperComponentProps {
    theme: ThemeInterface;
    preference: PreferenceInterface;
    imageData: UnsplashImageDataInterface | null;
}

function WallpaperComponent(props: WallpaperComponentProps) {
    const [imageLink, setImageLink] = useState("");
    const [displayImage, setDisplayImage] = useState("block");
    const [displayCanvas, setDisplayCanvas] = useState("block");
    const [canvasClass, setCanvasClass] = useState("backgroundLayer");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageWrapperRef = useRef<HTMLDivElement>(null);
    const imageStyle = {
        display: displayImage,
        filter: `brightness(${props.preference.imageBrightness})`,
    };
    const canvasStyle = {display: displayCanvas};
    
    const themedMessage = createThemedMessage(props.theme, message);
    
    // 当 imageData 变化时（首次加载或手动刷新），展示新壁纸
    useEffect(() => {
        if (!props.imageData) return;
        const data = props.imageData;
        
        // 重置动画状态
        setDisplayImage("none");
        setDisplayCanvas("block");
        setCanvasClass("backgroundLayer wallpaperFadeIn");
        
        setImageLink(props.preference.imageHighQuality ? data.urls.full : data.urls.regular);
        
        // 渲染 blurHash 到 canvas
        if (!isEmpty(data.blur_hash)) {
            const canvas = canvasRef.current;
            if (canvas) {
                const blurHashImage = decode(data.blur_hash!, canvas.width, canvas.height);
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    const blurImageData = ctx.createImageData(canvas.width, canvas.height);
                    blurImageData.data.set(blurHashImage);
                    ctx.putImageData(blurImageData, 0, 0);
                }
            }
        }
    }, [props.imageData, props.preference.imageHighQuality]);
    
    // 图片加载中提示
    useEffect(() => {
        if (imageLink) {
            themedMessage.loading({content: "正在加载图片", duration: 0, key: MESSAGE_KEY});
        }
    }, [imageLink]);
    
    // 壁纸鼠标跟随视差效果
    const effectMode = props.preference.imageParallax ? "translate" : "close";
    useEffect(() => {
        if (!imageLink || !imageWrapperRef.current) return;
        return wallpaperDynamicEffect(imageWrapperRef.current, effectMode);
    }, [imageLink, effectMode]);
    
    const handleImageLoad = () => {
        themedMessage.destroy(MESSAGE_KEY);
        setDisplayImage("block");
        setCanvasClass("backgroundLayer wallpaperFadeOut");
    };
    
    return (
        <>
            <div key={imageLink} ref={imageWrapperRef} style={{
                position: "fixed",
                top: "-1%",
                left: "-1%",
                width: "102%",
                height: "102%",
                overflow: "hidden",
                animation: "wallpaperZoom 4s ease-out",
                animationFillMode: "forwards",
            }}>
                <Image
                    id={"backgroundImage"}
                    width={"102%"}
                    height={"102%"}
                    className={"backgroundLayer"}
                    preview={false}
                    src={imageLink}
                    style={imageStyle}
                    onLoad={handleImageLoad}
                />
            </div>
            <canvas ref={canvasRef} style={canvasStyle} className={canvasClass}/>
        </>
    );
}

export default React.memo(WallpaperComponent);
