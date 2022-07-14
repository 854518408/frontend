//首页强势新品,每周特价这里用第三方接口王者荣耀数据渲染 其它静态页面
//处理首页index.html的主模块

import {
    getHeroInfo
} from "./api.js";
import {
    initHeroInfo,
    seamlessCarousel,
    secondMenu,
    updateUserInfo,
    headerCarEvent
} from "./public.js";


const topNormal = document.querySelector('.topNormal');
const resp = await getHeroInfo();
updateUserInfo();
headerCarEvent();
//强势新品用坦克英雄的前五条数据渲染
const blockProduct = document.querySelector('.blockProduct .content');
const proArray = resp.filter(elem => elem.hero_type === 3).slice(1, 6);
initHeroInfo(blockProduct, proArray);
//每周特价用战士英雄的前五条数据渲染
const specialProduct = document.querySelector('.specialProduct .content');
const speArray = resp.filter(elem => elem.hero_type === 1).slice(9, 14);
initHeroInfo(specialProduct, speArray);
//每周特价用刺客英雄的前五条数据渲染
const houseProduct = document.querySelector('.houseProduct .content');
const houseArray = resp.filter(elem => elem.hero_type === 4).slice(10, 15);
initHeroInfo(houseProduct, houseArray);
//安防监控用法师英雄的前五条数据渲染
const monitorProduct = document.querySelector('.monitorProduct .content');
const monitorArray = resp.filter(elem => elem.hero_type === 2).slice(1, 6);
initHeroInfo(monitorProduct, monitorArray);
//商用产品用射手英雄的前五条数据渲染
const businessProduct = document.querySelector('.businessProduct .content');
const businessArray = resp.filter(elem => elem.hero_type === 5).slice(4, 9);
initHeroInfo(businessProduct, businessArray);
//无线路由用辅助英雄的前五条数据渲染
const routerProduct = document.querySelector('.routerProduct .content');
const routerArray = resp.filter(elem => elem.hero_type === 6).slice(7, 12);
initHeroInfo(routerProduct, routerArray)
//用户点击回到顶部变让页面scrollTop变成0
topNormal.onclick = function () {
    document.documentElement.scrollTop = 0;
}
window.onscroll = function () {
    if (document.documentElement.scrollTop > 0) {
        topNormal.style.display = 'block';
    }
    if (document.documentElement.scrollTop === 0) {
        topNormal.style.display = 'none';
    }
}
//运行无缝轮播图函数
seamlessCarousel();
//运行二级菜单函数
secondMenu();
//tab选项卡代码
const liArr = document.querySelectorAll('.join li');
const contentArr = Array.from(document.querySelectorAll('.join .content li'));
for (const li of liArr) {
    li.onclick = function () {
        document.querySelector('.join .active').classList.remove('active');
        li.classList.add('active');
        contentArr.forEach((elem, i) => {
            if (i == li.dataset.index) {
                elem.style.display = 'block';
            } else {
                elem.style.display = 'none';
            }
        })
    }
}