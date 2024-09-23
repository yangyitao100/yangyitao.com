import{_ as n,o as s,c as a,f as e}from"./app.03bf752b.js";const t={},p=e(`<h1 id="_04-createroot" tabindex="-1"><a class="header-anchor" href="#_04-createroot" aria-hidden="true">#</a> 04.createRoot</h1><p>同学们好，前面我们说本章的目标是实现初始化渲染，具体而言，这个初始化渲染过程完成后，可以在页面上渲染一个带有一定样式的字符串：</p><h2 id="index-html" tabindex="-1"><a class="header-anchor" href="#index-html" aria-hidden="true">#</a> index.html:</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;react-dom/client&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> element <span class="token operator">=</span> <span class="token operator">&lt;</span>div<span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>div<span class="token operator">&gt;</span>课程名称：手写React高质量源码迈向高阶开发<span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>div<span class="token operator">&gt;</span>讲师：杨艺韬<span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>div<span class="token operator">&gt;</span>电子书：<span class="token operator">&lt;</span>a style<span class="token operator">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token literal-property property">color</span><span class="token operator">:</span> <span class="token string">&#39;blue&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">}</span> href<span class="token operator">=</span><span class="token string">&quot;https://www.yangyitao.com/react18&quot;</span><span class="token operator">&gt;</span>https<span class="token operator">:</span><span class="token operator">/</span><span class="token operator">/</span>www<span class="token punctuation">.</span>yangyitao<span class="token punctuation">.</span>com<span class="token operator">/</span>react18<span class="token operator">&lt;</span><span class="token operator">/</span>a<span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
<span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
<span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">createRoot</span><span class="token punctuation">(</span>document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;root&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
root<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;index.jsx&quot;</span><span class="token punctuation">,</span> element<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们在这里用到了jsx、createRoot、render这样几个函数，上一小节我们已经介绍了jsx，那么还剩下createRoot和render两个函数需要我们实现。刚才我们说初始化渲染完成后可以在页面上渲染一个字符串，看起来很简单，但实际上在fiber架构下，里面的逻辑是比较丰富的。</p><p>本小节会实现createRoot函数以及render函数的局部逻辑，至于render函数细节在后面的小节进行讲解：</p><p>在编写createRoot代码之前，大家回想一下我们在编写原始版react初始化的时候，写过一个函数<code>ReactDOM.render</code>，既然有这个函数，为什么现在要实现调用createRoot返回一个对象，再调用render函数，这两者有什么区别？</p><ul><li><p>ReactDOM.render 是 React 的传统渲染方法，自 React 诞生以来就存在。它在同步模式下运行，即所有组件的更新和渲染都是同步执行的，一气呵成没有中断的。</p></li><li><p>ReactDOM.createRoot 是 React 18 引入的新方法，其最主要的特征是它允许我们在并发模式下运行 React 应用。并发模式允许 React 在渲染和更新组件时利用时间切片，使得渲染过程是可中断的，从而提高应用程序的响应性和性能，前面我们在介绍Fiber架构体系的时候也提到过。</p></li></ul><p>这就像是，就像是去往同一个目的地的两种不同方式。</p><h2 id="react-dom-src-client-reactdomroot-js" tabindex="-1"><a class="header-anchor" href="#react-dom-src-client-reactdomroot-js" aria-hidden="true">#</a> react-dom/src/client/ReactDOMRoot.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>
  createContainer<span class="token punctuation">,</span>
  updateContainer
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;react-reconciler/src/ReactFiberReconciler&#39;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * ReactDOMRoot构造函数
 *
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">internalRoot</span> - React Fiber树的根节点
 *
 * 这个构造函数用于创建ReactDOMRoot实例对象，实例对象中包含了一个_internalRoot属性，该属性引用了React Fiber树的根节点。
 */</span>
<span class="token keyword">function</span> <span class="token function">ReactDOMRoot</span><span class="token punctuation">(</span><span class="token parameter">internalRoot</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>_internalRoot <span class="token operator">=</span> internalRoot<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * render方法，负责更新或渲染React组件树
 *
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>ReactElement<span class="token operator">|</span>ReactComponent<span class="token punctuation">}</span></span> <span class="token parameter">children</span> - 需要渲染的React元素或组件
 *
 * render方法是挂载在ReactDOMRoot原型链上的，每个ReactDOMRoot实例对象都可以调用这个方法。
 * 当调用render方法时，会通过调用updateContainer函数，将传入的React元素或组件(children参数)更新或渲染到当前的Fiber树(_internalRoot属性对应的Fiber树)中。
 */</span>
<span class="token class-name">ReactDOMRoot</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">render</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">children</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>_internalRoot<span class="token punctuation">;</span>
  <span class="token function">updateContainer</span><span class="token punctuation">(</span>children<span class="token punctuation">,</span> root<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 创建Fiber根节点并封装为ReactDOMRoot对象的工厂函数
 *
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>HTMLElement<span class="token punctuation">}</span></span> <span class="token parameter">container</span> - React组件需要渲染到的DOM元素
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>ReactDOMRoot<span class="token punctuation">}</span></span> 封装了Fiber根节点的ReactDOMRoot对象
 *
 * createRoot是一个工厂函数，接收一个DOM元素作为参数，这个DOM元素通常是React应用的根DOM节点。
 * 在函数内部，首先通过调用createContainer函数，传入DOM元素参数，创建一个Fiber根节点。
 * 然后将这个Fiber根节点传入ReactDOMRoot构造函数，创建一个ReactDOMRoot实例对象，并返回。
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createRoot</span><span class="token punctuation">(</span><span class="token parameter">container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">createContainer</span><span class="token punctuation">(</span>container<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">ReactDOMRoot</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="react-reconciler-src-reactfiberreconciler-js" tabindex="-1"><a class="header-anchor" href="#react-reconciler-src-reactfiberreconciler-js" aria-hidden="true">#</a> react-reconciler/src/ReactFiberReconciler.js:</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createFiberRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberRoot&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createUpdate<span class="token punctuation">,</span> enqueueUpdate <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberClassUpdateQueue&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> scheduleUpdateOnFiber <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberWorkLoop&quot;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 创建容器，用于将虚拟DOM转换为真实DOM并插入到容器中。
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">containerInfo</span> - DOM容器信息。
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>FiberRoot<span class="token punctuation">}</span></span> - 创建的Fiber根节点。
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createContainer</span><span class="token punctuation">(</span><span class="token parameter">containerInfo</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">createFiberRoot</span><span class="token punctuation">(</span>containerInfo<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 更新容器，将虚拟DOM转换为真实DOM并插入到容器中。
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">element</span> - 虚拟DOM元素。
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">container</span> - DOM容器，FiberRootNode。
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">updateContainer</span><span class="token punctuation">(</span><span class="token parameter">element<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 获取当前的根Fiber</span>
  <span class="token keyword">const</span> current <span class="token operator">=</span> container<span class="token punctuation">.</span>current<span class="token punctuation">;</span>
  <span class="token comment">// 创建更新</span>
  <span class="token keyword">const</span> update <span class="token operator">=</span> <span class="token function">createUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 要更新的虚拟DOM</span>
  update<span class="token punctuation">.</span>payload <span class="token operator">=</span> <span class="token punctuation">{</span> element <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token comment">// 将更新添加到当前根Fiber的更新队列上，并返回根节点</span>
  <span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> update<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 在根Fiber上调度更新</span>
  <span class="token function">scheduleUpdateOnFiber</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-reconciler-src-reactfiberroot-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactfiberroot-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactFiberRoot.js：</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createHostRootFiber <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./ReactFiber&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> initialUpdateQueue <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./ReactFiberClassUpdateQueue&#39;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * Fiber 根节点对象构造函数。
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>any<span class="token punctuation">}</span></span> <span class="token parameter">containerInfo</span> - 容器信息。
 */</span>
<span class="token keyword">function</span> <span class="token function">FiberRootNode</span><span class="token punctuation">(</span><span class="token parameter">containerInfo</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>containerInfo <span class="token operator">=</span> containerInfo<span class="token punctuation">;</span> <span class="token comment">// 容器信息，如 div#root</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 创建 Fiber 根节点。
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>any<span class="token punctuation">}</span></span> <span class="token parameter">containerInfo</span> - 容器信息。
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>FiberRootNode<span class="token punctuation">}</span></span> - 创建的 Fiber 根节点。
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createFiberRoot</span><span class="token punctuation">(</span><span class="token parameter">containerInfo</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FiberRootNode</span><span class="token punctuation">(</span>containerInfo<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 创建未初始化的根 Fiber</span>
  <span class="token keyword">const</span> uninitializedFiber <span class="token operator">=</span> <span class="token function">createHostRootFiber</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 根容器的 current 指向当前的根 Fiber</span>
  root<span class="token punctuation">.</span>current <span class="token operator">=</span> uninitializedFiber<span class="token punctuation">;</span>
  <span class="token comment">// 根 Fiber 的 stateNode，即真实 DOM 节点，指向 FiberRootNode</span>
  uninitializedFiber<span class="token punctuation">.</span>stateNode <span class="token operator">=</span> root<span class="token punctuation">;</span>
  <span class="token comment">// 初始化根 Fiber 的更新队列</span>
  <span class="token function">initialUpdateQueue</span><span class="token punctuation">(</span>uninitializedFiber<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> root<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-reconciler-src-reactfiber-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactfiber-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactFiber.js:</h2><p>TODO：回顾Fiber是什么，Fiber相当于是对虚拟DOM的抽象，它不仅包含了 DOM 节点的信息，还包含了这个节点在 Fiber 架构下的其他信息（如子节点、兄弟节点、父节点等）。这种抽象使得 React 能够实现更为复杂的功能，如时间切片（time-slicing）和 Suspense。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 导入React中的一些工作标签和标记</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> HostComponent<span class="token punctuation">,</span> HostRoot<span class="token punctuation">,</span> IndeterminateComponent<span class="token punctuation">,</span> HostText <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactWorkTags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> NoFlags <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberFlags&quot;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 构造函数，用于创建一个新的Fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">tag</span> - fiber的类型，如函数组件、类组件、原生组件、根元素等
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">pendingProps</span> - 新属性，等待处理或者说生效的属性
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">key</span> - 唯一标识
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">FiberNode</span><span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> pendingProps<span class="token punctuation">,</span> key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>tag <span class="token operator">=</span> tag<span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>key <span class="token operator">=</span> key<span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>type <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> 
  <span class="token keyword">this</span><span class="token punctuation">.</span>stateNode <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> 
  <span class="token keyword">this</span><span class="token punctuation">.</span>return <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> 
  <span class="token keyword">this</span><span class="token punctuation">.</span>child <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>sibling <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>pendingProps <span class="token operator">=</span> pendingProps<span class="token punctuation">;</span> 
  <span class="token keyword">this</span><span class="token punctuation">.</span>memoizedProps <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> 
  <span class="token keyword">this</span><span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>updateQueue <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>flags <span class="token operator">=</span> NoFlags<span class="token punctuation">;</span> 
  <span class="token keyword">this</span><span class="token punctuation">.</span>subtreeFlags <span class="token operator">=</span> NoFlags<span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>alternate <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>index <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 用于创建新的Fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">tag</span> - fiber的类型
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">pendingProps</span> - 新属性
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">key</span> - 唯一标识
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> 新的Fiber节点
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createFiber</span><span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> pendingProps<span class="token punctuation">,</span> key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">FiberNode</span><span class="token punctuation">(</span>tag<span class="token punctuation">,</span> pendingProps<span class="token punctuation">,</span> key<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 创建新的HostRoot类型的Fiber节点
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> 新的HostRoot类型的Fiber节点
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createHostRootFiber</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">createFiber</span><span class="token punctuation">(</span>HostRoot<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 基于旧的Fiber节点和新的属性创建一个新的Fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> <span class="token parameter">current</span> - 旧的Fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">pendingProps</span> - 新的属性
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> 新的Fiber节点
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createWorkInProgress</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> pendingProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> workInProgress <span class="token operator">=</span> current<span class="token punctuation">.</span>alternate<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>workInProgress <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    workInProgress <span class="token operator">=</span> <span class="token function">createFiber</span><span class="token punctuation">(</span>current<span class="token punctuation">.</span>tag<span class="token punctuation">,</span> pendingProps<span class="token punctuation">,</span> current<span class="token punctuation">.</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    workInProgress<span class="token punctuation">.</span>type <span class="token operator">=</span> current<span class="token punctuation">.</span>type<span class="token punctuation">;</span>
    workInProgress<span class="token punctuation">.</span>stateNode <span class="token operator">=</span> current<span class="token punctuation">.</span>stateNode<span class="token punctuation">;</span>
    workInProgress<span class="token punctuation">.</span>alternate <span class="token operator">=</span> current<span class="token punctuation">;</span>
    current<span class="token punctuation">.</span>alternate <span class="token operator">=</span> workInProgress<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    workInProgress<span class="token punctuation">.</span>pendingProps <span class="token operator">=</span> pendingProps<span class="token punctuation">;</span>
    workInProgress<span class="token punctuation">.</span>type <span class="token operator">=</span> current<span class="token punctuation">.</span>type<span class="token punctuation">;</span>
    workInProgress<span class="token punctuation">.</span>flags <span class="token operator">=</span> NoFlags<span class="token punctuation">;</span>
    workInProgress<span class="token punctuation">.</span>subtreeFlags <span class="token operator">=</span> NoFlags<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  workInProgress<span class="token punctuation">.</span>child <span class="token operator">=</span> current<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
  workInProgress<span class="token punctuation">.</span>memoizedProps <span class="token operator">=</span> current<span class="token punctuation">.</span>memoizedProps<span class="token punctuation">;</span>
  workInProgress<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> current<span class="token punctuation">.</span>memoizedState<span class="token punctuation">;</span>
  workInProgress<span class="token punctuation">.</span>updateQueue <span class="token operator">=</span> current<span class="token punctuation">.</span>updateQueue<span class="token punctuation">;</span>
  workInProgress<span class="token punctuation">.</span>sibling <span class="token operator">=</span> current<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
  workInProgress<span class="token punctuation">.</span>index <span class="token operator">=</span> current<span class="token punctuation">.</span>index<span class="token punctuation">;</span>
  <span class="token keyword">return</span> workInProgress<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 从虚拟DOM创建新的Fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">element</span> - 虚拟DOM元素
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> 新的Fiber节点
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createFiberFromElement</span><span class="token punctuation">(</span><span class="token parameter">element</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> type<span class="token punctuation">,</span> key<span class="token punctuation">,</span> <span class="token literal-property property">props</span><span class="token operator">:</span> pendingProps <span class="token punctuation">}</span> <span class="token operator">=</span> element<span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token function">createFiberFromTypeAndProps</span><span class="token punctuation">(</span>type<span class="token punctuation">,</span> key<span class="token punctuation">,</span> pendingProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 从类型和属性创建新的Fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">type</span> - Fiber节点的类型
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">key</span> - 唯一标识
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">pendingProps</span> - 新的属性
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> 新的Fiber节点
 */</span>
<span class="token keyword">function</span> <span class="token function">createFiberFromTypeAndProps</span><span class="token punctuation">(</span><span class="token parameter">type<span class="token punctuation">,</span> key<span class="token punctuation">,</span> pendingProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> tag <span class="token operator">=</span> IndeterminateComponent<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> type <span class="token operator">===</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    tag <span class="token operator">=</span> HostComponent<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">const</span> fiber <span class="token operator">=</span> <span class="token function">createFiber</span><span class="token punctuation">(</span>tag<span class="token punctuation">,</span> pendingProps<span class="token punctuation">,</span> key<span class="token punctuation">)</span><span class="token punctuation">;</span>
  fiber<span class="token punctuation">.</span>type <span class="token operator">=</span> type<span class="token punctuation">;</span>
  <span class="token keyword">return</span> fiber<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 创建一个新的文本类型的Fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">content</span> - 文本内容
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> 新的文本类型的Fiber节点
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createFiberFromText</span><span class="token punctuation">(</span><span class="token parameter">content</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">createFiber</span><span class="token punctuation">(</span>HostText<span class="token punctuation">,</span> content<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-reconciler-src-reactworktags-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactworktags-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactWorkTags.js:</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">const</span> FunctionComponent <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>  <span class="token comment">// 表示函数式组件，这是 React 中最基础的组件类型，通过函数返回 UI 结构</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> ClassComponent <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>  <span class="token comment">// 表示类组件，这是 React 的另一种主要组件类型，通过 class 定义，可以使用生命周期方法等更复杂的特性</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> IndeterminateComponent <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>  <span class="token comment">// 表示尚未确定类型的组件，在 React 渲染过程中，如果遇到了这种类型，会先尝试将其当做函数式组件处理</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> HostRoot <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">;</span>  <span class="token comment">// 表示宿主环境的根节点，例如在浏览器环境中，这个就代表了整个 React App 的根节点</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> HostComponent <span class="token operator">=</span> <span class="token number">5</span><span class="token punctuation">;</span>  <span class="token comment">// 表示宿主环境的常规节点，例如在浏览器环境中，这就代表了一个普通的 DOM 元素，如 div、span 等</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> HostText <span class="token operator">=</span> <span class="token number">6</span><span class="token punctuation">;</span>  <span class="token comment">// 表示宿主环境的文本节点，例如在浏览器环境中，这就代表了一个文本节点</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-reconciler-src-reactfiberflags-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactfiberflags-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactFiberFlags.js:</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">const</span> NoFlags <span class="token operator">=</span> <span class="token number">0b00000000000000000000000000</span><span class="token punctuation">;</span> <span class="token comment">// 标识位：无</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> Placement <span class="token operator">=</span> <span class="token number">0b00000000000000000000000010</span><span class="token punctuation">;</span> <span class="token comment">// 标识位：插入</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> Update <span class="token operator">=</span> <span class="token number">0b00000000000000000000000100</span><span class="token punctuation">;</span> <span class="token comment">// 标识位：更新</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> MutationMask <span class="token operator">=</span> Placement <span class="token operator">|</span> Update<span class="token punctuation">;</span> <span class="token comment">// 变更标识位掩码</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-reconciler-src-reactfiberclassupdatequeue-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactfiberclassupdatequeue-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactFiberClassUpdateQueue.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> markUpdateLaneFromFiberToRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberConcurrentUpdates&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> assign <span class="token keyword">from</span> <span class="token string">&quot;shared/assign&quot;</span><span class="token punctuation">;</span>

<span class="token comment">// 定义状态更新的类型标签</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> UpdateState <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 初始化fiber节点的更新队列
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> <span class="token parameter">fiber</span> - 需要初始化更新队列的fiber节点
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">initialUpdateQueue</span><span class="token punctuation">(</span><span class="token parameter">fiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> queue <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">shared</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">pending</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token comment">// 创建一个新的更新队列，其中pending是一个循环链表</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  fiber<span class="token punctuation">.</span>updateQueue <span class="token operator">=</span> queue<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 创建一个状态更新对象
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>Update<span class="token punctuation">}</span></span> 更新对象
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> update <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token literal-property property">tag</span><span class="token operator">:</span> UpdateState <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> update<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 将更新对象添加到fiber节点的更新队列中
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> <span class="token parameter">fiber</span> - 需要添加更新的fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Update<span class="token punctuation">}</span></span> <span class="token parameter">update</span> - 待添加的更新对象
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> fiber根节点
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span><span class="token parameter">fiber<span class="token punctuation">,</span> update</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> updateQueue <span class="token operator">=</span> fiber<span class="token punctuation">.</span>updateQueue<span class="token punctuation">;</span>
  <span class="token keyword">const</span> pending <span class="token operator">=</span> updateQueue<span class="token punctuation">.</span>shared<span class="token punctuation">.</span>pending<span class="token punctuation">;</span>

  <span class="token comment">// 如果pending为空，则让update自引用形成一个循环链表</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>pending <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    update<span class="token punctuation">.</span>next <span class="token operator">=</span> update<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    update<span class="token punctuation">.</span>next <span class="token operator">=</span> pending<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    pending<span class="token punctuation">.</span>next <span class="token operator">=</span> update<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// pending始终指向最后一个更新对象，形成一个单向循环链表</span>
  updateQueue<span class="token punctuation">.</span>shared<span class="token punctuation">.</span>pending <span class="token operator">=</span> update<span class="token punctuation">;</span>

  <span class="token keyword">return</span> <span class="token function">markUpdateLaneFromFiberToRoot</span><span class="token punctuation">(</span>fiber<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 根据老状态和更新队列中的更新计算最新的状态
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> <span class="token parameter">workInProgress</span> - 需要计算新状态的fiber节点
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">processUpdateQueue</span><span class="token punctuation">(</span><span class="token parameter">workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> queue <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>updateQueue<span class="token punctuation">;</span>
  <span class="token keyword">const</span> pendingQueue <span class="token operator">=</span> queue<span class="token punctuation">.</span>shared<span class="token punctuation">.</span>pending<span class="token punctuation">;</span>

  <span class="token comment">// 如果有更新，则清空更新队列并开始计算新的状态</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>pendingQueue <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    queue<span class="token punctuation">.</span>shared<span class="token punctuation">.</span>pending <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> lastPendingUpdate <span class="token operator">=</span> pendingQueue<span class="token punctuation">;</span>
    <span class="token keyword">const</span> firstPendingUpdate <span class="token operator">=</span> lastPendingUpdate<span class="token punctuation">.</span>next<span class="token punctuation">;</span>

    <span class="token comment">// 把更新链表剪开，变成一个单链表</span>
    lastPendingUpdate<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">let</span> newState <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>memoizedState<span class="token punctuation">;</span>
    <span class="token keyword">let</span> update <span class="token operator">=</span> firstPendingUpdate<span class="token punctuation">;</span>

    <span class="token comment">// 遍历更新队列，根据老状态和更新对象计算新状态</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>update<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      newState <span class="token operator">=</span> <span class="token function">getStateFromUpdate</span><span class="token punctuation">(</span>update<span class="token punctuation">,</span> newState<span class="token punctuation">)</span><span class="token punctuation">;</span>
      update <span class="token operator">=</span> update<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 更新fiber节点的memoizedState</span>
    workInProgress<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> newState<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 根据老状态和更新对象计算新状态
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Update<span class="token punctuation">}</span></span> <span class="token parameter">update</span> - 更新对象
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">prevState</span> - 老状态
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> 新状态
 */</span>
<span class="token keyword">function</span> <span class="token function">getStateFromUpdate</span><span class="token punctuation">(</span><span class="token parameter">update<span class="token punctuation">,</span> prevState</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>update<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">UpdateState</span><span class="token operator">:</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span> payload <span class="token punctuation">}</span> <span class="token operator">=</span> update<span class="token punctuation">;</span>
      <span class="token comment">// 合并prevState和payload为新状态</span>
      <span class="token keyword">return</span> <span class="token function">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> prevState<span class="token punctuation">,</span> payload<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-reconciler-src-reactfiberconcurrentupdates-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactfiberconcurrentupdates-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactFiberConcurrentUpdates.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> HostRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactWorkTags&quot;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 从源 Fiber 向上遍历树，找到根节点。
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">sourceFiber</span> - 源 Fiber。
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>Node<span class="token operator">|</span><span class="token keyword">null</span><span class="token punctuation">}</span></span> - 如果找到根节点，则返回根节点；否则返回 null。
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">markUpdateLaneFromFiberToRoot</span><span class="token punctuation">(</span><span class="token parameter">sourceFiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> node <span class="token operator">=</span> sourceFiber<span class="token punctuation">;</span> 
  <span class="token keyword">let</span> parent <span class="token operator">=</span> sourceFiber<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>parent <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    node <span class="token operator">=</span> parent<span class="token punctuation">;</span>
    parent <span class="token operator">=</span> parent<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 持续向上遍历树，直到找到根节点</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>tag <span class="token operator">===</span> HostRoot<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> node<span class="token punctuation">.</span>stateNode<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="shared-assign-js" tabindex="-1"><a class="header-anchor" href="#shared-assign-js" aria-hidden="true">#</a> shared/assign.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> assign <span class="token punctuation">}</span> <span class="token operator">=</span> Object<span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> assign<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,28),o=[p];function c(i,l){return s(),a("div",null,o)}const u=n(t,[["render",c],["__file","04.createRoot.html.vue"]]);export{u as default};
