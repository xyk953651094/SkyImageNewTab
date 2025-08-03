import React from "react";
import {Button, Row} from "antd";
import {ToTopOutlined} from "@ant-design/icons";
import {changeButtonTheme} from "../../TypeScripts/PublicFunctions";

function MenuToTopComponent(props: any) {
    function toTopBtnOnClick() {
        let drawerContent: HTMLElement | null = document.getElementById("drawerContent");
        if (drawerContent) {
            drawerContent.scrollIntoView({behavior: "smooth"});
        }
    }
    
    return (
        <Row justify={"center"}>
            <Button type={"text"}
                    icon={<ToTopOutlined/>} size={"large"}
                    style={{color: props.theme.secondaryFontColor}}
                    onClick={toTopBtnOnClick}
                    onMouseOver={(e) => changeButtonTheme(props.theme.primaryColor, props.theme.primaryFontColor, e)}
                    onMouseOut={(e) => changeButtonTheme("transparent", props.theme.secondaryFontColor, e)}>
                {"回到顶部"}
            </Button>
        </Row>
    );
}

export default MenuToTopComponent;