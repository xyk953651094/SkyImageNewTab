import React, {useEffect, useMemo, useState, useCallback} from "react";
import {Avatar, Button, Col, Divider, List, message, Popover, Row, Space, Typography} from "antd";
import {
    CameraOutlined,
    EnvironmentOutlined,
    HomeOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
import {unsplashUrl} from "../TypeScripts/PublicConstants";
import {isEmpty, truncateText} from "../TypeScripts/PublicFunctions";
import "../StyleSheets/PublicStyles.scss"
import {ThemeInterface, UnsplashImageData} from "../TypeScripts/PublicInterface";
import {DisplayButton, HoverButton} from "./PublicComponents/PublicButton";

const {Text} = Typography;
const btnMaxSize = 50;

interface AuthorComponentProps {
    theme: ThemeInterface;
    imageData: UnsplashImageData | null;
}

interface AuthorInfo {
    name: string;
    link: string;
    iconUrl: string;
    collections: number;
    likes: number;
    photos: number;
}

interface ImageInfo {
    link: string;
    previewUrl: string;
    location: string;
    description: string;
}

const defaultAuthor: AuthorInfo = {
    name: "暂无信息",
    link: "",
    iconUrl: "",
    collections: 0,
    likes: 0,
    photos: 0,
};

const defaultImage: ImageInfo = {
    link: "",
    previewUrl: "",
    location: "",
    description: "",
};

function AuthorComponent(props: AuthorComponentProps) {
    const [author, setAuthor] = useState<AuthorInfo>(defaultAuthor);
    const [image, setImage] = useState<ImageInfo>(defaultImage);
    
    const imageLinkBtnOnClick = useCallback(() => {
        if (!isEmpty(image.link)) {
            window.open(image.link + unsplashUrl, "_self");
        } else {
            message.error("无跳转链接");
        }
    }, [image.link]);
    
    useEffect(() => {
        if (props.imageData) {
            const {user, links, urls, location, alt_description} = props.imageData;
            setAuthor({
                name: user.name,
                link: user.links.html,
                iconUrl: user.profile_image.large,
                collections: user.total_collections,
                likes: user.total_likes,
                photos: user.total_photos,
            });
            setImage({
                link: links.html,
                previewUrl: urls.regular,
                location: location.name ?? "暂无信息",
                description: alt_description ?? "暂无信息",
            });
        }
    }, [props.imageData]);
    
    const popoverTitle = useMemo(() => (
        <Row align={"middle"}>
            <Col span={10}>
                <Text style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}>{"摄影师与照片信息"}</Text>
            </Col>
            <Col span={14} style={{textAlign: "right"}}>
                <Space>
                    <HoverButton theme={props.theme} icon={<HomeOutlined/>} onClick={imageLinkBtnOnClick}>
                        {"图片主页"}
                    </HoverButton>
                </Space>
            </Col>
        </Row>
    ), [props.theme, imageLinkBtnOnClick]);
    
    const popoverContent = useMemo(() => (
        <List>
            <List.Item>
                <Space align={"center"}>
                    <Avatar size={90} src={author.iconUrl} alt={"作者"}/>
                    <Space orientation={"vertical"}>
                        <DisplayButton theme={props.theme} icon={<CameraOutlined/>}>
                            {"由 Unsplash 的 " + truncateText(author.name, btnMaxSize) + " 拍摄"}
                        </DisplayButton>
                        <Space>
                            <DisplayButton theme={props.theme} icon={<i className="bi bi-collection"></i>}>
                                {" " + author.collections + " 个合集"}
                            </DisplayButton>
                            <Divider orientation="vertical" style={{borderColor: props.theme.secondaryFontColor}}/>
                            <DisplayButton theme={props.theme} icon={<i className="bi bi-heart"></i>}>
                                {" " + author.likes + " 个点赞"}
                            </DisplayButton>
                            <Divider orientation="vertical" style={{borderColor: props.theme.secondaryFontColor}}/>
                            <DisplayButton theme={props.theme} icon={<i className="bi bi-images"></i>}>
                                {" " + author.photos + " 张照片"}
                            </DisplayButton>
                        </Space>
                    </Space>
                </Space>
            </List.Item>
            <List.Item>
                <Space orientation={"vertical"}>
                    <Space>
                        <Avatar size={90} shape={"square"} src={image.previewUrl} alt={"信息"}/>
                        <Space orientation={"vertical"}>
                            <DisplayButton theme={props.theme} icon={<InfoCircleOutlined/>}>
                                {truncateText(image.description, btnMaxSize)}
                            </DisplayButton>
                            <DisplayButton theme={props.theme} icon={<EnvironmentOutlined/>}>
                                {truncateText(image.location, btnMaxSize)}
                            </DisplayButton>
                        </Space>
                    </Space>
                </Space>
            </List.Item>
        </List>
    ), [props.theme, author, image]);
    
    return (
        <Popover title={popoverTitle} content={popoverContent} placement={"topRight"}
                 color={props.theme.secondaryColor}
                 styles={{root: {minWidth: "600px"}}}>
            <Button icon={<CameraOutlined/>} size={"large"}
                    id={"authorBtn"}
                    className={"componentTheme zIndexHigh"}
                    style={{
                        cursor: "default",
                        backgroundColor: props.theme.secondaryColor,
                        color: props.theme.secondaryFontColor
                    }}
            >
                {"由 Unsplash 的 " + truncateText(author.name, btnMaxSize) + " 拍摄"}
            </Button>
        </Popover>
    );
}

export default AuthorComponent;