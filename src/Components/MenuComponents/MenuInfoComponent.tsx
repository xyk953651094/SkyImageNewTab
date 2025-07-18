import React from "react";
import {Button, Card, Col, Row, Typography} from "antd";
import {GithubOutlined, GitlabOutlined, InfoCircleOutlined} from "@ant-design/icons";
import {btnMouseOut, btnMouseOver} from "../../TypeScripts/PublicFunctions";

const {Text} = Typography;
function MenuInfoComponent(props: any) {
    return (
        <Card title={<Text style={{color: props.fontColor, fontSize: "16px"}}>{"产品信息"}</Text>}
              extra={<InfoCircleOutlined style={{color: props.fontColor, fontSize: "16px"}}/>}
              style={{border: "1px solid " + props.fontColor}}
              styles={{
                  header: {
                      backgroundColor: props.backgroundColor,
                      color: props.fontColor,
                      borderBottom: "2px solid " + props.fontColor
                  },
                  body: {
                      backgroundColor: props.backgroundColor
                  }
              }}
        >
            <Row gutter={[0, 8]}>
                <Col span="12" style={{textAlign: "center"}}>
                    <Button type={"text"} 
                            icon={<GithubOutlined/>} size={"large"}
                            href={"https://github.com/xyk953651094/SkyImageNewTab/"} target={"_self"}
                            style={{color: props.fontColor}}
                            onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                            onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                        {"产品主页"}
                    </Button>
                </Col>
                <Col span="12" style={{textAlign: "center"}}>
                    <Button type={"text"} 
                            icon={<GitlabOutlined/>} size={"large"}
                            href={"https://gitlab.com/xyk953651094/SkyImageNewTab/"} target={"_self"}
                            style={{color: props.fontColor}}
                            onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                            onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                        {"产品主页"}
                    </Button>
                </Col>
                <Col span="12" style={{textAlign: "center"}}>
                    <Button type={"text"} 
                            icon={<GithubOutlined/>} size={"large"}
                            href={"https://github.com/xyk953651094/SkyImageNewTab/releases/"} target={"_self"}
                            style={{color: props.fontColor}}
                            onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                            onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                        {"更新日志"}
                    </Button>
                </Col>
                <Col span="12" style={{textAlign: "center"}}>
                    <Button type={"text"} 
                            icon={<GitlabOutlined/>} size={"large"}
                            href={"https://gitlab.com/xyk953651094/SkyImageNewTab/-/releases/"} target={"_self"}
                            style={{color: props.fontColor}}
                            onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                            onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                        {"更新日志"}
                    </Button>
                </Col>
                <Col span="12" style={{textAlign: "center"}}>
                    <Button type={"text"} 
                            icon={<GithubOutlined/>} size={"large"}
                            href={"https://xyk953651094.github.io/SkyDocuments/"} target={"_self"}
                            style={{color: props.fontColor}}
                            onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                            onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                        {"帮助文档"}
                    </Button>
                </Col>
                <Col span="12" style={{textAlign: "center"}}>
                    <Button type={"text"} 
                            icon={<GitlabOutlined/>} size={"large"}
                            href={"https://xyk953651094.gitlab.io/SkyDocuments/"} target={"_self"}
                            style={{color: props.fontColor}}
                            onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                            onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                        {"帮助文档"}
                    </Button>
                </Col>
            </Row>
        </Card>
    );
}

export default MenuInfoComponent;