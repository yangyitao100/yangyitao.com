import{_ as n,o as s,c as a,f as t}from"./app.a186c370.js";const e={},p=t(`<h1 id="_02-生命周期的内涵" tabindex="-1"><a class="header-anchor" href="#_02-生命周期的内涵" aria-hidden="true">#</a> 02.生命周期的内涵</h1><p>同学们好，我们经常听说一个词“生命周期函数”，要了解什么是生命周期函数，就必须了解什么是生命周期，进而搞清楚生命周期函数的本质。</p><p>我们查阅百度百科对生命周期有这样的解释：生命周期就是指一个对象的生老病死。在React的世界里，生命周期就是指组件的生老病死。也就是从虚拟DOM到真实DOM的初始化以及中途到更新到最后组件的销毁。而生命周期函数，就是在初始化渲染和更新渲染的各个不同阶段执行的函数。那怎么才能在不同阶段执行对应的函数呢？当然就是在到相应阶段调用特定的函数，所以生命周期函数的本质就是回调，我们来举一个小例子。</p><p>比如我们出生的时候要开始执行一个函数叫开启一辈子：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>
<span class="token keyword">function</span> <span class="token function">startALifetime</span><span class="token punctuation">(</span><span class="token parameter">life</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  
<span class="token punctuation">}</span>
<span class="token comment">//本质：回调</span>
<span class="token function">startALifetime</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token function-variable function">born</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span>

  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function-variable function">school</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span><span class="token punctuation">{</span>

  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function-variable function">work</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span>

  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function-variable function">marry</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span>

  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token comment">//.....</span>
  <span class="token function-variable function">detroy</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span>

  <span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里有些阶段是必经的，有些阶段是不同人情况不一样的，有些阶段只经历一次，有些阶段要经历多次，但本质上都是在特定阶段需要执行的操作。其实不仅是React，在Vue，在Android、iOS等程序等等编程领域都有生命周期的概念，凡事分阶段执行特定任务的场景，我们都可以考虑使用生命周期的概念。</p>`,6),c=[p];function o(i,l){return s(),a("div",null,c)}const r=n(e,[["render",o],["__file","02.生命周期的内涵.html.vue"]]);export{r as default};
