import { Language } from "../redux";
import { ReadCookie } from "./cookieManager";

export const FetchErrorMessages = () => {
    const lang = ReadCookie("language") as keyof typeof Language ?? Language.en;
    return import(`../redux/errors/${Language[lang]}.json`)
}

export const GetErrorMessage = async (msg: string) => {
    const errorMessages = await FetchErrorMessages();
    if(errorMessages)
        return errorMessages[msg] ?? errorMessages["ERR_UNEXPECTED_ERROR"]
    console.error("Unexpected error!")
    return
}
