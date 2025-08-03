import React from "react";
import {Button, Col, Row, Typography} from "antd";
import {InfoCircleOutlined} from "@ant-design/icons";
import {changeButtonTheme} from "../../TypeScripts/PublicFunctions";

const {Text} = Typography;

function MenuHeaderComponent(props: any) {
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
                    {"当前版本：V" + require("../../../package.json").version}
                </Button>
            </Col>
        </Row>
    );
}

export default MenuHeaderComponent;