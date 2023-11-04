import{_ as n,o as s,c as a,f as e}from"./app.4326c516.js";const t={},i=e(`<h1 id="_04-注册监听事件" tabindex="-1"><a class="header-anchor" href="#_04-注册监听事件" aria-hidden="true">#</a> 04.注册监听事件</h1><h2 id="packages-react-dom-bindings-src-events-domplugineventsystem-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-events-domplugineventsystem-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/events/DOMPluginEventSystem.js</h2><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>import { allNativeEvents } from &#39;./EventRegistry&#39;;
import * as SimpleEventPlugin from &#39;./plugins/SimpleEventPlugin&#39;;

<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">import { IS_CAPTURE_PHASE } from &#39;./EventSystemFlags&#39;;
</span><span class="token prefix inserted">+</span><span class="token line">import { createEventListenerWrapperWithPriority } from &#39;./ReactDOMEventListener&#39;;
</span><span class="token prefix inserted">+</span><span class="token line">import {
</span><span class="token prefix inserted">+</span><span class="token line">  addEventCaptureListener,
</span><span class="token prefix inserted">+</span><span class="token line">  addEventBubbleListener
</span><span class="token prefix inserted">+</span><span class="token line">} from &#39;./EventListener&#39;;
</span></span>
SimpleEventPlugin.registerEvents();
const listeningMarker = \`_reactListening\` + Math.random().toString(36).slice(2);

<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 监听所有支持的事件
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {Element} rootContainerElement 根容器元素
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span></span>export function listenToAllSupportedEvents(rootContainerElement) {
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  // 如果此元素尚未标记为已监听，则监听所有原生事件
</span><span class="token prefix inserted">+</span><span class="token line">  if (!rootContainerElement[listeningMarker]) {
</span><span class="token prefix inserted">+</span><span class="token line">    rootContainerElement[listeningMarker] = true;
</span><span class="token prefix inserted">+</span><span class="token line">    allNativeEvents.forEach((domEventName) =&gt; {
</span><span class="token prefix inserted">+</span><span class="token line">      listenToNativeEvent(domEventName, true, rootContainerElement);
</span><span class="token prefix inserted">+</span><span class="token line">      listenToNativeEvent(domEventName, false, rootContainerElement);
</span><span class="token prefix inserted">+</span><span class="token line">    });
</span><span class="token prefix inserted">+</span><span class="token line">  }
</span></span>}

<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 监听原生事件
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {string} domEventName DOM 事件名称
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {boolean} isCapturePhaseListener 是否在捕获阶段监听
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {Element} target 目标元素
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span><span class="token prefix inserted">+</span><span class="token line">export function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
</span><span class="token prefix inserted">+</span><span class="token line">  let eventSystemFlags = 0;
</span><span class="token prefix inserted">+</span><span class="token line">  // 如果在捕获阶段监听，设置事件系统标记
</span><span class="token prefix inserted">+</span><span class="token line">  if (isCapturePhaseListener) {
</span><span class="token prefix inserted">+</span><span class="token line">    eventSystemFlags |= IS_CAPTURE_PHASE;
</span><span class="token prefix inserted">+</span><span class="token line">  }
</span><span class="token prefix inserted">+</span><span class="token line">  addTrappedEventListener(target, domEventName, eventSystemFlags, isCapturePhaseListener);
</span><span class="token prefix inserted">+</span><span class="token line">}
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 添加受限制的事件监听器
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {Element} targetContainer 目标容器元素
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {string} domEventName DOM 事件名称
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {number} eventSystemFlags 事件系统标记
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {boolean} isCapturePhaseListener 是否在捕获阶段监听
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span><span class="token prefix inserted">+</span><span class="token line">function addTrappedEventListener(
</span><span class="token prefix inserted">+</span><span class="token line">  targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener
</span><span class="token prefix inserted">+</span><span class="token line">) {
</span><span class="token prefix inserted">+</span><span class="token line">  // 创建带有优先级的事件监听器
</span><span class="token prefix inserted">+</span><span class="token line">  const listener = createEventListenerWrapperWithPriority(targetContainer, domEventName, eventSystemFlags);
</span><span class="token prefix inserted">+</span><span class="token line">  // 根据监听阶段选择合适的添加监听函数
</span><span class="token prefix inserted">+</span><span class="token line">  if (isCapturePhaseListener) {
</span><span class="token prefix inserted">+</span><span class="token line">    addEventCaptureListener(targetContainer, domEventName, listener);
</span><span class="token prefix inserted">+</span><span class="token line">  } else {
</span><span class="token prefix inserted">+</span><span class="token line">    addEventBubbleListener(targetContainer, domEventName, listener);
</span><span class="token prefix inserted">+</span><span class="token line">  }
</span><span class="token prefix inserted">+</span><span class="token line">}
</span></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-dom-bindings-src-events-eventlistener-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-events-eventlistener-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/events/EventListener.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 在目标元素上添加捕获阶段的事件监听器
 * 
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>EventTarget<span class="token punctuation">}</span></span> <span class="token parameter">target</span> - 目标元素，我们想要在上面添加监听器的元素
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">eventType</span> - 事件类型，我们想要监听的事件的名称
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Function<span class="token punctuation">}</span></span> <span class="token parameter">listener</span> - 监听器函数，当事件发生时将调用的函数
 * 
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>Function<span class="token punctuation">}</span></span> 返回添加的监听器函数
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">addEventCaptureListener</span><span class="token punctuation">(</span><span class="token parameter">target<span class="token punctuation">,</span> eventType<span class="token punctuation">,</span> listener</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 调用目标元素的 addEventListener 方法，添加捕获阶段的事件监听器</span>
  target<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span>eventType<span class="token punctuation">,</span> listener<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  
  <span class="token comment">// 返回添加的监听器函数</span>
  <span class="token keyword">return</span> listener<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 在目标元素上添加冒泡阶段的事件监听器
 * 
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>EventTarget<span class="token punctuation">}</span></span> <span class="token parameter">target</span> - 目标元素，我们想要在上面添加监听器的元素
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">eventType</span> - 事件类型，我们想要监听的事件的名称
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Function<span class="token punctuation">}</span></span> <span class="token parameter">listener</span> - 监听器函数，当事件发生时将调用的函数
 * 
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>Function<span class="token punctuation">}</span></span> 返回添加的监听器函数
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">addEventBubbleListener</span><span class="token punctuation">(</span><span class="token parameter">target<span class="token punctuation">,</span> eventType<span class="token punctuation">,</span> listener</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 调用目标元素的 addEventListener 方法，添加冒泡阶段的事件监听器</span>
  target<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span>eventType<span class="token punctuation">,</span> listener<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  
  <span class="token comment">// 返回添加的监听器函数</span>
  <span class="token keyword">return</span> listener<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-dom-bindings-src-events-reactdomeventlistener-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-events-reactdomeventlistener-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/events/ReactDOMEventListener.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 创建一个具有优先级的事件监听器包装器。
 *
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>HTMLElement<span class="token punctuation">}</span></span> <span class="token parameter">targetContainer</span> - 目标容器，通常是一个HTML元素。
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">domEventName</span> - DOM事件名称。
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">eventSystemFlags</span> - 事件系统标志，用于表示事件在哪个阶段（冒泡/捕获）。
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token keyword">function</span><span class="token punctuation">}</span></span> - 绑定了特定参数的事件调度函数。
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createEventListenerWrapperWithPriority</span><span class="token punctuation">(</span>
  <span class="token parameter">targetContainer<span class="token punctuation">,</span>
  domEventName<span class="token punctuation">,</span>
  eventSystemFlags</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> listenerWrapper <span class="token operator">=</span> dispatchDiscreteEvent<span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token function">listenerWrapper</span><span class="token punctuation">.</span><span class="token function">bind</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> domEventName<span class="token punctuation">,</span> eventSystemFlags<span class="token punctuation">,</span> targetContainer<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 调度离散事件。
 *
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">domEventName</span> - DOM事件名称。
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">eventSystemFlags</span> - 事件系统标志，用于表示事件在哪个阶段（冒泡/捕获）。
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>HTMLElement<span class="token punctuation">}</span></span> <span class="token parameter">container</span> - 目标容器，通常是一个HTML元素。
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Event<span class="token punctuation">}</span></span> <span class="token parameter">nativeEvent</span> - 原生的浏览器事件对象。
 */</span>
<span class="token keyword">function</span> <span class="token function">dispatchDiscreteEvent</span><span class="token punctuation">(</span><span class="token parameter">domEventName<span class="token punctuation">,</span> eventSystemFlags<span class="token punctuation">,</span> container<span class="token punctuation">,</span> nativeEvent</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7),p=[i];function l(c,r){return s(),a("div",null,p)}const d=n(t,[["render",l],["__file","04.注册监听事件.html.vue"]]);export{d as default};
