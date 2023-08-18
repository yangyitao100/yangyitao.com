import{_ as n,o as s,c as a,f as p}from"./app.a186c370.js";const t={},o=p(`<h1 id="_04-类组件的基本实现" tabindex="-1"><a class="header-anchor" href="#_04-类组件的基本实现" aria-hidden="true">#</a> 04.类组件的基本实现</h1><blockquote><p>其实在日常开发中，我们已经很少用类组件的形式来编写代码，但是，类组件会长期存在，我们有必要在这里去进行研究，而且有了对类组件的理解，有助于我们后续对Hooks的相关内容进行深入的掌握</p></blockquote><p>具体代码演化过程请观看视频，这里呈现关键代码：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// Component.js</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">Component</span> <span class="token punctuation">{</span>
    <span class="token keyword">static</span> <span class="token constant">IS_CLASS_COMPONENT</span> <span class="token operator">=</span> <span class="token boolean">true</span>
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>props <span class="token operator">=</span> props<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">//react-dom.js</span>
<span class="token keyword">function</span> <span class="token function">createDOM</span><span class="token punctuation">(</span><span class="token parameter">VNode</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span>type<span class="token punctuation">,</span> props<span class="token punctuation">}</span> <span class="token operator">=</span> VNode
    <span class="token keyword">let</span> dom<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> type <span class="token operator">===</span> <span class="token string">&#39;function&#39;</span> <span class="token operator">&amp;&amp;</span> type<span class="token punctuation">.</span><span class="token constant">IS_CLASS_COMPONENT</span> <span class="token operator">&amp;&amp;</span> VNode<span class="token punctuation">.</span>$$<span class="token keyword">typeof</span> <span class="token operator">===</span> <span class="token constant">REACT_ELEMENT</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token function">getDomByClassComponent</span><span class="token punctuation">(</span>VNode<span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> type <span class="token operator">===</span> <span class="token string">&#39;function&#39;</span> <span class="token operator">&amp;&amp;</span> VNode<span class="token punctuation">.</span>$$<span class="token keyword">typeof</span> <span class="token operator">===</span> <span class="token constant">REACT_ELEMENT</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token function">getDomByFunctionComponent</span><span class="token punctuation">(</span>VNode<span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>type <span class="token operator">&amp;&amp;</span> VNode<span class="token punctuation">.</span>$$<span class="token keyword">typeof</span> <span class="token operator">===</span> <span class="token constant">REACT_ELEMENT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        dom <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span>type<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> 
    <span class="token keyword">if</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> props<span class="token punctuation">.</span>children <span class="token operator">===</span> <span class="token string">&#39;object&#39;</span> <span class="token operator">&amp;&amp;</span> props<span class="token punctuation">.</span>children<span class="token punctuation">.</span>type<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">mount</span><span class="token punctuation">(</span>props<span class="token punctuation">.</span>children<span class="token punctuation">,</span> dom<span class="token punctuation">)</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>props<span class="token punctuation">.</span>children<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">mountArray</span><span class="token punctuation">(</span>props<span class="token punctuation">.</span>children<span class="token punctuation">,</span> dom<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> props<span class="token punctuation">.</span>children <span class="token operator">===</span> <span class="token string">&#39;string&#39;</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            dom<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>document<span class="token punctuation">.</span><span class="token function">createTextNode</span><span class="token punctuation">(</span>props<span class="token punctuation">.</span>children<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token function">setPropsForDOM</span><span class="token punctuation">(</span>dom<span class="token punctuation">,</span> props<span class="token punctuation">)</span>
    <span class="token keyword">return</span> dom
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">getDomByClassComponent</span><span class="token punctuation">(</span><span class="token parameter">vNode</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">let</span> <span class="token punctuation">{</span> type<span class="token punctuation">,</span> props <span class="token punctuation">}</span> <span class="token operator">=</span> vNode<span class="token punctuation">;</span>
    <span class="token keyword">let</span> instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">type</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span>
    <span class="token keyword">let</span> renderVNode <span class="token operator">=</span> instance<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>renderVNode<span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token function">createDOM</span><span class="token punctuation">(</span>renderVNode<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),e=[o];function c(l,i){return s(),a("div",null,e)}const k=n(t,[["render",c],["__file","04.实现类组件基础功能.html.vue"]]);export{k as default};
