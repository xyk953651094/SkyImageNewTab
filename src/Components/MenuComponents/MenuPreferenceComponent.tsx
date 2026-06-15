import React, {useState} from "react";
import {
    Button,
    Card,
    Col, Divider,
    Form, Input,
    message, Modal,
    Radio,
    Row, Select,
    Space,
    Typography,
} from "antd";
import {
    TagOutlined,
    RedoOutlined,
    SettingOutlined,
    CheckOutlined,
    CloseOutlined
} from "@ant-design/icons";
import {changeButtonTheme, isEmpty} from "../../TypeScripts/PublicFunctions";
import {getExtensionStorage, setExtensionStorage, clearExtensionStorage} from "../../TypeScripts/StorageFunctions";
import {PreferenceInterface} from "../../TypeScripts/PublicInterface";
import {defaultPreference} from "../../TypeScripts/PublicConstants";

const {Text} = Typography;

function MenuPreferenceComponent(props: any) {
    const [formDisabled, setFormDisabled] = useState<boolean>(false);
    const [disableImageTopic, setDisableImageTopic] = useState<boolean>(false);
    const [imageTopicStatus, setImageTopicStatus] = useState<string>("已使用预设主题");
    const [customTopicStatus, setCustomTopicStatus] = useState<string>("已禁用自定主题");
    const [displayCustomTopicModal, setDisplayCustomTopicModal] = useState<boolean>(false);
    const [customTopicInputValue, setCustomTopicInputValue] = useState<string>("");
    const [displayResetPreferenceModal, setDisplayResetPreferenceModal] = useState<boolean>(false);
    const [displayClearStorageModal, setDisplayClearStorageModal] = useState<boolean>(false);
    const [preference, setPreference] = useState<PreferenceInterface>(props.preference);
    
    function refreshWindow() {
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
    
    function changePreference(data: Object) {
        return Object.assign({}, preference, data);
    }
    
    function topicRadioOnChange(e: any) {
        let topicType= e.target.value;
        if (topicType === "presetTopics") {
            setDisableImageTopic(false);
        }
        else {
            setDisableImageTopic(true);
        }
    }
    
    // 预设主题
     function imageTopicsSelectOnChange(selectedValues: string) {
         setPreference(changePreference({imageTopics: selectedValues}));
         setExtensionStorage("preference", preference);
         props.getPreference(preference);
         message.success({content: "已更换图片主题，下次切换图片时生效",
             styles: {
                 root: {backgroundColor: props.theme.secondaryColor},
                 icon: {color: props.theme.secondaryFontColor},
                 title: {color: props.theme.secondaryFontColor}
             }
         });
         if (selectedValues.length === 0) {
             message.info({
                 content: "全不选与全选的效果一样",
                 styles: {
                     root: {backgroundColor: props.theme.secondaryColor},
                     icon: {color: props.theme.secondaryFontColor},
                     title: {color: props.theme.secondaryFontColor}
                 }
             });
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
            setImageTopicStatus(isEmpty(customTopicInputValue)? "已使用预设主题" : "已禁用预设主题");
            setCustomTopicStatus(isEmpty(customTopicInputValue)? "已禁用自定主题" : "已使用自定主题");
            setExtensionStorage("preference", preference);
            props.getPreference(preference);
            
            if(!isEmpty(customTopicInputValue)) {
                message.success("已使用自定主题，下次切换图片时生效");
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
            setImageTopicStatus("已使用预设主题");
            setCustomTopicStatus("已禁用自定主题");
            setExtensionStorage("preference", preference);
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
        getExtensionStorage(["resetTimeStamp"]).then((result)=> {
            let [resetTimeStampStorage] = result;
            if (resetTimeStampStorage && new Date().getTime() - parseInt(resetTimeStampStorage) < 60 * 1000) {
                message.error("操作过于频繁，请稍后再试");
            } else {
                setDisplayResetPreferenceModal(true);
            }
        })
    }
    
    function resetPreferenceOkBtnOnClick() {
        setFormDisabled(true);
        setDisplayResetPreferenceModal(false);
        setExtensionStorage("preference", defaultPreference);
        setExtensionStorage("resetTimeStamp", new Date().getTime());
        message.success("已重置设置，一秒后刷新页面");
        refreshWindow();
    }
    
    function resetPreferenceCancelBtnOnClick() {
        setDisplayResetPreferenceModal(false)
    }
    
    // 重置插件
    function clearStorageBtnOnClick() {
        getExtensionStorage(["resetTimeStamp"]).then((result)=> {
            let [resetTimeStampStorage] = result;
            if (resetTimeStampStorage && new Date().getTime() - parseInt(resetTimeStampStorage) < 60 * 1000) {
                message.error("操作过于频繁，请稍后再试");
            } else {
                setDisplayClearStorageModal(true);
            }
        })
    }
    
    function clearStorageOkBtnOnClick() {
        setFormDisabled(true);
        setDisplayClearStorageModal(false);
        clearExtensionStorage();
        setExtensionStorage("resetTimeStamp", new Date().getTime());
        message.success("已重置插件，一秒后刷新页面");
        refreshWindow();
    }
    
    function clearStorageCancelBtnOnClick() {
        setDisplayClearStorageModal(false);
    }
    
    return (
        <>
            <Card title={<Text style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}>{"偏好设置"}</Text>}
                  extra={<SettingOutlined style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}/>}
                  style={{border: "1px solid " + props.theme.secondaryFontColor}}
                  styles={{
                      header: {
                          backgroundColor: props.theme.secondaryColor,
                          color: props.theme.secondaryFontColor,
                          borderBottom: "2px solid " + props.theme.secondaryFontColor
                      },
                      body: {
                          backgroundColor: props.theme.secondaryColor
                      }
                  }}
            >
                <Form colon={false} initialValues={preference} disabled={formDisabled}>
                    <Form.Item name={"TopicsType"} label={<Text style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}>{"主题类型"}</Text>}>
                        <Radio.Group
                            defaultValue={disableImageTopic? "customTopics" : "presetTopics"}
                            size={"large"}
                            onChange={topicRadioOnChange}
                            options={[
                                { value: "presetTopics", label: "预设主题", style: { color: props.theme.secondaryFontColor } },
                                { value: "customTopics", label: "自定主题", style: { color: props.theme.secondaryFontColor } }
                            ]}
                        />
                    </Form.Item>
                    
                    <Form.Item name={"imageTopics"} label={<Text style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}>{"预设主题"}</Text>}
                               extra={<Text style={{color: props.theme.secondaryFontColor}}>{imageTopicStatus}</Text>}>
                        <Select size={"large"} mode="multiple"
                                defaultValue={"wallpapers"}
                                onChange={imageTopicsSelectOnChange}
                                style={{width: "100%"}}
                                styles={{
                                    item: {backgroundColor: props.theme.secondaryColor},
                                    itemContent: {color: props.theme.secondaryFontColor},
                                    itemRemove: {color: props.theme.secondaryFontColor},
                                }}
                                disabled={disableImageTopic}
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
                    <Form.Item label={<Text style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}>{"自定主题"}</Text>}
                               extra={<Text style={{color: props.theme.secondaryFontColor}}>{customTopicStatus}</Text>}>
                        <Input size="large" placeholder="large size" disabled={!disableImageTopic}/>
                    </Form.Item>
                    <Divider/>
                    <Form.Item name={"clearStorageButton"}
                               label={<Text style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}>{"危险设置"}</Text>}
                               extra={<Text style={{color: props.theme.secondaryFontColor}}>{"出现异常时可尝试重置设置或插件"}</Text>}>
                        <Space>
                            <Button type={"text"}
                                    icon={<RedoOutlined/>} size={"large"}
                                    style={{color: props.theme.secondaryFontColor}}
                                    onClick={resetPreferenceBtnOnClick}
                                    onMouseOver={(e) => changeButtonTheme(props.theme.primaryColor, props.theme.primaryFontColor, e)}
                                    onMouseOut={(e) => changeButtonTheme("transparent", props.theme.secondaryFontColor, e)}>
                                重置设置
                            </Button>
                            <Button type={"text"}
                                    icon={<RedoOutlined/>} size={"large"}
                                    style={{color: props.theme.secondaryFontColor}}
                                    onClick={clearStorageBtnOnClick}
                                    onMouseOver={(e) => changeButtonTheme(props.theme.primaryColor, props.theme.primaryFontColor, e)}
                                    onMouseOut={(e) => changeButtonTheme("transparent", props.theme.secondaryFontColor, e)}>
                                重置插件
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
            <Modal title={
                <Row align={"middle"}>
                    <Col span={12}>
                        <Text style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}>
                            {"自定义 Unsplash 图片主题"}
                        </Text>
                    </Col>
                    <Col span={12} style={{textAlign: "right"}}>
                        <TagOutlined style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}/>
                    </Col>
                </Row>
            }
                   closeIcon={false}
                   footer={[
                       <Space>
                           <Button type={"text"}
                                   icon={<CloseOutlined />} size={"large"}
                                   style={{color: props.theme.secondaryFontColor}}
                                   onClick={customTopicCancelBtnOnClick}
                                   onMouseOver={(e) => changeButtonTheme(props.theme.primaryColor, props.theme.primaryFontColor, e)}
                                   onMouseOut={(e) => changeButtonTheme("transparent", props.theme.secondaryFontColor, e)}>
                               {"取消"}
                           </Button>
                           <Button type={"text"}
                                   icon={<CheckOutlined />} size={"large"}
                                   style={{color: props.theme.secondaryFontColor}}
                                   onClick={customTopicOkBtnOnClick}
                                   onMouseOver={(e) => changeButtonTheme(props.theme.primaryColor, props.theme.primaryFontColor, e)}
                                   onMouseOut={(e) => changeButtonTheme("transparent", props.theme.secondaryFontColor, e)}>
                               {"确定"}
                           </Button>
                       </Space>
                   ]}
                   centered
                   open={displayCustomTopicModal}
                   destroyOnHidden={true}
                   styles={{
                       mask: {backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)"},
                       header: {color: props.theme.secondaryFontColor, backgroundColor: props.theme.secondaryColor},
                       container: {backgroundColor: props.theme.secondaryColor}
                   }}
            >
                <Form initialValues={preference} colon={false} >
                    <Form.Item label={<Text style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}>{"自定主题"}</Text>}
                               name={"customTopic"}
                               extra={<Text style={{color: props.theme.secondaryFontColor}}>{"自定义图片主题为空时将使用预设主题"}</Text>}>
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
                        <Text style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}>
                            {"确定重置设置？"}
                        </Text>
                    </Col>
                    <Col span={12} style={{textAlign: "right"}}>
                        <RedoOutlined style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}/>
                    </Col>
                </Row>
            }
                   closeIcon={false}
                   footer={[
                       <Space>
                           <Button type={"text"}
                                   icon={<CloseOutlined />} size={"large"}
                                   style={{color: props.theme.secondaryFontColor}}
                                   onClick={resetPreferenceCancelBtnOnClick}
                                   onMouseOver={(e) => changeButtonTheme(props.theme.primaryColor, props.theme.primaryFontColor, e)}
                                   onMouseOut={(e) => changeButtonTheme("transparent", props.theme.secondaryFontColor, e)}>
                               {"取消"}
                           </Button>
                           <Button type={"text"}
                                   icon={<CheckOutlined />} size={"large"}
                                   style={{color: props.theme.secondaryFontColor}}
                                   onClick={resetPreferenceOkBtnOnClick}
                                   onMouseOver={(e) => changeButtonTheme(props.theme.primaryColor, props.theme.primaryFontColor, e)}
                                   onMouseOut={(e) => changeButtonTheme("transparent", props.theme.secondaryFontColor, e)}>
                               {"确定"}
                           </Button>
                       </Space>
                   ]}
                   centered
                   open={displayResetPreferenceModal}
                   destroyOnHidden={true}
                   styles={{
                       mask: {backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)"},
                       header: {color: props.theme.secondaryFontColor, backgroundColor: props.theme.secondaryColor},
                       container: {backgroundColor: props.theme.secondaryColor}
                   }}
            >
                <Text style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}>
                    {"注意：所有设置项将被重置为默认值"}
                </Text>
            </Modal>
            <Modal title={
                <Row align={"middle"}>
                    <Col span={12}>
                        <Text style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}>
                            {"确定重置插件？"}
                        </Text>
                    </Col>
                    <Col span={12} style={{textAlign: "right"}}>
                        <RedoOutlined  style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}/>
                    </Col>
                </Row>
            }
                   closeIcon={false}
                   footer={[
                       <Space>
                           <Button type={"text"}
                                   icon={<CloseOutlined />} size={"large"}
                                   style={{color: props.theme.secondaryFontColor}}
                                   onClick={clearStorageCancelBtnOnClick}
                                   onMouseOver={(e) => changeButtonTheme(props.theme.primaryColor, props.theme.primaryFontColor, e)}
                                   onMouseOut={(e) => changeButtonTheme("transparent", props.theme.secondaryFontColor, e)}>
                               {"取消"}
                           </Button>
                           <Button type={"text"}
                                   icon={<CheckOutlined />} size={"large"}
                                   style={{color: props.theme.secondaryFontColor}}
                                   onClick={clearStorageOkBtnOnClick}
                                   onMouseOver={(e) => changeButtonTheme(props.theme.primaryColor, props.theme.primaryFontColor, e)}
                                   onMouseOut={(e) => changeButtonTheme("transparent", props.theme.secondaryFontColor, e)}>
                               {"确定"}
                           </Button>
                       </Space>
                   ]}
                   centered
                   open={displayClearStorageModal}
                   destroyOnHidden={true}
                   styles={{
                       mask: {backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)"},
                       header: {color: props.theme.secondaryFontColor, backgroundColor: props.theme.secondaryColor},
                       container: {backgroundColor: props.theme.secondaryColor}
                   }}
            >
                <Text style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}>
                    {"注意：所有设置项将被重置为默认值，其他所有数据将被清空"}
                </Text>
            </Modal>
        </>
    );
}

export default MenuPreferenceComponent;