import React from "react";
import {Button, Row} from "antd";
import {ToTopOutlined} from "@ant-design/icons";
import {btnMouseOut, btnMouseOver} from "../../TypeScripts/PublicFunctions";

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
                    style={{color: props.fontColor}}
                    onClick={toTopBtnOnClick}
                    onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                    onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                {"回到顶部"}
            </Button>
        </Row>
    );
}

export default MenuToTopComponent;