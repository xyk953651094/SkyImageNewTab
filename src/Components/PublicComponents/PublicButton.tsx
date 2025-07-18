import React, {useEffect} from "react";
import {Button} from "antd";
import {btnMouseOut, btnMouseOver} from "../../TypeScripts/PublicFunctions";

// 已废弃，仅作保留，不要用
function PublicButton(props: any) {
    const defaultButtonIcon = null;
    const defaultButtonFontColor = "#000000";
    const defaultButtonCursor = "default";
    const defaultButtonFontSize = "16px";
    const defaultButtonOnClick = undefined;
    const defaultButtonContent = "暂无信息";
    const defaultButtonMouseOverColor = "#000000";
    const defaultButtonMouseOutColor = "#ffffff";
    
    const [buttonIcon, setButtonIcon] = React.useState(defaultButtonIcon);
    const [buttonFontColor, setButtonFontColor] = React.useState(defaultButtonFontColor);
    const [buttonCursor, setButtonCursor] = React.useState(defaultButtonCursor);
    const [buttonFontSize, setButtonFontSize] = React.useState(props.buttonFontSize ? props.buttonFontSize : defaultButtonFontSize);
    const [buttonOnClick, setButtonOnClick] = React.useState(defaultButtonOnClick);
    const [buttonContent, setButtonContent] = React.useState(props.buttonContent ? props.buttonContent : defaultButtonContent);
    const [buttonMouseOverColor, setButtonMouseOverColor] = React.useState(props.buttonMouseOverColor ? props.buttonMouseOverColor : defaultButtonMouseOverColor);
    const [buttonMouseOutColor, setButtonMouseOutColor] = React.useState(props.buttonMouseOutColor ? props.buttonMouseOutColor : defaultButtonMouseOutColor);
    
    useEffect(() => {
        setButtonIcon(props.buttonIcon ? props.buttonIcon : defaultButtonIcon);
        setButtonFontColor(props.buttonFontColor ? props.buttonFontColor : defaultButtonFontColor);
        setButtonCursor(props.buttonCursor ? props.buttonCursor : defaultButtonCursor);
        setButtonFontSize(props.buttonFontSize ? props.buttonFontSize : defaultButtonFontSize);
        setButtonOnClick(() => props.buttonOnClick ? props.buttonOnClick : defaultButtonOnClick);
        setButtonContent(props.buttonContent ? props.buttonContent : defaultButtonContent);
        setButtonMouseOverColor(props.buttonMouseOverColor ? props.buttonMouseOverColor : defaultButtonMouseOverColor);
        setButtonMouseOutColor(props.buttonMouseOutColor ? props.buttonMouseOutColor : defaultButtonMouseOutColor);
    }, [defaultButtonOnClick, props.buttonContent, props.buttonCursor, props.buttonFontColor, props.buttonFontSize, props.buttonIcon, props.buttonMouseOutColor, props.buttonMouseOverColor, props.buttonOnClick, props.buttonShape, props.theme]);
    
    return (
        <Button type={"text"} size={"large"}
                icon={buttonIcon}
                style={{color: buttonFontColor, cursor: buttonCursor, fontSize: buttonFontSize}}
                onMouseOver={(e) => btnMouseOver(buttonMouseOverColor, e)}
                onMouseOut={(e) => btnMouseOut(buttonMouseOutColor, e)}
                onClick={buttonOnClick}
        >
            {buttonContent}
        </Button>
    );
}

export default PublicButton;