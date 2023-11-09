import{_ as n,o as s,c as a,f as e}from"./app.d90d410b.js";const p="/assets/10-01.b23b57e3.webp",t="/assets/10-02.1ec5ebe8.webp",o="/assets/10-03.6acdd49a.webp",c={},i=e(`<h1 id="_10-名动江湖的diff算法" tabindex="-1"><a class="header-anchor" href="#_10-名动江湖的diff算法" aria-hidden="true">#</a> 10.名动江湖的diff算法</h1><p><strong>欢迎关注 微信公众号：杨艺韬</strong></p><blockquote><p>至今不明白为什么<strong>Vue</strong>中的<strong>diff算法</strong>名气这么大，我想说我们不要被事物的表象所迷惑，做技术尤其如此，名气大的事物可能并不一定真的特别重要。就好像谈到<strong>Vue</strong>很多人的第一反应就是响应式系统，似乎<strong>Vue</strong>的核心就是响应式系统。除了响应式系统，很多人对<strong>Vue</strong>印象最深刻的可能就是<strong>diff算法</strong>了，好像<strong>diff算法</strong>就是<strong>Vue</strong>的精髓所在。而实际上响应式系统仅仅是<strong>Vue3</strong>中一个比较重要的子系统罢了，而<strong>diff算法</strong>只不过是<strong>Vue3</strong>这个庞大系统的一个很小的部分，甚至可以说没有<strong>diff</strong>算法，用粗暴的方式仅用几行代码即可替代<strong>diff算法</strong>，还能让<strong>Vue3</strong>依然可以正常工作。当然，<strong>diff算法</strong>是值得我们学习的，毕竟对性能的不断追求是一个开发者的基本素养。</p></blockquote><p>本文会从函数<code>patchChildren</code>函数讲起，先让大家理解该函数的核心功能。接着分析<strong>diff</strong>算法的具体实现。</p><h1 id="patchchildren" tabindex="-1"><a class="header-anchor" href="#patchchildren" aria-hidden="true">#</a> patchChildren</h1><p>我们先来看看<code>patchChildren</code>函数的内部实现：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段1</span>
<span class="token keyword">const</span> patchChildren<span class="token operator">:</span> <span class="token function-variable function">PatchChildrenFn</span> <span class="token operator">=</span> <span class="token punctuation">(</span>
    n1<span class="token punctuation">,</span>
    n2<span class="token punctuation">,</span>
    container<span class="token punctuation">,</span>
    anchor<span class="token punctuation">,</span>
    parentComponent<span class="token punctuation">,</span>
    parentSuspense<span class="token punctuation">,</span>
    isSVG<span class="token punctuation">,</span>
    slotScopeIds<span class="token punctuation">,</span>
    optimized <span class="token operator">=</span> <span class="token boolean">false</span>
  <span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> c1 <span class="token operator">=</span> n1 <span class="token operator">&amp;&amp;</span> n1<span class="token punctuation">.</span>children
    <span class="token keyword">const</span> prevShapeFlag <span class="token operator">=</span> n1 <span class="token operator">?</span> n1<span class="token punctuation">.</span>shapeFlag <span class="token operator">:</span> <span class="token number">0</span>
    <span class="token keyword">const</span> c2 <span class="token operator">=</span> n2<span class="token punctuation">.</span>children

    <span class="token keyword">const</span> <span class="token punctuation">{</span> patchFlag<span class="token punctuation">,</span> shapeFlag <span class="token punctuation">}</span> <span class="token operator">=</span> n2
    <span class="token keyword">if</span> <span class="token punctuation">(</span>patchFlag <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>patchFlag <span class="token operator">&amp;</span> PatchFlags<span class="token punctuation">.</span><span class="token constant">KEYED_FRAGMENT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">patchKeyedChildren</span><span class="token punctuation">(</span>
          c1 <span class="token keyword">as</span> VNode<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
          c2 <span class="token keyword">as</span> VNodeArrayChildren<span class="token punctuation">,</span>
          container<span class="token punctuation">,</span>
          anchor<span class="token punctuation">,</span>
          parentComponent<span class="token punctuation">,</span>
          parentSuspense<span class="token punctuation">,</span>
          isSVG<span class="token punctuation">,</span>
          slotScopeIds<span class="token punctuation">,</span>
          optimized
        <span class="token punctuation">)</span>
        <span class="token keyword">return</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>patchFlag <span class="token operator">&amp;</span> PatchFlags<span class="token punctuation">.</span><span class="token constant">UNKEYED_FRAGMENT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">patchUnkeyedChildren</span><span class="token punctuation">(</span>
          c1 <span class="token keyword">as</span> VNode<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
          c2 <span class="token keyword">as</span> VNodeArrayChildren<span class="token punctuation">,</span>
          container<span class="token punctuation">,</span>
          anchor<span class="token punctuation">,</span>
          parentComponent<span class="token punctuation">,</span>
          parentSuspense<span class="token punctuation">,</span>
          isSVG<span class="token punctuation">,</span>
          slotScopeIds<span class="token punctuation">,</span>
          optimized
        <span class="token punctuation">)</span>
        <span class="token keyword">return</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>shapeFlag <span class="token operator">&amp;</span> ShapeFlags<span class="token punctuation">.</span><span class="token constant">TEXT_CHILDREN</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>prevShapeFlag <span class="token operator">&amp;</span> ShapeFlags<span class="token punctuation">.</span><span class="token constant">ARRAY_CHILDREN</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">unmountChildren</span><span class="token punctuation">(</span>c1 <span class="token keyword">as</span> VNode<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> parentComponent<span class="token punctuation">,</span> parentSuspense<span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>c2 <span class="token operator">!==</span> c1<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">hostSetElementText</span><span class="token punctuation">(</span>container<span class="token punctuation">,</span> c2 <span class="token keyword">as</span> <span class="token builtin">string</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>prevShapeFlag <span class="token operator">&amp;</span> ShapeFlags<span class="token punctuation">.</span><span class="token constant">ARRAY_CHILDREN</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>shapeFlag <span class="token operator">&amp;</span> ShapeFlags<span class="token punctuation">.</span><span class="token constant">ARRAY_CHILDREN</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">patchKeyedChildren</span><span class="token punctuation">(</span>
            c1 <span class="token keyword">as</span> VNode<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
            c2 <span class="token keyword">as</span> VNodeArrayChildren<span class="token punctuation">,</span>
            container<span class="token punctuation">,</span>
            anchor<span class="token punctuation">,</span>
            parentComponent<span class="token punctuation">,</span>
            parentSuspense<span class="token punctuation">,</span>
            isSVG<span class="token punctuation">,</span>
            slotScopeIds<span class="token punctuation">,</span>
            optimized
          <span class="token punctuation">)</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          <span class="token function">unmountChildren</span><span class="token punctuation">(</span>c1 <span class="token keyword">as</span> VNode<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> parentComponent<span class="token punctuation">,</span> parentSuspense<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>prevShapeFlag <span class="token operator">&amp;</span> ShapeFlags<span class="token punctuation">.</span><span class="token constant">TEXT_CHILDREN</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">hostSetElementText</span><span class="token punctuation">(</span>container<span class="token punctuation">,</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>shapeFlag <span class="token operator">&amp;</span> ShapeFlags<span class="token punctuation">.</span><span class="token constant">ARRAY_CHILDREN</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">mountChildren</span><span class="token punctuation">(</span>
            c2 <span class="token keyword">as</span> VNodeArrayChildren<span class="token punctuation">,</span>
            container<span class="token punctuation">,</span>
            anchor<span class="token punctuation">,</span>
            parentComponent<span class="token punctuation">,</span>
            parentSuspense<span class="token punctuation">,</span>
            isSVG<span class="token punctuation">,</span>
            slotScopeIds<span class="token punctuation">,</span>
            optimized
          <span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>代码片段<strong>1</strong>中的逻辑原本是很清晰的，初次看这段代码的朋友可能有些疑惑，不太清楚这里为什么要这么判断，比如第一个条件判断<code>if (patchFlag &gt; 0) {</code>，如果没有这个判断其实也是可以正常工作的，实际上这里更多的是为了优化，源码中的注释<code>fast path</code>说明了原因。另外，关于<code>ShapeFlags.ARRAY_CHILDREN</code>、<code>ShapeFlags.TEXT_CHILDREN</code>的逻辑里面也有好几个<code>if else</code>语句。其实这里表达的含义是很简单的：</p><ol><li>如果新旧<strong>虚拟Node</strong>的子节点都是数组，则执行<code>patchKeyedChildren</code>进行比较和更新；</li><li>如果<strong>旧虚拟Node</strong>的子节点是数组，但<strong>新虚拟Node</strong>的子节点是文本，则卸载<strong>旧虚拟Node</strong>对应的子节点数组，同时将<strong>新虚拟Node</strong>的文本更新到<strong>DOM</strong>元素上；</li><li>如果<strong>新虚拟Node</strong>的子节点既不是数组也不是文本（同时前面也排除了<code>PatchFlags.KEYED_FRAGMENT</code>、<code>PatchFlags.UNKEYED_FRAGMENT</code>），相当于<strong>新虚拟Node</strong>无子节点，而<strong>旧虚拟Node</strong>的子节点是数组，则只需要进行卸载子节点数组即可；</li><li>如果<strong>新虚拟Node</strong>的子节点是数组，而<strong>旧虚拟Node</strong>的子节点是文本，则把文本元素清空，挂载新的子节点数组即可。</li></ol><p>接下来我们来进入<code>patchUnkeyedChildren</code>和<code>patchKeyedChildren</code>两个函数。</p><h1 id="patchunkeyedchildren" tabindex="-1"><a class="header-anchor" href="#patchunkeyedchildren" aria-hidden="true">#</a> patchUnkeyedChildren</h1><p>函数<code>patchUnkeyedChildren</code>的代码片段如下：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段2</span>
<span class="token keyword">const</span> <span class="token function-variable function">patchUnkeyedChildren</span> <span class="token operator">=</span> <span class="token punctuation">(</span>
    c1<span class="token operator">:</span> VNode<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    c2<span class="token operator">:</span> VNodeArrayChildren<span class="token punctuation">,</span>
    container<span class="token operator">:</span> RendererElement<span class="token punctuation">,</span>
    anchor<span class="token operator">:</span> RendererNode <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    parentComponent<span class="token operator">:</span> ComponentInternalInstance <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    parentSuspense<span class="token operator">:</span> SuspenseBoundary <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    isSVG<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">,</span>
    slotScopeIds<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    optimized<span class="token operator">:</span> <span class="token builtin">boolean</span>
  <span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    c1 <span class="token operator">=</span> c1 <span class="token operator">||</span> <span class="token constant">EMPTY_ARR</span>
    c2 <span class="token operator">=</span> c2 <span class="token operator">||</span> <span class="token constant">EMPTY_ARR</span>
    <span class="token keyword">const</span> oldLength <span class="token operator">=</span> c1<span class="token punctuation">.</span>length
    <span class="token keyword">const</span> newLength <span class="token operator">=</span> c2<span class="token punctuation">.</span>length
    <span class="token keyword">const</span> commonLength <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">min</span><span class="token punctuation">(</span>oldLength<span class="token punctuation">,</span> newLength<span class="token punctuation">)</span>
    <span class="token keyword">let</span> i
    <span class="token keyword">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> commonLength<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> nextChild <span class="token operator">=</span> <span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> optimized
        <span class="token operator">?</span> <span class="token function">cloneIfMounted</span><span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token keyword">as</span> VNode<span class="token punctuation">)</span>
        <span class="token operator">:</span> <span class="token function">normalizeVNode</span><span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
      <span class="token function">patch</span><span class="token punctuation">(</span>
        c1<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span>
        nextChild<span class="token punctuation">,</span>
        container<span class="token punctuation">,</span>
        <span class="token keyword">null</span><span class="token punctuation">,</span>
        parentComponent<span class="token punctuation">,</span>
        parentSuspense<span class="token punctuation">,</span>
        isSVG<span class="token punctuation">,</span>
        slotScopeIds<span class="token punctuation">,</span>
        optimized
      <span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>oldLength <span class="token operator">&gt;</span> newLength<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// remove old</span>
      <span class="token function">unmountChildren</span><span class="token punctuation">(</span>
        c1<span class="token punctuation">,</span>
        parentComponent<span class="token punctuation">,</span>
        parentSuspense<span class="token punctuation">,</span>
        <span class="token boolean">true</span><span class="token punctuation">,</span>
        <span class="token boolean">false</span><span class="token punctuation">,</span>
        commonLength
      <span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token comment">// mount new</span>
      <span class="token class-name">mountChildren</span><span class="token punctuation">(</span>
        c2<span class="token punctuation">,</span>
        container<span class="token punctuation">,</span>
        anchor<span class="token punctuation">,</span>
        parentComponent<span class="token punctuation">,</span>
        parentSuspense<span class="token punctuation">,</span>
        isSVG<span class="token punctuation">,</span>
        slotScopeIds<span class="token punctuation">,</span>
        optimized<span class="token punctuation">,</span>
        commonLength
      <span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实该函数最原始的逻辑，应该是卸载所有的旧节点，再挂载所有的新节点。只不过框架作者做了优化，还是尽可能去尝试旧的节点是否能复用，这点值得我们学习。</p><h1 id="patchkeyedchildren" tabindex="-1"><a class="header-anchor" href="#patchkeyedchildren" aria-hidden="true">#</a> patchKeyedChildren</h1><p>大名鼎鼎的<strong>diff</strong>算法，其实就是函数<code>patchKeydChildren</code>里面的逻辑。在进入该函数之前，我们先思考为什么会有<code>patchUnkeyedChildren</code>和<code>patchKeyedChildren</code>两个函数存在，这两者有什么区别？其实最直观的比较，从函数名称可以看出<code>keyed</code>、<code>UnKeyed</code>，其实这两者的区分就是表示子节点是否有<code>key</code>属性来标识。没有<code>key</code>属性，比较起来比较复杂，<strong>Vue3</strong>中有一段这样的逻辑：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段3</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">isSameVNodeType</span><span class="token punctuation">(</span>n1<span class="token operator">:</span> VNode<span class="token punctuation">,</span> n2<span class="token operator">:</span> VNode<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">boolean</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>
    __DEV__ <span class="token operator">&amp;&amp;</span>
    n2<span class="token punctuation">.</span>shapeFlag <span class="token operator">&amp;</span> ShapeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT</span> <span class="token operator">&amp;&amp;</span>
    hmrDirtyComponents<span class="token punctuation">.</span><span class="token function">has</span><span class="token punctuation">(</span>n2<span class="token punctuation">.</span><span class="token keyword">type</span> <span class="token class-name"><span class="token keyword">as</span></span> ConcreteComponent<span class="token punctuation">)</span>
  <span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// HMR only: if the component has been hot-updated, force a reload.</span>
    <span class="token keyword">return</span> <span class="token boolean">false</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> n1<span class="token punctuation">.</span>type <span class="token operator">===</span> n2<span class="token punctuation">.</span>type <span class="token operator">&amp;&amp;</span> n1<span class="token punctuation">.</span>key <span class="token operator">===</span> n2<span class="token punctuation">.</span>key
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果<strong>虚拟Node</strong>没有<code>key</code>属性，则类型相同就认为是同一个节点类型，逻辑上确实没问题，但这样一来，相较于通过<code>key</code>属性值直接区分两者不是同一个元素，<strong>新旧虚拟Node</strong>之间的比较会比较频繁。这也就是为什么建议我们在模版中编写诸如<code>for</code>循环的代码的时候强烈推荐要具备<code>key</code>属性的原因。</p><p>函数<code>patchKeyedChildren</code>的代码比较多，下面分步骤进行讲解，每一步对应的代码单独放出来。</p><h2 id="第1步-头比较" tabindex="-1"><a class="header-anchor" href="#第1步-头比较" aria-hidden="true">#</a> 第1步：头比较</h2><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段4</span>
<span class="token comment">// 1. sync from start</span>
<span class="token comment">// (a b) c</span>
<span class="token comment">// (a b) d e</span>
<span class="token keyword">while</span> <span class="token punctuation">(</span>i <span class="token operator">&lt;=</span> e1 <span class="token operator">&amp;&amp;</span> i <span class="token operator">&lt;=</span> e2<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> n1 <span class="token operator">=</span> c1<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
  <span class="token keyword">const</span> n2 <span class="token operator">=</span> <span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> optimized
    <span class="token operator">?</span> <span class="token function">cloneIfMounted</span><span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token keyword">as</span> VNode<span class="token punctuation">)</span>
    <span class="token operator">:</span> <span class="token function">normalizeVNode</span><span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isSameVNodeType</span><span class="token punctuation">(</span>n1<span class="token punctuation">,</span> n2<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">patch</span><span class="token punctuation">(</span>
      n1<span class="token punctuation">,</span>
      n2<span class="token punctuation">,</span>
      container<span class="token punctuation">,</span>
      <span class="token keyword">null</span><span class="token punctuation">,</span>
      parentComponent<span class="token punctuation">,</span>
      parentSuspense<span class="token punctuation">,</span>
      isSVG<span class="token punctuation">,</span>
      slotScopeIds<span class="token punctuation">,</span>
      optimized
    <span class="token punctuation">)</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token keyword">break</span>
  <span class="token punctuation">}</span>
  i<span class="token operator">++</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>怎么理解这里的代码呢？可以借助下面的示意图理解：</p><p><img src="`+p+`" alt="diff-头比较 (1).jpg"></p><p>假设<strong>新旧虚拟Node</strong>如上图所示，执行完代码片段<strong>4</strong>的逻辑后，则节点<strong>A</strong>执行完<code>patch</code>操作。相当于后续我们不需要再关心<strong>A</strong>节点，其实这算是一种优化行为，是一个不断缩小后续处理范围的过程。</p><h2 id="第2步-尾比较" tabindex="-1"><a class="header-anchor" href="#第2步-尾比较" aria-hidden="true">#</a> 第2步：尾比较</h2><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段5</span>
<span class="token comment">// 2. sync from end</span>
<span class="token comment">// a (b c)</span>
<span class="token comment">// d e (b c)</span>
<span class="token keyword">while</span> <span class="token punctuation">(</span>i <span class="token operator">&lt;=</span> e1 <span class="token operator">&amp;&amp;</span> i <span class="token operator">&lt;=</span> e2<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> n1 <span class="token operator">=</span> c1<span class="token punctuation">[</span>e1<span class="token punctuation">]</span>
  <span class="token keyword">const</span> n2 <span class="token operator">=</span> <span class="token punctuation">(</span>c2<span class="token punctuation">[</span>e2<span class="token punctuation">]</span> <span class="token operator">=</span> optimized
    <span class="token operator">?</span> <span class="token function">cloneIfMounted</span><span class="token punctuation">(</span>c2<span class="token punctuation">[</span>e2<span class="token punctuation">]</span> <span class="token keyword">as</span> VNode<span class="token punctuation">)</span>
    <span class="token operator">:</span> <span class="token function">normalizeVNode</span><span class="token punctuation">(</span>c2<span class="token punctuation">[</span>e2<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isSameVNodeType</span><span class="token punctuation">(</span>n1<span class="token punctuation">,</span> n2<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">patch</span><span class="token punctuation">(</span>
      n1<span class="token punctuation">,</span>
      n2<span class="token punctuation">,</span>
      container<span class="token punctuation">,</span>
      <span class="token keyword">null</span><span class="token punctuation">,</span>
      parentComponent<span class="token punctuation">,</span>
      parentSuspense<span class="token punctuation">,</span>
      isSVG<span class="token punctuation">,</span>
      slotScopeIds<span class="token punctuation">,</span>
      optimized
    <span class="token punctuation">)</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token keyword">break</span>
  <span class="token punctuation">}</span>
  e1<span class="token operator">--</span>
  e2<span class="token operator">--</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>假设<strong>新旧虚拟Node</strong>如上图所示，执行完代码片段<strong>5</strong>的逻辑后，则节点<strong>F</strong>执行完<code>patch</code>操作。相当于后续我们不需要再关心<strong>F</strong>节点，这和头比较一样也是一种优化行为，不断缩小后续处理范围。</p><h2 id="第3步-相同序列-挂载" tabindex="-1"><a class="header-anchor" href="#第3步-相同序列-挂载" aria-hidden="true">#</a> 第3步：相同序列 + 挂载</h2><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段6</span>
<span class="token comment">// 3. common sequence + mount</span>
<span class="token comment">// (a b)</span>
<span class="token comment">// (a b) c</span>
<span class="token comment">// i = 2, e1 = 1, e2 = 2</span>
<span class="token comment">// (a b)</span>
<span class="token comment">// c (a b)</span>
<span class="token comment">// i = 0, e1 = -1, e2 = 0</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">&gt;</span> e1<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">&lt;=</span> e2<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> nextPos <span class="token operator">=</span> e2 <span class="token operator">+</span> <span class="token number">1</span>
    <span class="token keyword">const</span> anchor <span class="token operator">=</span> nextPos <span class="token operator">&lt;</span> l2 <span class="token operator">?</span> <span class="token punctuation">(</span>c2<span class="token punctuation">[</span>nextPos<span class="token punctuation">]</span> <span class="token keyword">as</span> VNode<span class="token punctuation">)</span><span class="token punctuation">.</span>el <span class="token operator">:</span> parentAnchor
    <span class="token keyword">while</span> <span class="token punctuation">(</span>i <span class="token operator">&lt;=</span> e2<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">patch</span><span class="token punctuation">(</span>
        <span class="token keyword">null</span><span class="token punctuation">,</span>
        <span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> optimized
          <span class="token operator">?</span> <span class="token function">cloneIfMounted</span><span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token keyword">as</span> VNode<span class="token punctuation">)</span>
          <span class="token operator">:</span> <span class="token function">normalizeVNode</span><span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        container<span class="token punctuation">,</span>
        anchor<span class="token punctuation">,</span>
        parentComponent<span class="token punctuation">,</span>
        parentSuspense<span class="token punctuation">,</span>
        isSVG<span class="token punctuation">,</span>
        slotScopeIds<span class="token punctuation">,</span>
        optimized
      <span class="token punctuation">)</span>
      i<span class="token operator">++</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>假设我们目前的新旧节点如下图所示：</p><p><img src="`+t+`" alt="diff-同序 + 挂载.jpg"></p><p>执行完代码片段<strong>6</strong>的代码后，相当于，会把多余的新节点<code>E</code>,<code>F</code>进行挂载操作。</p><h2 id="第4步-相同序列-卸载" tabindex="-1"><a class="header-anchor" href="#第4步-相同序列-卸载" aria-hidden="true">#</a> 第4步：相同序列 + 卸载</h2><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段7</span>
<span class="token comment">// 4. common sequence + unmount</span>
<span class="token comment">// (a b) c</span>
<span class="token comment">// (a b)</span>
<span class="token comment">// i = 2, e1 = 2, e2 = 1</span>
<span class="token comment">// a (b c)</span>
<span class="token comment">// (b c)</span>
<span class="token comment">// i = 0, e1 = 0, e2 = -1</span>
<span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">&gt;</span> e2<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>i <span class="token operator">&lt;=</span> e1<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">unmount</span><span class="token punctuation">(</span>c1<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> parentComponent<span class="token punctuation">,</span> parentSuspense<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>
    i<span class="token operator">++</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所谓相同<strong>序列 + 卸载</strong>，如下图所示：</p><p><img src="`+o+`" alt="diff-同序 + 卸载.jpg"> 执行完片段<strong>7</strong>的代码后，<code>E</code>和<code>F</code>节点将会被卸载。</p><h2 id="第5步-乱序" tabindex="-1"><a class="header-anchor" href="#第5步-乱序" aria-hidden="true">#</a> 第5步：乱序</h2><p>前面<strong>4</strong>步都是为了提升性能而做的特殊处理，实际上如果不做前面<strong>4</strong>步工作，程序也是可以正常运行的。对于乱序序列的节点，可以分为下面<strong>3</strong>个步骤处理：</p><h3 id="_5-1-记录新节点的key属性值和索引值的对应关系" tabindex="-1"><a class="header-anchor" href="#_5-1-记录新节点的key属性值和索引值的对应关系" aria-hidden="true">#</a> 5.1 记录新节点的Key属性值和索引值的对应关系</h3><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段8</span>
<span class="token keyword">const</span> keyToNewIndexMap<span class="token operator">:</span> Map<span class="token operator">&lt;</span><span class="token builtin">string</span> <span class="token operator">|</span> <span class="token builtin">number</span> <span class="token operator">|</span> <span class="token builtin">symbol</span><span class="token punctuation">,</span> <span class="token builtin">number</span><span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> s2<span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> e2<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> nextChild <span class="token operator">=</span> <span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> optimized
      <span class="token operator">?</span> <span class="token function">cloneIfMounted</span><span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token keyword">as</span> VNode<span class="token punctuation">)</span>
      <span class="token operator">:</span> <span class="token function">normalizeVNode</span><span class="token punctuation">(</span>c2<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>nextChild<span class="token punctuation">.</span>key <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>__DEV__ <span class="token operator">&amp;&amp;</span> keyToNewIndexMap<span class="token punctuation">.</span><span class="token function">has</span><span class="token punctuation">(</span>nextChild<span class="token punctuation">.</span>key<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">warn</span><span class="token punctuation">(</span>
          <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Duplicate keys found during update:</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span>
          <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>nextChild<span class="token punctuation">.</span>key<span class="token punctuation">)</span><span class="token punctuation">,</span>
          <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Make sure keys are unique.</span><span class="token template-punctuation string">\`</span></span>
        <span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
      keyToNewIndexMap<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>nextChild<span class="token punctuation">.</span>key<span class="token punctuation">,</span> i<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>代码片段<strong>8</strong>利用<code>keyToNewIndexMap</code>比变量存储了所有新节点的Key属性值和索引值的对应关系。</p><h3 id="_5-2-卸载不需要的旧节点-对匹配的新旧节点进行更新" tabindex="-1"><a class="header-anchor" href="#_5-2-卸载不需要的旧节点-对匹配的新旧节点进行更新" aria-hidden="true">#</a> 5.2 卸载不需要的旧节点，对匹配的新旧节点进行更新</h3><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段9</span>
<span class="token comment">// 5.2 loop through old children left to be patched and try to patch</span>
  <span class="token comment">// matching nodes &amp; remove nodes that are no longer present</span>
  <span class="token keyword">let</span> j
  <span class="token keyword">let</span> patched <span class="token operator">=</span> <span class="token number">0</span>
  <span class="token keyword">const</span> toBePatched <span class="token operator">=</span> e2 <span class="token operator">-</span> s2 <span class="token operator">+</span> <span class="token number">1</span>
  <span class="token keyword">let</span> moved <span class="token operator">=</span> <span class="token boolean">false</span>
  <span class="token comment">// used to track whether any node has moved</span>
  <span class="token keyword">let</span> maxNewIndexSoFar <span class="token operator">=</span> <span class="token number">0</span>
  <span class="token comment">// works as Map&lt;newIndex, oldIndex&gt;</span>
  <span class="token comment">// Note that oldIndex is offset by +1</span>
  <span class="token comment">// and oldIndex = 0 is a special value indicating the new node has</span>
  <span class="token comment">// no corresponding old node.</span>
  <span class="token comment">// used for determining longest stable subsequence</span>
  <span class="token keyword">const</span> newIndexToOldIndexMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name"><span class="token builtin">Array</span></span><span class="token punctuation">(</span>toBePatched<span class="token punctuation">)</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> toBePatched<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> newIndexToOldIndexMap<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">0</span>

  <span class="token keyword">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> s1<span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> e1<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> prevChild <span class="token operator">=</span> c1<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>patched <span class="token operator">&gt;=</span> toBePatched<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// all new children have been patched so this can only be a removal</span>
      <span class="token function">unmount</span><span class="token punctuation">(</span>prevChild<span class="token punctuation">,</span> parentComponent<span class="token punctuation">,</span> parentSuspense<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>
      <span class="token keyword">continue</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">let</span> newIndex
    <span class="token keyword">if</span> <span class="token punctuation">(</span>prevChild<span class="token punctuation">.</span>key <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      newIndex <span class="token operator">=</span> keyToNewIndexMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>prevChild<span class="token punctuation">.</span>key<span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token comment">// key-less node, try to locate a key-less node of the same type</span>
      <span class="token class-name"><span class="token keyword">for</span></span> <span class="token punctuation">(</span>j <span class="token operator">=</span> s2<span class="token punctuation">;</span> j <span class="token operator">&lt;=</span> e2<span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>
          newIndexToOldIndexMap<span class="token punctuation">[</span>j <span class="token operator">-</span> s2<span class="token punctuation">]</span> <span class="token operator">===</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span>
          <span class="token function">isSameVNodeType</span><span class="token punctuation">(</span>prevChild<span class="token punctuation">,</span> c2<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token keyword">as</span> VNode<span class="token punctuation">)</span>
        <span class="token punctuation">)</span> <span class="token punctuation">{</span>
          newIndex <span class="token operator">=</span> j
          <span class="token keyword">break</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>newIndex <span class="token operator">===</span> <span class="token keyword">undefined</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">unmount</span><span class="token punctuation">(</span>prevChild<span class="token punctuation">,</span> parentComponent<span class="token punctuation">,</span> parentSuspense<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      newIndexToOldIndexMap<span class="token punctuation">[</span>newIndex <span class="token operator">-</span> s2<span class="token punctuation">]</span> <span class="token operator">=</span> i <span class="token operator">+</span> <span class="token number">1</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>newIndex <span class="token operator">&gt;=</span> maxNewIndexSoFar<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        maxNewIndexSoFar <span class="token operator">=</span> newIndex
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        moved <span class="token operator">=</span> <span class="token boolean">true</span>
      <span class="token punctuation">}</span>
      <span class="token function">patch</span><span class="token punctuation">(</span>
        prevChild<span class="token punctuation">,</span>
        c2<span class="token punctuation">[</span>newIndex<span class="token punctuation">]</span> <span class="token keyword">as</span> VNode<span class="token punctuation">,</span>
        container<span class="token punctuation">,</span>
        <span class="token keyword">null</span><span class="token punctuation">,</span>
        parentComponent<span class="token punctuation">,</span>
        parentSuspense<span class="token punctuation">,</span>
        isSVG<span class="token punctuation">,</span>
        slotScopeIds<span class="token punctuation">,</span>
        optimized
      <span class="token punctuation">)</span>
      patched<span class="token operator">++</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>代码片段<strong>9</strong>主要完成了下面几项工作：</p><ol><li>遍历旧的子节点序列，卸载那些和所有新节点都不是相同节点的旧节点；</li><li>如果新旧节点是相同节点（<strong>key</strong>属性值相同或者<code>isSameVNodeType</code>为<code>true</code>）则调用<code>patch</code>函数进行更新操作；</li><li>利用变量<code>newIndexToOldIndexMap</code>存储新节点的索引值和对应旧节点的索引值的关系。</li></ol><h3 id="_5-3-对已经更新过的旧节点进行排序并挂载新节点" tabindex="-1"><a class="header-anchor" href="#_5-3-对已经更新过的旧节点进行排序并挂载新节点" aria-hidden="true">#</a> 5.3 对已经更新过的旧节点进行排序并挂载新节点</h3><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段10</span>
<span class="token comment">// 5.3 move and mount</span>
  <span class="token comment">// generate longest stable subsequence only when nodes have moved</span>
  <span class="token keyword">const</span> increasingNewIndexSequence <span class="token operator">=</span> moved
    <span class="token operator">?</span> <span class="token function">getSequence</span><span class="token punctuation">(</span>newIndexToOldIndexMap<span class="token punctuation">)</span>
    <span class="token operator">:</span> <span class="token constant">EMPTY_ARR</span>
  j <span class="token operator">=</span> increasingNewIndexSequence<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span>
  <span class="token comment">// looping backwards so that we can use last patched node as anchor</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> toBePatched <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&gt;=</span> <span class="token number">0</span><span class="token punctuation">;</span> i<span class="token operator">--</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> nextIndex <span class="token operator">=</span> s2 <span class="token operator">+</span> i
    <span class="token keyword">const</span> nextChild <span class="token operator">=</span> c2<span class="token punctuation">[</span>nextIndex<span class="token punctuation">]</span> <span class="token keyword">as</span> VNode
    <span class="token keyword">const</span> anchor <span class="token operator">=</span>
      nextIndex <span class="token operator">+</span> <span class="token number">1</span> <span class="token operator">&lt;</span> l2 <span class="token operator">?</span> <span class="token punctuation">(</span>c2<span class="token punctuation">[</span>nextIndex <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span> <span class="token keyword">as</span> VNode<span class="token punctuation">)</span><span class="token punctuation">.</span>el <span class="token operator">:</span> parentAnchor
    <span class="token keyword">if</span> <span class="token punctuation">(</span>newIndexToOldIndexMap<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// mount new</span>
      <span class="token class-name">patch</span><span class="token punctuation">(</span>
        <span class="token keyword">null</span><span class="token punctuation">,</span>
        nextChild<span class="token punctuation">,</span>
        container<span class="token punctuation">,</span>
        anchor<span class="token punctuation">,</span>
        parentComponent<span class="token punctuation">,</span>
        parentSuspense<span class="token punctuation">,</span>
        isSVG<span class="token punctuation">,</span>
        slotScopeIds<span class="token punctuation">,</span>
        optimized
      <span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>moved<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// move if:</span>
      <span class="token comment">// There is no stable subsequence (e.g. a reverse)</span>
      <span class="token comment">// OR current node is not among the stable sequence</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>j <span class="token operator">&lt;</span> <span class="token number">0</span> <span class="token operator">||</span> i <span class="token operator">!==</span> increasingNewIndexSequence<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">move</span><span class="token punctuation">(</span>nextChild<span class="token punctuation">,</span> container<span class="token punctuation">,</span> anchor<span class="token punctuation">,</span> MoveType<span class="token punctuation">.</span><span class="token constant">REORDER</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        j<span class="token operator">--</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>代码片段<strong>10</strong>根据变量<code>newIndexToOldIndexMap</code>保存的<strong>新旧虚拟Node</strong>的索引之间的关系，调用<code>getSequence</code>函数获取最长递增子序列。然后保持最长递增子序列对应的元素不动，移动其他已经更新获得旧元素或者挂载新元素，完成所有子节点的更新。</p><h4 id="getsequence" tabindex="-1"><a class="header-anchor" href="#getsequence" aria-hidden="true">#</a> getSequence</h4><p>这里需要知道什么叫最长递增子序列，结合<strong>diff</strong>算法的实际场景：</p><table><thead><tr><th>元素1</th><th>元素2</th><th>元素3</th><th>元素4</th><th>元素5</th><th>元素6</th><th>含义</th></tr></thead><tbody><tr><td>0</td><td></td><td>2</td><td>3</td><td></td><td>5</td><td>旧元素序列可复用元素的索引值</td></tr><tr><td><strong>2</strong></td><td><strong>3</strong></td><td><strong>0</strong></td><td>无</td><td><strong>5</strong></td><td>无</td><td>新元素序列对应的旧元素的索引值</td></tr><tr><td>2</td><td>3</td><td>5</td><td></td><td></td><td></td><td>最长递增子序列</td></tr></tbody></table><p>从上表中我们得出的最长递增子序列是<code>2</code>、<code>3</code>、<code>5</code>，后续可以对旧元素序列中的索引为<code>2</code>、<code>3</code>、<code>5</code>的元素位置不变，将新元素序列中索引为<code>2</code>、<code>3</code>的元素插入到索引值为<code>5</code>对应的旧元素左边，把新元素序列中索引为<code>5</code>的元素插入到索引值为<code>5</code>对应的旧元素的右边，就以最小代价(移动和挂载的操作次数最少)完成了所有新旧元素序列的更新。</p><p>下面是最长递增子序列的代码实现，是一个纯粹的算法问题，朋友们可以在<strong>leetcode</strong>查阅相关题解，可能和这里有些出入，但是总体实现思路应该大致相同。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段11</span>
<span class="token comment">// https://en.wikipedia.org/wiki/Longest_increasing_subsequence</span>
<span class="token keyword">function</span> <span class="token function">getSequence</span><span class="token punctuation">(</span>arr<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> p <span class="token operator">=</span> arr<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>
  <span class="token keyword">let</span> i<span class="token punctuation">,</span> j<span class="token punctuation">,</span> u<span class="token punctuation">,</span> v<span class="token punctuation">,</span> c
  <span class="token keyword">const</span> len <span class="token operator">=</span> arr<span class="token punctuation">.</span>length
  <span class="token keyword">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> arrI <span class="token operator">=</span> arr<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>arrI <span class="token operator">!==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      j <span class="token operator">=</span> result<span class="token punctuation">[</span>result<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>arr<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">&lt;</span> arrI<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        p<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> j
        result<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span>
        <span class="token keyword">continue</span>
      <span class="token punctuation">}</span>
      u <span class="token operator">=</span> <span class="token number">0</span>
      v <span class="token operator">=</span> result<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span>
      <span class="token keyword">while</span> <span class="token punctuation">(</span>u <span class="token operator">&lt;</span> v<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        c <span class="token operator">=</span> <span class="token punctuation">(</span>u <span class="token operator">+</span> v<span class="token punctuation">)</span> <span class="token operator">&gt;&gt;</span> <span class="token number">1</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>arr<span class="token punctuation">[</span>result<span class="token punctuation">[</span>c<span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&lt;</span> arrI<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          u <span class="token operator">=</span> c <span class="token operator">+</span> <span class="token number">1</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          v <span class="token operator">=</span> c
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>arrI <span class="token operator">&lt;</span> arr<span class="token punctuation">[</span>result<span class="token punctuation">[</span>u<span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>u <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          p<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> result<span class="token punctuation">[</span>u <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span>
        <span class="token punctuation">}</span>
        result<span class="token punctuation">[</span>u<span class="token punctuation">]</span> <span class="token operator">=</span> i
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  u <span class="token operator">=</span> result<span class="token punctuation">.</span>length
  v <span class="token operator">=</span> result<span class="token punctuation">[</span>u <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>u<span class="token operator">--</span> <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    result<span class="token punctuation">[</span>u<span class="token punctuation">]</span> <span class="token operator">=</span> v
    v <span class="token operator">=</span> p<span class="token punctuation">[</span>v<span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> result
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="写在最后" tabindex="-1"><a class="header-anchor" href="#写在最后" aria-hidden="true">#</a> 写在最后</h2><p>读完文章觉得有收获的朋友们，可以做下面几件事情支持：</p><ul><li>如果<code>点赞，点在看，转发</code>可以让文章帮助到更多需要帮助的人；</li><li>如果是微信公众号的作者，可以找我开通<code>白名单</code>，<code>转载</code>我的原创文章；</li></ul><p>最后，请朋友们关注我的<code>微信公众号: 杨艺韬</code>，可以获取我的最新动态。</p>`,58),l=[i];function u(d,r){return s(),a("div",null,l)}const v=n(c,[["render",u],["__file","10.名动江湖的diff算法.html.vue"]]);export{v as default};
