import React from "react";
import {Col, Row, Typography} from "antd";
import {ThemeInterface} from "../../TypeScripts/PublicInterface";
import { HoverButton } from "../PublicComponents/PublicButton";
import {getGreetInfo} from "../../TypeScripts/GreetComponent";

const {Text} = Typography;

const { icon, greet } = getGreetInfo();

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
                <HoverButton theme={props.theme} icon={<i className={icon} />}>
                    {greet}
                </HoverButton>
            </Col>
        </Row>
    );
}

export default React.memo(MenuHeaderComponent);