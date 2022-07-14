import { register } from './api.js'
import { isExist } from './api.js'
import { FieldValidator } from './public.js'

//处理注册html页面的主模块
const txtLoginId = new FieldValidator('txtLoginId',async (value)=>{
    if(!value.trim()){
        return '用户名不能为空'
    }
    if(value.replace(/[\u4e00-\u9fa5]/g, "**").length>14){
        return '用户名最长为14个英文或7个汉字'
    }
    if(!/^[a-zA-Z\u4e00-\u9fa5]+$/.test(value)){
        return '用户名只能中英文组成...'
    }
    const resp = await isExist(value);
    if(resp.data === true){
        return '账号已存在'
    }
})

const txtNickname = new FieldValidator('txtNickname',(value)=>{
    if(!value.trim()){
        return '昵称不能为空'
    }
    if(value.replace(/[\u4e00-\u9fa5]/g, "**").length>14){
        return '昵称最长为14个英文或7个汉字'
    }
    if(!/^[a-zA-Z\u4e00-\u9fa5]+$/.test(value)){
        return '昵称只能中英文组成...'
    }
})

const txtLoginPwd = new FieldValidator('txtLoginPwd',(value)=>{
    if(!value.trim()){
        return '请填写密码'
    }
    if(value.length < 6 || value.length > 15){
        return '密码长度为6到15位'
    }
    let count = 0;
    if(/[0-9]+/.test(value)){
        count ++;
    }
    if(/[a-z]+/.test(value)){
        count ++;
    }
    if(/[A-Z]+/.test(value)){
        count ++;
    }
    if(/[\W\_]+/.test(value)){
        count ++;
    }
    if(count === 1){
        return '密码强度太低,请输入多种字符'
    }
    if(count === 2){
        return '密码强度为中,可以加强也可以提交'
    }
})
const txtLoginPwdConfirm = new FieldValidator('txtLoginPwdConfirm',(value)=>{
    if(!value.trim()){
        return '请确认密码'
    }
    if(value !== txtLoginPwd.input.value){
        return '两次输入的密码不一致'
    }
})  

const btn = document.querySelector('.submit');
btn.onclick = async function (e) { 
    e.preventDefault();
    const res = await FieldValidator.validate([txtLoginId,txtNickname,txtLoginPwd,txtLoginPwdConfirm]);
    if(res){
        //这里发送fetch请求,调用register接口
        const resp = await register({
            loginId:txtLoginId.input.value,
            loginPwd:txtLoginPwd.input.value,
            nickname:txtNickname.input.value
        })
        if(resp.code === 0){
            alert('注册成功');
            location.href = './login.html'
        }
    }
}