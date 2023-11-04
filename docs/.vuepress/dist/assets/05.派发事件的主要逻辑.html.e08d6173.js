import{_ as n,o as s,c as a,f as e}from"./app.4326c516.js";const t={},p=e(`<h1 id="_05-派发事件的主要逻辑" tabindex="-1"><a class="header-anchor" href="#_05-派发事件的主要逻辑" aria-hidden="true">#</a> 05.派发事件的主要逻辑</h1><h2 id="packages-react-dom-bindings-src-events-reactdomeventlistener-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-events-reactdomeventlistener-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/events/ReactDOMEventListener.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> getEventTarget <span class="token keyword">from</span> <span class="token string">&#39;./getEventTarget&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> getClosestInstanceFromNode <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../client/ReactDOMComponentTree&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> dispatchEventForPluginEventSystem <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./DOMPluginEventSystem&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">dispatchDiscreteEvent</span><span class="token punctuation">(</span><span class="token parameter">domEventName<span class="token punctuation">,</span> eventSystemFlags<span class="token punctuation">,</span> container<span class="token punctuation">,</span> nativeEvent</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">dispatchEvent</span><span class="token punctuation">(</span>domEventName<span class="token punctuation">,</span> eventSystemFlags<span class="token punctuation">,</span> container<span class="token punctuation">,</span> nativeEvent<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 调度一个事件。
 *
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">domEventName</span> - DOM事件名称。
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">eventSystemFlags</span> - 事件系统标志，用于表示事件在哪个阶段（冒泡/捕获）。
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>HTMLElement<span class="token punctuation">}</span></span> <span class="token parameter">targetContainer</span> - 目标容器，通常是一个HTML元素。
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Event<span class="token punctuation">}</span></span> <span class="token parameter">nativeEvent</span> - 原生的浏览器事件对象。
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">dispatchEvent</span><span class="token punctuation">(</span><span class="token parameter">domEventName<span class="token punctuation">,</span> eventSystemFlags<span class="token punctuation">,</span> targetContainer<span class="token punctuation">,</span> nativeEvent</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> nativeEventTarget <span class="token operator">=</span> <span class="token function">getEventTarget</span><span class="token punctuation">(</span>nativeEvent<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> targetInst <span class="token operator">=</span> <span class="token function">getClosestInstanceFromNode</span><span class="token punctuation">(</span>nativeEventTarget<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">dispatchEventForPluginEventSystem</span><span class="token punctuation">(</span>
    domEventName<span class="token punctuation">,</span>
    eventSystemFlags<span class="token punctuation">,</span>
    nativeEvent<span class="token punctuation">,</span>
    targetInst<span class="token punctuation">,</span>
    targetContainer
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-dom-bindings-src-events-geteventtarget-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-events-geteventtarget-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/events/getEventTarget.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 获取原生事件的目标元素。如果原生事件没有目标元素，
 * 则尝试获取事件的 \`srcElement\`，如果仍然没有，则返回全局 \`window\` 对象。
 *
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Event<span class="token punctuation">}</span></span> <span class="token parameter">nativeEvent</span> - 原生的 DOM 事件对象
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>EventTarget<span class="token operator">|</span>Window<span class="token punctuation">}</span></span> - 事件的目标元素或 \`window\` 对象
 */</span>
<span class="token keyword">function</span> <span class="token function">getEventTarget</span><span class="token punctuation">(</span><span class="token parameter">nativeEvent</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> target <span class="token operator">=</span> nativeEvent<span class="token punctuation">.</span>target <span class="token operator">||</span> nativeEvent<span class="token punctuation">.</span>srcElement <span class="token operator">||</span> window<span class="token punctuation">;</span>
  <span class="token keyword">return</span> target<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> getEventTarget<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-dom-bindings-src-client-reactdomcomponenttree-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-client-reactdomcomponenttree-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/client/ReactDOMComponentTree.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> randomKey <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token number">36</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> internalInstanceKey <span class="token operator">=</span> <span class="token string">&#39;__reactFiber$&#39;</span> <span class="token operator">+</span> randomKey<span class="token punctuation">;</span>
<span class="token keyword">const</span> internalPropsKey <span class="token operator">=</span> <span class="token string">&quot;__reactProps$&quot;</span> <span class="token operator">+</span> randomKey<span class="token punctuation">;</span>


<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">precacheFiberNode</span><span class="token punctuation">(</span><span class="token parameter">hostInst<span class="token punctuation">,</span> node</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    node<span class="token punctuation">[</span>internalInstanceKey<span class="token punctuation">]</span> <span class="token operator">=</span> hostInst<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">updateFiberProps</span><span class="token punctuation">(</span><span class="token parameter">node<span class="token punctuation">,</span> props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    node<span class="token punctuation">[</span>internalPropsKey<span class="token punctuation">]</span> <span class="token operator">=</span> props<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">getClosestInstanceFromNode</span><span class="token punctuation">(</span><span class="token parameter">targetNode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> targetInst <span class="token operator">=</span> targetNode<span class="token punctuation">[</span>internalInstanceKey<span class="token punctuation">]</span>
    <span class="token keyword">return</span> targetInst<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-dom-bindings-src-client-reactdomhostconfig-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-client-reactdomhostconfig-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/client/ReactDOMHostConfig.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> precacheFiberNode<span class="token punctuation">,</span> updateFiberProps <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./ReactDOMComponentTree&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createInstance</span><span class="token punctuation">(</span><span class="token parameter">type<span class="token punctuation">,</span> props<span class="token punctuation">,</span> internalInstanceHandle</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> domElement <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span>type<span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token function">precacheFiberNode</span><span class="token punctuation">(</span>internalInstanceHandle<span class="token punctuation">,</span> domElement<span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token function">updateFiberProps</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> props<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> domElement<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-dom-bindings-src-events-domplugineventsystem-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-events-domplugineventsystem-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/events/DOMPluginEventSystem.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> getEventTarget <span class="token keyword">from</span> <span class="token string">&#39;./getEventTarget&#39;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 在插件事件系统中分发事件
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">domEventName</span> DOM事件名称
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">eventSystemFlags</span> 事件系统标记
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Event<span class="token punctuation">}</span></span> <span class="token parameter">nativeEvent</span> 原生事件
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">targetInst</span> Fiber目标实例
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Element<span class="token punctuation">}</span></span> <span class="token parameter">targetContainer</span> 目标容器元素
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">dispatchEventForPluginEventSystem</span><span class="token punctuation">(</span>
  <span class="token parameter">domEventName<span class="token punctuation">,</span> eventSystemFlags<span class="token punctuation">,</span> nativeEvent<span class="token punctuation">,</span> targetInst<span class="token punctuation">,</span> targetContainer</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">dispatchEventForPlugins</span><span class="token punctuation">(</span>domEventName<span class="token punctuation">,</span> eventSystemFlags<span class="token punctuation">,</span> nativeEvent<span class="token punctuation">,</span> targetInst<span class="token punctuation">,</span> targetContainer<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 为插件分发事件
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">domEventName</span> DOM事件名称
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">eventSystemFlags</span> 事件系统标记
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Event<span class="token punctuation">}</span></span> <span class="token parameter">nativeEvent</span> 原生事件
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">targetInst</span> Fiber目标实例
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Element<span class="token punctuation">}</span></span> <span class="token parameter">targetContainer</span> 目标容器元素
 */</span>
<span class="token keyword">function</span> <span class="token function">dispatchEventForPlugins</span><span class="token punctuation">(</span><span class="token parameter">domEventName<span class="token punctuation">,</span> eventSystemFlags<span class="token punctuation">,</span> nativeEvent<span class="token punctuation">,</span> targetInst<span class="token punctuation">,</span> targetContainer</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 获取原生事件的目标</span>
  <span class="token keyword">const</span> nativeEventTarget <span class="token operator">=</span> <span class="token function">getEventTarget</span><span class="token punctuation">(</span>nativeEvent<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> dispatchQueue <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token comment">// 提取事件</span>
  <span class="token function">extractEvents</span><span class="token punctuation">(</span>
    dispatchQueue<span class="token punctuation">,</span>
    domEventName<span class="token punctuation">,</span>
    targetInst<span class="token punctuation">,</span>
    nativeEvent<span class="token punctuation">,</span>
    nativeEventTarget<span class="token punctuation">,</span>
    eventSystemFlags<span class="token punctuation">,</span>
    targetContainer
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 处理分发队列</span>
  <span class="token function">processDispatchQueue</span><span class="token punctuation">(</span>dispatchQueue<span class="token punctuation">,</span> eventSystemFlags<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 处理分发队列
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">}</span></span> <span class="token parameter">dispatchQueue</span> 分发队列
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">eventSystemFlags</span> 事件系统标记
 */</span>
<span class="token keyword">function</span> <span class="token function">processDispatchQueue</span><span class="token punctuation">(</span><span class="token parameter">dispatchQueue<span class="token punctuation">,</span> eventSystemFlags</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 提取事件
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">}</span></span> <span class="token parameter">dispatchQueue</span> 分发队列
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">domEventName</span> DOM事件名称
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">targetInst</span> Fiber目标实例
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Event<span class="token punctuation">}</span></span> <span class="token parameter">nativeEvent</span> 原生事件
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>EventTarget<span class="token punctuation">}</span></span> <span class="token parameter">nativeEventTarget</span> 原生事件目标
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">eventSystemFlags</span> 事件系统标记
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Element<span class="token punctuation">}</span></span> <span class="token parameter">targetContainer</span> 目标容器元素
 */</span>
<span class="token keyword">function</span> <span class="token function">extractEvents</span><span class="token punctuation">(</span><span class="token parameter">dispatchQueue<span class="token punctuation">,</span>
  domEventName<span class="token punctuation">,</span>
  targetInst<span class="token punctuation">,</span>
  nativeEvent<span class="token punctuation">,</span>
  nativeEventTarget<span class="token punctuation">,</span>
  eventSystemFlags<span class="token punctuation">,</span>
  targetContainer</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  SimpleEventPlugin<span class="token punctuation">.</span><span class="token function">extractEvents</span><span class="token punctuation">(</span>
    dispatchQueue<span class="token punctuation">,</span>
    domEventName<span class="token punctuation">,</span>
    targetInst<span class="token punctuation">,</span>
    nativeEvent<span class="token punctuation">,</span>
    nativeEventTarget<span class="token punctuation">,</span>
    eventSystemFlags<span class="token punctuation">,</span>
    targetContainer
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 累积单阶段监听器
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">targetFiber</span> 目标Fiber实例
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">reactName</span> React事件名称
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">nativeEventType</span> 原生事件类型
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>boolean<span class="token punctuation">}</span></span> <span class="token parameter">isCapturePhase</span> 是否在捕获阶段
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">accumulateSinglePhaseListeners</span><span class="token punctuation">(</span>
  <span class="token parameter">targetFiber<span class="token punctuation">,</span> reactName<span class="token punctuation">,</span> nativeEventType<span class="token punctuation">,</span> isCapturePhase</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-dom-bindings-src-events-plugins-simpleeventplugin-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-events-plugins-simpleeventplugin-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/events/plugins/SimpleEventPlugin.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 导入需要的模块和函数</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> registerSimpleEvents<span class="token punctuation">,</span> topLevelEventsToReactNames <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../DOMEventProperties&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> <span class="token constant">IS_CAPTURE_PHASE</span> <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../EventSystemFlags&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> accumulateSinglePhaseListeners <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../DOMPluginEventSystem&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> SyntheticMouseEvent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../SyntheticEvent&#39;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 提取特定事件并将其加入调度队列
 *
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">}</span></span> <span class="token parameter">dispatchQueue</span> 要处理的事件队列
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">domEventName</span> DOM 事件的名称，例如 &#39;click&#39;
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">targetInst</span> 目标实例，接收事件的 React 组件
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Event<span class="token punctuation">}</span></span> <span class="token parameter">nativeEvent</span> 原生的浏览器事件对象
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>EventTarget<span class="token punctuation">}</span></span> <span class="token parameter">nativeEventTarget</span> 原生的浏览器事件目标
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">eventSystemFlags</span> 事件系统标志，表示特定的事件状态
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Element<span class="token punctuation">}</span></span> <span class="token parameter">targetContainer</span> 事件发生的 DOM 容器
 */</span>
<span class="token keyword">function</span> <span class="token function">extractEvents</span><span class="token punctuation">(</span>
  <span class="token parameter">dispatchQueue<span class="token punctuation">,</span>
  domEventName<span class="token punctuation">,</span>
  targetInst<span class="token punctuation">,</span>
  nativeEvent<span class="token punctuation">,</span>
  nativeEventTarget<span class="token punctuation">,</span>
  eventSystemFlags<span class="token punctuation">,</span>
  targetContainer</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 根据给定的 DOM 事件名，获取对应的 React 事件名</span>
  <span class="token keyword">const</span> reactName <span class="token operator">=</span> topLevelEventsToReactNames<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>domEventName<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> SyntheticEventCtor<span class="token punctuation">;</span>
  <span class="token comment">// 根据 DOM 事件名来确定要使用的合成事件构造函数</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>domEventName<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token string">&#39;click&#39;</span><span class="token operator">:</span>
      SyntheticEventCtor <span class="token operator">=</span> SyntheticMouseEvent<span class="token punctuation">;</span>  <span class="token comment">// 对于 &#39;click&#39; 事件，使用 SyntheticMouseEvent</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">default</span><span class="token operator">:</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 通过与运算确定事件是否处于捕获阶段</span>
  <span class="token keyword">const</span> isCapturePhase <span class="token operator">=</span> <span class="token punctuation">(</span>eventSystemFlags <span class="token operator">&amp;</span> <span class="token constant">IS_CAPTURE_PHASE</span><span class="token punctuation">)</span> <span class="token operator">!==</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token comment">// 使用 accumulateSinglePhaseListeners 函数获取当前阶段的所有事件监听器</span>
  <span class="token keyword">const</span> listeners <span class="token operator">=</span> <span class="token function">accumulateSinglePhaseListeners</span><span class="token punctuation">(</span>
    targetInst<span class="token punctuation">,</span>
    reactName<span class="token punctuation">,</span>
    nativeEvent<span class="token punctuation">.</span>type<span class="token punctuation">,</span>
    isCapturePhase
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 如果存在至少一个监听器</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>listeners<span class="token punctuation">.</span>length <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 则创建一个新的合成事件</span>
    <span class="token keyword">const</span> event <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SyntheticEventCtor</span><span class="token punctuation">(</span>
      reactName<span class="token punctuation">,</span> domEventName<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> nativeEvent<span class="token punctuation">,</span> nativeEventTarget<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 并将其与相应的监听器一起加入调度队列</span>
    dispatchQueue<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      event<span class="token punctuation">,</span>
      listeners
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// 导出函数，重命名 registerSimpleEvents 为 registerEvents</span>
<span class="token keyword">export</span> <span class="token punctuation">{</span> registerSimpleEvents <span class="token keyword">as</span> registerEvents<span class="token punctuation">,</span> extractEvents <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-dom-bindings-src-events-syntheticevent-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-events-syntheticevent-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/events/SyntheticEvent.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">SyntheticMouseEvent</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,15),c=[p];function o(i,l){return s(),a("div",null,c)}const r=n(t,[["render",o],["__file","05.派发事件的主要逻辑.html.vue"]]);export{r as default};
