import React, {useEffect, useState, useRef, useMemo} from "react";
import "../StyleSheets/WallpaperComponent.scss"
import "../StyleSheets/PublicStyles.scss"
import {Image, message} from "antd";
import {createThemedMessage, isEmpty} from "../TypeScripts/PublicFunctions";
import {getExtensionStorage, setExtensionStorage} from "../TypeScripts/StorageFunctions";
import {httpRequest} from "../TypeScripts/RequestFunctions";
import {clientId, deviceType, imageHistoryMaxSize, imageSwitchingInterval} from "../TypeScripts/PublicConstants";
import {decode} from "blurhash";
import {ImageHistoryItem, PreferenceInterface, ThemeInterface, UnsplashImageData} from "../TypeScripts/PublicInterface";

interface WallpaperComponentProps {
    theme: ThemeInterface;
    preference: PreferenceInterface;
    getImageData: (data: UnsplashImageData) => void;
    getImageHistory: React.Dispatch<React.SetStateAction<ImageHistoryItem[]>>;
}

/** 纯请求函数 —— 只管从 Unsplash 拿数据 */
async function fetchWallpaper(preference: PreferenceInterface): Promise<UnsplashImageData> {
    const imageTopics = preference.imageTopics.join(",");
    const imageQuery = preference.customTopic;
    return httpRequest<UnsplashImageData>("https://api.unsplash.com/photos/random?", {
        method: "GET",
        headers: {},
        data: {
            client_id: clientId,
            orientation: (deviceType === "iPhone" || deviceType === "Android") ? "portrait" : "landscape",
            topics: isEmpty(imageQuery) ? imageTopics : "",
            query: imageQuery,
            content_filter: "high",
        },
    });
}

/** 纯缓存函数 —— 只管更新历史记录，返回更新后的列表 */
async function updateImageHistory(currentImage: UnsplashImageData): Promise<ImageHistoryItem[]> {
    const [lastImageStorage, imageHistoryStorage = []] =
        await getExtensionStorage(["lastImage", "imageHistory"]);

    const history: ImageHistoryItem[] = imageHistoryStorage || [];

    if (!isEmpty(lastImageStorage) && !isEmpty(history)) {
        const historyItem: ImageHistoryItem = {
            index: Date.now(),
            imageUrl: lastImageStorage.urls.regular,
            imageLink: lastImageStorage.links.html,
        };

        const isDuplicate = history.some(
            (item: ImageHistoryItem) => item.imageUrl === historyItem.imageUrl
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
    const [canvasClass, setCanvasClass] = useState("backgroundCanvas");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageWrapperRef = useRef<HTMLDivElement>(null);
    const imageStyle = useMemo(() => ({display: displayImage}), [displayImage]);
    const canvasStyle = useMemo(() => ({display: displayCanvas}), [displayCanvas]);
    
    const themedMessage = createThemedMessage(props.theme, message);

    /** 渲染 blurHash 到 canvas 并通知父组件 */
    function setWallpaper(imageData: UnsplashImageData) {
        props.getImageData(imageData);
        setImageLink(imageData.urls.full);

        if (!isEmpty(imageData.blur_hash)) {
            const canvas = canvasRef.current;
            if (canvas) {
                const blurHashImage = decode(imageData.blur_hash!, canvas.width, canvas.height);
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    const blurImageData = new ImageData(blurHashImage, canvas.width, canvas.height);
                    ctx.putImageData(blurImageData, 0, 0);
                }
                setDisplayCanvas("block");
                setCanvasClass("backgroundCanvas wallpaperFadeIn");
            }
        }
    }

    useEffect(() => {
        let cancelled = false;
        const MESSAGE_KEY = "wallpaper_loading";

        async function loadWallpaper() {
            try {
                const [lastRequestTime, lastImage] =
                    await getExtensionStorage(["lastImageRequestTime", "lastImage"]);
                
                //TODO: 样式出不来
                message.loading({
                    content: "正在加载图片",
                    styles: {
                        root: {backgroundColor: props.theme.secondaryColor},
                        icon: {color: props.theme.secondaryFontColor},
                        title: {color: props.theme.secondaryFontColor}
                    },
                    duration: 0,
                    key: MESSAGE_KEY
                });
                const now = Date.now();

                let imageData: UnsplashImageData;
                const needsFetch = isEmpty(lastRequestTime) ||
                    (now - parseInt(lastRequestTime) > imageSwitchingInterval);

                if (needsFetch) {
                    // 先保存上一张图片到历史记录
                    if (!isEmpty(lastImage)) {
                        const history = await updateImageHistory(lastImage);
                        if (!cancelled) props.getImageHistory(history);
                    }
                    setExtensionStorage("lastImageRequestTime", now);

                    // 请求新图片
                    imageData = await fetchWallpaper(props.preference);
                    setExtensionStorage("lastImage", imageData);
                } else if (!isEmpty(lastImage)) {
                    imageData = lastImage as UnsplashImageData;
                } else {
                    themedMessage.error("获取图片失败，请检查网络连接");
                    return;
                }

                if (!cancelled) setWallpaper(imageData);
            } catch {
                // 请求失败，回退缓存
                const [lastImage] = await getExtensionStorage(["lastImage"]);
                if (!isEmpty(lastImage)) {
                    if (!cancelled) setWallpaper(lastImage as UnsplashImageData);
                } else {
                    themedMessage.error("获取图片失败，请检查网络连接");
                }
            } finally {
                themedMessage.destroy(MESSAGE_KEY);
            }
        }

        loadWallpaper();

        // 图片加载完成后的动画
        const backgroundImage = imageWrapperRef.current?.querySelector<HTMLImageElement>("img");
        if (backgroundImage) {
            backgroundImage.onload = () => {
                backgroundImage.style.width = "102%";
                setDisplayImage("block");
                setCanvasClass("backgroundCanvas wallpaperFadeOut");

                backgroundImage.classList.add("wallpaperFadeIn");
                setTimeout(() => {
                    backgroundImage.style.transform = "scale(1.05, 1.05)";
                    backgroundImage.style.transition = "5s";
                }, 2000);
            };
        }

        return () => {
            cancelled = true;
            if (backgroundImage) {
                backgroundImage.onload = null;
            }
        };
    }, []);

    return (
        <>
            <div ref={imageWrapperRef}>
                <Image
                    id={"backgroundImage"}
                    width={"102%"}
                    height={"102%"}
                    className={"backgroundImage zIndexLow"}
                    preview={false}
                    src={imageLink}
                    style={imageStyle}
                />
            </div>
            <canvas ref={canvasRef} style={canvasStyle} className={canvasClass}/>
        </>
    );
}

export default React.memo(WallpaperComponent);