import React, {useEffect, useState} from "react";
import {Button, Drawer, Space, Tooltip, Typography} from "antd";
import {MenuOutlined} from "@ant-design/icons";
import {changeTheme, isEmpty} from "../TypeScripts/PublicFunctions";
import {deviceType} from "../TypeScripts/PublicConstants";
import MenuHeaderComponent from "./MenuComponents/MenuHeaderComponent";
import MenuFooterComponent from "./MenuComponents/MenuFooterComponent";
import MenuInfoComponent from "./MenuComponents/MenuInfoComponent";
import MenuContactComponent from "./MenuComponents/MenuContactComponent";
import MenuToTopComponent from "./MenuComponents/menuToTopComponent";
import MenuPreferenceComponent from "./MenuComponents/MenuPreferenceComponent";

const {Text} = Typography;

function MenuComponent(props: any) {
    const [hoverColor, setHoverColor] = useState<string>("");
    const [backgroundColor, setBackgroundColor] = useState<string>("");
    const [fontColor, setFontColor] = useState<string>("");
    const [displayDrawer, setDisplayDrawer] = useState<boolean>(false);
    const [drawerPosition, setDrawerPosition] = React.useState<"right" | "bottom">("right");
    
    function showDrawerBtnOnClick() {
        setDisplayDrawer(true);
    }
    
    function drawerOnClose() {
        setDisplayDrawer(false);
    }
    
    useEffect(() => {
        // 屏幕适配
        if (deviceType === "iPhone" || deviceType === "Android") {
            setDrawerPosition("bottom");
        }
        
        if (!isEmpty(props.theme.mainColor) && !isEmpty(props.theme.backgroundColor) && !isEmpty(props.theme.fontColor)) {
            setHoverColor(props.theme.mainColor);
            setBackgroundColor(props.theme.backgroundColor);
            setFontColor(props.theme.fontColor);
            changeTheme("#imageHistoryBtn", props.theme.backgroundColor, props.theme.fontColor);
        }
    }, [props.theme.backgroundColor, props.theme.fontColor, props.theme.mainColor]);
    
    return (
        <>
            <Tooltip title={<Text style={{color: fontColor}}>{"菜单栏"}</Text>} placement={"bottomRight"} color={backgroundColor}>
                <Button icon={<MenuOutlined/>} size={"large"}
                        onClick={showDrawerBtnOnClick}
                        id={"preferenceBtn"}
                        className={"componentTheme zIndexHigh"}
                        style={{
                            backgroundColor: backgroundColor,
                            color: props.theme.fontColor
                        }}
                />
            </Tooltip>
            <Drawer
                size={"default"}
                width={420}
                height={500}
                placement={drawerPosition}
                onClose={drawerOnClose}
                open={displayDrawer}
                closeIcon={false}
                styles={{
                    mask: {backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)"},
                    header: {color: fontColor, borderBottomColor: fontColor},
                    content: {backgroundColor: backgroundColor},
                    footer: {
                        backgroundColor: backgroundColor,
                        borderTopColor: fontColor,
                        textAlign: "center"
                    }
                }}
                title={
                    <MenuHeaderComponent
                        hoverColor={hoverColor}
                        fontColor={fontColor}
                        preference={props.preference}/>
                }
                footer={
                    <MenuFooterComponent
                        hoverColor={hoverColor}
                        fontColor={fontColor}
                        preference={props.preference}/>
                }
            >
                <Space direction={"vertical"} size={"large"} id={"drawerContent"}>
                    <MenuPreferenceComponent
                        hoverColor={hoverColor}
                        backgroundColor={backgroundColor}
                        fontColor={fontColor}
                        getPreference={props.getPreference}/>
                    <MenuInfoComponent
                        hoverColor={hoverColor}
                        backgroundColor={backgroundColor}
                        fontColor={fontColor}
                        preference={props.preference}/>
                    <MenuContactComponent
                        hoverColor={hoverColor}
                        backgroundColor={backgroundColor}
                        fontColor={fontColor}
                        preference={props.preference}/>
                    <MenuToTopComponent
                        hoverColor={hoverColor}
                        fontColor={fontColor}
                        preference={props.preference}/>
                </Space>
            </Drawer>
        </>
    );
}

export default MenuComponent;