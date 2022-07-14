import "https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js";
import {
    updateUserInfo,
} from "./public.js";
import {
    profile
} from "./api.js"
await updateUserInfo();
//如果别的页面点击退出了,购物车页面刷新时需要进行判断
async function isLogin() {
    let token;
    token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    const resp = await profile(token);
    if (resp.code === 401) {
        alert('亲,您还没登录,点击确定去登录页面');
        location.href = './login.html';
    }
}
await isLogin();

$('#headerCart').click(() => {
    alert('亲,这已经是购物车页面了');
})
//购物车页面用户如果点了退出,则用户不能看见购物车的内容,跳转到首页
document.getElementById('loginout').addEventListener('click', function () {
    location.href = './index.html';
});

//从地址栏和localStorage中读取购物车中的数据,并进行初始化
const nickname = decodeURI(location.search.slice(10));
const cartArr = JSON.parse(localStorage.getItem(nickname));

initCartlist();

//找到全选的多选框,给它注册click事件(change事件也可以)
$('.checkAll').click(function () {
    //设置没被鼠标点击的所有多选框的选中状态和当前正在点击的多选框的选中状态一致 
    $(':checkbox').not(this).prop('checked', this.checked);
    setTotal();
});

//商品框全部选上时,全选框激活;商品框有一个没选上,全选框不激活
$('.checkItem').click(() => {
    if ($('.checkItem').length === $('.checkItem:checked').length) {
        $('.checkAll').prop('checked', true);
    } else {
        $('.checkAll').prop('checked', false)
    }
    setTotal();
})

//处理商品数量+和-的的点击事件
$('.incr').click((e) => {
    e.preventDefault();
    let count = +$(e.target).prev().val();
    let sum = 0;
    const unitPrice = parseFloat($(e.target).parent().prev().text().slice(1));
    count++;
    sum = unitPrice * count;
    //更新当前商品的数量和金额
    $(e.target).prev().val(count);
    $(e.target).parent().next().find('em').text(`￥${sum.toFixed(2)}`);
    setTotal();
    //更新localStorage里面的数据
    cartArr[e.target.dataset.index].num = count;
    localStorage.setItem(nickname, JSON.stringify(cartArr));
})

$('.decr').click((e) => {
    e.preventDefault();
    let count = +$(e.target).next().val();
    let sum = 0;
    if (count <= 1) {
        return
    }
    const unitPrice = parseFloat($(e.target).parent().prev().text().slice(1));
    count--;
    sum = unitPrice * count;
    //更新当前商品的数量和金额
    $(e.target).next().val(count);
    $(e.target).parent().next().find('em').text(`￥${sum.toFixed(2)}`);
    setTotal();
    //更新localStorage里面的数据
    cartArr[e.target.dataset.index].num = count;
    localStorage.setItem(nickname, JSON.stringify(cartArr));
})
//单个商品的删除点击事件
$('.del').find('a').click(function (e) {
    e.preventDefault();
    $(this).parents('.item').remove();
    //这里必须要删除使原数组变成稀松数组,不能用splice,因为自定义属性的索引没变
    delete cartArr[e.target.dataset.index]
    //更新localStorage里面的数据
    localStorage.setItem(nickname, JSON.stringify(cartArr.filter(elem => elem)));
    setTotal();
})
//清空购物车点击事件
$('.clearAll').click(function (e) {
    e.preventDefault();
    $('.item').remove()
    setTotal();
    //更新localStorage里面的数据
    localStorage.setItem(nickname, JSON.stringify([]));
})
//删除选中商品点击事件
$('.delChecked').click(function (e) {
    e.preventDefault();
    $('.checkItem:checked').parents('.item').each(function (i, elem) {
        //找到选择对象下面删除按钮下面的自定义属性,用稀松数组的形式删除,不能用splice();
        delete cartArr[$(elem).find('.del a').prop('dataset').index]
    });
    $('.checkItem:checked').parents('.item').remove();
    //更新localStorage里面的数据
    localStorage.setItem(nickname, JSON.stringify(cartArr.filter(elem => elem)));
    setTotal();
})

//设置汇总信息
function setTotal() {
    const cbs = $('.checkItem:checked');
    let price = 0;
    $('.nums>em').text(cbs.length);
    cbs.each((i, dom) => {
        price += parseFloat($(dom).parent().nextAll('.sum').text().slice(1));
    })
    $('.sums>em').text(`￥${price.toFixed(2)}`);
}

//购物车内容初始化
function initCartlist() {
    if (!cartArr || cartArr.length === 0) {
        $('.list').html('<p style="margin-left:515px">购物车空空如也,快去购物吧!</p>');
        return
    }
    const html = cartArr.map((cart, i) => `
                    <div class="item">
                        <div class="check">
                            <input type="checkbox" class="checkItem" />
                        </div>
                        <div class="info">
                            <img src="${cart.img}" alt="">
                            <a href="">${cart.name}</a>
                        </div>
                        <div class="price"><em>￥${cart.price}</em></div>
                        <div class="num">
                            <a href="" class="decr" data-index="${i}">-</a>
                            <input type="text" value="${cart.num}" class="txt">
                            <a href="" class="incr" data-index="${i}">+</a>
                        </div>
                        <div class="sum"><em>￥${cart.num*cart.price}</em></div>
                        <div class="del">
                            <a href="" data-index="${i}">删除</a>
                        </div>  
                    </div>`).join('');
    $('.list').html(html);
}