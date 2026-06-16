import React from "react";
import {StarOutlined} from "@ant-design/icons";
import {ThemeInterface} from "../../TypeScripts/PublicInterface";
import {HoverButton} from "../PublicComponents/PublicButton";

interface MenuFooterComponentProps {
    theme: ThemeInterface;
}

function MenuFooterComponent(props: MenuFooterComponentProps) {
    return (
        <HoverButton theme={props.theme} icon={<StarOutlined />}>
            {"如果喜欢这款插件，请考虑五星好评"}
        </HoverButton>
    );
}

export default React.memo(MenuFooterComponent);