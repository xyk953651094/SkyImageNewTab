import React, {useEffect, useState} from "react";
import "../StyleSheets/WallpaperComponent.scss"
import "../StyleSheets/PublicStyles.scss"
import {Image, message} from "antd";
import {
    httpRequest,
    isEmpty
} from "../TypeScripts/PublicFunctions";
import {clientId, deviceType, imageHistoryMaxSize, imageSwitchingInterval} from "../TypeScripts/PublicConstants";
import {decode} from "blurhash";

import $ from "jquery";

function WallpaperComponent(props: any) {
    const [imageLink, setImageLink] = useState("");
    const [displayImage, setDisplayImage] = useState("block");
    const [displayCanvas, setDisplayCanvas] = useState("block");
    
    function setWallpaper(imageData: any) {
        props.getImageData(imageData);
        setImageLink(imageData.urls.full);
            
        // blurHash
        if (!isEmpty(imageData.blur_hash)) {
            const backgroundCanvas = document.getElementById("backgroundCanvas") as HTMLCanvasElement | null;
            if (backgroundCanvas instanceof HTMLCanvasElement) {
                let blurHashImage = decode(imageData.blur_hash, backgroundCanvas.width, backgroundCanvas.height);
                let ctx = backgroundCanvas.getContext("2d");
                if (ctx) {
                    const imageData = new ImageData(blurHashImage, backgroundCanvas.width, backgroundCanvas.height);
                    ctx.putImageData(imageData, 0, 0);
                }
                
                setDisplayCanvas("block");
                backgroundCanvas.className = "backgroundCanvas wallpaperFadeIn";
            }
        }
        
    }
    
    function getWallpaper() {
        let imageTopics = "";
        for (let i = 0; i < props.preference.imageTopics.length; i++) {
            imageTopics += props.preference.imageTopics[i];
            if (i !== props.preference.imageTopics.length - 1) {
                imageTopics += ",";
            }
        }
        let imageQuery = props.preference.customTopic;
        
        let headers = {};
        let url = "https://api.unsplash.com/photos/random?";
        let data = {
            "client_id": clientId,
            "orientation": (deviceType === "iPhone" || deviceType === "Android") ? "portrait" : "landscape",
            "topics": isEmpty(imageQuery) ? imageTopics : "",
            "query": imageQuery,
            "content_filter": "high",
        };
        
        message.loading({content: "正在获取图片", duration: 0, key: "message1"});
        httpRequest(headers, url, data, "GET")
            .then(function (resultData: any) {
                message.destroy("message1");
                message.loading({content: "正在加载图片", duration: 0, key: "message2"});
                
                // 缓存历史图片
                let lastImageStorage = localStorage.getItem("lastImage"); // 上一张图片
                let imageHistoryStorage = localStorage.getItem("imageHistory");
                let imageHistory = [];
                if (imageHistoryStorage !== null) {
                    imageHistory = JSON.parse(imageHistoryStorage);
                }
                if (lastImageStorage !== null) {
                    let lastImageJson = JSON.parse(lastImageStorage);
                    let imageHistoryJsonItem = {
                        index: new Date().getTime(),
                        imageUrl: lastImageJson.urls.regular,
                        imageLink: lastImageJson.links.html,
                    };
                    
                    if (imageHistory.length === imageHistoryMaxSize) { // 满了就把第一个删掉
                        imageHistory.shift();
                    }
                    imageHistory.push(imageHistoryJsonItem);
                }
                localStorage.setItem("imageHistory", JSON.stringify(imageHistory));
                props.getImageHistory(imageHistory);  // 传递给历史图片组件
                
                // 保存请求时间，防抖节流
                localStorage.setItem("lastImageRequestTime", String(new Date().getTime()));
                localStorage.setItem("lastImage", JSON.stringify(resultData));
                setWallpaper(resultData);
            })
            .catch(function () {
                message.destroy("message1");
                
                // 请求失败时使用上一次请求结果
                let lastImage: any = localStorage.getItem("lastImage");
                if (lastImage) {
                    message.loading({content: "获取图片失败，正在加载缓存图片", duration: 0, key: "message3"});
                    lastImage = JSON.parse(lastImage);
                    setWallpaper(lastImage);
                } else {
                    message.error("获取图片失败，请检查网络连接");
                }
            })
            .finally(function () {});
    }
    
    useEffect(() => {
        // 防抖节流
        let lastRequestTime: any = localStorage.getItem("lastImageRequestTime");
        let nowTimeStamp = new Date().getTime();
        if (lastRequestTime === null) {  // 第一次请求时 lastRequestTime 为 null，因此直接进行请求赋值 lastRequestTime
            getWallpaper();
        } else if (nowTimeStamp - parseInt(lastRequestTime) > imageSwitchingInterval) {  // 必须多于切换间隔才能进行新的请求
            getWallpaper();
        } else {  // 切换间隔内使用上一次请求结果
            let lastImage: any = localStorage.getItem("lastImage");
            if (lastImage) {
                message.loading({content: "正在加载缓存图片", duration: 0, key: "message4"});
                lastImage = JSON.parse(lastImage);
                setWallpaper(lastImage);
            } else {
                message.error("无缓存图片可加载，请尝试重置插件");
            }
        }

        // 图片动画
        // @ts-ignore
        let backgroundImageDiv: HTMLElement = document.getElementById("backgroundImage");
        // @ts-ignore
        let backgroundImage: HTMLElement = backgroundImageDiv.children[0];
        if (backgroundImage instanceof HTMLElement) {
            backgroundImage.onload = () => {
                backgroundImage.style.width = "102%";

                setDisplayImage("block");
                $("#backgroundCanvas").removeClass("wallpaperFadeIn").addClass("wallpaperFadeOut");
                message.destroy("message2");
                message.destroy("message3");
                message.destroy("message4");

                // 设置动态效果
                backgroundImage.classList.add("wallpaperFadeIn");
                setTimeout(() => {
                    backgroundImage.style.transform = "scale(1.05, 1.05)";
                    backgroundImage.style.transition = "5s";
                }, 2000);
            }
        }
    }, []);
    
    return (
        <>
            <Image
                id={"backgroundImage"}
                // key={"1"}
                width={"102%"}
                height={"102%"}
                className={"backgroundImage zIndexLow"}
                preview={false}
                src={imageLink}
                style={{display: displayImage}}
            />
            <canvas id="backgroundCanvas" style={{display: displayCanvas}} className={"backgroundCanvas"}/>
        </>
    );
}

export default WallpaperComponent;