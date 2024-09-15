import Cookies from "js-cookie";

export const clearAllCookies = () => {
        // Ambil semua cookie
        const cookies = document.cookie.split(';');
      
        // Iterasi melalui semua cookie dan hapus masing-masing
        cookies.forEach(cookie => {
          const [name] = cookie.split('=');
          // Menghapus cookie dengan nama yang sama
          Cookies.remove(name.trim());
        });
}