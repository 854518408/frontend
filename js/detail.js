import {
    getHeroInfo,
    profile
} from './api.js'

import {updateUserInfo} from './public.js'

const config = {
    titleImg: [], //小标题图片路径
    smallBg: [], // 小图背景路径
    bigBg: [], //大图背景路径
    divProduct: document.querySelector('.product-info'),
    divTitle: document.querySelector('.content .title-img'),
    divBig: document.querySelector(".content .big"), //大图div dom元素
    divSmall: document.querySelector(".content .small"), //小图div dom元素
    divMove: document.querySelector(".content .small .move"), //可移动的div
    smallImgSize: { //小图尺寸
        width: 350,
        height: 200
    },
    divBigSize: { //大的div的尺寸
        width: 1090,
        height: 500
    },
    bigImgSize: { //大图尺寸
        width: 1920,
        height: 882
    }
};
const resp = await getHeroInfo();
const ename = location.search.slice(7);
const result = resp.filter(elem => elem.ename == ename)[0];
//获取地址栏cname数据,并进行更新图片放大镜右边的内容
function initProductInfo() {
    //更新divProduct里面的内容
    config.divProduct.innerHTML = `
        <h4>${result.title} ${result.skin_name} ${result.cname}</h4>
            <div class="price">￥${result.ename}</div>
            <div class="freight"></div>
            <div class="address">
                <span>发货地址：</span>广东 深圳
                <i>有货</i>
            </div>
            <div class="buybtns clearfix">
                <div class="num fl">
                    <input type="text" class="fl" value="1" readonly>
                    <button class="fr addbtn">+</button>
                    <button class="fr lowerbtn">-</button>
                </div>
                <a href="javascript:;" class="tobuy fl">去购物车查看</a>
                <div class="addcart fl">
                    <i class="iconfont icon-gouwuche"></i>
                    加入购物车
                </div>
            </div>`;
    //更新config里面的titleImg,smallBg,bigBg信息
    //大背景图片:https://game.gtimg.cn/images/yxzj/img201606/skin/hero-info/131/131-bigskin-1.jpg;
    config.titleImg = config.smallBg = config.bigBg = [
        `https://game.gtimg.cn/images/yxzj/img201606/skin/hero-info/${result.ename}/${result.ename}-bigskin-1.jpg`,
        `https://game.gtimg.cn/images/yxzj/img201606/skin/hero-info/${result.ename}/${result.ename}-bigskin-2.jpg`,
        `https://game.gtimg.cn/images/yxzj/img201606/skin/hero-info/${result.ename}/${result.ename}-bigskin-3.jpg`,
    ];

}

//计算可移动的div的宽高
config.moveSize = {
    width: config.divBigSize.width / config.bigImgSize.width * config.smallImgSize.width,
    height: config.divBigSize.height / config.bigImgSize.height * config.smallImgSize.height,
};

updateUserInfo();
await initProductInfo();
initDivBg();
initMoveDiv();
initDivSmallEvent();
productEvent();
cartlistEvent();


/**
 * 初始化div背景
 */
function initDivBg() {
    const html = config.titleImg.map((url, i) => {
        if (i === 0) {
            return `<img src="${url}" alt="" class="active">`
        }
        return `<img src="${url}" alt="">`
    }).join('');
    config.divTitle.innerHTML = html;
    config.divSmall.style.backgroundImage = `url("${config.smallBg[0]}")`;
    config.divBig.style.backgroundImage = `url("${config.bigBg[0]}")`;
    //divTitle 子img标签的点击事件
    for (let i = 0; i < config.titleImg.length; i++) {
        config.divTitle.children[i].onclick = function () {
            document.querySelector('.content .active').classList.remove('active');
            this.classList.add('active');
            config.divSmall.style.backgroundImage = `url("${config.smallBg[i]}")`;
            config.divBig.style.backgroundImage = `url("${config.bigBg[i]}")`;
        }
    }
}

/**
 * 初始化可移动的div
 */
function initMoveDiv() {
    config.divMove.style.width = config.moveSize.width + "px";
    config.divMove.style.height = config.moveSize.height + "px";
}

/**
 * 初始化小图div的鼠标事件
 */
