// 桌面端壁纸动态效果
export function imageDynamicEffect(element: HTMLElement, effectType: string) {
    window.addEventListener("mousemove", function (e) {
        let mouseX = e.screenX;
        let mouseY = e.screenY;
        let screenWidth = document.body.clientWidth;
        let screenHeight = document.body.clientHeight;
        let screenMidWidth = screenWidth / 2;
        let screenMidHeight = screenHeight / 2;
        let relatedX = mouseX - screenMidWidth;   // 大于0则在屏幕右边，小于0则在屏幕左边
        let relatedY = mouseY - screenMidHeight;  // 大于0则在屏幕下边，小于0则在屏幕上边
        let relatedXRatio = relatedX / screenMidWidth;
        let relatedYRatio = relatedY / screenMidHeight;

        element.style.transition = "0.3s";
        switch (effectType) {
            case "translate": {
                let translateX = (-relatedXRatio / 4).toFixed(2);  // 调整精度
                let translateY = (-relatedYRatio / 4).toFixed(2);  // 调整精度
                element.style.transform = "scale(1.05, 1.05) translate(" + translateX + "%, " + translateY + "%)";
                break;
            }
            case "rotate": {
                let rotateX = (relatedXRatio / 4).toFixed(2);      // 调整精度
                let rotateY = (-relatedYRatio / 4).toFixed(2);     // 调整精度
                element.style.transform = "scale(1.05, 1.05) rotateX(" + rotateY + "deg) rotateY(" + rotateX + "deg)";
                break;
            }
            case "all": {
                let skewX = (relatedXRatio / 10).toFixed(2);       // 调整精度
                let rotateX = (relatedXRatio / 2).toFixed(2);      // 调整精度
                let rotateY = (-relatedYRatio / 2).toFixed(2);     // 调整精度
                let translateX = (-relatedXRatio / 2).toFixed(2);  // 调整精度
                let translateY = (-relatedYRatio / 2).toFixed(2);  // 调整精度
                element.style.transform = "scale(1.05, 1.05) " +
                    "skew(" + skewX + "deg)" +
                    "rotateX(" + rotateY + "deg) rotateY(" + rotateX + "deg) " +
                    "translate(" + translateX + "%, " + translateY + "%)";
                break;
            }
            case "close": {
                element.style.transform = "scale(1.05, 1.05)";
                break;
            }
        }
    });
}