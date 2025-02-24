/**
 * Funciones útiles (y esas que no sabes donde poner)
 */
function getCookieValue(name) {
    const cookies = document.cookie.split('; '); // Separa las cookies
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === name) {
        return value;
      }
    }
    return null;
  }

function truncateString(str) {
    if (str != undefined && str.length > 20) {
        return str.substring(0, 20) + '...';
    } else {
        return str;
    }
}



export {getCookieValue, truncateString}