function initDivSmallEvent() {
    config.divSmall.onmouseenter = function () {
        config.divMove.style.display = "block";
        config.divBig.style.display = "block";
    }
    config.divSmall.onmouseleave = function () {
        config.divMove.style.display = "none";
        config.divBig.style.display = "none";
    }

    config.divSmall.onmousemove = function (e) {
        var offset = getOffset(e);
        setPosition(offset);
        setBigBgPosition();
    }

    /**
     * 设置大图背景图位置
     */
    function setBigBgPosition() {
        var style = getComputedStyle(config.divMove);
        var left = parseFloat(style.left);
        var top = parseFloat(style.top);

        var bgLeft = left / config.smallImgSize.width * config.bigImgSize.width;
        var bgTop = top / config.smallImgSize.height * config.bigImgSize.height;
        config.divBig.style.backgroundPosition = `-${bgLeft}px -${bgTop}px`;
    }

    /**
     * 根据鼠标坐标，设置divMove的坐标
     * @param {*} offset 
     */
    function setPosition(offset) {
        var left = offset.x - config.moveSize.width / 2;
        var top = offset.y - config.moveSize.height / 2;
        if (left < 0) {
            left = 0;
        }
        if (top < 0) {
            top = 0;
        }
        if (left > config.smallImgSize.width - config.moveSize.width) {
            left = config.smallImgSize.width - config.moveSize.width;
        }
        if (top > config.smallImgSize.height - config.moveSize.height) {
            top = config.smallImgSize.height - config.moveSize.height;
        }
        config.divMove.style.left = left + "px";
        config.divMove.style.top = top + "px";
    }

    /**
     * 根据鼠标事件参数，得到鼠标在divsmall中的坐标
     * @param {MouseEvent} e 
     */
    function getOffset(e) {
        if (e.target === config.divSmall) {
            return {
                x: e.offsetX,
                y: e.offsetY
            }
        } else {
            //事件源是divMove
            var style = getComputedStyle(config.divMove);
            var left = parseFloat(style.left);
            var top = parseFloat(style.top);
            return {
                x: e.offsetX + left + 1, //加1是因为边框
                y: e.offsetY + top + 1
            }
        }
    }
}

//商品加减注册点击事件
function productEvent() {
    const addbtn = document.querySelector('.buybtns .addbtn');
    const lowerbtn = document.querySelector('.buybtns .lowerbtn');
    const input = document.querySelector('.buybtns .num input');
    addbtn.onclick = function () {
        if (input.value >= 99) {
            alert('每次购买的商品数量不能多于99');
            input.value = 99;
            return
        }
        input.value = +input.value + 1;
    }
    lowerbtn.onclick = function () {
        if (input.value <= 1) {
            alert('商品数量不能小于1');
            input.value = 1;
            return
        }
        input.value = +input.value - 1;
    }
}

//去购物车查看(包括header头部最右边的购物车),加入购物车的点击事件
function cartlistEvent() {
    const buybtns = document.querySelector('.buybtns .tobuy');
    const headerCart = document.querySelector('#headerCart');
    const addcart = document.querySelector('.buybtns .addcart');
    let token;
    buybtns.onclick = headerCart.onclick = async function () {
        //判断当前用户登录信息,已经登录则可以去购物车页面,没有登录则跳转到登录页
        token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
        const resp = await profile(token);
        if (resp.code === 401) {
            alert('亲,您还没登录,点击确定去登录页面');
            location.href = './login.html';
        }
        location.href = `./cartlist.html?nickname=${resp.data.nickname}`;
    }
    addcart.onclick = async function () {
        const input = document.querySelector('.buybtns .num input');
        token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
        const resp = await profile(token);
        if (resp.code === 401) {
            alert('亲,您还没登录,点击确定去登录页面');
            location.href = './login.html';
        }
        const shoppingInfo = localStorage.getItem(resp.data.nickname) ? JSON.parse(localStorage.getItem(resp.data.nickname)) : [];
        //如果添加的商品已经存在于购物车中,则更新该商品的数量;不存在则在购物车数组里面新增商品对象
        const currentProduct = shoppingInfo.filter(elem => elem.price == result.ename);
        if (currentProduct.length !== 0) {
            currentProduct[0].num += +input.value;
        } else {
            shoppingInfo.push({
                name: `${result.title} ${result.skin_name} ${result.cname}`,
                price: result.ename,
                num: +input.value,
                img:`https://game.gtimg.cn/images/yxzj/img201606/heroimg/${result.ename}/${result.ename}.jpg`
            })
        }
        localStorage.setItem(resp.data.nickname, JSON.stringify(shoppingInfo));
        alert('加入购物车成功!');
    }
}