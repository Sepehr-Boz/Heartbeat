import Cookies from "universal-cookie";

// checks cookies on the website to see if the user is already logged in
// returns true/false based on whether it can or not get cookie data
function IsUserLoggedIn(){
    const rootCookies = new Cookies(null, {path:"/"});
    return (rootCookies.get("id") != undefined);
}


export default IsUserLoggedIn;