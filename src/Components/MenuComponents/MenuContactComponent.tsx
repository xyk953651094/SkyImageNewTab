import React from "react";
import {Button, Card, Col, Row, Typography} from "antd";
import {DislikeOutlined, GithubOutlined, GitlabOutlined, LikeOutlined, MailOutlined} from "@ant-design/icons";
import {btnMouseOut, btnMouseOver} from "../../TypeScripts/PublicFunctions";

const {Text} = Typography;
function MenuContactComponent(props: any) {
    return (
        <Card title={<Text style={{color: props.fontColor, fontSize: "16px"}}>{"联系作者"}</Text>}
              extra={<MailOutlined style={{color: props.fontColor, fontSize: "16px"}}/>}
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
                            href={"https://github.com/xyk953651094/"} target={"_self"}
                            style={{color: props.fontColor}}
                            onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                            onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                        {"作者主页"}
                    </Button>
                </Col>
                <Col span="12" style={{textAlign: "center"}}>
                    <Button type={"text"} 
                            icon={<GitlabOutlined/>} size={"large"}
                            href={"https://gitlab.com/xyk953651094/"} target={"_self"}
                            style={{color: props.fontColor}}
                            onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                            onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                        {"作者主页"}
                    </Button>
                </Col>
                <Col span="12" style={{textAlign: "center"}}>
                    <Button type={"text"} 
                            icon={<GithubOutlined/>} size={"large"}
                            href={"https://github.com/xyk953651094?tab=repositories"} target={"_self"}
                            style={{color: props.fontColor}}
                            onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                            onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                        {"更多产品"}
                    </Button>
                </Col>
                <Col span="12" style={{textAlign: "center"}}>
                    <Button type={"text"} 
                            icon={<GitlabOutlined/>} size={"large"}
                            href={"https://gitlab.com/users/xyk953651094/projects/"} target={"_self"}
                            style={{color: props.fontColor}}
                            onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                            onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                        {"更多产品"}
                    </Button>
                </Col>
                <Col span="12" style={{textAlign: "center"}}>
                    <Button type={"text"} 
                            icon={<LikeOutlined/>} size={"large"}
                            href={"mailto:xyk953651094@qq.com?&subject=云开新标签页-功能建议&body=温馨提示：建议前烦请优先查阅帮助文档"} target={"_self"}
                            style={{color: props.fontColor}}
                            onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                            onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                        {"功能建议"}
                    </Button>
                </Col>
                <Col span="12" style={{textAlign: "center"}}>
                    <Button type={"text"} 
                            icon={<DislikeOutlined/>} size={"large"}
                            href={"mailto:xyk953651094@qq.com?&subject=云开新标签页-问题反馈&body=温馨提示：反馈前烦请优先查阅帮助文档"} target={"_self"}
                            style={{color: props.fontColor}}
                            onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                            onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                        {"问题反馈"}
                    </Button>
                </Col>
            </Row>
        </Card>
    );
}

export default MenuContactComponent;