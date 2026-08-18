// 桌面端壁纸动态效果：缩放动画结束后，根据模式决定是否启动鼠标视差
export function wallpaperDynamicEffect(
    element: HTMLElement,
    effectType: "translate" | "close"
): () => void {
    let rafId: number | null = null;
    
    let screenWidth = document.body.clientWidth;
    let screenHeight = document.body.clientHeight;
    
    // 初始化 CSS 自定义属性
    element.style.setProperty("--tx", "0%");
    element.style.setProperty("--ty", "0%");
    element.style.transition = "0.15s";
    
    function onResize() {
        screenWidth = document.body.clientWidth;
        screenHeight = document.body.clientHeight;
    }
    
    function handler(e: MouseEvent) {
        if (rafId !== null) return;
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        rafId = requestAnimationFrame(() => {
            const screenMidWidth = screenWidth / 2;
            const screenMidHeight = screenHeight / 2;
            
            if (screenMidWidth === 0 || screenMidHeight === 0) {
                rafId = null;
                return;
            }
            
            const relatedX = mouseX - screenMidWidth;
            const relatedY = mouseY - screenMidHeight;
            const relatedXRatio = relatedX / screenMidWidth;
            const relatedYRatio = relatedY / screenMidHeight;
            
            const tx = (-relatedXRatio / 2).toFixed(2);
            const ty = (-relatedYRatio / 2).toFixed(2);
            element.style.setProperty("--tx", `${tx}%`);
            element.style.setProperty("--ty", `${ty}%`);
            
            rafId = null;
        });
    }
    
    // 缩放动画结束后，才启动鼠标视差
    function startParallax() {
        if (effectType === "translate") {
            window.addEventListener("mousemove", handler);
            window.addEventListener("resize", onResize);
        }
    }
    
    // 检查缩放动画是否仍在运行
    const animations = element.getAnimations();
    const isAnimating = animations.some(a => a.playState === "running");
    
    if (isAnimating) {
        // 动画还在跑，等结束再启动视差
        function onAnimationEnd() {
            element.removeEventListener("animationend", onAnimationEnd);
            startParallax();
        }
        element.addEventListener("animationend", onAnimationEnd);
    } else {
        // 动画已结束（例如切换开关时），立即启动视差
        startParallax();
    }
    
    return () => {
        window.removeEventListener("mousemove", handler);
        window.removeEventListener("resize", onResize);
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    };
}
