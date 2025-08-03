import React, {useEffect, useState} from "react";
import {Button, Carousel, Col, Empty, Image, List, message, Popover, Row, Space, Spin, Typography} from "antd";
import {HomeOutlined, HistoryOutlined} from "@ant-design/icons";
import {unsplashUrl} from "../TypeScripts/PublicConstants";
import {changeButtonTheme, changeTheme, isEmpty} from "../TypeScripts/PublicFunctions";
import "../StyleSheets/PublicStyles.scss"

const {Text} = Typography;

function HistoryComponent(props: any) {
    const [imageHistory, setImageHistory] = useState<any[]>([]);
    const [imageLink, setImageLink] = useState<string>("");
    
    function imageLinkBtnOnClick() {
        if (!isEmpty(imageLink)) {
            window.open(imageLink + unsplashUrl, "_self");
        } else {
            message.error("无跳转链接");
        }
    }
    
    function carouselOnChange(currentIndex: number) {
        setImageLink(imageHistory[currentIndex].imageLink)
    }
    
    useEffect(() => {
        if (!isEmpty(props.theme)) {
            changeTheme("#imageHistoryBtn", props.theme.secondaryColor, props.theme.secondaryFontColor);
        }
        
        if (!isEmpty(props.imageHistory) && !isEmpty(props.imageHistory[0].imageLink)) {
            setImageHistory(props.imageHistory);
            setImageLink(props.imageHistory[0].imageLink)
        }
    }, [props.imageHistory, props.theme]);
    
    const popoverTitle = (
        <Row align={"middle"}>
            <Col span={8}>
                <Text style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}>{"历史记录"}</Text>
            </Col>
            <Col span={16} style={{textAlign: "right"}}>
                <Space>
                    <Button type={"text"} 
                            icon={<HomeOutlined />} size={"large"}
                            style={{color: props.theme.secondaryFontColor}}
                            onClick={imageLinkBtnOnClick}
                            onMouseOver={(e) => changeButtonTheme(props.theme.primaryColor, props.theme.primaryFontColor, e)}
                            onMouseOut={(e) => changeButtonTheme("transparent", props.theme.secondaryFontColor, e)}>
                        {"图片主页"}
                    </Button>
                </Space>
            </Col>
        </Row>
    );
    
    const popoverContent = (
        <List split={false}>
            <List.Item style={{display: imageHistory.length === 0 ? "flex" : "none"}}>
                <Row className="alignCenter" style={{width: "400px"}}>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                </Row>
            </List.Item>
            <List.Item style={{display: imageHistory.length === 0 ? "none" : "flex"}}>
                <Carousel effect="fade" afterChange={carouselOnChange} arrows
                          style={{width: "400px", height: "300px"}}>
                    {
                        imageHistory.map((item: any) => {
                            return (
                                <div key={item.index}
                                     style={{width: "400px", height: "300px", lineHeight: "300px"}}>
                                    <Image
                                        width={"400px"}
                                        height={"300px"}
                                        preview={false}
                                        alt={"暂无图片"}
                                        src={item.imageUrl}
                                        style={{borderRadius: "8px"}}
                                        placeholder={
                                            <div style={{width: "400px", height: "300px", borderRadius: "8px"}}
                                                 className="alignCenter">
                                                <Spin tip="加载中，请稍后..."/>
                                            </div>
                                        }
                                    />
                                </div>
                            )
                        })
                    }
                </Carousel>
            </List.Item>
        </List>
    );
    
    return (
        <Popover title={popoverTitle} content={popoverContent} placement={"topRight"}
                 color={props.theme.secondaryColor}
                 overlayStyle={{minWidth: "400px"}}>
            <Button icon={<HistoryOutlined/>} size={"large"}
                    id={"imageHistoryBtn"}
                    className={"componentTheme zIndexHigh"}
                    style={{
                        cursor: "default",
                        backgroundColor: props.theme.secondaryColor,
                        color: props.theme.secondaryFontColor
                    }}
            />
        </Popover>
    );
}

export default HistoryComponent;