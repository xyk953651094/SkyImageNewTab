import React, {useState} from "react";
import {
    Card,
    Divider,
    Form, Input,
    message,
    Radio,
    Select,
    Space,
    Typography,
} from "antd";
import type { RadioChangeEvent } from "antd";
import {
    RedoOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import {createThemedMessage} from "../../TypeScripts/PublicFunctions";
import {getExtensionStorage, setExtensionStorage, clearExtensionStorage} from "../../TypeScripts/StorageFunctions";
import {PreferenceInterface, ThemeInterface} from "../../TypeScripts/PublicInterface";
import {defaultPreference} from "../../TypeScripts/PublicConstants";
import {PublicModal} from "../PublicComponents/PublicModal";
import { HoverButton } from "../PublicComponents/PublicButton";

const {Text} = Typography;

const RESET_COOLDOWN_MS = 60 * 1000;

interface MenuPreferenceComponentProps {
    theme: ThemeInterface;
    preference: PreferenceInterface;
    getPreference: React.Dispatch<React.SetStateAction<PreferenceInterface>>;
}

function MenuPreferenceComponent(props: MenuPreferenceComponentProps) {
    const [formDisabled, setFormDisabled] = useState<boolean>(false);
    const [disableImageTopic, setDisableImageTopic] = useState<boolean>(false);
    const [activeModal, setActiveModal] = useState<"resetPreference" | "clearStorage" | null>(null);
    const [preference, setPreference] = useState<PreferenceInterface>(props.preference);
    const imageTopicStatus = disableImageTopic ? "已禁用预设主题" : "已启用预设主题";
    const customTopicStatus = disableImageTopic ? "已启用自定主题" : "已禁用自定主题";
    const themedMessage = createThemedMessage(props.theme, message);
    
    function refreshWindow() {
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
    
    function changePreference(data: Object) {
        return Object.assign({}, preference, data);
    }
    
    function topicRadioOnChange(e: RadioChangeEvent) {
        const topicType= e.target.value;
        if (topicType === "presetTopics") {
            setDisableImageTopic(false);
        }
        else {
            setDisableImageTopic(true);
        }
    }
    
    async function checkCooldownThen(callback: () => void) {
    const [resetTimeStampStorage] = await getExtensionStorage(["resetTimeStamp"]);
    if (resetTimeStampStorage && Date.now() - parseInt(resetTimeStampStorage) < RESET_COOLDOWN_MS) {
        themedMessage.error("操作过于频繁，请稍后再试");
    } else {
        callback();
    }
}
    
    // 预设主题
    function imageTopicsSelectOnChange(selectedValues: string) {
        const newPreference = changePreference({imageTopics: selectedValues});
        setPreference(newPreference);
        setExtensionStorage("preference", newPreference);
        props.getPreference(newPreference);
        
        themedMessage.success("已更换图片主题，下次切换图片时生效");
        if (selectedValues.length === 0) {
            themedMessage.info("全不选与全选的效果一样");
        }
    }
    
    // 重置设置
    function resetPreferenceBtnOnClick() {
        checkCooldownThen(() => setActiveModal("resetPreference"));
    }
    
    function resetPreferenceOkBtnOnClick() {
        setFormDisabled(true);
        setActiveModal(null);
        setExtensionStorage("preference", defaultPreference);
        setExtensionStorage("resetTimeStamp", new Date().getTime());
        themedMessage.success("已重置设置，一秒后刷新页面");
        refreshWindow();
    }
    
    function resetPreferenceCancelBtnOnClick() {
        setActiveModal(null);
    }
    
    // 重置插件
    function clearStorageBtnOnClick() {
        checkCooldownThen(() => setActiveModal("clearStorage"));
    }
    
    function clearStorageOkBtnOnClick() {
        setFormDisabled(true);
        setActiveModal(null);
        clearExtensionStorage();
        setExtensionStorage("resetTimeStamp", new Date().getTime());
        themedMessage.success("已重置插件，一秒后刷新页面");
        
        refreshWindow();
    }
    
    function clearStorageCancelBtnOnClick() {
        setActiveModal(null);
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
                        <Input size="large" placeholder="请输入自定义主题" disabled={!disableImageTopic}/>
                    </Form.Item>
                    <Divider/>
                    <Form.Item name={"clearStorageButton"}
                               label={<Text style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}>{"危险设置"}</Text>}
                               extra={<Text style={{color: props.theme.secondaryFontColor}}>{"出现异常时可尝试重置设置或插件"}</Text>}>
                        <Space>
                            <HoverButton theme={props.theme} icon={<RedoOutlined/>} onClick={resetPreferenceBtnOnClick}>
                                重置设置
                            </HoverButton>
                            <HoverButton theme={props.theme} icon={<RedoOutlined/>} onClick={clearStorageBtnOnClick}>
                                重置插件
                            </HoverButton>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
            
            <PublicModal
                theme={props.theme}
                open={activeModal === "resetPreference"}
                titleText={"确定重置设置？"}
                titleIcon={<RedoOutlined style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}/>}
                onOk={resetPreferenceOkBtnOnClick}
                onCancel={resetPreferenceCancelBtnOnClick}
            >
                <Text style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}>
                    {"注意：所有设置项将被重置为默认值"}
                </Text>
            </PublicModal>
            <PublicModal
                theme={props.theme}
                open={activeModal === "clearStorage"}
                titleText={"确定重置插件？"}
                titleIcon={<RedoOutlined style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}/>}
                onOk={clearStorageOkBtnOnClick}
                onCancel={clearStorageCancelBtnOnClick}
            >
                <Text style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}>
                    {"注意：所有设置项将被重置为默认值，其他所有数据将被清空"}
                </Text>
            </PublicModal>
        </>
    );
}

export default React.memo(MenuPreferenceComponent);