import React, {useMemo, useRef, useState} from "react";
import {Button, Drawer, Row, Space, Tooltip, Typography} from "antd";
import {MenuFoldOutlined, ToTopOutlined} from "@ant-design/icons";
import {deviceType} from "../TypeScripts/PublicConstants";
import MenuHeaderComponent from "./MenuComponents/MenuHeaderComponent";
import MenuFooterComponent from "./MenuComponents/MenuFooterComponent";
import MenuInfoComponent from "./MenuComponents/MenuInfoComponent";
import MenuContactComponent from "./MenuComponents/MenuContactComponent";
import MenuPreferenceComponent from "./MenuComponents/MenuPreferenceComponent";
import {PreferenceInterface, ThemeInterface} from "../TypeScripts/PublicInterface";
import {HoverButton} from "./PublicComponents/PublicButton";

const {Text} = Typography;
const drawerPosition = (deviceType === "iPhone" || deviceType === "Android") ? "bottom" : "right";

interface MenuComponentProps {
    theme: ThemeInterface;
    preference: PreferenceInterface;
    getPreference: React.Dispatch<React.SetStateAction<PreferenceInterface>>;
}

function MenuComponent(props: MenuComponentProps) {
    const [displayDrawer, setDisplayDrawer] = useState<boolean>(false);
    const drawerContentRef = useRef<HTMLDivElement>(null);
    
    const buttonStyle = useMemo(() => ({
        backgroundColor: props.theme.secondaryColor,
        color: props.theme.secondaryFontColor,
    }), [props.theme.secondaryColor, props.theme.secondaryFontColor]);
    
    const tooltipTextStyle = useMemo(() => ({
        color: props.theme.secondaryFontColor,
    }), [props.theme.secondaryFontColor]);
    
    const drawerStyles = useMemo(() => ({
        mask: {backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)"},
        header: {color: props.theme.secondaryFontColor, borderBottomColor: props.theme.secondaryFontColor},
        section: {backgroundColor: props.theme.secondaryColor},
        footer: {
            backgroundColor: props.theme.secondaryColor,
            borderTopColor: props.theme.secondaryFontColor,
            textAlign: "center" as const,
        },
    }), [props.theme.secondaryColor, props.theme.secondaryFontColor]);
    
    function showDrawerBtnOnClick() {
        setDisplayDrawer(true);
    }
    
    function drawerOnClose() {
        setDisplayDrawer(false);
    }
    
    function scrollToTop() {
        drawerContentRef.current?.scrollIntoView({behavior: "smooth"});
    }
    
    return (
        <>
            <Tooltip title={<Text style={tooltipTextStyle}>{"菜单栏"}</Text>} placement={"bottomRight"} color={props.theme.secondaryColor}>
                <Button icon={<MenuFoldOutlined />} size={"large"} type={"primary"}
                        onClick={showDrawerBtnOnClick}
                        style={buttonStyle}
                />
            </Tooltip>
            <Drawer
                size={420}
                placement={drawerPosition}
                onClose={drawerOnClose}
                open={displayDrawer}
                closeIcon={false}
                styles={drawerStyles}
                title={
                    <MenuHeaderComponent theme={props.theme}/>
                }
                footer={
                    <MenuFooterComponent theme={props.theme}/>
                }
            >
                <Space orientation={"vertical"} size={"large"} ref={drawerContentRef}>
                    <MenuPreferenceComponent
                        theme={props.theme}
                        preference={props.preference}
                        getPreference={props.getPreference}/>
                    <MenuInfoComponent theme={props.theme}/>
                    <MenuContactComponent theme={props.theme}/>
                    <Row justify={"center"}>
                        <HoverButton theme={props.theme} icon={<ToTopOutlined/>} onClick={scrollToTop}>
                            {"回到顶部"}
                        </HoverButton>
                    </Row>
                </Space>
            </Drawer>
        </>
    );
}

export default React.memo(MenuComponent);