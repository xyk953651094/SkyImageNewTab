import React, {useEffect, useState, useRef} from "react";
import "../StyleSheets/WallpaperComponent.scss"
import "../StyleSheets/PublicStyles.scss"
import {Image, message} from "antd";
import {createThemedMessage, isEmpty} from "../TypeScripts/PublicFunctions";
import {getExtensionStorage, setExtensionStorage} from "../TypeScripts/StorageFunctions";
import {httpRequest} from "../TypeScripts/RequestFunctions";
import {clientId, deviceType, imageHistoryMaxSize, imageSwitchingInterval} from "../TypeScripts/PublicConstants";
import {decode} from "blurhash";
import {
    ImageHistoryItemInterface,
    PreferenceInterface,
    ThemeInterface,
    UnsplashImageDataInterface
} from "../TypeScripts/PublicInterface";

interface WallpaperComponentProps {
    theme: ThemeInterface;
    preference: PreferenceInterface;
    getImageData: (data: UnsplashImageDataInterface) => void;
    getImageHistory: React.Dispatch<React.SetStateAction<ImageHistoryItemInterface[]>>;
}

/** 纯请求函数 —— 只管从 Unsplash 拿数据 */
async function fetchWallpaper(preference: PreferenceInterface): Promise<UnsplashImageDataInterface> {
    const topicsParam = preference.imageTopics.join(",");
    return httpRequest<UnsplashImageDataInterface>("https://api.unsplash.com/photos/random?", {
        method: "GET",
        headers: {},
        data: {
            client_id: clientId,
            orientation: (deviceType === "iPhone" || deviceType === "Android") ? "portrait" : "landscape",
            topics: preference.customTopic ? "" : topicsParam,
            query: preference.customTopic ? topicsParam : "",
            content_filter: "high",
        },
    });
}

/** 纯缓存函数 —— 只管更新历史记录，返回更新后的列表 */
async function updateImageHistory(currentImage: UnsplashImageDataInterface): Promise<ImageHistoryItemInterface[]> {
    const [imageHistoryStorage] = await getExtensionStorage(["imageHistory"]);
    const history: ImageHistoryItemInterface[] = imageHistoryStorage || [];
    
    if (!isEmpty(currentImage)) {
        const historyItem: ImageHistoryItemInterface = {
            index: Date.now(),
            imageUrl: currentImage.urls.regular,
            imageLink: currentImage.links.html,
        };
        
        const isDuplicate = history.some(
            (item: ImageHistoryItemInterface) => item.imageUrl === historyItem.imageUrl
        );
        
        if (!isDuplicate) {
            if (history.length >= imageHistoryMaxSize) {
                history.shift();
            }
            history.push(historyItem);
        }
    }
    
    setExtensionStorage("imageHistory", history);
    return history;
}

function WallpaperComponent(props: WallpaperComponentProps) {
    const [imageLink, setImageLink] = useState("");
    const [displayImage, setDisplayImage] = useState("block");
    const [displayCanvas, setDisplayCanvas] = useState("block");
    const [canvasClass, setCanvasClass] = useState("backgroundLayer");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageWrapperRef = useRef<HTMLDivElement>(null);
    const imageStyle = {display: displayImage};
    const canvasStyle = {display: displayCanvas};
    
    const themedMessage = createThemedMessage(props.theme, message);
    
    /** 渲染 blurHash 到 canvas 并通知父组件 */
    function setWallpaper(imageData: UnsplashImageDataInterface) {
        props.getImageData(imageData);
        setImageLink(imageData.urls.full);
        
        if (!isEmpty(imageData.blur_hash)) {
            const canvas = canvasRef.current;
            if (canvas) {
                const blurHashImage = decode(imageData.blur_hash!, canvas.width, canvas.height);
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    const blurImageData = ctx.createImageData(canvas.width, canvas.height);
                    blurImageData.data.set(blurHashImage);
                    ctx.putImageData(blurImageData, 0, 0);
                }
                setDisplayCanvas("block");
                setCanvasClass("backgroundLayer wallpaperFadeIn");
                themedMessage.loading({content: "正在加载图片", duration: 0, key: "wallpaper_loading"});
            }
        }
    }
    
    
    const handleImageLoad = () => {
        themedMessage.destroy("wallpaper_loading");
        const img = imageWrapperRef.current?.querySelector<HTMLImageElement>("img");
        if (img) {
            img.style.width = "102%";
            img.classList.add("wallpaperFadeIn");
            setTimeout(() => {
                img.style.transform = "scale(1.05, 1.05)";
                img.style.transition = "5s";
            }, 2000);
        }
        setDisplayImage("block");
        setCanvasClass("backgroundLayer wallpaperFadeOut");
    };
    
    useEffect(() => {
        let cancelled = false;
        const MESSAGE_KEY = "wallpaper_fetching";
        
        async function loadWallpaper() {
            const [cached] = await getExtensionStorage(["wallpaperCache"]);
            
            if (!isEmpty(cached)) {
                // 有缓存，先展示
                setWallpaper(cached.imageData);
            } else {
                // 没缓存，给用户一个提示
                themedMessage.loading({content: "正在获取图片", duration: 0, key: MESSAGE_KEY});
            }
            
            const needsRefresh = isEmpty(cached) ||
                (Date.now() - cached.timestamp > imageSwitchingInterval);
            
            if (!needsRefresh) return;
            
            // 先保存上一张图片到历史记录
            if (!isEmpty(cached)) {
                const history = await updateImageHistory(cached.imageData);
                if (!cancelled) props.getImageHistory(history);
            }
            
            try {
                const newData = await fetchWallpaper(props.preference);
                setExtensionStorage("wallpaperCache", {
                    imageData: newData,
                    timestamp: Date.now(),
                });
                if (!cancelled) setWallpaper(newData);
            } catch {
                if (isEmpty(cached)) {
                    themedMessage.error("获取图片失败，请检查网络连接");
                }
            } finally {
                themedMessage.destroy(MESSAGE_KEY);
            }
        }
        
        loadWallpaper();
        
        return () => {
            cancelled = true;
        };
    }, []);  // 忽略这个警告
    
    return (
        <>
            <div ref={imageWrapperRef}>
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