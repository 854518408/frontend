//封装用户注册和登录的表单项验证等一系列通用代码,并导出
import 'https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js'; //引入jquery模块
import 'https://cdn.bootcdn.net/ajax/libs/jquery.lazyload/1.9.1/jquery.lazyload.min.js'; //引入jquery懒加载插件
import {
    profile
} from './api.js';
/**
 * 对某一个表单项进行验证的通用构造函数
 */
export class FieldValidator {
    /**
     * 构造函数
     * @param {Stirng} txtId 文本框id
     * @param {Function} validatorFunc 验证规则函数 也是回调函数 参数为文本框的内容
     */
    constructor(txtId, validatorFunc) {
        this.input = document.getElementById(txtId);
        this.p = this.input.nextElementSibling;
        this.validatorFunc = validatorFunc;
        //this.input失去焦点时触发一次验证方法
        this.input.onblur = () => {
            this.validate()
        }
    }

    //实例方法 验证方法 可以在任何时候主动调用 验证的时候(注册时)需要调用fetch api,所以需要异步处理
    async validate() {
        const errMsg = await this.validatorFunc(this.input.value);
        //如果错误信息存在,则将其显示在this.p中;否则this.p显示为空
        if (errMsg && errMsg !== '密码强度为中,可以加强也可以提交') {
            this.p.innerText = errMsg;
            return false; //标记思维 用于最后点击注册(登录)时判断能不能注册(登录)
        } else if (errMsg === '密码强度为中,可以加强也可以提交') {
            this.p.innerText = '密码强度为中,可以加强也可以提交';
            return true; //标记思维 用于最后点击注册(登录)时判断能不能注册(登录)
        } else {
            this.p.innerText = '';
            return true; //标记思维 用于最后点击注册(登录)时判断能不能注册(登录)
        }
    }

    /**
     * 静态方法 验证方法 主要用于用户最后点击注册或者登录时总的来一次验证
     * @param {Array} validators 数组里面存放各个需要验证的new FieldValidator()对象
     */
    static async validate(validators) {
        let res = true;
        for (const input of validators) {
            if (!await input.validate()) {
                res = false;
                //break;这里不能break 需要所有input都进行验证 一开始就出现错误,后面也要验证,把错误信息显示到this.p中
            }
        }
        return res;
    }
}

/**
 * 传入一个英雄数据的数组,将英雄数据初始化渲染到页面中(采用jquery图片懒加载插件)
 * @param {Array} arr 
 * @param {Element} 元素对象 
 * https://game.gtimg.cn/images/yxzj/img201606/heroimg/533/533.jpg
 * 大背景图片:https://game.gtimg.cn/images/yxzj/img201606/skin/hero-info/131/131-bigskin-1.jpg;
 * 皮肤图片: https://game.gtimg.cn/images/yxzj/img201606/skin/hero-info/131/131-bigskin-2.jpg
 */
export function initHeroInfo(elem, arr) {
    let html = `<div class="left fl">
                    <img data-original="https://game.gtimg.cn/images/yxzj/img201606/skin/hero-info/${arr[0].ename}/${arr[0].ename}-bigskin-2.jpg" class="lazy" alt="">
                    <p>${arr[0].cname}</p>
                    <p>${arr[0].skin_name}</p>
                    <p>${arr[0].title}</p>
                    <p>¥${arr[0].ename}</p>
                </div>`;
    html += '<div class="right fl">';
    for (let i = 1; i < arr.length; i++) {
        html += `<div class="clearfix box fl">
                    <img data-original="https://game.gtimg.cn/images/yxzj/img201606/heroimg/${arr[i].ename}/${arr[i].ename}.jpg" alt="" class="fl lazy">
                    <div class="fl">
                        <p>${arr[i].cname}</p>
                        <p>${arr[i].skin_name}</p>
                        <p>${arr[i].title}</p>
                        <p>¥${arr[i].ename}</p>
                    </div>
                </div>`;
    }
    html += '</div>';
    elem.innerHTML = html;
    $("img.lazy").lazyload({
        effect: "fadeIn" //也可以用另一种效果fadeIn
    });
}

