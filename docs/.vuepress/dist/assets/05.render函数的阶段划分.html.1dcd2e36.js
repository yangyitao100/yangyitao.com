import{_ as r,o,c as t,b as e,d as n}from"./app.d86bc82c.js";const i={},c=e("h1",{id:"_05-render函数的阶段划分",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#_05-render函数的阶段划分","aria-hidden":"true"},"#"),n(" 05.render函数的阶段划分")],-1),_=e("p",null,"同学们好，上一小节，我们把createRoot的逻辑进行了实现，这一小节就开始实行render函数中的代码。由于render函数中的逻辑比较复杂，为了方便大家理解，我们可以将render函数分为两个阶段：",-1),l=e("ul",null,[e("li",null,"渲染阶段"),e("li",null,"提交阶段")],-1),s=e("p",null,"其中渲染阶段又可以分为beginWork和completeWork两个阶段，而提交阶段对应着commitWork。那什么是beginWork，completeWork、commitWork？以及为什么要有beginWork、completeWork、commitWork。",-1),d=e("p",null,"大家还记不记得，我们在手写原始版本react的时候，实际上就是把虚拟DOM转化为真实DOM，而如今在Fiber架构下，变成了 虚拟DOM->Fiber树->真实DOM。相当于多了一层Fiber。那么虚拟转化为Fiber树，可以认为就是我们前面说的beginWork，Fiber树转化真实DOM就是completeWork，转化为真实DOM之后挂载到页面，就是commitWork。",-1),m=e("p",null,"为什么要这样划分呢？其实很好理解，前面讲过Fiber本身包括了虚拟DOM在内的很多信息，而这些丰富的信息能够支持Fiber在执行任务的过程中被中断和恢复。这里说的beginWork和completeWork其实就是就是在执行Fiber相关任务————虚拟转化为Fiber，Fiber转化为真实DOM。但是Fiber转化为真实DOM后挂载到页面的这个过程是不可以中断的。也就是Fiber内部怎么运行都可以随便来，但是涉及到和页面真实发生关系的时候是不可以中断的。这也就是区分为渲染阶段和提交阶段的原因。也就是说渲染阶段可以中断恢复，提交阶段不可以。而beginWork和completeWork的划分更多的只是从程序逻辑的角度进行拆分，它们都属于渲染阶段。",-1),a=e("p",null,"接下来会分三小节实现beginWork、completeWork、commitWork三个阶段。关于render函数阶段划分的内容就先到这里，谢谢大家。",-1),b=[c,_,l,s,d,m,a];function k(W,h){return o(),t("div",null,b)}const u=r(i,[["render",k],["__file","05.render函数的阶段划分.html.vue"]]);export{u as default};
