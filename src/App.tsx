import React, {useEffect, useState} from "react";
import WallpaperComponent from "./Components/WallpaperComponent";
import MenuComponent from "./Components/MenuComponent";
import AuthorComponent from "./Components/AuthorComponent";
import HistoryComponent from "./Components/HistoryComponent";

import {Col, Layout, Row, Space} from "antd";
import "./StyleSheets/PublicStyles.scss"
import {
    getFontColor,
    getReverseColor,
    getRandomTheme,
    changeTheme,
} from "./TypeScripts/PublicFunctions";
import {getExtensionStorage, fixPreference} from "./TypeScripts/StorageFunctions";
import {PreferenceInterface, ThemeInterface} from "./TypeScripts/PublicInterface";
import {defaultPreference} from "./TypeScripts/PublicConstants";

const {Header, Content, Footer} = Layout;

function App() {
    const [theme, setTheme] = useState({
        primaryColor: "",
        secondaryColor: "",
        primaryFontColor: "",
        secondaryFontColor: "",
    });
    const [imageData, setImageData] = useState<any>(null);
    const [imageHistory, setImageHistory] = useState<any>([]);
    const [preference, setPreference] = useState<PreferenceInterface>(defaultPreference);
    
    function getImageData(imageData: any) {
        setImageData(imageData);
        // 修改主题颜色
        if (imageData.color !== null) {
            let primaryColor = imageData.color;
            let secondaryColor = getReverseColor(imageData.color);
            let primaryFontColor = getFontColor(imageData.color);
            let secondaryFontColor = getFontColor(secondaryColor);
            setTheme({
                primaryColor: primaryColor,
                secondaryColor: secondaryColor,
                primaryFontColor: primaryFontColor,
                secondaryFontColor: secondaryFontColor,
            });
            
            changeTheme("body", primaryColor, primaryFontColor);
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
        if (imageData === null) {
            const tempTheme: ThemeInterface = getRandomTheme();
            changeTheme("body", tempTheme.primaryColor, tempTheme.primaryFontColor);
            setTheme(tempTheme);
        }
        
        // 获取图片历史
        getExtensionStorage(["imageHistory"]).then((result) => {
            let [imageHistoryStorage] = result;
            if (imageHistoryStorage) {
                setImageHistory(imageHistoryStorage.reverse());
            }
        })
        
        // 获取用户设置
        getExtensionStorage(["preference"]).then((result)=> {
            let [preferenceStorage] = result;
            if (preferenceStorage) {
                setPreference(fixPreference(preferenceStorage));
            }
        })
        
        // 修改各类弹窗样式
        // const observer = new MutationObserver((mutations) => {
        //     mutations.forEach((mutation) => {
        //         // 插入节点时
        //         if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        //             // message
        //             // let messageEle = $(".ant-message");
        //             // if (messageEle.length && messageEle.length > 0) {
        //             //     $(".ant-message-notice-content").css({
        //             //         "backgroundColor": theme.secondaryColor,
        //             //         "color": theme.secondaryFontColor
        //             //     });
        //             //     $(".ant-message-custom-content > .anticon").css("color", theme.secondaryFontColor);
        //             // }
        //
        //             // drawer
        //             // let drawerEle = $(".ant-drawer");
        //             // if (drawerEle.length && drawerEle.length > 0) {
        //             //     $(".ant-select-selection-item").css("backgroundColor", theme.secondaryColor);
        //             //     $(".ant-select-selection-item-content").css("color", theme.secondaryFontColor);
        //             //     $(".ant-select-selection-item-remove").css("color", theme.secondaryFontColor);
        //             // }
        //         }
        //     });
        // });
        // observer.observe(document.body, {childList: true});
    }, [theme]);
    
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
                    theme={theme}
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
