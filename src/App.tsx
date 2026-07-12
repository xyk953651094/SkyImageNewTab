import {useEffect, useState, useCallback} from "react";
import {Col, Flex, Layout, Row, Space} from "antd";
import "./StyleSheets/PublicStyles.scss"
import {
    getFontColor,
    getReverseColor,
    getRandomTheme
} from "./TypeScripts/PublicFunctions";
import {getExtensionStorage, fixPreference} from "./TypeScripts/StorageFunctions";
import {PreferenceInterface, ThemeInterface, UnsplashImageDataInterface, ImageHistoryItemInterface} from "./TypeScripts/PublicInterface";
import {defaultPreference} from "./TypeScripts/PublicConstants";
import TodoComponent from "./Components/TodoComponent";
import DailyComponent from "./Components/CountdownComponent";
import FocusComponent from "./Components/FocusComponent";
import WallpaperComponent from "./Components/WallpaperComponent";
import MenuComponent from "./Components/MenuComponent";
import AuthorComponent from "./Components/AuthorComponent";
import HistoryComponent from "./Components/HistoryComponent";

const {Header, Content, Footer} = Layout;

function App() {
    const [theme, setTheme] = useState<ThemeInterface>({
        primaryColor: "",
        secondaryColor: "",
        primaryFontColor: "",
        secondaryFontColor: "",
    });
    const [imageData, setImageData] = useState<UnsplashImageDataInterface | null>(null);
    const [imageHistory, setImageHistory] = useState<ImageHistoryItemInterface[]>([]);
    const [preference, setPreference] = useState<PreferenceInterface>(defaultPreference);
    
    const getImageData = useCallback((data: UnsplashImageDataInterface) => {
        setImageData(data);
        if (data.color !== null) {
            const primaryColor = data.color;
            const secondaryColor = getReverseColor(data.color);
            const primaryFontColor = getFontColor(data.color);
            const secondaryFontColor = getFontColor(secondaryColor);
            setTheme({
                primaryColor,
                secondaryColor,
                primaryFontColor,
                secondaryFontColor,
            });
        }
    }, []);
    
    // Effect 1：仅在组件挂载时从 storage 加载历史与偏好
    useEffect(() => {
        getExtensionStorage(["imageHistory"]).then((result) => {
            const [imageHistoryStorage] = result;
            if (imageHistoryStorage) {
                setImageHistory([...imageHistoryStorage].reverse());
            }
        });
        
        getExtensionStorage(["preference"]).then((result) => {
            const [preferenceStorage] = result;
            if (preferenceStorage) {
                setPreference(fixPreference(preferenceStorage));
            }
        });
    }, []);
    
    // Effect 2：仅在 imageData 变化时判断是否需要随机主题
    useEffect(() => {
        if (imageData === null) {
            const tempTheme: ThemeInterface = getRandomTheme();
            setTheme(tempTheme);
        }
    }, [imageData]);
    
    useEffect(() => {
        if (theme.primaryColor && theme.primaryFontColor) {
            document.body.style.backgroundColor = theme.primaryColor;
            document.body.style.color = theme.primaryFontColor;
            document.body.style.transition = "background-color 0.3s, color 0.3s";
        }
    }, [theme.primaryColor, theme.primaryFontColor]);
    
    return (
        <Layout>
            <Header className={"layoutHeader"}>
                <Row justify={"center"}>
                    <Col xs={0} sm={0} md={20} lg={20} xl={20} xxl={20} style={{textAlign: "right"}}>
                        <Space align={"center"}>
                            <TodoComponent theme={theme} />
                            <DailyComponent theme={theme} />
                            <FocusComponent theme={theme} />
                        </Space>
                    </Col>
                </Row>
            </Header>
            <Content className={"layoutContent"}>
                <Flex justify="center" align="center" style={{height: "100%"}}>
                    <WallpaperComponent
                        theme={theme}
                        preference={preference}
                        getImageData={getImageData}
                        getImageHistory={setImageHistory}
                    />
                </Flex>
            </Content>
            <Footer className={"layoutFooter"}>
                <Row justify="center">
                    <Col xs={0} sm={0} md={20} lg={20} xl={20} xxl={20} style={{textAlign: "right"}}>
                        <Space align={"center"}>
                            <AuthorComponent
                                theme={theme}
                                imageData={imageData}
                            />
                            <HistoryComponent
                                theme={theme}
                                imageHistory={imageHistory}
                            />
                            <MenuComponent
                                theme={theme}
                                preference={preference}
                                getPreference={setPreference}
                            />
                        </Space>
                    </Col>
                </Row>
            </Footer>
        </Layout>
    );
}

export default App;
