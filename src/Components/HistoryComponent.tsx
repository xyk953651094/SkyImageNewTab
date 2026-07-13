import React, {useEffect, useState} from "react";
import {Button, Carousel, Col, Empty, Flex, Image, List, message, Popover, Row, Space, Spin, Typography} from "antd";
import {HistoryOutlined, FileImageOutlined} from "@ant-design/icons";
import {unsplashUrl} from "../TypeScripts/PublicConstants";
import {createThemedMessage, isEmpty} from "../TypeScripts/PublicFunctions";
import "../StyleSheets/PublicStyles.scss"
import {ImageHistoryItemInterface, ThemeInterface} from "../TypeScripts/PublicInterface";
import {HoverButton} from "./PublicComponents/PublicButton";

const {Text} = Typography;

interface HistoryComponentProps {
    theme: ThemeInterface;
    imageHistory: ImageHistoryItemInterface[];
}

function HistoryComponent(props: HistoryComponentProps) {
    const [imageHistory, setImageHistory] = useState<ImageHistoryItemInterface[]>([]);
    const [imageLink, setImageLink] = useState<string>("");
    
    const themedMessage = createThemedMessage(props.theme, message);
    
    function imageLinkBtnOnClick() {
        if (!isEmpty(imageLink)) {
            window.open(imageLink + unsplashUrl, "_self");
        } else {
            themedMessage.error("无跳转链接");
        }
    }
    
    function carouselOnChange(currentIndex: number) {
        if (imageHistory[currentIndex]) {
            setImageLink(imageHistory[currentIndex].imageLink);
        }
    }
    
    useEffect(() => {
        if (!isEmpty(props.imageHistory) && !isEmpty(props.imageHistory[0].imageLink)) {
            setImageHistory(props.imageHistory);
            setImageLink(props.imageHistory[0].imageLink)
        }
    }, [props.imageHistory, props.theme]);
    
    const popoverTitle = (
        <Row align={"middle"}>
            <Col span={8}>
                <Text style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}>{"历史图片"}</Text>
            </Col>
            <Col span={16} style={{textAlign: "right"}}>
                <Space>
                    <HoverButton theme={props.theme} icon={<FileImageOutlined />} onClick={imageLinkBtnOnClick}>
                        {"查看原图"}
                    </HoverButton>
                </Space>
            </Col>
        </Row>
    );
    
    const popoverContent = (
        <List split={false}>
            {imageHistory.length === 0 ? (
                <List.Item>
                    <Flex justify="center" align="center" style={{width: "400px"}}>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} styles={{description: {color: props.theme.secondaryFontColor} }} />
                    </Flex>
                </List.Item>
            ) : (
                <List.Item>
                    <Carousel effect="fade" afterChange={carouselOnChange} arrows
                              style={{width: "400px", height: "300px"}}>
                        {
                            imageHistory.map((item) => {
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
                                                <Flex justify="center" align="center" style={{width: "400px", height: "300px", borderRadius: "8px"}}>
                                                    <Spin description="加载中，请稍后..."/>
                                                </Flex>
                                            }
                                        />
                                    </div>
                                )
                            })
                        }
                    </Carousel>
                </List.Item>
            )}
        </List>
    );
    
    return (
        <Popover title={popoverTitle} content={popoverContent} placement={"topRight"}
                 color={props.theme.secondaryColor}
                 styles={{root: {minWidth: "400px"}}}>
            <Button icon={<HistoryOutlined/>} size={"large"}
                    type={"primary"}
                    className={"floatingButton"}
                    style={{
                        cursor: "default",
                        backgroundColor: props.theme.secondaryColor,
                        color: props.theme.secondaryFontColor
                    }}
            />
        </Popover>
    );
}

export default React.memo(HistoryComponent);