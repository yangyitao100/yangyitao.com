import{_ as n,o as s,c as a,f as e}from"./app.d90d410b.js";const t={},p=e(`<h1 id="_03-单节点-domdiff" tabindex="-1"><a class="header-anchor" href="#_03-单节点-domdiff" aria-hidden="true">#</a> 03.单节点 domdiff</h1><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 使用现有的fiber节点和待处理的props创建新的fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">fiber</span> 现有的fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">pendingProps</span> 待处理的props
 * <span class="token keyword">@return</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> clone 新的fiber节点
 */</span>
<span class="token keyword">function</span> <span class="token function">useFiber</span><span class="token punctuation">(</span><span class="token parameter">fiber<span class="token punctuation">,</span> pendingProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> clone <span class="token operator">=</span> <span class="token function">createWorkInProgress</span><span class="token punctuation">(</span>fiber<span class="token punctuation">,</span> pendingProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
  clone<span class="token punctuation">.</span>index <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
  clone<span class="token punctuation">.</span>sibling <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> clone<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token doc-comment comment">/**
 * 将子节点添加到待删除列表中
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">returnFiber</span> 父级fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">childToDelete</span> 需要被删除的子fiber节点
 */</span>
<span class="token keyword">function</span> <span class="token function">deleteChild</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> childToDelete</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>shouldTrackSideEffects<span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> deletions <span class="token operator">=</span> returnFiber<span class="token punctuation">.</span>deletions<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>deletions <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    returnFiber<span class="token punctuation">.</span>deletions <span class="token operator">=</span> <span class="token punctuation">[</span>childToDelete<span class="token punctuation">]</span><span class="token punctuation">;</span>
    returnFiber<span class="token punctuation">.</span>flags <span class="token operator">|=</span> ChildDeletion<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    returnFiber<span class="token punctuation">.</span>deletions<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>childToDelete<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 删除所有剩余的子节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">returnFiber</span> 父级fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">currentFirstChild</span> 当前的第一个子节点
 * <span class="token keyword">@return</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token keyword">null</span><span class="token punctuation">}</span></span> 返回null
 */</span>
<span class="token keyword">function</span> <span class="token function">deleteRemainingChildren</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstChild</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>shouldTrackSideEffects<span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> childToDelete <span class="token operator">=</span> currentFirstChild<span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>childToDelete <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">deleteChild</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> childToDelete<span class="token punctuation">)</span><span class="token punctuation">;</span>
    childToDelete <span class="token operator">=</span> childToDelete<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">function</span> <span class="token function">reconcileSingleElement</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstChild<span class="token punctuation">,</span> element</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> key <span class="token operator">=</span> element<span class="token punctuation">.</span>key<span class="token punctuation">;</span>
  <span class="token keyword">let</span> child <span class="token operator">=</span> currentFirstChild<span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>child<span class="token punctuation">.</span>key <span class="token operator">===</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>child<span class="token punctuation">.</span>type <span class="token operator">===</span> element<span class="token punctuation">.</span>type<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">deleteRemainingChildren</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">const</span> existing <span class="token operator">=</span> <span class="token function">useFiber</span><span class="token punctuation">(</span>child<span class="token punctuation">,</span> element<span class="token punctuation">.</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>
        existing<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
        <span class="token keyword">return</span> existing<span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token function">deleteRemainingChildren</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> child<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token function">deleteChild</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> child<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    child <span class="token operator">=</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">const</span> created <span class="token operator">=</span> <span class="token function">createFiberFromElement</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span>
  created<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
  <span class="token keyword">return</span> created<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),c=[p];function o(l,i){return s(),a("div",null,c)}const r=n(t,[["render",o],["__file","03.单节点domdiff.html.vue"]]);export{r as default};
