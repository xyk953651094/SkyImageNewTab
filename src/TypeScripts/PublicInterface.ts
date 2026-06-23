export interface ThemeInterface {
    primaryColor: string;
    secondaryColor: string;
    primaryFontColor: string;
    secondaryFontColor: string;
}

export interface PreferenceInterface {
    imageTopics: string[];
    customTopic: string;
}

export interface ExtensionDataInterface {
    preference: PreferenceInterface;
}

// 历史记录的每一条
export interface ImageHistoryItemInterface {
    index: number;
    imageUrl: string;
    imageLink: string;
}

// Unsplash API /photos/random 返回的数据，只定义项目中用到的字段
export interface UnsplashImageDataInterface {
    color: string;
    blur_hash: string | null;
    alt_description: string | null;
    urls: {
        full: string;
        regular: string;
    };
    links: {
        html: string;
    };
    location: {
        name: string | null;
    };
    user: {
        name: string;
        total_collections: number;
        total_likes: number;
        total_photos: number;
        links: {
            html: string;
        };
        profile_image: {
            large: string;
        };
    };
}