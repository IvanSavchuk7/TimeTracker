import {symlink} from "fs";
import {EventHandler} from "react";

export interface ButtonProps {
    type: "button" | "submit" | "reset" | undefined;
    value: string;
    handleClick?:Function

}