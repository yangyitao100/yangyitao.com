import{_ as n,o as s,c as a,f as t}from"./app.00462568.js";const e={},p=t(`<h1 id="_07-合成事件" tabindex="-1"><a class="header-anchor" href="#_07-合成事件" aria-hidden="true">#</a> 07.合成事件</h1><h2 id="packages-react-dom-bindings-src-events-syntheticevent-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-events-syntheticevent-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/events/SyntheticEvent.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> assign <span class="token keyword">from</span> <span class="token string">&quot;shared/assign&quot;</span><span class="token punctuation">;</span>

<span class="token comment">// 定义两个返回特定布尔值的函数</span>
<span class="token keyword">function</span> <span class="token function">functionThatReturnsTrue</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">function</span> <span class="token function">functionThatReturnsFalse</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 定义一个接口，用来表示鼠标事件的某些属性</span>
<span class="token keyword">const</span> MouseEventInterface <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">clientX</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  <span class="token literal-property property">clientY</span><span class="token operator">:</span> <span class="token number">0</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 创建一个合成事件类。
 * 
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">Interface</span> - 事件接口，定义了事件应有的属性。
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token keyword">function</span><span class="token punctuation">}</span></span> - 返回的函数是一个合成事件类的构造器。
 */</span>
<span class="token keyword">function</span> <span class="token function">createSyntheticEvent</span><span class="token punctuation">(</span><span class="token parameter">Interface</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token doc-comment comment">/**
   * SyntheticBaseEvent 类表示一个合成事件。
   * 
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">reactName</span> - React事件的名称。
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">reactEventType</span> - React事件类型。
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">targetInst</span> - 目标实例。
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Event<span class="token punctuation">}</span></span> <span class="token parameter">nativeEvent</span> - 原生的浏览器事件对象。
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">nativeEventTarget</span> - 原生事件的目标对象。
   */</span>
  <span class="token keyword">function</span> <span class="token function">SyntheticBaseEvent</span><span class="token punctuation">(</span>
    <span class="token parameter">reactName<span class="token punctuation">,</span> reactEventType<span class="token punctuation">,</span> targetInst<span class="token punctuation">,</span> nativeEvent<span class="token punctuation">,</span> nativeEventTarget</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>_reactName <span class="token operator">=</span> reactName<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>type <span class="token operator">=</span> reactEventType<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>_targetInst <span class="token operator">=</span> targetInst<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>nativeEvent <span class="token operator">=</span> nativeEvent<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>target <span class="token operator">=</span> nativeEventTarget<span class="token punctuation">;</span>
    <span class="token comment">// 对于接口中定义的每一个属性，都将其值从原生事件对象中拷贝过来</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> propName <span class="token keyword">in</span> Interface<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>Interface<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>propName<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">continue</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">this</span><span class="token punctuation">[</span>propName<span class="token punctuation">]</span> <span class="token operator">=</span> nativeEvent<span class="token punctuation">[</span>propName<span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 初始状态下，事件的默认行为不被阻止，事件传播也没有被停止</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>isDefaultPrevented <span class="token operator">=</span> functionThatReturnsFalse<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>isPropagationStopped <span class="token operator">=</span> functionThatReturnsFalse<span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 为合成事件类的原型添加 preventDefault 和 stopPropagation 方法</span>
  <span class="token function">assign</span><span class="token punctuation">(</span><span class="token class-name">SyntheticBaseEvent</span><span class="token punctuation">.</span>prototype<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token function">preventDefault</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> event <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>nativeEvent<span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>event<span class="token punctuation">.</span>preventDefault<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        event<span class="token punctuation">.</span><span class="token function">preventDefault</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        event<span class="token punctuation">.</span>returnValue <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>isDefaultPrevented <span class="token operator">=</span> functionThatReturnsTrue<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">stopPropagation</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> event <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>nativeEvent<span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>event<span class="token punctuation">.</span>stopPropagation<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        event<span class="token punctuation">.</span><span class="token function">stopPropagation</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        event<span class="token punctuation">.</span>cancelBubble <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>isPropagationStopped <span class="token operator">=</span> functionThatReturnsTrue<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> SyntheticBaseEvent<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 使用鼠标事件接口创建一个合成鼠标事件类</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> SyntheticMouseEvent <span class="token operator">=</span> <span class="token function">createSyntheticEvent</span><span class="token punctuation">(</span>MouseEventInterface<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3),c=[p];function o(i,l){return s(),a("div",null,c)}const r=n(e,[["render",o],["__file","07.合成事件.html.vue"]]);export{r as default};
