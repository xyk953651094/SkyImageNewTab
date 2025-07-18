import React from "react";
import {Button, Space} from "antd";
import {StarOutlined} from "@ant-design/icons";
import {btnMouseOut, btnMouseOver} from "../../TypeScripts/PublicFunctions";

function MenuFooterComponent(props: any) {
    return (
        <Button type={"text"} 
                icon={<StarOutlined />} size={"large"}
                style={{color: props.fontColor, cursor: "default"}}
                onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
            {"如果喜欢这款插件，请考虑五星好评"}
        </Button>
    );
}

export default MenuFooterComponent;