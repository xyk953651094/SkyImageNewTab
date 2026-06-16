import React from "react";
import {Button, Col, Row, Typography} from "antd";
import {InfoCircleOutlined} from "@ant-design/icons";
import {changeButtonTheme} from "../../TypeScripts/PublicFunctions";
import {ThemeInterface} from "../../TypeScripts/PublicInterface";

const {Text} = Typography;

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
                <Button type={"text"} 
                        icon={<InfoCircleOutlined />} size={"large"}
                        style={{color: props.theme.secondaryFontColor, cursor: "default"}}
                        onMouseOver={(e) => changeButtonTheme(props.theme.primaryColor, props.theme.primaryFontColor, e)}
                        onMouseOut={(e) => changeButtonTheme("transparent", props.theme.secondaryFontColor, e)}>
                    {"版本：V" + require("../../../package.json").version}
                </Button>
            </Col>
        </Row>
    );
}

export default MenuHeaderComponent;