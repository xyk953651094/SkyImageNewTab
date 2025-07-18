import React, {useState} from "react";
import {
    Button,
    Card, Checkbox,
    Col,
    Form, Input,
    message, Modal,
    Radio,
    RadioChangeEvent,
    Row, Select,
    Space,
    Switch,
    Typography,
    Upload
} from "antd";
import {
    TagOutlined,
    RedoOutlined,
    SettingOutlined,
    ImportOutlined,
    ExportOutlined,
    CheckOutlined,
    CloseOutlined
} from "@ant-design/icons";
import {
    btnMouseOut,
    btnMouseOver,
    getPreferenceStorage, getTimeDetails, isEmpty,
} from "../../TypeScripts/PublicFunctions";
import {PreferenceInterface} from "../../TypeScripts/PublicInterface";
import {defaultPreference} from "../../TypeScripts/PublicConstants";

const {Text} = Typography;

function MenuPreferenceComponent(props: any) {
    const [formDisabled, setFormDisabled] = useState<boolean>(false);
    const [disableImageTopic, setDisableImageTopic] = useState<boolean>(false);
    const [imageTopicStatus, setImageTopicStatus] = useState<string>("已启用图片主题");
    const [customTopicStatus, setCustomTopicStatus] = useState<string>("已禁用自定主题");
    const [displayCustomTopicModal, setDisplayCustomTopicModal] = useState<boolean>(false);
    const [customTopicInputValue, setCustomTopicInputValue] = useState<string>("");
    const [displayResetPreferenceModal, setDisplayResetPreferenceModal] = useState<boolean>(false);
    const [displayClearStorageModal, setDisplayClearStorageModal] = useState<boolean>(false);
    const [preference, setPreference] = useState<PreferenceInterface>(getPreferenceStorage());
    
    function refreshWindow() {
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
    
    function changePreference(data: Object) {
        return Object.assign({}, preference, data);
    }
    
    // 预设主题
     function imageTopicsSelectOnChange(selectedValues: string) {
         setPreference(changePreference({imageTopics: selectedValues}));
         localStorage.setItem("preference", JSON.stringify(preference));
         props.getPreference(preference);
         message.success("已更换图片主题，下次切换图片时生效");
         if (selectedValues.length === 0) {
             message.info("全不选与全选的效果一样");
         }
    }
    
    // 自定主题
    function customTopicBtnOnClick() {
        setDisplayCustomTopicModal(true);
    }
    
    function customTopicInputOnChange(e: any) {
        setCustomTopicInputValue(e.target.value)
    }
    
    function customTopicOkBtnOnClick() {
        if (customTopicInputValue.length !== 0) {
            setDisplayCustomTopicModal(false);
            setPreference(changePreference({customTopic: customTopicInputValue}));
            setDisableImageTopic(!isEmpty(customTopicInputValue));
            setImageTopicStatus(isEmpty(customTopicInputValue)? "已启用图片主题" : "已禁用图片主题");
            setCustomTopicStatus(isEmpty(customTopicInputValue)? "已禁用自定主题" : "已启用自定主题");
            localStorage.setItem("preference", JSON.stringify(preference));
            props.getPreference(preference);
            
            if(!isEmpty(customTopicInputValue)) {
                message.success("已启用自定主题，下次切换图片时生效");
            } else {
                setFormDisabled(true);
                message.success("已禁用自定主题，一秒后刷新页面");
                refreshWindow();
            }
        } else {
            setDisplayCustomTopicModal(false);
            setFormDisabled(true);
            setPreference(changePreference({customTopic: ""}));
            setDisableImageTopic(false);
            setImageTopicStatus("已启用图片主题");
            setCustomTopicStatus("已禁用自定主题");
            localStorage.setItem("preference", JSON.stringify(preference));
            props.getPreference(preference);
            message.success("已禁用自定主题，一秒后刷新页面");
            refreshWindow();
        }
    }
    
    function customTopicCancelBtnOnClick() {
        setDisplayCustomTopicModal(false)
    }
    
    // 重置设置
    function resetPreferenceBtnOnClick() {
        let resetTimeStampStorage = localStorage.getItem("resetTimeStamp");
        if (resetTimeStampStorage && new Date().getTime() - parseInt(resetTimeStampStorage) < 60 * 1000) {
            message.error("操作过于频繁，请稍后再试");
        } else {
            setDisplayResetPreferenceModal(true);
        }
    }
    
    function resetPreferenceOkBtnOnClick() {
        setFormDisabled(true);
        setDisplayResetPreferenceModal(false);
        localStorage.setItem("preference", JSON.stringify(defaultPreference));
        localStorage.setItem("resetTimeStamp", JSON.stringify(new Date().getTime()));
        message.success("已重置设置，一秒后刷新页面");
        refreshWindow();
    }
    
    function resetPreferenceCancelBtnOnClick() {
        setDisplayResetPreferenceModal(false)
    }
    
    // 重置插件
    function clearStorageBtnOnClick() {
        let resetTimeStampStorage = localStorage.getItem("resetTimeStamp");
        if (resetTimeStampStorage && new Date().getTime() - parseInt(resetTimeStampStorage) < 60 * 1000) {
            message.error("操作过于频繁，请稍后再试");
        } else {
            setDisplayClearStorageModal(true);
        }
    }
    
    function clearStorageOkBtnOnClick() {
        setFormDisabled(true);
        setDisplayClearStorageModal(false);
        localStorage.clear();
        localStorage.setItem("resetTimeStamp", JSON.stringify(new Date().getTime()));
        message.success("已重置插件，一秒后刷新页面");
        refreshWindow();
    }
    
    function clearStorageCancelBtnOnClick() {
        setDisplayClearStorageModal(false);
    }
    
    return (
        <>
            <Card title={<Text style={{color: props.fontColor, fontSize: "16px"}}>{"偏好设置"}</Text>}
                  extra={<SettingOutlined style={{color: props.fontColor, fontSize: "16px"}}/>}
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
                <Form colon={false} initialValues={preference} disabled={formDisabled}>
                    <Form.Item name={"imageTopics"} label={<Text style={{color: props.fontColor, fontSize: "16px"}}>{"预设主题"}</Text>}
                               extra={<Text style={{color: props.fontColor}}>{imageTopicStatus}</Text>}>
                        <Select size={"large"} mode="multiple" allowClear
                                defaultValue={"wallpapers"}
                                onChange={imageTopicsSelectOnChange}
                                style={{width: "100%"}}
                                options={[
                                    {value: "travel", label: "旅游"},
                                    {value: "wallpapers", label: "壁纸"},
                                    {value: "3d-renders", label: "3D 渲染"},
                                    {value: "textures-patterns", label: "纹理 & 图案"},
                                    {value: "experimental", label: "实验"},
                                    {value: "architecture-interior", label: "建筑 & 室内"},
                                    {value: "nature", label: "自然"},
                                    {value: "business-work", label: "商业 & 工作"},
                                    {value: "fashion-beauty", label: "时尚 & 美容"},
                                    {value: "film", label: "电影"},
                                    {value: "food-drink", label: "饮食"},
                                    {value: "health", label: "健康"},
                                    {value: "people", label: "人物"},
                                    {value: "interiors", label: "室内"},
                                    {value: "street-photography", label: "街头摄影"},
                                    {value: "animals", label: "动物"},
                                    {value: "spirituality", label: "灵性"},
                                    {value: "sports", label: "体育"},
                                ]}
                        />
                    </Form.Item>
                    <Form.Item label={<Text style={{color: props.fontColor, fontSize: "16px"}}>{"自定主题"}</Text>}
                               extra={<Text style={{color: props.fontColor}}>{customTopicStatus}</Text>}>
                        <Button type={"text"} icon={<TagOutlined />} size={"large"}
                                style={{color: props.fontColor}}
                                onClick={customTopicBtnOnClick}
                                onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                                onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                            {"自定义 Unsplash 图片主题"}
                        </Button>
                    </Form.Item>
                    <Form.Item name={"clearStorageButton"}
                               label={<Text style={{color: props.fontColor, fontSize: "16px"}}>{"危险设置"}</Text>}
                               extra={<Text style={{color: props.fontColor}}>{"出现异常时可尝试重置设置或插件"}</Text>}>
                        <Space>
                            <Button type={"text"}
                                    icon={<RedoOutlined/>} size={"large"}
                                    style={{color: props.fontColor}}
                                    onClick={resetPreferenceBtnOnClick}
                                    onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                                    onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                                重置设置
                            </Button>
                            <Button type={"text"}
                                    icon={<RedoOutlined/>} size={"large"}
                                    style={{color: props.fontColor}}
                                    onClick={clearStorageBtnOnClick}
                                    onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                                    onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                                重置插件
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
            <Modal title={
                <Row align={"middle"}>
                    <Col span={12}>
                        <Text style={{color: props.fontColor, fontSize: "16px"}}>
                            {"自定义 Unsplash 图片主题"}
                        </Text>
                    </Col>
                    <Col span={12} style={{textAlign: "right"}}>
                        <TagOutlined style={{color: props.fontColor, fontSize: "16px"}}/>
                    </Col>
                </Row>
            }
                   closeIcon={false}
                   footer={[
                       <Space>
                           <Button type={"text"}
                                   icon={<CloseOutlined />} size={"large"}
                                   style={{color: props.fontColor}}
                                   onClick={customTopicCancelBtnOnClick}
                                   onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                                   onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                               {"取消"}
                           </Button>
                           <Button type={"text"}
                                   icon={<CheckOutlined />} size={"large"}
                                   style={{color: props.fontColor}}
                                   onClick={customTopicOkBtnOnClick}
                                   onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                                   onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                               {"确定"}
                           </Button>
                       </Space>
                   ]}
                   centered
                   open={displayCustomTopicModal}
                   destroyOnHidden={true}
                   styles={{
                       mask: {backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)"},
                       header: {color: props.fontColor, backgroundColor: props.backgroundColor},
                       content: {backgroundColor: props.backgroundColor}
                   }}
            >
                <Form initialValues={preference} colon={false} >
                    <Form.Item label={<Text style={{color: props.fontColor, fontSize: "16px"}}>{"自定主题"}</Text>}
                               name={"customTopic"}
                               extra={<Text style={{color: props.fontColor}}>{"自定义图片主题为空时将使用预设主题"}</Text>}>
                        <Input size={"large"} placeholder="请输入自定义 Unsplash 图片主题"
                               value={customTopicInputValue}
                               onChange={customTopicInputOnChange}
                               allowClear/>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal title={
                <Row align={"middle"}>
                    <Col span={12}>
                        <Text style={{color: props.fontColor, fontSize: "16px"}}>
                            {"确定重置设置？"}
                        </Text>
                    </Col>
                    <Col span={12} style={{textAlign: "right"}}>
                        <RedoOutlined style={{color: props.fontColor, fontSize: "16px"}}/>
                    </Col>
                </Row>
            }
                   closeIcon={false}
                   footer={[
                       <Space>
                           <Button type={"text"}
                                   icon={<CloseOutlined />} size={"large"}
                                   style={{color: props.fontColor}}
                                   onClick={resetPreferenceCancelBtnOnClick}
                                   onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                                   onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                               {"取消"}
                           </Button>
                           <Button type={"text"}
                                   icon={<CheckOutlined />} size={"large"}
                                   style={{color: props.fontColor}}
                                   onClick={resetPreferenceOkBtnOnClick}
                                   onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                                   onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                               {"确定"}
                           </Button>
                       </Space>
                   ]}
                   centered
                   open={displayResetPreferenceModal}
                   destroyOnHidden={true}
                   styles={{
                       mask: {backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)"},
                       header: {color: props.fontColor, backgroundColor: props.backgroundColor},
                       content: {backgroundColor: props.backgroundColor}
                   }}
            >
                <Text style={{color: props.fontColor, fontSize: "16px"}}>
                    {"注意：所有设置项将被重置为默认值"}
                </Text>
            </Modal>
            <Modal title={
                <Row align={"middle"}>
                    <Col span={12}>
                        <Text style={{color: props.fontColor, fontSize: "16px"}}>
                            {"确定重置插件？"}
                        </Text>
                    </Col>
                    <Col span={12} style={{textAlign: "right"}}>
                        <RedoOutlined  style={{color: props.fontColor, fontSize: "16px"}}/>
                    </Col>
                </Row>
            }
                   closeIcon={false}
                   footer={[
                       <Space>
                           <Button type={"text"}
                                   icon={<CloseOutlined />} size={"large"}
                                   style={{color: props.fontColor}}
                                   onClick={clearStorageCancelBtnOnClick}
                                   onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                                   onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                               {"取消"}
                           </Button>
                           <Button type={"text"}
                                   icon={<CheckOutlined />} size={"large"}
                                   style={{color: props.fontColor}}
                                   onClick={clearStorageOkBtnOnClick}
                                   onMouseOver={(e) => btnMouseOver(props.hoverColor, e)}
                                   onMouseOut={(e) => btnMouseOut(props.fontColor, e)}>
                               {"确定"}
                           </Button>
                       </Space>
                   ]}
                   centered
                   open={displayClearStorageModal}
                   destroyOnHidden={true}
                   styles={{
                       mask: {backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)"},
                       header: {color: props.fontColor, backgroundColor: props.backgroundColor},
                       content: {backgroundColor: props.backgroundColor}
                   }}
            >
                <Text style={{color: props.fontColor, fontSize: "16px"}}>
                    {"注意：所有设置项将被重置为默认值，其他所有数据将被清空"}
                </Text>
            </Modal>
        </>
    );
}

export default MenuPreferenceComponent;