import React, {useEffect, useState} from "react";

import MenuComponent from "./Components/MenuComponent";
import WallpaperComponent from "./Components/WallpaperComponent";

import {Col, Layout, notification, Row, Space} from "antd";
import "./StyleSheets/PublicStyles.css"
import {
    getExtensionStorage,
    getFontColor,
    getPreferenceStorage,
    getReverseColor,
    setExtensionStorage,
    setThemeColor,
    changeTheme,
    getImageHistoryStorage
} from "./TypeScripts/PublicFunctions";
import {PreferenceInterface, ThemeInterface} from "./TypeScripts/PublicInterface";

import $ from "jquery";
import {imageTopics} from "./TypeScripts/PublicConstants";

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
        if (theme.mainColor === "") {
            const tempTheme: ThemeInterface = setThemeColor();
            setTheme(tempTheme);
        }
        
        // 版本号提醒
        let currentVersion = require('../package.json').version;
        getExtensionStorage("SkyPoemNewTabVersion", "0.0.0").then((storageVersion) => {
            if (storageVersion !== currentVersion) {
                notification.open({
                    icon: null,
                    message: "已更新至版本 V" + currentVersion,
                    description: "详细内容请前往菜单栏更新日志查看",
                    placement: "bottomLeft",
                    duration: 5,
                    closeIcon: false
                });
                setExtensionStorage("SkyNewTabPoemReactVersion", currentVersion);
            }
        });
        
    }, [theme.mainColor]);
    
    return (
        <Layout>
            <Header id={"header"} className={"zIndexMiddle"}>
                <Row justify="center">
                    <Col xs={0} sm={0} md={0} lg={10} xl={10} xxl={10}>
                    
                    </Col>
                    <Col xs={0} sm={0} md={0} lg={10} xl={10} xxl={10} style={{textAlign: "right"}}>
                        <Space>
                            <MenuComponent
                                theme={theme}
                                preference={preference}
                                getPreference={getPreference}
                            />
                        </Space>
                    </Col>
                    <Col xs={22} sm={22} md={22} lg={0} xl={0} xxl={0} style={{textAlign: "right"}}>
                        <Space align={"center"}>
                            <MenuComponent
                                themeColor={theme}
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
                    
                    </Col>
                </Row>
            </Footer>
        </Layout>
    );
}

export default App;