/**
 * 将无缝轮播图的函数封装并导出,不是通用函数,只适用于本项目
 */
export function seamlessCarousel() {
    //配置对象
    const config = {
        imgWidth: 1200, //图片的宽度
        dotWidth: 10, //圆点的宽度
        doms: { //涉及的dom对象
            divBanner: document.querySelector(".banner"),
            divImgs: document.querySelector(".banner .imgs"),
            divDots: document.querySelector(".banner .dots"),
            divArrow: document.querySelector(".banner .arrow")
        },
        currentIndex: 0, //实际的图片索引，0 ~ imgNumber-1
        timer: { //运动计时器配置
            duration: 16, //运动间隔的时间，单位毫秒
            total: 300, //运动的总时间，单位毫秒
            id: null //计时器id
        },
        autoTimer: null //自动移动的计时器
    };
    //图片数量
    config.imgNumber = config.doms.divImgs.children.length;
    //初始化元素尺寸
    function initSize() {
        config.doms.divDots.style.width = config.dotWidth * config.imgNumber + 8 * 4 + "px";
        config.doms.divImgs.style.width = config.imgWidth * (config.imgNumber + 2) + "px";
    }
    //初始化元素
    function initElements() {
        //创建小圆点
        for (var i = 0; i < config.imgNumber; i++) {
            var span = document.createElement("span");
            config.doms.divDots.appendChild(span);
        }
        //复制图片
        var children = config.doms.divImgs.children;
        var first = children[0],
            last = children[children.length - 1];
        var newImg = first.cloneNode(true); //深度克隆
        config.doms.divImgs.appendChild(newImg);
        newImg = last.cloneNode(true);
        config.doms.divImgs.insertBefore(newImg, first);
    }
    //初始化位置
    function initPosition() {
        var left = (-config.currentIndex - 1) * config.imgWidth;
        config.doms.divImgs.style.marginLeft = left + "px";
    }
    //设置小圆点的状态
    function setDotStatus() {
        for (var i = 0; i < config.doms.divDots.children.length; i++) {
            var dot = config.doms.divDots.children[i];
            if (i === config.currentIndex) {
                dot.className = "active";
            } else {
                dot.className = "";
            }
        }
    }
    //初始化汇总方法
    function init() {
        initSize();
        initElements();
        initPosition();
        setDotStatus();
    }
    init();
    /**
     * 切换到某一个图片索引
     * @param {*} index 切换到的图片索引
     * @param {*} direction 方向  "left"  "right"
     */
    function switchTo(index, direction) {
        if (index === config.currentIndex) {
            return;
        }
        if (!direction) {
            direction = "left";
        }
        //最终的marginLeft
        var newLeft = (-index - 1) * config.imgWidth;
        animateSwitch();

        //重新设置当前索引
        config.currentIndex = index;
        setDotStatus();


        /**
         * 逐步改变marginLeft
         */
        function animateSwitch() {
            stopAnimate(); //先停止之前的动画
            //1. 计算运动的次数
            var number = Math.ceil(config.timer.total / config.timer.duration);
            var curNumber = 0; //当前的运动次数
            //2. 计算总距离
            var distance,
                marginLeft = parseFloat(getComputedStyle(config.doms.divImgs).marginLeft),
                totalWidth = config.imgNumber * config.imgWidth;
            if (direction === "left") {
                if (newLeft < marginLeft) {
                    distance = newLeft - marginLeft;
                } else {
                    distance = -(totalWidth - Math.abs(newLeft - marginLeft));
                }
            } else {
                if (newLeft > marginLeft) {
                    distance = newLeft - marginLeft;
                } else {
                    distance = totalWidth - Math.abs(newLeft - marginLeft);
                }
            }
            //3. 计算每次改变的距离
            var everyDistance = distance / number;

            config.timer.id = setInterval(function () {
                //改变div的marginleft
                marginLeft += everyDistance;
                if (direction === "left" && Math.abs(marginLeft) > totalWidth) {
                    marginLeft += totalWidth;
                } else if (direction === "right" && Math.abs(marginLeft) < config.imgWidth) {
                    marginLeft -= totalWidth;
                }
                config.doms.divImgs.style.marginLeft = marginLeft + "px";
                curNumber++;
                if (curNumber === number) {
                    stopAnimate();
                }
            }, config.timer.duration);
        }

        function stopAnimate() {
            clearInterval(config.timer.id);
            config.timer.id = null;
        }
    }

    config.doms.divArrow.onclick = function (e) {
        if (e.target.classList.contains("left")) {
            toLeft();
        } else if (e.target.classList.contains("right")) {
            toRight();
        }
    }

    config.doms.divDots.onclick = function (e) {
        if (e.target.tagName === "SPAN") {
            var index = Array.from(this.children).indexOf(e.target);
            switchTo(index, index > config.currentIndex ? "left" : "right");
        }
    }

    function toLeft() {
        var index = config.currentIndex - 1;
        if (index < 0) {
            index = config.imgNumber - 1;
        }
        switchTo(index, "right");
    }

    function toRight() {
        var index = (config.currentIndex + 1) % config.imgNumber;
        switchTo(index, "left");
    }

    config.autoTimer = setInterval(toRight, 5000);

    config.doms.divBanner.onmouseenter = function () {
        clearInterval(config.autoTimer);
        config.autoTimer = null;
    }

    config.doms.divBanner.onmouseleave = function () {
        if (config.autoTimer) {
            return;
        }
        config.autoTimer = setInterval(toRight, 2000);
    }
}

