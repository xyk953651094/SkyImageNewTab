export interface PreferenceInterface {
    imageTopics: string[],
    customTopic: string,
}

export interface ThemeInterface {
    primaryColor: string,
    secondaryColor: string,
    primaryFontColor: string,
    secondaryFontColor: string,
}

export interface ExtensionDataInterface {
    Preference: PreferenceInterface
}