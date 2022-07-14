//该文件封装各个网络请求的接口,并导出

const BASE_URL = 'https://study.duyiedu.com';
/**
 * 登录接口(POST)
 * @param {String} loginId 
 * @param {String} loginPwd 
 */
export async function login(loginId, loginPwd) {
    const resp = await fetch(`${BASE_URL}/api/user/login`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            loginId,
            loginPwd
        })
    })
    const res = await resp.json();
    //登录成功则将token令牌存到本地
    if (res.code === 0) {
        localStorage.setItem('token', resp.headers.get('Authorization'))
    }
    return res;
}

/**
 * 注册接口(POST)
 * @param {Object} regInfo 对象的键固定为loginId,loginPwd,nickname
 */
export function register(regInfo) {
    return fetch(`${BASE_URL}/api/user/reg`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(regInfo)
    }).then(resp => resp.json())
}

/**
 * 根据loginId判断该用户名是否已经注册了(GET)
 * @param {String} loginId 
 */
export function isExist(loginId) {
    return fetch(`${BASE_URL}/api/user/exists?loginId=${loginId}`)
        .then(resp => resp.json())
}

/**
 * 获取第三方接口王者荣耀的英雄数据,用于填充index.html,list.html,detail.html,cartlist.html页面
 */
export function getHeroInfo() {
    return fetch(`${BASE_URL}/api/herolist`)
        .then(resp => resp.json())
        .then(resp => resp.data.reverse())
}

/**
 * 判断当前用户是否登录及登录过后的用户信息
 * @param {String} token 登录成功后端返回的token值
 * @returns promise对象
 */
export function profile(token) {
    return fetch(`${BASE_URL}/api/user/profile`, {
        headers: {
            authorization: 'Bearer' + ' ' + token
        }
    }).then(resp => resp.json())
}