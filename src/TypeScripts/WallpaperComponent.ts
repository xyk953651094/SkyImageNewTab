type EffectFn = (rxRatio: number, ryRatio: number) => string;

const effects: Record<string, EffectFn> = {
    translate: (rx, ry) => {
        const tx = (-rx / 4).toFixed(2);
        const ty = (-ry / 4).toFixed(2);
        return `scale(1.05, 1.05) translate(${tx}%, ${ty}%)`;
    },
    rotate: (rx, ry) => {
        const rotX = (rx / 4).toFixed(2);
        const rotY = (-ry / 4).toFixed(2);
        return `scale(1.05, 1.05) rotateX(${rotY}deg) rotateY(${rotX}deg)`;
    },
    all: (rx, ry) => {
        const skew = (rx / 10).toFixed(2);
        const rotX = (rx / 2).toFixed(2);
        const rotY = (-ry / 2).toFixed(2);
        const tx = (-rx / 2).toFixed(2);
        const ty = (-ry / 2).toFixed(2);
        return `scale(1.05, 1.05) skew(${skew}deg) rotateX(${rotY}deg) rotateY(${rotX}deg) translate(${tx}%, ${ty}%)`;
    },
    close: () => "scale(1.05, 1.05)",
};

// 桌面端壁纸动态效果
export function imageDynamicEffect(
    element: HTMLElement,
    effectType: "translate" | "rotate" | "all" | "close"
): () => void {
    let rafId: number | null = null;

    let screenWidth = document.body.clientWidth;
    let screenHeight = document.body.clientHeight;

    element.style.transition = "0.3s";

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

            element.style.transform = effects[effectType](relatedXRatio, relatedYRatio);

            rafId = null;
        });
    }

    window.addEventListener("mousemove", handler);
    window.addEventListener("resize", onResize);

    return () => {
        window.removeEventListener("mousemove", handler);
        window.removeEventListener("resize", onResize);
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    };
}