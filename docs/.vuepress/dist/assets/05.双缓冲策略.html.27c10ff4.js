import{_ as a,o as s,c as n,f as p}from"./app.d86bc82c.js";const e={},o=p(`<h1 id="什么是双缓冲策略" tabindex="-1"><a class="header-anchor" href="#什么是双缓冲策略" aria-hidden="true">#</a> 什么是双缓冲策略</h1><h2 id="性能优化在-react-18-中的重要性" tabindex="-1"><a class="header-anchor" href="#性能优化在-react-18-中的重要性" aria-hidden="true">#</a> 性能优化在 React 18 中的重要性</h2><p>性能优化在 React 18 中具有非常重要的地位，性能优化在 React 18 中具有重要意义，它有助于提升用户体验、提高渲染效率、减小前端包体积等等。在不断优化性能的探索过程中，Fiber架构下采用了一种双缓冲策略来进行优化。那什么是双缓冲策略呢？</p><h2 id="双缓冲策略" tabindex="-1"><a class="header-anchor" href="#双缓冲策略" aria-hidden="true">#</a> 双缓冲策略</h2><p>其实双缓冲策略主要用于计算机图形渲染，看这样一个图片：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token operator">+</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">+</span>     <span class="token operator">+</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">+</span> 
<span class="token operator">|</span>      前缓冲区         <span class="token operator">|</span>     <span class="token operator">|</span>      后缓冲区          <span class="token operator">|</span>
<span class="token operator">|</span>                      <span class="token operator">|</span>     <span class="token operator">|</span>                      <span class="token operator">|</span>
<span class="token operator">|</span>   显示完整渲染的帧      <span class="token operator">|</span><span class="token operator">&lt;</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">|</span>   正在绘制的渲染帧      <span class="token operator">|</span>
<span class="token operator">|</span>                      <span class="token operator">|</span>     <span class="token operator">|</span>                      <span class="token operator">|</span>
<span class="token operator">+</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">+</span>     <span class="token operator">+</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">+</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>用户看见的是前缓冲区，正在准备的内容是后缓冲区，避免了用户看见的内容是渲染未完成的内容。</p><h2 id="fiber架构中的双缓冲策略" tabindex="-1"><a class="header-anchor" href="#fiber架构中的双缓冲策略" aria-hidden="true">#</a> Fiber架构中的双缓冲策略</h2><p>在 React Fiber 中，每个 Fiber 节点都有一个对应的 alternate 节点，它们代表了同一个组件在不同阶段的状态。这种设计允许 React 在更新组件时在内存中构建和处理新的渲染树，类似于双缓冲策略中的后缓冲区。</p><p>更具体一点：</p><ul><li>当前渲染树（类似于前缓冲区）：表示当前 UI 的状态，用户看到的就是当前渲染树所呈现的内容。</li><li>工作进程树（类似于后缓冲区）：在更新过程中，React 使用 alternate 节点构建一个新的渲染树。这个新的渲染树包含了更新后的组件状态。所有的更新操作都在这个新的渲染树中进行，就像双缓冲策略中的后缓冲区。</li><li>提交阶段（类似于前后缓冲区交换）：当工作进程树完成构建，React 会在提交阶段将其应用到 UI 上。这个过程类似于双缓冲策略中的前后缓冲区交换，当前渲染树和工作进程树交换角色，工作进程树成为新的当前渲染树，显示新的渲染状态。</li></ul><p>通过这种方式，React Fiber 架构的 alternate 概念允许 React 在内存中构建和处理新的渲染树，避免 UI 的不必要更新和卡顿现象，提高渲染性能和用户体验。这与双缓冲策略在图形渲染中的作用有相似之处。</p><p>更具体一点，举个例子：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> React<span class="token punctuation">,</span> <span class="token punctuation">{</span> useState <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;react&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">Counter</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>count<span class="token punctuation">,</span> setCount<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">useState</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token operator">&lt;</span>div<span class="token operator">&gt;</span>
      <span class="token operator">&lt;</span>p<span class="token operator">&gt;</span>Count<span class="token operator">:</span> <span class="token punctuation">{</span>count<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>p<span class="token operator">&gt;</span>
      <span class="token operator">&lt;</span>button onClick<span class="token operator">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">setCount</span><span class="token punctuation">(</span>count <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token operator">&gt;</span>Increase<span class="token operator">&lt;</span><span class="token operator">/</span>button<span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> Counter<span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当用户点击 &quot;Increase&quot; 按钮时，计数器的值会增加。在 React 内部，以下过程将发生：</p><ul><li>React 会创建一个新的工作进程树（类似于后缓冲区），其中包含更新后的计数器状态。这个新的渲染树在内存中构建，不会立即反映在 UI 上。</li><li>同时，当前渲染树（类似于前缓冲区）继续保持现有的 UI 状态，用户仍然可以看到当前的计数值。</li><li>在工作进程树构建完成后，React 会将其应用到 UI（类似于前后缓冲区交换），此时用户将看到更新后的计数值。</li></ul><p>这种双缓存技术使得 React 能够在执行渲染任务时更加高效，因为它可以在新的 Fiber 树上进行更改，同时保持旧的 Fiber 树不变。一旦新的 Fiber 树准备好被提交，React 就会在两棵树之间进行切换，从而实现高效的更新。</p>`,17),t=[o];function r(c,l){return s(),n("div",null,t)}const k=a(e,[["render",r],["__file","05.双缓冲策略.html.vue"]]);export{k as default};