/**
 * 将二级菜单的函数封装并导出,不是通用函数,只适用于本函数
 */
export function secondMenu() {
    const liArr = document.querySelectorAll('.menu>li');
    for (const li of liArr) {
        li.onmouseover = function () {
            this.firstElementChild.style.backgroundColor = '#ff6700';
            this.firstElementChild.nextElementSibling.style.display = 'block';
        }
        li.onmouseout = function () {
            this.firstElementChild.style.backgroundColor = 'rgba(0,0,0,0)';
            this.firstElementChild.nextElementSibling.style.display = 'none';
        }
    }
}

/**
 * 用户已经登录了,则头部的登录、注册变成显示用户昵称和退出;用户点击退出了则重新变成登录、注册
 * 封装该功能并导出,不是通用函数,只适用于本项目
 */
export async function updateUserInfo() {
    const login = document.getElementById('login');
    const register = document.getElementById('register');

    let token;
    //判断当前用户登录信息
    token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    const resp = await profile(token);

    if (resp.code === 0) {
        login.innerHTML = `<a href="javascript:;">好久不见 : ${resp.data.nickname} !</a>`;
        register.innerHTML = `<a href="javascript:;" id="loginout">退出</a>`;
    }
    const loginout = document.getElementById('loginout');
    //用户点击退出时清除localStorage的token,退回成登录注册样式
    loginout && (loginout.addEventListener('click', function () {
        localStorage.removeItem('token');
        login.innerHTML = `<a href="./login.html">登录</a>`;
        register.innerHTML = `<a href="./register.html">注册</a>`;
    }))

}

/**
 * 头部导航栏用户点击购物车车进行是否登录的判断及跳转,封装功能并导出
 */
export function headerCarEvent() {
    let token;
    const headerCart = document.getElementById('headerCart');
    headerCart.onclick = async function () {
        //判断当前用户登录信息,已经登录则可以去购物车页面,没有登录则跳转到登录页
        token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
        const resp = await profile(token);
        if (resp.code === 401) {
            alert('亲,您还没登录,点击确定去登录页面');
            location.href = './login.html';
        }
        location.href = `./cartlist.html?nickname=${resp.data.nickname}`;
    }
}