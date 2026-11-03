import React, {useEffect, useState} from "react";
import {Divider, Input} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {ThemeInterface} from "../TypeScripts/PublicInterface";
import {getSearchEngineDetail} from "../TypeScripts/SearchComponent";
import {getExtensionStorage, setExtensionStorage} from "../TypeScripts/StorageFunctions";
import {HoverButton} from "./PublicComponents/PublicButton";
import "../StyleSheets/SearchComponent.scss";

// 存储 key 常量
const STORAGE_KEY_SEARCH_ENGINE = "searchEngine";

// 可循环切换的搜索引擎
const SEARCH_ENGINES = ["bing", "google"];

interface SearchComponentProps {
    theme: ThemeInterface;
}

function SearchComponent(props: SearchComponentProps) {
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchEngine, setSearchEngine] = useState<string>("bing");

    const searchEngineDetail = getSearchEngineDetail(searchEngine);

    // 初始化：读取上次选用的搜索引擎
    useEffect(() => {
        async function loadFromStorage() {
            const [storedEngine] = await getExtensionStorage([STORAGE_KEY_SEARCH_ENGINE]);
            if (storedEngine && SEARCH_ENGINES.includes(storedEngine)) {
                setSearchEngine(storedEngine);
            }
        }

        loadFromStorage();
    }, []);

    // 切换到下一个搜索引擎并持久化
    function searchEngineBtnOnClick() {
        const nextEngine = SEARCH_ENGINES[(SEARCH_ENGINES.indexOf(searchEngine) + 1) % SEARCH_ENGINES.length];
        setSearchEngine(nextEngine);
        setExtensionStorage(STORAGE_KEY_SEARCH_ENGINE, nextEngine);
    }

    // 按下回车执行搜索
    function inputOnPressEnter() {
        const keyword = searchValue.trim();
        if (keyword) {
            window.open(searchEngineDetail.searchEngineUrl + encodeURIComponent(keyword), "_self");
        }
    }

    return (
        <Input
            className={"searchInput"}
            size={"large"}
            placeholder={"按下 Enter 键搜索"}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onPressEnter={inputOnPressEnter}
            prefix={
                <>
                    <HoverButton
                        theme={props.theme}
                        size={"small"}
                        icon={<i className={"bi bi-" + searchEngine}/>}
                        onClick={searchEngineBtnOnClick}
                    >
                        {searchEngineDetail.searchEngineName}
                    </HoverButton>
                    <Divider orientation={"vertical"} style={{borderColor: props.theme.secondaryFontColor}}/>
                </>
            }
            suffix={<SearchOutlined/>}
            styles={{
                root: {backgroundColor: props.theme.secondaryColor},
                input: {color: props.theme.secondaryFontColor},
                suffix: {color: props.theme.secondaryFontColor}
            }}
        />
    );
}

export default React.memo(SearchComponent);
