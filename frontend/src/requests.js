import { endpoint } from './utils';

const requests = {
    registerURL: `${endpoint}users/api/register/`,
    loginURL: `${endpoint}users/api/login/`,
    getUserURL: `${endpoint}users/api/user/`,
    getContactURL: `${endpoint}api/contact/`
}

export default requests