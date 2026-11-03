import React, {useEffect, useState} from "react";
import {Button, Divider, Flex, Input, message, Tooltip} from "antd";
import {DeleteOutlined, LinkOutlined, PlusOutlined} from "@ant-design/icons";
import {createThemedMessage} from "../TypeScripts/PublicFunctions";
import {ThemeInterface} from "../TypeScripts/PublicInterface";
import {getExtensionStorage, setExtensionStorage, removeExtensionStorage} from "../TypeScripts/StorageFunctions";
import {PublicModal} from "./PublicComponents/PublicModal";
import "../StyleSheets/QuickLinkComponent.scss";

// 存储 key 常量
const QUICK_LINK_MAX_SIZE = 5;
const STORAGE_KEY_QUICK_LINKS = "quickLinks";

interface QuickLinkItem {
    name: string;
    url: string;
    timeStamp: number;
}

interface QuickLinkComponentProps {
    theme: ThemeInterface;
}

function QuickLinkComponent(props: QuickLinkComponentProps) {
    const [linkList, setLinkList] = useState<QuickLinkItem[]>([]);
    const [displayModal, setDisplayModal] = useState<boolean>(false);
    const [inputName, setInputName] = useState<string>("");
    const [inputUrl, setInputUrl] = useState<string>("");

    const themedMessage = createThemedMessage(props.theme, undefined, message);

    // 持久化链接列表
    async function saveLinkList(list: QuickLinkItem[]) {
        if (list.length === 0) {
            await removeExtensionStorage(STORAGE_KEY_QUICK_LINKS);
        } else {
            await setExtensionStorage(STORAGE_KEY_QUICK_LINKS, list);
        }
    }

    // 删除单条
    function deleteBtnOnClick(item: QuickLinkItem) {
        const newList = linkList.filter(l => l.timeStamp !== item.timeStamp);
        setLinkList(newList);
        saveLinkList(newList);
        themedMessage.success("已删除");
    }

    // 打开添加弹窗
    function showAddModalBtnOnClick() {
        if (linkList.length < QUICK_LINK_MAX_SIZE) {
            setDisplayModal(true);
            setInputName("");
            setInputUrl("");
        } else {
            themedMessage.error(`链接数量最多为${QUICK_LINK_MAX_SIZE}个`);
        }
    }

    // 确认添加
    function modalOkBtnOnClick() {
        if (!inputName.trim() || !inputUrl.trim()) {
            themedMessage.error("表单不能为空");
            return;
        }

        const newItem: QuickLinkItem = {
            name: inputName.trim(),
            url: inputUrl.trim(),
            timeStamp: Date.now(),
        };

        const newList = [...linkList, newItem];
        setLinkList(newList);
        setDisplayModal(false);
        saveLinkList(newList);
        themedMessage.success("添加成功");
    }

    // 初始化：从 storage 读取数据
    useEffect(() => {
        async function loadFromStorage() {
            const [storedLinks] = await getExtensionStorage([STORAGE_KEY_QUICK_LINKS]);
            setLinkList(storedLinks ?? []);
        }

        loadFromStorage();
    }, []);

    return (
        <>
            <Flex
                wrap="wrap"
                justify="center"
                align="center"
                gap="small"
                style={{
                    "--qlb-bg": props.theme.secondaryColor,
                    "--qlb-font": props.theme.secondaryFontColor,
                } as React.CSSProperties}
            >
                {linkList.map((item) => (
                    <Flex key={item.timeStamp} align="center" className="quickLinkGroup floatingButton">
                        <Tooltip
                            title={`点击前往 ${item.name}`}
                            placement={"bottom"}
                            color={props.theme.secondaryColor}
                            styles={{container: {color: props.theme.secondaryFontColor}}}
                        >
                            <Button type={"text"} size={"large"} className="quickLinkBtn" onClick={() => window.open(item.url, "_blank")}>
                                {item.name}
                            </Button>
                        </Tooltip>
                        <Divider orientation={"vertical"}/>
                        <Tooltip
                            title={"删除链接"}
                            placement={"bottom"}
                            color={props.theme.secondaryColor}
                            styles={{container: {color: props.theme.secondaryFontColor}}}
                        >
                            <Button type={"text"} size={"large"} icon={<DeleteOutlined/>} className="quickLinkBtn" onClick={() => deleteBtnOnClick(item)}/>
                        </Tooltip>
                    </Flex>
                ))}
                <Tooltip
                    title={"添加快速链接"}
                    placement={"bottom"}
                    color={props.theme.secondaryColor}
                    styles={{container: {color: props.theme.secondaryFontColor}}}
                >
                    <Button
                        type={"text"}
                        size={"large"}
                        className="quickLinkBtn floatingButton"
                        icon={<PlusOutlined/>}
                        onClick={showAddModalBtnOnClick}
                    />
                </Tooltip>
            </Flex>

            <PublicModal
                theme={props.theme}
                open={displayModal}
                titleText={`添加链接 ${linkList.length} / ${QUICK_LINK_MAX_SIZE}`}
                titleIcon={<LinkOutlined/>}
                onOk={modalOkBtnOnClick}
                onCancel={() => setDisplayModal(false)}
            >
                <Flex vertical gap="middle">
                    <Input
                        placeholder="请输入链接名称"
                        size={"large"}
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        maxLength={5}
                        showCount
                        allowClear
                    />
                    <Input
                        placeholder="请输入链接地址，例如：https://www.example.com"
                        size={"large"}
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        allowClear
                    />
                </Flex>
            </PublicModal>
        </>
    );
}

export default React.memo(QuickLinkComponent);
