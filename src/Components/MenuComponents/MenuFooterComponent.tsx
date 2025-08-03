import React from "react";
import {Button} from "antd";
import {StarOutlined} from "@ant-design/icons";
import {changeButtonTheme} from "../../TypeScripts/PublicFunctions";

function MenuFooterComponent(props: any) {
    return (
        <Button type={"text"} 
                icon={<StarOutlined />} size={"large"}
                style={{color: props.theme.secondaryFontColor, cursor: "default"}}
                onMouseOver={(e) => changeButtonTheme(props.theme.primaryColor, props.theme.primaryFontColor, e)}
                onMouseOut={(e) => changeButtonTheme("transparent", props.theme.secondaryFontColor, e)}>
            {"如果喜欢这款插件，请考虑五星好评"}
        </Button>
    );
}

export default MenuFooterComponent;