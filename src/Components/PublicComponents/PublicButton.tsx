import React, {useEffect} from "react";
import {Button} from "antd";
import {changeButtonTheme} from "../../TypeScripts/PublicFunctions";

// 已废弃，仅作保留，不要用
function PublicButton(props: any) {
    const defaultPrimaryColor = "#ffffff";
    const defaultPrimaryFontColor = "#000000"
    const defaultSecondaryFontColor = "#ffffff";
    const defaultButtonIcon = null;
    const defaultButtonCursor = "default";
    const defaultButtonFontSize = "16px";
    const defaultButtonOnClick = undefined;
    const defaultButtonContent = "暂无信息";
    
    const [primaryColor, setPrimaryColor] = React.useState(defaultPrimaryColor);
    const [primaryFontColor, setPrimaryFontColor] = React.useState(defaultPrimaryFontColor);
    const [secondaryFontColor, setSecondaryFontColor] = React.useState(defaultSecondaryFontColor);
    const [buttonIcon, setButtonIcon] = React.useState(defaultButtonIcon);
    const [buttonCursor, setButtonCursor] = React.useState(defaultButtonCursor);
    const [buttonFontSize, setButtonFontSize] = React.useState(defaultButtonFontSize);
    const [buttonOnClick, setButtonOnClick] = React.useState(defaultButtonOnClick);
    const [buttonContent, setButtonContent] = React.useState(defaultButtonContent);

    useEffect(() => {
        setPrimaryColor(props.theme.primaryColor ? props.theme.primaryColor : defaultPrimaryColor);
        setPrimaryFontColor(props.theme.primaryFontColor ? props.theme.primaryFontColor : defaultPrimaryFontColor)
        setSecondaryFontColor(props.theme.secondaryFontColor ? props.theme.secondaryFontColor : defaultSecondaryFontColor);
        setButtonIcon(props.buttonIcon ? props.buttonIcon : defaultButtonIcon);
        setButtonCursor(props.buttonCursor ? props.buttonCursor : defaultButtonCursor);
        setButtonFontSize(props.buttonFontSize ? props.buttonFontSize : defaultButtonFontSize);
        setButtonOnClick(() => props.buttonOnClick ? props.buttonOnClick : defaultButtonOnClick);
        setButtonContent(props.buttonContent ? props.buttonContent : defaultButtonContent);
        
    }, [defaultButtonOnClick, props.buttonContent, props.buttonCursor, props.buttonFontSize, props.buttonIcon, props.buttonOnClick, props.buttonShape, props.theme]);

    return (
        <Button type={"text"} size={"large"}
                icon={buttonIcon}
                style={{color: secondaryFontColor, cursor: buttonCursor, fontSize: buttonFontSize}}
                onMouseOver={(e) => changeButtonTheme(primaryColor, primaryFontColor, e)}
                onMouseOut={(e) => changeButtonTheme("transparent", secondaryFontColor, e)}
                onClick={buttonOnClick}
        >
            {buttonContent}
        </Button>
    );
}

export default PublicButton;