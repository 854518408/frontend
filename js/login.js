import { login } from './api.js'
import { FieldValidator } from './public.js'

//处理登录html页面的主模块

const loginId = new FieldValidator('txtLoginId',(value)=>{
    if (!value.trim()){
        return '用户名不能为空'
    }
})

const loginPwd = new FieldValidator('txtLoginPwd',(value)=>{
    if(!value.trim()){
        return '密码不能为空'
    }
})

const btn = document.querySelector('.submit');
btn.onclick = async function (e) { 
    e.preventDefault();
    const res = await FieldValidator.validate([loginId,loginPwd]);
    if(res){
        const resp = await login(loginId.input.value,loginPwd.input.value);
        if(resp.code === 400){
            loginPwd.p.innerText = resp.msg;
            return
        }
        alert('登录成功');
        location.href = './index.html' 
    }
 }