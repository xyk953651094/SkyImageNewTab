export interface PreferenceInterface {
    imageQuality: "full" | "regular",
    imageTopics: string[],
    customTopic: string,
    changeImageTime: string,
    buttonShape: "circle" | "default" | "round" | undefined,
    accessKey: string
}

export interface ThemeInterface {
    mainColor: string,
    backgroundColor: string,
    fontColor: string,
}