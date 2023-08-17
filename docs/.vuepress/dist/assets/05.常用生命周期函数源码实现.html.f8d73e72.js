import{_ as n,o as s,c as a,f as t}from"./app.d86bc82c.js";const p={},o=t(`<h1 id="_05-常用生命周期函数源码实现" tabindex="-1"><a class="header-anchor" href="#_05-常用生命周期函数源码实现" aria-hidden="true">#</a> 05.常用生命周期函数源码实现</h1><p>本小节实现了三个常见生命周期函数，代码演化请观看视频，这里呈现相关代码：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">getDomByClassComponent</span><span class="token punctuation">(</span><span class="token parameter">vNode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> <span class="token punctuation">{</span> type<span class="token punctuation">,</span> props<span class="token punctuation">,</span> ref <span class="token punctuation">}</span> <span class="token operator">=</span> vNode<span class="token punctuation">;</span>
    <span class="token keyword">let</span> instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">type</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span>
    ref <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span>ref<span class="token punctuation">.</span>current <span class="token operator">=</span> instance<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">let</span> renderVNode <span class="token operator">=</span> instance<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    instance<span class="token punctuation">.</span>oldVNode <span class="token operator">=</span> renderVNode
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>renderVNode<span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">let</span> dom <span class="token operator">=</span> <span class="token function">createDOM</span><span class="token punctuation">(</span>renderVNode<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>instance<span class="token punctuation">.</span>componentDidMount<span class="token punctuation">)</span> instance<span class="token punctuation">.</span><span class="token function">componentDidMount</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> dom
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token function">update</span><span class="token punctuation">(</span><span class="token parameter">prevProps<span class="token punctuation">,</span> prevState</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">let</span> oldVNode <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>oldVNode<span class="token punctuation">;</span>
        <span class="token keyword">let</span> oldDOM <span class="token operator">=</span> <span class="token function">findDomByVNode</span><span class="token punctuation">(</span>oldVNode<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>constructor<span class="token punctuation">.</span>getDerivedStateFromProps<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">let</span> newState <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>constructor<span class="token punctuation">.</span><span class="token function">getDerivedStateFromProps</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>state <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token operator">...</span><span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">,</span> <span class="token operator">...</span>newState <span class="token punctuation">}</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">let</span> snapshot <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>getSnapshotBeforeUpdate <span class="token operator">&amp;&amp;</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getSnapshotBeforeUpdate</span><span class="token punctuation">(</span>prevProps<span class="token punctuation">,</span> prevState<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">let</span> newVNode <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">updateDomTree</span><span class="token punctuation">(</span>oldVNode<span class="token punctuation">,</span> newVNode<span class="token punctuation">,</span> oldDOM<span class="token punctuation">)</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>oldVNode <span class="token operator">=</span> newVNode<span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>componentDidUpdate<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">componentDidUpdate</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">,</span> snapshot<span class="token punctuation">)</span><span class="token punctuation">;</span> 
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">removeVNode</span><span class="token punctuation">(</span><span class="token parameter">vNode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> currentDOM <span class="token operator">=</span> <span class="token function">findDomByVNode</span><span class="token punctuation">(</span>vNode<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>currentDOM<span class="token punctuation">)</span> currentDOM<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>vNode<span class="token punctuation">.</span>classInstance <span class="token operator">&amp;&amp;</span> vNode<span class="token punctuation">.</span>classInstance<span class="token punctuation">.</span>componentWillUnmount<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        vNode<span class="token punctuation">.</span>classInstance<span class="token punctuation">.</span><span class="token function">componentWillUnmount</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),e=[o];function c(u,l){return s(),a("div",null,e)}const k=n(p,[["render",c],["__file","05.常用生命周期函数源码实现.html.vue"]]);export{k as default};
