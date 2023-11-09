import{_ as n,o as s,c as a,f as t}from"./app.d90d410b.js";const p={},e=t(`<h1 id="_09-类组件的ref源码实现" tabindex="-1"><a class="header-anchor" href="#_09-类组件的ref源码实现" aria-hidden="true">#</a> 09.类组件的ref源码实现</h1><p>具体代码演化过程请观看视频，这里呈现关键代码：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// react.js</span>
<span class="token keyword">function</span> <span class="token function">createRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> 
    <span class="token keyword">return</span> <span class="token punctuation">{</span> <span class="token literal-property property">current</span><span class="token operator">:</span> <span class="token keyword">null</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">const</span> React <span class="token operator">=</span> <span class="token punctuation">{</span>
    createElement<span class="token punctuation">,</span>
    Component<span class="token punctuation">,</span>
    createRef 
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// react-dom.js</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createDOM</span><span class="token punctuation">(</span><span class="token parameter">VNode</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token operator">!</span>VNode<span class="token punctuation">)</span> <span class="token keyword">return</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span>type<span class="token punctuation">,</span> props<span class="token punctuation">,</span> ref<span class="token punctuation">}</span> <span class="token operator">=</span> VNode 
    <span class="token comment">// 此处省略原有代码若干...</span>
    VNode<span class="token punctuation">.</span>dom <span class="token operator">=</span> dom
    ref <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span>ref<span class="token punctuation">.</span>current <span class="token operator">=</span> dom<span class="token punctuation">)</span> 
    <span class="token keyword">return</span> dom
<span class="token punctuation">}</span>


<span class="token keyword">function</span> <span class="token function">getDomByClassComponent</span><span class="token punctuation">(</span><span class="token parameter">vNode</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">let</span> <span class="token punctuation">{</span> type<span class="token punctuation">,</span> props<span class="token punctuation">,</span> ref <span class="token punctuation">}</span> <span class="token operator">=</span> vNode<span class="token punctuation">;</span>
    <span class="token keyword">let</span> instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">type</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span>
    ref <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span>ref<span class="token punctuation">.</span>current <span class="token operator">=</span> instance<span class="token punctuation">)</span><span class="token punctuation">;</span> 
    <span class="token keyword">let</span> renderVNode <span class="token operator">=</span> instance<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    instance<span class="token punctuation">.</span>oldVNode <span class="token operator">=</span> renderVNode
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>renderVNode<span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token function">createDOM</span><span class="token punctuation">(</span>renderVNode<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">//index.js</span>
<span class="token keyword">class</span> <span class="token class-name">CustomTextInput</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// create a ref to store the textInput DOM element</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>textInput <span class="token operator">=</span> React<span class="token punctuation">.</span><span class="token function">createRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>focusTextInput <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">focusTextInput</span><span class="token punctuation">.</span><span class="token function">bind</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token function">focusTextInput</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// Explicitly focus the text input using the raw DOM API</span>
    <span class="token comment">// Note: we&#39;re accessing &quot;current&quot; to get the DOM node</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>textInput<span class="token punctuation">.</span>current<span class="token punctuation">.</span><span class="token function">focus</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// tell React that we want to associate the &lt;input&gt; ref</span>
    <span class="token comment">// with the \`textInput\` that we created in the constructor</span>
    <span class="token keyword">return</span> <span class="token punctuation">(</span>
      <span class="token operator">&lt;</span>div<span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span>input
          type<span class="token operator">=</span><span class="token string">&quot;text&quot;</span>
          ref<span class="token operator">=</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>textInput<span class="token punctuation">}</span> <span class="token operator">/</span><span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span>input
          type<span class="token operator">=</span><span class="token string">&quot;button&quot;</span>
          value<span class="token operator">=</span><span class="token string">&quot;Focus the text input&quot;</span>
          onClick<span class="token operator">=</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>focusTextInput<span class="token punctuation">}</span>
        <span class="token operator">/</span><span class="token operator">&gt;</span>
      <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">AutoFocusTextInput</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>textInput <span class="token operator">=</span> React<span class="token punctuation">.</span><span class="token function">createRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token function">componentDidMount</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>textInput<span class="token punctuation">.</span>current<span class="token punctuation">.</span><span class="token function">focusTextInput</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">(</span>
      <span class="token operator">&lt;</span>CustomTextInput ref<span class="token operator">=</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>textInput<span class="token punctuation">}</span> <span class="token operator">/</span><span class="token operator">&gt;</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),o=[e];function c(i,l){return s(),a("div",null,o)}const r=n(p,[["render",c],["__file","10.类组件的ref源码实现.html.vue"]]);export{r as default};
