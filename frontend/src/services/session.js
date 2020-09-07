// return the user data from the session storage
export const getUser = () => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    else return null;
};

// return the user type from the session storage
export const getType = () => {
    return sessionStorage.getItem("type") || null;
};

// return the token from the session storage
export const getToken = () => {
    return sessionStorage.getItem("token") || null;
};

// remove the token and user from the session storage
export const removeUserSession = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("type");
    sessionStorage.removeItem("user");
};

// set the token and user from the session storage
export const setUserSession = (token, user, type) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("type", type);
    sessionStorage.setItem("user", JSON.stringify(user));
};
