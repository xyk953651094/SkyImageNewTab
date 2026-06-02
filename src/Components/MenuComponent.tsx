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
        
        if (!isEmpty(props.theme)) {
            changeTheme("#imageHistoryBtn", props.theme.secondaryColor, props.theme.secondaryFontColor);
        }
    }, [props.theme]);
    
    return (
        <>
            <Tooltip title={<Text style={{color: props.theme.secondaryFontColor}}>{"菜单栏"}</Text>} placement={"bottomRight"} color={props.theme.secondaryColor}>
                <Button icon={<MenuOutlined/>} size={"large"}
                        onClick={showDrawerBtnOnClick}
                        id={"preferenceBtn"}
                        className={"componentTheme zIndexHigh"}
                        style={{
                            backgroundColor: props.theme.secondaryColor,
                            color: props.theme.secondaryFontColor
                        }}
                />
            </Tooltip>
            <Drawer
                size={420}
                placement={drawerPosition}
                onClose={drawerOnClose}
                open={displayDrawer}
                closeIcon={false}
                styles={{
                    mask: {backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)"},
                    header: {color: props.theme.secondaryFontColor, borderBottomColor: props.theme.secondaryFontColor},
                    section: {backgroundColor: props.theme.secondaryColor},
                    footer: {
                        backgroundColor: props.theme.secondaryColor,
                        borderTopColor: props.theme.secondaryFontColor,
                        textAlign: "center"
                    }
                }}
                title={
                    <MenuHeaderComponent
                        theme={props.theme}
                        preference={props.preference}/>
                }
                footer={
                    <MenuFooterComponent
                        theme={props.theme}
                        preference={props.preference}/>
                }
            >
                <Space direction={"vertical"} size={"large"} id={"drawerContent"}>
                    <MenuPreferenceComponent
                        theme={props.theme}
                        preference={props.preference}
                        getPreference={props.getPreference}/>
                    <MenuInfoComponent
                        theme={props.theme}
                        preference={props.preference}/>
                    <MenuContactComponent
                        theme={props.theme}
                        preference={props.preference}/>
                    <MenuToTopComponent
                        theme={props.theme}
                        preference={props.preference}/>
                </Space>
            </Drawer>
        </>
    );
}

export default MenuComponent;