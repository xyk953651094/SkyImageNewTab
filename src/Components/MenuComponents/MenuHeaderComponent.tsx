import React from "react";
import {Col, Row, Typography} from "antd";
import {InfoCircleOutlined} from "@ant-design/icons";
import {ThemeInterface} from "../../TypeScripts/PublicInterface";
import { HoverButton } from "../PublicComponents/PublicButton";

const {Text} = Typography;

const version = require("../../../package.json").version;

interface MenuHeaderComponentProps {
    theme: ThemeInterface;
}

function MenuHeaderComponent(props: MenuHeaderComponentProps) {
    return (
        <Row align={"middle"}>
            <Col span={6}>
                <Text style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}>{"菜单栏"}</Text>
            </Col>
            <Col span={18} style={{textAlign: "right"}}>
                <HoverButton theme={props.theme} icon={<InfoCircleOutlined />}>
                    {"版本：V" + version}
                </HoverButton>
            </Col>
        </Row>
    );
}

export default React.memo(MenuHeaderComponent);