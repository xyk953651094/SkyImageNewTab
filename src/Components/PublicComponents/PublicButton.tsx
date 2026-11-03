import React from "react";
import {Button} from "antd";
import {changeButtonTheme} from "../../TypeScripts/PublicFunctions";
import {ThemeInterface} from "../../TypeScripts/PublicInterface";
import "../../StyleSheets/PublicStyles.scss"

interface HoverButtonProps {
    theme: ThemeInterface;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    size?: "small" | "middle" | "large";
    onClick?: () => void;
    href?: string;
    target?: string;
}

export function HoverButton({theme, icon, children, size = "large", onClick, href, target}: HoverButtonProps) {
    return (
        <Button type={"text"} size={size}
                icon={icon}
                style={{
                    color: theme.secondaryFontColor,
                    cursor: onClick || href ? "pointer" : "default"
                }}
                onClick={onClick}
                href={href}
                target={target}
                onMouseOver={(e) => changeButtonTheme(theme.primaryColor, theme.primaryFontColor, e)}
                onMouseOut={(e) => changeButtonTheme("transparent", theme.secondaryFontColor, e)}>
            {children}
        </Button>
    );
}