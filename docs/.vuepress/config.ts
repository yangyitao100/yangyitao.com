import { commentTheme } from "./index";
import { defineUserConfig } from 'vuepress'
import { commentPlugin } from 'vuepress-plugin-comment2'

export default defineUserConfig({
  lang: 'zh-CN',
  title: '杨艺韬的官方网站',
  description: '杨艺韬的官方网站, 杨艺韬, Adam Yang, react18, React, vue3, 源码, 前端',
  head:[['script', {}, `
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?3ada78bd736d6c32ac7d2e900e4e3d9d";
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
  })();`],['link', {rel: 'icon', href:'/images/developer.jpeg'}]],
  theme: commentTheme({
    colorMode: 'light',
    // toggleSidebar: 'toggle sidebar',
    colorModeSwitch: false,
    selectLanguageName: '简体中文',
    lastUpdatedText: '上次更新',
    contributorsText: '贡献者',
    // custom containers
    tip: '提示',
    warning: '注意',
    danger: '警告',
      // 404 page
      notFound: [
        '这里什么都没有',
        '我们怎么到这来了？',
        '这是一个 404 页面',
        '看起来我们进入了错误的链接',
      ],
      backToHome: '返回首页',
      // a11y
      openInNewWindow: '在新窗口打开',
      toggleColorMode: '切换颜色模式',
      toggleSidebar: '切换侧边栏',
    home: '/',
    logo: '/images/developer.jpeg',
    navbar:[
      {
        text: '首页',
        link: '/'
      },
      {
        text: 'React源码研习录',
        link: '/react18/'
      },
      // {
      //   text: 'Vue3源码研习录',
      //   link: '/vue3/'
      // },
      // {
      //   text: '杂谈',
      //   link: '/life/'
      // },
      {
        text: 'github',
        link: 'https://www.github.com/yangyitao100'
      }
    ],
    sidebar: {
      '/': [
        {
          text: '杨艺韬的官方网站',
          children: ['README.md'],
          link: 'README.md'
        }
      ],
      '/react18/':[
        {
          collapsible: true,
          text: '第01章 课程介绍',
          children: ['/react18/README.md'],
          link: '/react18/README.md'
        }
        // {
        //   collapsible: true,
        //   text: '第02章 解放思想',
        //   children: [
        //     '/react18/01/introduction.md',
        //     '/react18/01/源码观.md',
        //     '/react18/01/React是什么.md',
        //     '/react18/01/React架构演进过程.md',
        //     '/react18/01/数据结构与算法.md',
        //     '/react18/01/React18源码学习方法.md',
        //   ],
        //   link:'/react18/01/introduction.md'
        // },
        // {
        //   collapsible: true,
        //   text: '第03章 [老架构]初始化渲染',
        //   children: [
        //     '/react18/03/introduction.md'
        //   ],
        //   link:'/react18/03/introduction.md'
        // },
        // {
        //   collapsible: true,
        //   text: '第04章 [老架构]函数组件与类组件',
        //   children: [
        //     '/react18/04/introduction.md',
        //   ],
        //   link:'/react18/04/introduction.md'
        // },
        // {
        //   collapsible: true,
        //   text: '第05章 [老架构]DOM DIFF',
        //   children: [
        //     '/react18/05/introduction.md',
        //   ],
        //   link:'/react18/05/introduction.md'
        // },
        // {
        //   collapsible: true,
        //   text: '第06章 [老架构]类的生命周期',
        //   children: [
        //     '/react18/06/introduction.md',
        //   ],
        //   link:'/react18/06/introduction.md'
        // },
        // {
        //   collapsible: true,
        //   text: '第07章 [老架构]性能优化',
        //   children: [
        //     '/react18/07/introduction.md',
        //   ],
        //   link:'/react18/07/introduction.md'
        // },
        // {
        //   collapsible: true,
        //   text: '第08章 [老架构]Hooks',
        //   children: [
        //     '/react18/08/introduction.md',
        //   ],
        //   link:'/react18/08/introduction.md'
        // },
        // {
        //   collapsible: true,
        //   text: '第09章 [Fiber架构]设计理念',
        //   children: [
        //     '/react18/09/introduction.md',
        //   ],
        //   link:'/react18/09/introduction.md'
        // },
        // {
        //   collapsible: true,
        //   text: '第10章 [Fiber架构]初始化渲染',
        //   children: [
        //     '/react18/10/introduction.md',
        //   ],
        //   link:'/react18/10/introduction.md'
        // },
        // {
        //   collapsible: true,
        //   text: '第11章 [Fiber架构]事件合成',
        //   children: [
        //     '/react18/11/introduction.md',
        //   ],
        //   link:'/react18/11/introduction.md'
        // },
        // {
        //   collapsible: true,
        //   text: '第12章 [Fiber架构]更新流程',
        //   children: [
        //     '/react18/12/introduction.md',
        //   ],
        //   link:'/react18/12/introduction.md'
        // },

        // {
        //   collapsible: true,
        //   text: '第13章 [Fiber架构]DOM DIFF',
        //   children: [
        //     '/react18/13/introduction.md',
        //   ],
        //   link:'/react18/13/introduction.md'
        // },
        // {
        //   collapsible: true,
        //   text: '第14章 [Fiber架构]Hooks',
        //   children: [
        //     '/react18/14/introduction.md',
        //   ],
        //   link:'/react18/14/introduction.md'
        // },
        // {
        //   collapsible: true,
        //   text: '第15章 [Fiber架构]调度机制',
        //   children: [
        //     '/react18/15/introduction.md',
        //   ],
        //   link:'/react18/15/introduction.md'
        // },
        // {
        //   collapsible: true,
        //   text: '第16章 [Fiber架构]lane模型',
        //   children: [
        //     '/react18/16/introduction.md',
        //   ],
        //   link:'/react18/16/introduction.md'
        // }
      ],
      // '/vue3/': [
      //   {
      //     text: 'Vue3源码研习录',
      //     children: ['/vue3/README.md'],
      //     link: '/vue3/README.md'
      //   }
      // ],
        // {
        //   text: '第一章 准备工作',
        //   children: [
        //     '/react18/first/introduction.md',
        //     '/react18/first/JSX.md'
        //   ],
        //   link:'/react18/first/introduction.md'
        // },
        // {
        //   text: '第er章 准备工作',
        //   children: [
        //     '/react18/second/Fiber.md',
        //     '/react18/second/xx.md'
        //   ],
        //   link:'/react18/second/Fiber.md'
        // }
    }
  }),
  plugins: [
    // commentPlugin({
    //   provider: "Giscus",
    //   repo: "yangyitao100/yangyitao.com",
    //   repoId: "R_kgDOIVN2oQ",
    //   category: "Announcements",
    //   categoryId: "DIC_kwDOIVN2oc4CSSNs"
    // })
  ],
})