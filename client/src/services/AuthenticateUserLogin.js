import { getToken } from './TokenServices.js';

export const authenticate = (tokenName) => {
    const user = getToken(tokenName);
    if(user === null)
        return null;
    return user;
}

