import React, {useEffect, useState} from "react";
import {Avatar, Button, Col, Divider, List, message, Popover, Row, Space, Typography} from "antd";
import {
    CameraOutlined,
    EnvironmentOutlined,
    HomeOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
import {unsplashUrl} from "../TypeScripts/PublicConstants";
import {
    changeButtonTheme,
    changeTheme,
    isEmpty
} from "../TypeScripts/PublicFunctions";
import "../StyleSheets/PublicStyles.scss"

const {Text} = Typography;
const btnMaxSize = 50;

function AuthorComponent(props: any) {
    const [authorName, setAuthorName] = useState<any>("暂无信息");
    const [authorLink, setAuthorLink] = useState<string>("");
    const [authorIconUrl, setAuthorIconUrl] = useState<string>("");
    const [authorCollections, setAuthorCollections] = useState<number>(0);
    const [authorLikes, setAuthorLikes] = useState<number>(0);
    const [authorPhotos, setAuthorPhotos] = useState<number>(0);
    const [imageLink, setImageLink] = useState<string>("");
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
    const [imageLocation, setImageLocation] = useState<string>("");
    const [imageDescription, setImageDescription] = useState<string>("");
    
    function imageLinkBtnOnClick() {
        if (!isEmpty(imageLink)) {
            window.open(imageLink + unsplashUrl, "_self");
        } else {
            message.error("无跳转链接");
        }
    }
    
    useEffect(() => {
        if(!isEmpty(props.theme)) {
            changeTheme("#authorBtn", props.theme.secondaryColor, props.theme.secondaryFontColor);
        }
        
        if(!isEmpty(props.imageData)) {
            setAuthorName(props.imageData.user.name);
            setAuthorLink(props.imageData.user.links.html);
            setAuthorIconUrl(props.imageData.user.profile_image.large);
            setAuthorCollections(props.imageData.user.total_collections);
            setAuthorLikes(props.imageData.user.total_likes);
            setAuthorPhotos(props.imageData.user.total_photos);
            setImageLink(props.imageData.links.html);
            setImagePreviewUrl(props.imageData.urls.regular);
            setImageLocation(isEmpty(props.imageData.location.name) ? "暂无信息" : props.imageData.location.name);
            setImageDescription(isEmpty(props.imageData.alt_description) ? "暂无信息" : props.imageData.alt_description);
        }
    }, [props.imageData, props.theme]);
    
    const popoverTitle = (
        <Row align={"middle"}>
            <Col span={10}>
                <Text style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}>{"摄影师与照片信息"}</Text>
            </Col>
            <Col span={14} style={{textAlign: "right"}}>
                <Space>
                    <Button type={"text"}
                            icon={<HomeOutlined/>} size={"large"}
                            style={{color: props.theme.secondaryFontColor}}
                            onClick={imageLinkBtnOnClick}
                            onMouseOver={(e) => changeButtonTheme(props.theme.primaryColor, props.theme.primaryFontColor, e)}
                            onMouseOut={(e) => changeButtonTheme("transparent", props.theme.secondaryFontColor, e)}>
                        {"图片主页"}
                    </Button>
                </Space>
            </Col>
        </Row>
    )
    
    const popoverContent = (
        <List>
            <List.Item>
                <Space align={"center"}>
                    <Avatar size={90} src={authorIconUrl} alt={"作者"}/>
                    <Space direction={"vertical"}>
                        <Button type={"text"}
                                icon={<CameraOutlined/>} size={"large"}
                                style={{color: props.theme.secondaryFontColor, cursor: "default"}}
                                onMouseOver={(e) => changeButtonTheme(props.theme.primaryColor, props.theme.primaryFontColor, e)}
                                onMouseOut={(e) => changeButtonTheme("transparent", props.theme.secondaryFontColor, e)}>
                            {"由 Unsplash 的 " + (authorName.length < btnMaxSize ? authorName : authorName.substring(0, btnMaxSize) + "...") + " 拍摄"}
                        </Button>
                        <Space>
                            <Button type={"text"} 
                                    icon={<i className="bi bi-collection"></i>} size={"large"}
                                    style={{color: props.theme.secondaryFontColor, cursor: "default"}}
                                    onMouseOver={(e) => changeButtonTheme(props.theme.primaryColor, props.theme.primaryFontColor, e)}
                                    onMouseOut={(e) => changeButtonTheme("transparent", props.theme.secondaryFontColor, e)}>
                                {" " + authorCollections + " 个合集"}
                            </Button>
                            <Divider type="vertical" style={{borderColor: props.theme.secondaryFontColor}}/>
                            <Button type={"text"} 
                                    icon={<i className="bi bi-heart"></i>} size={"large"}
                                    style={{color: props.theme.secondaryFontColor, cursor: "default"}}
                                    onMouseOver={(e) => changeButtonTheme(props.theme.primaryColor, props.theme.primaryFontColor, e)}
                                    onMouseOut={(e) => changeButtonTheme("transparent", props.theme.secondaryFontColor, e)}>
                                {" " + authorLikes + " 个点赞"}
                            </Button>
                            <Divider type="vertical" style={{borderColor: props.theme.secondaryFontColor}}/>
                            <Button type={"text"} 
                                    icon={<i className="bi bi-images"></i>} size={"large"}
                                    style={{color: props.theme.secondaryFontColor, cursor: "default"}}
                                    onMouseOver={(e) => changeButtonTheme(props.theme.primaryColor, props.theme.primaryFontColor, e)}
                                    onMouseOut={(e) => changeButtonTheme("transparent", props.theme.secondaryFontColor, e)}>
                                {" " + authorPhotos + " 张照片"}
                            </Button>
                        </Space>
                    </Space>
                </Space>
            </List.Item>
            <List.Item>
                <Space direction={"vertical"}>
                    <Space>
                        <Avatar size={90} shape={"square"} src={imagePreviewUrl} alt={"信息"}/>
                        <Space direction={"vertical"}>
                            <Button type={"text"} 
                                    icon={<InfoCircleOutlined/>} size={"large"}
                                    style={{color: props.theme.secondaryFontColor, cursor: "default"}}
                                    onMouseOver={(e) => changeButtonTheme(props.theme.primaryColor, props.theme.primaryFontColor, e)}
                                    onMouseOut={(e) => changeButtonTheme("transparent", props.theme.secondaryFontColor, e)}>
                                {imageDescription.length < btnMaxSize ? imageDescription : imageDescription.substring(0, btnMaxSize) + "..."}
                            </Button>
                            <Button type={"text"} 
                                    icon={<EnvironmentOutlined/>} size={"large"}
                                    style={{color: props.theme.secondaryFontColor, cursor: "default"}}
                                    onMouseOver={(e) => changeButtonTheme(props.theme.primaryColor, props.theme.primaryFontColor, e)}
                                    onMouseOut={(e) => changeButtonTheme("transparent", props.theme.secondaryFontColor, e)}>
                                {imageLocation.length < btnMaxSize ? imageLocation : imageLocation.substring(0, btnMaxSize) + "..."}
                            </Button>
                        </Space>
                    </Space>
                </Space>
            </List.Item>
        </List>
    );
    
    return (
        <Popover title={popoverTitle} content={popoverContent} placement={"topRight"}
                 color={props.theme.secondaryColor}
                 overlayStyle={{minWidth: "600px"}}>
            <Button icon={<CameraOutlined/>} size={"large"}
                    id={"authorBtn"}
                    className={"componentTheme zIndexHigh"}
                    style={{cursor: "default", backgroundColor: props.theme.secondaryColor, color: props.theme.secondaryFontColor}}
            >
                {"由 Unsplash 的 " + (authorName.length < btnMaxSize ? authorName : authorName.substring(0, btnMaxSize) + "...") + " 拍摄"}
            </Button>
        </Popover>
    );
}

export default AuthorComponent;