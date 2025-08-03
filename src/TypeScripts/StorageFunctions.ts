// 封装对 localStorage 的操作，增加异常处理
import {defaultPreference, environment} from "./PublicConstants";
import {PreferenceInterface} from "./PublicInterface";

export async function getExtensionStorage(keys: string[]): Promise<any[]> {
    try {
        let tempStorage: any[] = [];
        if (environment === "production") {
            // 生产环境
            // if (["Chrome", "Edge"].indexOf(browserType) !== -1) {
            //     await chrome.storage.local.get(keys).then((result) => {
            //         tempStorage = result;
            //     });
            // }
            // else if (["Firefox", "Safari"].indexOf(browserType) !== -1) {
            //     await browser.storage.local.get(keys).then((result) => {
            //         tempStorage = result;
            //     });
            // }
        } else if (environment === "development") {
            // 开发环境
            for (const key of keys) {
                const tempKeyStorage = localStorage.getItem(key);
                if (tempKeyStorage) {
                    try {
                        tempStorage.push(JSON.parse(tempKeyStorage));
                    } catch (error) {
                        tempStorage.push(tempKeyStorage); // 不是 JSON 的纯字符串
                    }
                }
            }
        }
        return tempStorage;
    } catch (error) {
        console.error("Error reading from storage:", error);
        return [];
    }
}

export function setExtensionStorage(key: string, value: any) {
    try {
        if (environment === "production") {
            // 生产环境
            // if (["Chrome", "Edge"].indexOf(browserType) !== -1) {
            //     chrome.storage.local.set({[key]: value});
            // }
            // else if (["Firefox", "Safari"].indexOf(browserType) !== -1) {
            //     browser.storage.local.set({[key]: value});
            // }
        } else if (environment === "development") {
            // 开发环境
            localStorage.setItem(key, JSON.stringify(value));
        }
    } catch (error) {
        console.error("Error writing to storage:", error);
    }
}

export function removeExtensionStorage(key: string) {
    try {
        if (environment === "production") {
            // 生产环境
            // if (["Chrome", "Edge"].indexOf(browserType) !== -1) {
            //     chrome.storage.local.remove(key);
            // }
            // else if (["Firefox", "Safari"].indexOf(browserType) !== -1) {
            //     browser.storage.local.remove(key);
            // }
        } else if (environment === "development") {
            // 开发环境
            localStorage.removeItem(key);
        }
    } catch (error) {
        console.error("Error removing from storage:", error);
    }
}

export function clearExtensionStorage() {
    try {
        if (environment === "production") {
            // 生产环境
            // if (["Chrome", "Edge"].indexOf(browserType) !== -1) {
            //     chrome.storage.local.clear();
            // } else if (["Firefox", "Safari"].indexOf(browserType) !== -1) {
            //     browser.storage.local.clear();
            // }
        } else if (environment === "development") {
            // 开发环境
            localStorage.clear();
        }
    } catch (error) {
        console.error("Error clearing storage:", error);
    }
}

// 补全设置数据
export function fixPreference(preference: PreferenceInterface) {
    let isFixed = false;
    
    function setDefaultIfUndefinedOrNull(obj: any, key: string, defaultValue: any) {
        if (obj[key] === undefined || obj[key] === null) {
            obj[key] = defaultValue;
            isFixed = true;
        }
    }
    
    setDefaultIfUndefinedOrNull(preference, "imageTopics", defaultPreference.imageTopics);
    setDefaultIfUndefinedOrNull(preference, "customTopic", defaultPreference.customTopic);
    
    if (isFixed) {
        setExtensionStorage("preference", preference)
    }
    return preference;
}