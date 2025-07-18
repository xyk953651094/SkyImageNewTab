import React, {useEffect, useState} from "react";

// import MenuComponent from "./Components/MenuComponent";
import WallpaperComponent from "./Components/WallpaperComponent";

import {Col, Layout, notification, Row, Space} from "antd";
import "./StyleSheets/PublicStyles.scss"
import {
    getExtensionStorage,
    getFontColor,
    getPreferenceStorage,
    getReverseColor,
    setExtensionStorage,
    setThemeColor,
    changeTheme,
    getImageHistoryStorage, isEmpty
} from "./TypeScripts/PublicFunctions";
import {PreferenceInterface, ThemeInterface} from "./TypeScripts/PublicInterface";

import $ from "jquery";
import {imageTopics} from "./TypeScripts/PublicConstants";
import AuthorComponent from "./Components/AuthorComponent";
import HistoryComponent from "./Components/HistoryComponent";
import MenuComponent from "./Components/MenuComponent";

const {Header, Content, Footer} = Layout;

function App() {
    const [theme, setTheme] = useState({
        "mainColor": "",
        "backgroundColor": "",
        "fontColor": "",
    });
    const [imageData, setImageData] = useState(null);
    const [imageHistory, setImageHistory] = useState(getImageHistoryStorage(),);
    const [preference, setPreference] = useState(getPreferenceStorage());
    
    function getImageData(imageData: any) {
        setImageData(imageData);
        // 修改主题颜色
        if (imageData.color !== null) {
            let bodyBackgroundColor = imageData.color;
            let bodyFontColor = getFontColor(bodyBackgroundColor);
            changeTheme("body", bodyBackgroundColor, bodyFontColor);
            
            let backgroundColor = getReverseColor(imageData.color);
            let fontColor = getFontColor(backgroundColor);
            setTheme({
                "mainColor": imageData.color,
                "backgroundColor": backgroundColor,
                "fontColor": fontColor,
            });
        }
    }
    
    function getImageHistory(value: any) {
        setImageHistory(value);
    }
    
    function getPreference(value: PreferenceInterface) {
        setPreference(value);
    }
    
    useEffect(() => {
        // 未加载图片前随机设置颜色主题
        // if (isEmpty(theme.mainColor)) {
        //     const tempTheme: ThemeInterface = setThemeColor();
        //     setTheme(tempTheme);
        // }
    }, [theme.mainColor]);
    
    return (
        <Layout>
            <Header id={"header"} className={"zIndexMiddle"}>
                <Row justify="center">
                    <Col xs={0} sm={0} md={0} lg={10} xl={10} xxl={10}>
                    
                    </Col>
                    <Col xs={22} sm={22} md={22} lg={10} xl={10} xxl={10} style={{textAlign: "right"}}>
                        <Space>
                            <MenuComponent
                                theme={theme}
                                preference={preference}
                                getPreference={getPreference}
                            />
                        </Space>
                    </Col>
                </Row>
            </Header>
            <Content id={"content"} className={"alignCenter"}>
                <WallpaperComponent
                    preference={preference}
                    getImageData={getImageData}
                    getImageHistory={getImageHistory}
                />
            </Content>
            <Footer id={"footer"}>
                <Row justify="center">
                    <Col xs={0} sm={0} md={0} lg={20} xl={20} style={{textAlign: "right"}}>
                        <Space align={"center"}>
                            <AuthorComponent
                                theme={theme}
                                imageData={imageData}
                                preference={preference}
                            />
                            <HistoryComponent
                                theme={theme}
                                imageHistory={imageHistory}
                                preference={preference}
                            />
                        </Space>
                    </Col>
                </Row>
            </Footer>
        </Layout>
    );
}

export default App;
