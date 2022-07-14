import {
    getHeroInfo
} from "./api.js";
import 'https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js'; //引入jquery模块
import './jquery.pagination.js'; //引入分页的模块
import {updateUserInfo,headerCarEvent} from './public.js'

const content = document.querySelector('.content');
const resp = await getHeroInfo();
/**
 * 根据指定的英雄数组生成对应的li元素字符串集合
 * @param {Arrray} heroList 
 */
function setHeroHtml(heroList) {
    const html = heroList.map(elem => {
        return `<li>
                    <a href="./detail.html?ename=${elem.ename}" target="_blank">
                        <span>${elem.cname}</span>
                        <img src="https://game.gtimg.cn/images/yxzj/img201606/skin/hero-info/${elem.ename}/${elem.ename}-bigskin-1.jpg" alt="">
                        <i>${elem.title}</i>
                        <p class='detail'>${elem.skin_name?elem.skin_name:'冷晖之枪'}</p>
                        <p class='price'>
                            <span>￥${elem.ename}</span>
                            <i class="iconfont icon-gouwuche"></i>
                        </p>
                    </a>
                </li>`
    }).join('');
    return html
}

updateUserInfo();
headerCarEvent();
//初始化展示全部英雄数据
showAllHero()
//处理所有radio元素的点击事件
radioClickEvent();
//搜索框搜索英雄事件 加个函数防抖 更加合适
inputEvent();


//函数防抖封装
function debounce(callback, delay = 1000) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback(...args)
        }, delay)
    }
}

//分页函数封装
function pagination(resp) { 
    content.innerHTML = `<ul>${setHeroHtml(resp.slice(0,8))}</ul>`;
    $('.page').pagination({
        pageCount: Math.ceil(resp.length / 8), //总页数
        jump: true, //是否开启跳转到指定页数，值为boolean类型
        coping: true, //是否开启首页和末页，值为boolean
        homePage: '首页',
        endPage: '末页',
        prevContent: '上一页',
        nextContent: '下一页',
        callback: function (api) {
            const currentIndex = (api.getCurrent() - 1) * 8;
            const nextIndex = api.getCurrent() * 8;
            content.innerHTML = `<ul>${setHeroHtml(resp.slice(currentIndex,nextIndex))}</ul>`;
        }
    });
 }

function showAllHero() {
   pagination(resp);
}

function radioClickEvent() {
    const radioList = document.querySelectorAll('.radio');
    for (const radio of radioList) {
        radio.onclick = function (e) {
            //当前元素如果已经是激活状态,则重复点击直接结束函数,不用更新innerHTML
            if (radio.classList.contains('checked')) {
                return
            }
            document.querySelector('.checked').classList.remove('checked');
            radio.classList.add('checked');
            //本周免费和新手推荐事件
            if (radio.dataset.pay_type) {
                const heroList = resp.filter(elem => elem.pay_type == radio.dataset.pay_type);
                pagination(heroList);
            }
            //全部英雄事件
            if (radio.id === 'allHero') {
                showAllHero();
            }
            //坦克,战士,刺客,法师,射手,辅助点击事件
            if (radio.dataset.hero_type) {
                const heroList = resp.filter(elem => elem.hero_type == radio.dataset.hero_type || elem.hero_type2 == radio.dataset.hero_type);
                pagination(heroList);
            }
            //价格升序,价格降序事件
            if (radio.dataset.price_sort) {
                if (radio.dataset.price_sort === 'down') {
                    const heroList = resp.sort((a, b) => b.ename - a.ename);
                    pagination(heroList);
                }
                if (radio.dataset.price_sort === 'up') {
                    const heroList = resp.sort((a, b) => a.ename - b.ename);
                    pagination(heroList);
                }
            }
        }
    }
}

function inputEvent() {
    const input = document.querySelector('input');
    const allHero = document.getElementById('allHero');
    input.oninput = debounce(function () {
        //如果input内容改变后又重新变成空了
        if (input.value === '') {
            showAllHero()
        }
        document.querySelector('.checked').classList.remove('checked');
        allHero.classList.add('checked');
        const heroList = resp.filter(elem => {
            return elem.cname.includes(input.value) || (elem.skin_name ? elem.skin_name : '冷晖之枪').includes(input.value)
        });
        pagination(heroList);
    }, 500)
}