import React from "react";
import {Button} from "antd";
import {btnMouseOut, btnMouseOver} from "../../TypeScripts/PublicFunctions";

function PublicButton(props: any) {
    return (
        <Button type={"text"}
                shape={props.buttonShape}
                icon={props.buttonIcon}
                className={"poemFont"}
                style={{color: props.theme.fontColor, cursor: props.buttonCursor}}
                onMouseOver={(e) => btnMouseOver(props.theme.hoverColor, e)}
                onMouseOut={(e) => btnMouseOut(props.theme.fontColor, e)}
                onClick={props.buttonOnClick}
        >
            {props.buttonContent}
        </Button>
    );
}

export default PublicButton;