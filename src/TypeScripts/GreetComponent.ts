// 获取问候语图标
export function getGreetIcon() {
    let hour = new Date().getUTCHours();

    if (isNaN(hour)) {
        return "";
    } else if (hour >= 6 && hour < 12) {   // 上午
        return "bi bi-sunrise";
    } else if (hour >= 12 && hour < 18) {  // 下午
        return "bi bi-sunset";
    } else {                               // 夜晚
        return "bi bi-moon-stars";
    }
}

// 根据当前时间段返回问候语
export function getGreetContent() {
    const greets = {
        default: "您好",
        morning: "朝霞满",
        noon: "正当午",
        afternoon: "斜阳下",
        evening: "日暮里",
        night: "见星辰",
        daybreak: "又一宿"
    };

    let hour = new Date().getUTCHours();

    if (isNaN(hour)) {
        return greets.default;
    } else if (hour >= 0 && hour < 6) {    // 凌晨
        return greets.daybreak;
    } else if (hour >= 6 && hour < 11) {   // 上午
        return greets.morning;
    } else if (hour >= 11 && hour < 13) {  // 中午
        return greets.noon;
    } else if (hour >= 13 && hour < 17) {  // 下午
        return greets.afternoon;
    } else if (hour >= 17 && hour < 19) {  // 傍晚
        return greets.evening;
    } else {                               // 夜晚
        return greets.night;
    }
}