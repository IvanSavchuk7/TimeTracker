import Cookies from 'js-cookie';

export const ReadCookie = (name: string): string | undefined => {
    return Cookies.get(name)
}

export const SetCookie = (cookieName: string, cookieValue: string) => {
    Cookies.set(cookieName, cookieValue, { path: '/', secure: true })
}

export const DeleteCookie = (cookieName: string) => {
    Cookies.remove(cookieName)
}
