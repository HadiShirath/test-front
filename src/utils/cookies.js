import Cookies from "js-cookie";

export const clearAllCookies = () => {
    Cookies.remove('access_token', { path: '/', domain: '.kamarhitung.id' });
}