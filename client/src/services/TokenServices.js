// let tokenName = 'user';

const setToken = (token, tokenName) => {
    localStorage.setItem(tokenName, token);
}

const getToken = (tokenName) => {
    return localStorage.getItem(tokenName);
}

const clearToken = (tokenName) => {
    localStorage.removeItem(tokenName);
}

module.exports = {
    setToken,
    getToken,
    clearToken
}