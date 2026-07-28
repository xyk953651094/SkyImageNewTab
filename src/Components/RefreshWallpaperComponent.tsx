import React, {useEffect, useRef, useCallback} from "react";
import {Button, message, Tooltip} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import {createThemedMessage, isEmpty} from "../TypeScripts/PublicFunctions";
import {getExtensionStorage, setExtensionStorage} from "../TypeScripts/StorageFunctions";
import {httpRequest, HttpRequestError} from "../TypeScripts/RequestFunctions";
import {clientId, deviceType, imageHistoryMaxSize, imageSwitchingInterval} from "../TypeScripts/PublicConstants";
import {
    ImageHistoryItemInterface,
    PreferenceInterface,
    ThemeInterface,
    UnsplashImageDataInterface
} from "../TypeScripts/PublicInterface";

const MESSAGE_KEY = "wallpaper_fetching";
const COOLDOWN_MS = 5 * 60 * 1000;  // 5 * 60 * 1000

interface RefreshWallpaperComponentProps {
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
            client_id: preference.accessKey || clientId,
            orientation: (deviceType === "iPhone" || deviceType === "Android") ? "portrait" : "landscape",
            topics: preference.customTopic ? "" : topicsParam,
            query: preference.customTopic ? topicsParam : "",
            content_filter: "high",
        },
    });
}

/** 纯缓存函数 —— 只管更新历史记录，返回更新后的列表 */
async function updateImageHistory(currentImage: UnsplashImageDataInterface): Promise<ImageHistoryItemInterface[]> {
    const [imageHistoryStorage] = await getExtensionStorage(["wallpaperHistory"]);
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
    
    setExtensionStorage("wallpaperHistory", history);
    return history;
}

function RefreshWallpaperComponent(props: RefreshWallpaperComponentProps) {
    const themedMessage = createThemedMessage(props.theme, message);
    const preferenceRef = useRef(props.preference);
    preferenceRef.current = props.preference;
    
    // mount 时加载：缓存优先，过期则请求新图
    useEffect(() => {
        let cancelled = false;
        
        async function loadWallpaper() {
            const [cached, cachedTime] = await getExtensionStorage(["lastWallpaper", "lastWallpaperRequestTime"]);
            const pref = preferenceRef.current;
            
            if (!isEmpty(cached)) {
                props.getImageData(cached);
            } else {
                themedMessage.loading({
                    content: "正在获取图片",
                    duration: 0,
                    key: MESSAGE_KEY,
                    styles: {
                        root: {
                            backgroundColor: props.theme.secondaryColor,
                            color: props.theme.secondaryFontColor,
                        }
                    }
                });
            }
            
            const needsRefresh = isEmpty(cached) ||
                pref.accessKey ||
                (Date.now() - cachedTime > imageSwitchingInterval);
            
            if (!needsRefresh) return;
            
            // 先保存上一张图片到历史记录
            if (!isEmpty(cached)) {
                const history = await updateImageHistory(cached);
                if (!cancelled) props.getImageHistory(history);
            }
            
            try {
                const newData = await fetchWallpaper(pref);
                setExtensionStorage("lastWallpaper", newData);
                setExtensionStorage("lastWallpaperRequestTime", Date.now());
                if (!cancelled) props.getImageData(newData);
            } catch (error: any) {
                if (error instanceof HttpRequestError && (error.status === 401 || error.status === 403)) {
                    themedMessage.error("访问密钥无效，请检查后重试");
                } else {
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
    
    // 手动刷新：换一张
    const handleRefresh = useCallback(async () => {
        // 检查距上次请求是否不足 5 分钟（自定义密钥不受限制）
        const [, cachedTime] = await getExtensionStorage(["lastWallpaper", "lastWallpaperRequestTime"]);
        if (!preferenceRef.current.accessKey && cachedTime && Date.now() - cachedTime < COOLDOWN_MS) {
            themedMessage.error("操作太频繁，请稍后再试");
            return;
        }
        
        themedMessage.loading({
            content: "正在获取新图片",
            duration: 0,
            key: MESSAGE_KEY,
            styles: {
                root: {
                    backgroundColor: props.theme.secondaryColor,
                    color: props.theme.secondaryFontColor,
                }
            }
        });
        
        try {
            const newData = await fetchWallpaper(preferenceRef.current);
            // 更新缓存，同时重置 timestamp（影响自动切换计时和请求频率限制）
            setExtensionStorage("lastWallpaper", newData);
            setExtensionStorage("lastWallpaperRequestTime", Date.now());
            props.getImageData(newData);
        } catch (error: any) {
            if (error instanceof HttpRequestError && (error.status === 401 || error.status === 403)) {
                themedMessage.error("访问密钥无效，请检查后重试");
            } else {
                themedMessage.error("获取图片失败，请检查网络连接");
            }
        } finally {
            themedMessage.destroy(MESSAGE_KEY);
        }
    }, []);
    
    return (
        <Tooltip title="换一张" placement="topRight" color={props.theme.secondaryColor} styles={{
            container: {color: props.theme.secondaryFontColor},
        }}>
            <Button
                icon={<ReloadOutlined/>}
                size={"large"}
                type={"primary"}
                className={"floatingButton"}
                onClick={handleRefresh}
                style={{
                    backgroundColor: props.theme.secondaryColor,
                    color: props.theme.secondaryFontColor,
                }}
            />
        </Tooltip>
    );
}

export default React.memo(RefreshWallpaperComponent);
