export function getSearchEngineDetail(searchEngine: string) {
    interface SearchEngineMapInterface {
        [key: string]: {
            searchEngineName: string;
            searchEngineValue: string;
            searchEngineUrl: string;
        };
    }

    const searchEngineMap: SearchEngineMapInterface = {
        "bing": {
            searchEngineName: "必应",
            searchEngineValue: "bing",
            searchEngineUrl: "https://www.bing.com/search?q=",
        },
        "google": {
            searchEngineName: "谷歌",
            searchEngineValue: "google",
            searchEngineUrl: "https://www.google.com/search?q=",
        },
    };

    return searchEngineMap[searchEngine] || searchEngineMap.bing;
}