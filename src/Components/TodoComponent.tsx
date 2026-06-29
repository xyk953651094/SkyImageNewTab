import React, {useEffect, useState} from "react";
import {
    Button,
    Col,
    Input,
    List,
    message,
    Modal,
    Popover,
    Row,
    Space,
    Typography
} from "antd";
import {CheckOutlined, CheckSquareOutlined, PlusOutlined} from "@ant-design/icons";
import {createThemedMessage} from "../TypeScripts/PublicFunctions";
import {ThemeInterface} from "../TypeScripts/PublicInterface";
import {getExtensionStorage, setExtensionStorage, removeExtensionStorage} from "../TypeScripts/StorageFunctions";
import {HoverButton} from "./PublicComponents/PublicButton";

const {Text} = Typography;
const TODO_MAX_SIZE = 5;

// 存储 key 常量
const STORAGE_KEY_TODOS = "todos";

interface TodoItem {
    title: string;
    timeStamp: number;
}

interface TodoComponentProps {
    theme: ThemeInterface;
}

function TodoComponent(props: TodoComponentProps) {
    const [todoList, setTodoList] = useState<TodoItem[]>([]);
    const [displayModal, setDisplayModal] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");

    const themedMessage = createThemedMessage(props.theme, message);

    // 持久化待办列表
    async function saveTodoList(list: TodoItem[]) {
        if (list.length === 0) {
            await removeExtensionStorage(STORAGE_KEY_TODOS);
        } else {
            await setExtensionStorage(STORAGE_KEY_TODOS, list);
        }
    }

    // 全部完成
    function finishAllBtnOnClick() {
        setTodoList([]);
        saveTodoList([]);
        themedMessage.success("全部完成");
    }

    // 完成单条
    function finishBtnOnClick(item: TodoItem) {
        const newList = todoList.filter(t => t.timeStamp !== item.timeStamp);
        setTodoList(newList);
        saveTodoList(newList);
        themedMessage.success("已完成");
    }

    // 打开添加弹窗
    function showAddModalBtnOnClick() {
        if (todoList.length < TODO_MAX_SIZE) {
            setDisplayModal(true);
            setInputValue("");
        } else {
            themedMessage.error(`待办数量最多为${TODO_MAX_SIZE}个`);
        }
    }

    // 确认添加
    function modalOkBtnOnClick() {
        if (!inputValue.trim()) {
            themedMessage.error("表单不能为空");
            return;
        }

        const newItem: TodoItem = {
            title: inputValue.trim(),
            timeStamp: Date.now(),
        };

        const newList = [...todoList, newItem];
        setTodoList(newList);
        setDisplayModal(false);
        saveTodoList(newList);
        themedMessage.success("添加成功");
    }

    // 初始化：从 storage 读取数据
    useEffect(() => {
        async function loadFromStorage() {
            const [storedTodos] = await getExtensionStorage([STORAGE_KEY_TODOS]);
            const parsedTodos: TodoItem[] = storedTodos ?? [];

            setTodoList(parsedTodos);
        }

        loadFromStorage();
    }, []);

    const popoverTitle = (
        <Row align={"middle"}>
            <Col span={8}>
                <Text style={{color: props.theme.secondaryFontColor, fontSize: "16px"}}>
                    {`待办事项 ${todoList.length} / ${TODO_MAX_SIZE}`}
                </Text>
            </Col>
            <Col span={16} style={{textAlign: "right"}}>
                <Space>
                    <HoverButton theme={props.theme} icon={<PlusOutlined/>} onClick={showAddModalBtnOnClick}>
                        {"添加待办"}
                    </HoverButton>
                    <HoverButton theme={props.theme} icon={<CheckOutlined/>} onClick={finishAllBtnOnClick}>
                        {"全部完成"}
                    </HoverButton>
                </Space>
            </Col>
        </Row>
    );

    const popoverContent = (
        <List
            dataSource={todoList}
            renderItem={(item: TodoItem) => (
                <List.Item
                    actions={[
                        <HoverButton
                            key="finish"
                            theme={props.theme}
                            icon={<CheckOutlined/>}
                            onClick={() => finishBtnOnClick(item)}
                        >
                            {"完成"}
                        </HoverButton>,
                    ]}
                >
                    <HoverButton
                            key="finish"
                            theme={props.theme}
                            icon={<CheckSquareOutlined/>}
                        >
                            {item.title}
                    </HoverButton>,
                </List.Item>
            )}
        />
    );

    return (
        <>
            <Popover
                title={popoverTitle}
                content={popoverContent}
                placement="bottomRight"
                color={props.theme.secondaryColor}
                styles={{root: {minWidth: "600px"}}}
            >
                <Button
                    icon={<CheckSquareOutlined/>}
                    size={"large"}
                    type={"primary"}
                    style={{
                        cursor: "default",
                        backgroundColor: props.theme.secondaryColor,
                        color: props.theme.secondaryFontColor,
                    }}
                >
                    {`${todoList.length} 个待办`}
                </Button>
            </Popover>

            <Modal
                title={`添加待办 ${todoList.length} / ${TODO_MAX_SIZE}`}
                closeIcon={false}
                centered
                open={displayModal}
                onOk={modalOkBtnOnClick}
                onCancel={() => setDisplayModal(false)}
                styles={{
                    mask: {backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)"},
                    container: {backgroundColor: props.theme.secondaryColor},
                    title: {color: props.theme.secondaryFontColor}
                }}
            >
                <Input
                    placeholder="请输入待办内容"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    maxLength={20}
                    showCount
                    allowClear
                />
            </Modal>
        </>
    );
}

export default React.memo(TodoComponent);
