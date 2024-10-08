import{_ as n,o as s,c as a,f as e}from"./app.c996eb5c.js";const t={},p=e(`<h1 id="_03-事件名注册" tabindex="-1"><a class="header-anchor" href="#_03-事件名注册" aria-hidden="true">#</a> 03.事件名注册</h1><h2 id="packages-react-dom-bindings-src-events-domplugineventsystem-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-events-domplugineventsystem-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/events/DOMPluginEventSystem.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> allNativeEvents <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./EventRegistry&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> SimpleEventPlugin <span class="token keyword">from</span> <span class="token string">&#39;./plugins/SimpleEventPlugin&#39;</span><span class="token punctuation">;</span>
SimpleEventPlugin<span class="token punctuation">.</span><span class="token function">registerEvents</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">listenToAllSupportedEvents</span><span class="token punctuation">(</span><span class="token parameter">rootContainerElement</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-dom-bindings-src-events-plugins-simpleeventplugin-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-events-plugins-simpleeventplugin-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/events/plugins/SimpleEventPlugin.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> registerSimpleEvents <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../DOMEventProperties&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token punctuation">{</span> registerSimpleEvents <span class="token keyword">as</span> registerEvents <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-dom-bindings-src-events-domeventproperties-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-events-domeventproperties-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/events/DOMEventProperties.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 导入 EventRegistry 模块中的 registerTwoPhaseEvent 函数</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> registerTwoPhaseEvent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./EventRegistry&#39;</span><span class="token punctuation">;</span>

<span class="token comment">// 定义一个包含 &#39;click&#39; 的事件数组</span>
<span class="token keyword">const</span> simpleEventPluginEvents <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">&#39;click&#39;</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token comment">// 创建一个新的 Map 对象，用来存储顶层事件名到 React 事件名的映射</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> topLevelEventsToReactNames <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 注册简单事件
 *
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">domEventName</span> DOM事件名称
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">reactName</span> React事件名称
 */</span>
<span class="token keyword">function</span> <span class="token function">registerSimpleEvent</span><span class="token punctuation">(</span><span class="token parameter">domEventName<span class="token punctuation">,</span> reactName</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 在 Map 对象中设置 domEventName 和 reactName 的映射关系</span>
  topLevelEventsToReactNames<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>domEventName<span class="token punctuation">,</span> reactName<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 调用 registerTwoPhaseEvent 函数，注册为两阶段事件</span>
  <span class="token function">registerTwoPhaseEvent</span><span class="token punctuation">(</span>reactName<span class="token punctuation">,</span> <span class="token punctuation">[</span>domEventName<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 注册简单事件数组中的所有事件
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">registerSimpleEvents</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 遍历 simpleEventPluginEvents 数组</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> simpleEventPluginEvents<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 获取数组中的每个事件名</span>
    <span class="token keyword">const</span> eventName <span class="token operator">=</span> simpleEventPluginEvents<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
    
    <span class="token comment">// 转换事件名为小写，得到 domEventName</span>
    <span class="token keyword">const</span> domEventName <span class="token operator">=</span> eventName<span class="token punctuation">.</span><span class="token function">toLowerCase</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    
    <span class="token comment">// 将事件名的首字母转换为大写，得到 capitalizeEvent</span>
    <span class="token keyword">const</span> capitalizeEvent <span class="token operator">=</span> eventName<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">toUpperCase</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> eventName<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 调用 registerSimpleEvent 函数，注册该事件</span>
    <span class="token comment">// 其中，reactName 是 &#39;on&#39; 加上 capitalizeEvent</span>
    <span class="token function">registerSimpleEvent</span><span class="token punctuation">(</span>domEventName<span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">on</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>capitalizeEvent<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-dom-bindings-src-events-eventregistry-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-events-eventregistry-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/events/EventRegistry.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 创建一个 Set 来存储所有的原生事件
 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> allNativeEvents <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Set</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 注册一个两阶段的事件（包括捕获和冒泡阶段）
 * 
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">registrationName</span> - 注册的事件名称
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">&lt;</span>string<span class="token punctuation">&gt;</span><span class="token punctuation">}</span></span> <span class="token parameter">dependencies</span> - 事件依赖的其他事件的名称的数组
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">registerTwoPhaseEvent</span><span class="token punctuation">(</span><span class="token parameter">registrationName<span class="token punctuation">,</span> dependencies</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 直接注册事件（可能是冒泡阶段的）</span>
  <span class="token function">registerDirectEvent</span><span class="token punctuation">(</span>registrationName<span class="token punctuation">,</span> dependencies<span class="token punctuation">)</span><span class="token punctuation">;</span>
  
  <span class="token comment">// 注册捕获阶段的事件</span>
  <span class="token comment">// 通过在事件名称后添加 &#39;Capture&#39; 后缀来区分</span>
  <span class="token function">registerDirectEvent</span><span class="token punctuation">(</span>registrationName <span class="token operator">+</span> <span class="token string">&#39;Capture&#39;</span><span class="token punctuation">,</span> dependencies<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 直接注册事件（包括冒泡或捕获阶段）
 * 
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">registrationName</span> - 注册的事件名称
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">&lt;</span>string<span class="token punctuation">&gt;</span><span class="token punctuation">}</span></span> <span class="token parameter">dependencies</span> - 事件依赖的其他事件的名称的数组
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">registerDirectEvent</span><span class="token punctuation">(</span><span class="token parameter">registrationName<span class="token punctuation">,</span> dependencies</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 遍历依赖事件数组</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> dependencies<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 将每个依赖事件添加到 allNativeEvents Set 中</span>
    allNativeEvents<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>dependencies<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,9),c=[p];function i(o,l){return s(),a("div",null,c)}const r=n(t,[["render",i],["__file","03.事件名注册.html.vue"]]);export{r as default};
