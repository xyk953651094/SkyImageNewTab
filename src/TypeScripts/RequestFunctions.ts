import $ from "jquery";

// 网络请求
export async function httpRequest(headers: object, url: string, data: object, method: "GET" | "POST") {
    // 验证输入数据
    if (!headers || typeof headers !== "object") {
        throw new Error("Invalid headers");
    }
    if (!url) {
        throw new Error("Invalid url");
    }
    if (!data || typeof data !== "object") {
        throw new Error("Invalid data");
    }
    
    return new Promise(function (resolve, reject) {
        $.ajax({
            headers: headers,
            url: url,
            type: method,
            data: data,
            timeout: 5000,
            success: (resultData: any) => {
                resolve(resultData);
            },
            error: function (xhr: any, status: string, error: string) {
                const errorMsg = `Request failed: ${status} ${error}`;
                reject(new Error(errorMsg)); // 提供详细的错误信息
            }
        });
    })
}