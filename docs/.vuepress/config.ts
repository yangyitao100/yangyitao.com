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
        text: '手写React源码',
        link: '/react18/'
      },
      {
        text: 'Vue3源码剖析',
        link: '/vue3/'
      },
      {
        text: '微前端源码剖析',
        link: '/microfe/'
      },
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
          text: '第00章 课程介绍',
          children: ['/react18/00导学/01.本章介绍.md'],
          link: '/react18/00导学/01.本章介绍.md'
        },
        {
          collapsible: true,
          text: '第01章 解放思想',
          children: [
            '/react18/01思想准备/01.本章介绍.md',
            '/react18/01思想准备/02.树立正确的源码观.md',
            '/react18/01思想准备/03.React是什么.md',
            '/react18/01思想准备/04.React架构演进过程.md',
            '/react18/01思想准备/05.树立数据结构与算法的意识.md',
            '/react18/01思想准备/06.树立用原子视角看问题的意识.md',
            '/react18/01思想准备/07.React18源码学习方法.md'
          ],
          link:'/react18/01思想准备/01.本章介绍.md'
        },
        {
          collapsible: true,
          text: '第02章 原始版-初始化渲染',
          children: [
            '/react18/02原始版-初始化渲染/01.本章介绍.md',
            '/react18/02原始版-初始化渲染/02.环境准备.md',
            '/react18/02原始版-初始化渲染/03.虚拟DOM与真实DOM的实况对比.md',
            '/react18/02原始版-初始化渲染/04.JSX相关概念和原理.md',
            '/react18/02原始版-初始化渲染/05.React和ReactDOM职责划分.md',
            '/react18/02原始版-初始化渲染/06.createElement代码实现.md',
            '/react18/02原始版-初始化渲染/07.实现 render、mount 和 createDOM进行初次渲染.md',
            '/react18/02原始版-初始化渲染/08.实现函数setPropsForDOM为DOM设置属性.md',
            '/react18/02原始版-初始化渲染/09.调试初始化渲染过程.md',
            '/react18/02原始版-初始化渲染/10.思考题与解答.md'
          ],
          link:'/react18/02原始版-初始化渲染/01.本章介绍.md'
        },
        {
          collapsible: true,
          text: '第03章 原始版-函数组件与类组件',
          children: [
            '/react18/03原始版-函数组件与类组件/01.本章介绍.md',
            '/react18/03原始版-函数组件与类组件/02.函数组件与类组件介绍.md',
            '/react18/03原始版-函数组件与类组件/03.实现函数组件基础功能.md',
            '/react18/03原始版-函数组件与类组件/04.实现类组件基础功能.md',
            '/react18/03原始版-函数组件与类组件/05.类组件的更新机制分析.md',
            '/react18/03原始版-函数组件与类组件/06.实现类组件的setState方法.md',
            '/react18/03原始版-函数组件与类组件/07.事件合成机制原理分析.md',
            '/react18/03原始版-函数组件与类组件/08.事件合成机制的简单实现.md',
            '/react18/03原始版-函数组件与类组件/09.ref的原理分析.md',
            '/react18/03原始版-函数组件与类组件/10.类组件的ref源码实现.md',
            '/react18/03原始版-函数组件与类组件/11.引入forwardRef的底层逻辑.md',
            '/react18/03原始版-函数组件与类组件/12.实现forwardRef为函数组件提供ref的能力.md',
            '/react18/03原始版-函数组件与类组件/13.调试函数组件与类组件相关代码.md',
            '/react18/03原始版-函数组件与类组件/14.思考题与解答.md'
          ],
          link:'/react18/03原始版-函数组件与类组件/01.本章介绍.md'
        },
        {
          collapsible: true,
          text: '第04章 原始版-DOMDIFF',
          children: [
            '/react18/04原始版-DOMDIFF/01.本章介绍.md',
            '/react18/04原始版-DOMDIFF/02.React DOM DIFF原理.md',
            '/react18/04原始版-DOMDIFF/03.React DOM DIFF算法源码实现.md',
            '/react18/04原始版-DOMDIFF/04.调试DOM DIFF算法.md',
            '/react18/04原始版-DOMDIFF/05.思考题及解答.md'
          ],
          link:'/react18/04原始版-DOMDIFF/01.本章介绍.md'
        },
        {
          collapsible: true,
          text: '第05章 原始版-类组件的生命周期',
          children: [
            '/react18/05原始版-类组件的生命周期/01.本章介绍.md',
            '/react18/05原始版-类组件的生命周期/02.生命周期的内涵.md',
            '/react18/05原始版-类组件的生命周期/03.生命周期图观察.md',
            '/react18/05原始版-类组件的生命周期/04.常用生命周期函数应用案例.md',
            '/react18/05原始版-类组件的生命周期/05.常用生命周期函数源码实现.md',
            '/react18/05原始版-类组件的生命周期/06.shouldComponentUpdate案例.md',
            '/react18/05原始版-类组件的生命周期/07.shouldComponentUpdate实现.md',
            '/react18/05原始版-类组件的生命周期/08.getDeriveStateFromProp案例.md',
            '/react18/05原始版-类组件的生命周期/09.getDeriveStateFromProps源码实现.md',
            '/react18/05原始版-类组件的生命周期/10.getSnapshotBeforeUpdate应用案例.md',
            '/react18/05原始版-类组件的生命周期/11.getSnapshotBeforeUpdate源码实现.md',
            '/react18/05原始版-类组件的生命周期/12.生命周期相关代码调试.md',
            '/react18/05原始版-类组件的生命周期/13.思考题及解答.md'
          ],
          link:'/react18/05原始版-类组件的生命周期/01.本章介绍.md'
        },
        {
          collapsible: true,
          text: '第06章 原始版-性能优化相关特性',
          children: [
            '/react18/06原始版-性能优化相关特性/01.本章介绍.md',
            '/react18/06原始版-性能优化相关特性/02.PureComponent应用案例.md',
            '/react18/06原始版-性能优化相关特性/03.PureComponent源码实现.md',
            '/react18/06原始版-性能优化相关特性/04.memo应用案例.md',
            '/react18/06原始版-性能优化相关特性/05.memo源码实现.md',
            '/react18/06原始版-性能优化相关特性/06.调试PureComponent及memo相关的代码.md',
            // '/react18/06原始版-性能优化相关特性/07.思考题及解答.md',
            // '/react18/06原始版-性能优化相关特性/08.本章小结.md'
          ],
          link:'/react18/06原始版-性能优化相关特性/01.本章介绍.md'
        },
        {
          collapsible: true,
          text: '第07章 原始版-Hooks',
          children: [
            '/react18/07原始版-Hooks/01.本章介绍.md',
            '/react18/07原始版-Hooks/02.Hooks存在的意义.md',
            '/react18/07原始版-Hooks/03.useState应用案例.md',
            '/react18/07原始版-Hooks/04.useState源码实现.md',
            '/react18/07原始版-Hooks/05.useReducer应用案例.md',
            '/react18/07原始版-Hooks/06.useReducer源码实现.md',
            '/react18/07原始版-Hooks/07.useEffect及useLayoutEffect应用案例.md',
            '/react18/07原始版-Hooks/08.useEffect及useLayoutEffect源码实现.md',
            '/react18/07原始版-Hooks/09.useRef应用案例及源码实现.md',
            '/react18/07原始版-Hooks/10.useImperativeHandle应用案例及源码实现.md',
            '/react18/07原始版-Hooks/11.useMemo及useCallback应用案例.md',
            '/react18/07原始版-Hooks/12.useMemo及useCallback源码实现.md',
            '/react18/07原始版-Hooks/13.Hooks相关源码调试.md',
            '/react18/07原始版-Hooks/14.思考题及解答.md',
            // '/react18/07原始版-Hooks/15.本章小结.md'
          ],
          link:'/react18/07原始版-Hooks/01.本章介绍.md'
        },
        {
          collapsible: true,
          text: '第08章 [Fiber架构]核心概念和设计思想',
          children: [
            '/react18/08Fiber架构理论体系/01.本章介绍.md',
            '/react18/08Fiber架构理论体系/02.为什么需要Fiber架构.md',
            '/react18/08Fiber架构理论体系/03.Fiber架构是什么.md',
            '/react18/08Fiber架构理论体系/04.Fiber是什么.md',
            '/react18/08Fiber架构理论体系/05.双缓冲策略.md',
            '/react18/08Fiber架构理论体系/06.什么是工作循环.md',
            '/react18/08Fiber架构理论体系/07.什么是并发模式.md',
            '/react18/08Fiber架构理论体系/08.思考题及解答.md',
            // '/react18/08Fiber架构理论体系/09.小结.md',
          ],
          link:'/react18/08Fiber架构理论体系/01.本章介绍.md'
        },
        {
          collapsible: true,
          text: '第9章 [Fiber架构]初始化渲染',
          children: [
            '/react18/09Fiber架构-初始化渲染/01.本章介绍.md',
            '/react18/09Fiber架构-初始化渲染/02.环境准备.md',
            '/react18/09Fiber架构-初始化渲染/03.jsx代码实现.md',
            '/react18/09Fiber架构-初始化渲染/04.createRoot.md',
            '/react18/09Fiber架构-初始化渲染/05.render函数的阶段划分.md',
            '/react18/09Fiber架构-初始化渲染/06.beginWork.md',
            '/react18/09Fiber架构-初始化渲染/07.completeWork.md',
            '/react18/09Fiber架构-初始化渲染/08.commitWork.md',
            '/react18/09Fiber架构-初始化渲染/09.代码调试.md',
            '/react18/09Fiber架构-初始化渲染/10.函数组件的初始化.md',
            '/react18/09Fiber架构-初始化渲染/11.思考题.md',
            // '/react18/09Fiber架构-初始化渲染/11.小结.md'
          ],
          link:'/react18/09Fiber架构-初始化渲染/01.本章介绍.md'
        },
        {
          collapsible: true,
          text: '第10章 [Fiber架构]合成事件系统',
          children: [
            '/react18/10Fiber架构-合成事件系统/01.本章介绍.md',
            '/react18/10Fiber架构-合成事件系统/02.事件系统实现思路分析.md',
            '/react18/10Fiber架构-合成事件系统/03.事件名注册.md',
            '/react18/10Fiber架构-合成事件系统/04.注册监听事件.md',
            '/react18/10Fiber架构-合成事件系统/05.派发事件的主要逻辑.md',
            '/react18/10Fiber架构-合成事件系统/06.收集注册的函数.md',
            '/react18/10Fiber架构-合成事件系统/07.合成事件.md',
            '/react18/10Fiber架构-合成事件系统/08.注册事件的回调.md',
            '/react18/10Fiber架构-合成事件系统/09.代码调试.md',
            '/react18/10Fiber架构-合成事件系统/10.思考题.md',
          ],
          link:'/react18/10Fiber架构-合成事件系统/01.本章介绍.md'
        },
        {
          collapsible: true,
          text: '第11章 [Fiber架构]组件更新',
          children: [
            '/react18/11Fiber架构-组件更新/01.本章介绍.md',
            '/react18/11Fiber架构-组件更新/02.domdiff思路分析.md',
            '/react18/11Fiber架构-组件更新/03.单节点domdiff.md',
            '/react18/11Fiber架构-组件更新/04.多节点domdiff.md',
            '/react18/11Fiber架构-组件更新/05.思考题.md'
          ],
          link:'/react18/11Fiber架构-组件更新/01.本章介绍.md'
        },
        {
          collapsible: true,
          text: '第12章 [Fiber架构]Hooks',
          children: [
            '/react18/12Fiber架构-Hooks/01.本章介绍.md',
            '/react18/12Fiber架构-Hooks/02.useReducer挂载.md',
            '/react18/12Fiber架构-Hooks/03.useReducer触发更新.md',
            '/react18/12Fiber架构-Hooks/04.useReducer更新渲染1.md',
            '/react18/12Fiber架构-Hooks/05.useReducer更新渲染2.md',
            '/react18/12Fiber架构-Hooks/06.useState源码实现.md',
            '/react18/12Fiber架构-Hooks/07.useEffect挂载实现.md',
            '/react18/12Fiber架构-Hooks/08.useEffect更新实现.md',
            '/react18/12Fiber架构-Hooks/09.useLayoutEffect源码实现.md',
            '/react18/12Fiber架构-Hooks/10.代码调试.md',
            '/react18/12Fiber架构-Hooks/11.思考题.md',
          ],
          link:'/react18/12Fiber架构-Hooks/01.本章介绍.md'
        },
        {
          collapsible: true,
          text: '第13章 [Fiber架构]Lane模型与优先级',
          children: [
            '/react18/13Fiber架构-Lane模型与优先级/01.本章介绍.md',
            '/react18/13Fiber架构-Lane模型与优先级/02.二进制基础计算.md',
            '/react18/13Fiber架构-Lane模型与优先级/03.最小堆算法.md',
            '/react18/13Fiber架构-Lane模型与优先级/04.React18的优先级体系.md',
          ],
          link:'/react18/13Fiber架构-Lane模型与优先级/01.本章介绍.md'
        },
        {
          collapsible: true,
          text: '第14章 [Fiber架构]调度系统',
          children: [
            '/react18/14Fiber架构-调度系统/01.本章介绍.md',
            '/react18/14Fiber架构-调度系统/02.调度核心逻辑.md',
            '/react18/14Fiber架构-调度系统/03.任务优先级与事件优先级.md',
            '/react18/14Fiber架构-调度系统/04.lane模型下的更新队列.md',
            '/react18/14Fiber架构-调度系统/05.加入优先级的初始化渲染.md',
          ],
          link:'/react18/14Fiber架构-调度系统/01.本章介绍.md'
        },
        
        {
          collapsible: true,
          text: '第15章 [Fiber架构]并发渲染',
          children: [
            '/react18/15Fiber架构-同步渲染与并发渲染/01.本章介绍.md',
            '/react18/15Fiber架构-同步渲染与并发渲染/02.同步渲染.md',
            '/react18/15Fiber架构-同步渲染与并发渲染/03.并发渲染.md',
            '/react18/15Fiber架构-同步渲染与并发渲染/04.思考题.md',
          ],
          link:'/react18/15Fiber架构-同步渲染与并发渲染/01.本章介绍.md'
        },
        
      ],
      '/vue3/': [
        {
          collapsible: false,
          text: 'Vue3源码剖析',
          children: [
            '/vue3/01.代码管理策略-monorepo.md',
            '/vue3/02.项目构建流程和源码调试方法.md',
            '/vue3/03.Vue3响应式核心原理.md',
            '/vue3/04.Vue3响应式系统源码实现1.md',
            '/vue3/05.Vue3响应式系统源码实现2.md',
            '/vue3/06.reactive、ref相关api源码实现.md',
            '/vue3/07.故事要从createApp讲起.md',
            '/vue3/08.虚拟Node到真实Node的路其实很长.md',
            '/vue3/09.组件渲染和更新流程.md',
            '/vue3/10.名动江湖的diff算法.md',
            '/vue3/11.编译优化之Block Tree 与 PatchFlags.md',
            '/vue3/12.编译过程介绍及分析模版AST的生成过程.md',
            '/vue3/13.从AST到render函数（transform与代码生成）.md'
          ],
          link:'/vue3/README.md'
        },
      ],
      '/microfe/': [
        {
          collapsible: false,
          text: '微前端源码剖析',
          children: [
            '/microfe/01.乾坤的Js隔离机制原理剖析（快照沙箱、两种代理沙箱）.md',
            '/microfe/02.乾坤的微应用加载流程分析(从微应用的注册到loadApp方法内部实现).md',
            '/microfe/03.乾坤的沙箱容器分析（Js沙箱机制建立后的具体应用）.md',
            '/microfe/04.乾坤的资源加载机制(import-html-entry的内部实现).md',
            '/microfe/05.乾坤loadMicroApp方法实现以及数据通信机制分析.md',
            '/microfe/06.single-spa的注册机制.md',
            '/microfe/07.对single-spa的路由管理及微应用状态管理的分析.md',
            '/microfe/08.single-spa中的reroute函数.md'
          ],
          link:'/microfe/README.md'
        },
      ]
    }
  }),
  plugins: [
    commentPlugin({
      provider: "Giscus",
      repo: "yangyitao100/yangyitao.com",
      repoId: "R_kgDOIhz4Dw",
      category: "Announcements",
      categoryId: "DIC_kwDOIhz4D84CXc7D"
    })
  ],
})

// <script src="https://giscus.app/client.js"
//         data-repo="yangyitao100/yangyitao.com"
//         data-repo-id="R_kgDOIhz4Dw"
//         data-category="Announcements"
//         data-category-id="DIC_kwDOIhz4D84CXc7D"
//         data-mapping="pathname"
//         data-strict="0"
//         data-reactions-enabled="1"
//         data-emit-metadata="0"
//         data-input-position="top"
//         data-theme="light"
//         data-lang="zh-CN"
//         crossorigin="anonymous"
//         async>
// </script>