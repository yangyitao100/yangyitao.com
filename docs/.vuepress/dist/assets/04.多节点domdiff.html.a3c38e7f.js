import{_ as n,o as s,c as a,f as p}from"./app.18acec2c.js";const e={},t=p(`<h1 id="_04-多节点-domdiff" tabindex="-1"><a class="header-anchor" href="#_04-多节点-domdiff" aria-hidden="true">#</a> 04.多节点 domdiff</h1><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 设置子fiber节点的位置，并在必要的时候添加Placement标志
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">newFiber</span> 新的子fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">lastPlacedIndex</span> 最后一个被放置的节点的index
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">newIdx</span> 新节点的index
 * <span class="token keyword">@return</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> 返回最后一个被放置的节点的index
 */</span>
<span class="token keyword">function</span> <span class="token function">placeChild</span><span class="token punctuation">(</span><span class="token parameter">newFiber<span class="token punctuation">,</span> lastPlacedIndex<span class="token punctuation">,</span> newIdx</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  newFiber<span class="token punctuation">.</span>index <span class="token operator">=</span> newIdx<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>shouldTrackSideEffects<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> lastPlacedIndex<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">const</span> current <span class="token operator">=</span> newFiber<span class="token punctuation">.</span>alternate<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>current <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> oldIndex <span class="token operator">=</span> current<span class="token punctuation">.</span>index<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>oldIndex <span class="token operator">&lt;</span> lastPlacedIndex<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      newFiber<span class="token punctuation">.</span>flags <span class="token operator">|=</span> Placement<span class="token punctuation">;</span>
      <span class="token keyword">return</span> lastPlacedIndex<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> oldIndex<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    newFiber<span class="token punctuation">.</span>flags <span class="token operator">|=</span> Placement<span class="token punctuation">;</span>
    <span class="token keyword">return</span> lastPlacedIndex<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 更新元素节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">returnFiber</span> 父级fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">current</span> 当前fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">element</span> 新的React元素
 * <span class="token keyword">@return</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> 返回一个更新后的fiber节点
 */</span>
<span class="token keyword">function</span> <span class="token function">updateElement</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> current<span class="token punctuation">,</span> element</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> elementType <span class="token operator">=</span> element<span class="token punctuation">.</span>type<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>current <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>current<span class="token punctuation">.</span>type <span class="token operator">===</span> elementType<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> existing <span class="token operator">=</span> <span class="token function">useFiber</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> element<span class="token punctuation">.</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>
      existing<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
      <span class="token keyword">return</span> existing<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">const</span> created <span class="token operator">=</span> <span class="token function">createFiberFromElement</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span>
  created<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
  <span class="token keyword">return</span> created<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 更新一个slot，如果新的子节点和旧的fiber节点匹配，则返回更新后的fiber节点，否则返回null
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">returnFiber</span> 父级fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token operator">|</span><span class="token keyword">null</span><span class="token punctuation">}</span></span> <span class="token parameter">oldFiber</span> 旧的fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>any<span class="token punctuation">}</span></span> <span class="token parameter">newChild</span> 新的子节点
 * <span class="token keyword">@return</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token operator">|</span><span class="token keyword">null</span><span class="token punctuation">}</span></span> 返回一个更新后的fiber节点，如果新的子节点和旧的fiber节点不匹配，则返回null
 */</span>
<span class="token keyword">function</span> <span class="token function">updateSlot</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> oldFiber<span class="token punctuation">,</span> newChild</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> key <span class="token operator">=</span> oldFiber <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">?</span> oldFiber<span class="token punctuation">.</span>key <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>newChild <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> <span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">&quot;object&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">switch</span> <span class="token punctuation">(</span>newChild<span class="token punctuation">.</span>$$<span class="token keyword">typeof</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">case</span> <span class="token constant">REACT_ELEMENT_TYPE</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>newChild<span class="token punctuation">.</span>key <span class="token operator">===</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">return</span> <span class="token function">updateElement</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> oldFiber<span class="token punctuation">,</span> newChild<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">default</span><span class="token operator">:</span>
        <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 将剩余的子节点映射到一个Map对象中
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token operator">|</span><span class="token keyword">null</span><span class="token punctuation">}</span></span> <span class="token parameter">returnFiber</span> 父级fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token operator">|</span><span class="token keyword">null</span><span class="token punctuation">}</span></span> <span class="token parameter">existingChildren</span> 已经存在的子节点
 * <span class="token keyword">@return</span> <span class="token class-name"><span class="token punctuation">{</span>Map<span class="token operator">|</span><span class="token keyword">null</span><span class="token punctuation">}</span></span> 返回一个Map对象，键是子节点的key，值是子节点的fiber节点
 */</span>
<span class="token keyword">function</span> <span class="token function">mapRemainingChildren</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstChild</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> existingChildren <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> existingChild <span class="token operator">=</span> currentFirstChild<span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>existingChild <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>existingChild<span class="token punctuation">.</span>key <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      existingChildren<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>existingChild<span class="token punctuation">.</span>key<span class="token punctuation">,</span> existingChild<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      existingChildren<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>existingChild<span class="token punctuation">.</span>index<span class="token punctuation">,</span> existingChild<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    existingChild <span class="token operator">=</span> existingChild<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> existingChildren<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token doc-comment comment">/**
 * 如果当前节点是文本节点则复用，否则创建新的文本节点。
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">returnFiber</span> - 父级Fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">current</span> - 当前处理的Fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">textContent</span> - 文本内容
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> 新的或者复用的文本节点
 */</span>
<span class="token keyword">function</span> <span class="token function">updateTextNode</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> current<span class="token punctuation">,</span> textContent</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>current <span class="token operator">===</span> <span class="token keyword">null</span> <span class="token operator">||</span> current<span class="token punctuation">.</span>tag <span class="token operator">!==</span> HostText<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> created <span class="token operator">=</span> <span class="token function">createFiberFromText</span><span class="token punctuation">(</span>textContent<span class="token punctuation">)</span><span class="token punctuation">;</span>
    created<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
    <span class="token keyword">return</span> created<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> existing <span class="token operator">=</span> <span class="token function">useFiber</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> textContent<span class="token punctuation">)</span><span class="token punctuation">;</span>
    existing<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
    <span class="token keyword">return</span> existing<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token doc-comment comment">/**
 * 从现有的子节点映射中更新Fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Map<span class="token punctuation">}</span></span> <span class="token parameter">existingChildren</span> - 现有的子节点映射
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">returnFiber</span> - 父级Fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">newIdx</span> - 新节点的索引
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>any<span class="token punctuation">}</span></span> <span class="token parameter">newChild</span> - 新的子节点
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> 更新后的Fiber节点
 */</span>
<span class="token keyword">function</span> <span class="token function">updateFromMap</span><span class="token punctuation">(</span><span class="token parameter">existingChildren<span class="token punctuation">,</span> returnFiber<span class="token punctuation">,</span> newIdx<span class="token punctuation">,</span> newChild</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>
    <span class="token punctuation">(</span><span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">&quot;string&quot;</span> <span class="token operator">&amp;&amp;</span> newChild <span class="token operator">!==</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">)</span> <span class="token operator">||</span>
    <span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">&quot;number&quot;</span>
  <span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> matchedFiber <span class="token operator">=</span> existingChildren<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>newIdx<span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token function">updateTextNode</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> matchedFiber<span class="token punctuation">,</span> <span class="token string">&quot;&quot;</span> <span class="token operator">+</span> newChild<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">&quot;object&quot;</span> <span class="token operator">&amp;&amp;</span> newChild <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">switch</span> <span class="token punctuation">(</span>newChild<span class="token punctuation">.</span>$$<span class="token keyword">typeof</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">case</span> <span class="token constant">REACT_ELEMENT_TYPE</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> matchedFiber <span class="token operator">=</span>
          existingChildren<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>newChild<span class="token punctuation">.</span>key <span class="token operator">===</span> <span class="token keyword">null</span> <span class="token operator">?</span> newIdx <span class="token operator">:</span> newChild<span class="token punctuation">.</span>key<span class="token punctuation">)</span> <span class="token operator">||</span>
          <span class="token keyword">null</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token function">updateElement</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> matchedFiber<span class="token punctuation">,</span> newChild<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token doc-comment comment">/**
 * 将新的子节点数组与旧的子Fiber进行比较，并返回新的子Fiber
 *
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">returnFiber</span> - 新的父Fiber
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">currentFirstChild</span> - 老fiber第一个子fiber
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">}</span></span> <span class="token parameter">newChildren</span> - 新的子节点数组
 * <span class="token keyword">@return</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> resultingFirstChild - 返回的新的子Fiber
 */</span>
<span class="token keyword">function</span> <span class="token function">reconcileChildrenArray</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstChild<span class="token punctuation">,</span> newChildren</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> resultingFirstChild <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> previousNewFiber <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> newIdx <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> oldFiber <span class="token operator">=</span> currentFirstChild<span class="token punctuation">;</span>
  <span class="token keyword">let</span> nextOldFiber <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> lastPlacedIndex <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span> oldFiber <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> newIdx <span class="token operator">&lt;</span> newChildren<span class="token punctuation">.</span>length<span class="token punctuation">;</span> newIdx<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    nextOldFiber <span class="token operator">=</span> oldFiber<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
    <span class="token keyword">const</span> newFiber <span class="token operator">=</span> <span class="token function">updateSlot</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> oldFiber<span class="token punctuation">,</span> newChildren<span class="token punctuation">[</span>newIdx<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>newFiber <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>shouldTrackSideEffects<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>oldFiber <span class="token operator">&amp;&amp;</span> newFiber<span class="token punctuation">.</span>alternate <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">deleteChild</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> oldFiber<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    lastPlacedIndex <span class="token operator">=</span> <span class="token function">placeChild</span><span class="token punctuation">(</span>newFiber<span class="token punctuation">,</span> lastPlacedIndex<span class="token punctuation">,</span> newIdx<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>previousNewFiber <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      resultingFirstChild <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      previousNewFiber<span class="token punctuation">.</span>sibling <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    previousNewFiber <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
    oldFiber <span class="token operator">=</span> nextOldFiber<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>newIdx <span class="token operator">===</span> newChildren<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">deleteRemainingChildren</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> oldFiber<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> resultingFirstChild<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>oldFiber <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span> newIdx <span class="token operator">&lt;</span> newChildren<span class="token punctuation">.</span>length<span class="token punctuation">;</span> newIdx<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> newFiber <span class="token operator">=</span> <span class="token function">createChild</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> newChildren<span class="token punctuation">[</span>newIdx<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>newFiber <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token keyword">continue</span><span class="token punctuation">;</span>
      lastPlacedIndex <span class="token operator">=</span> <span class="token function">placeChild</span><span class="token punctuation">(</span>newFiber<span class="token punctuation">,</span> lastPlacedIndex<span class="token punctuation">,</span> newIdx<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>previousNewFiber <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        resultingFirstChild <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        previousNewFiber<span class="token punctuation">.</span>sibling <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      previousNewFiber <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">const</span> existingChildren <span class="token operator">=</span> <span class="token function">mapRemainingChildren</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> oldFiber<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span> newIdx <span class="token operator">&lt;</span> newChildren<span class="token punctuation">.</span>length<span class="token punctuation">;</span> newIdx<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> newFiber <span class="token operator">=</span> <span class="token function">updateFromMap</span><span class="token punctuation">(</span>
      existingChildren<span class="token punctuation">,</span>
      returnFiber<span class="token punctuation">,</span>
      newIdx<span class="token punctuation">,</span>
      newChildren<span class="token punctuation">[</span>newIdx<span class="token punctuation">]</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>newFiber <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>shouldTrackSideEffects<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>newFiber<span class="token punctuation">.</span>alternate <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          existingChildren<span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span>
            newFiber<span class="token punctuation">.</span>key <span class="token operator">===</span> <span class="token keyword">null</span> <span class="token operator">?</span> newIdx <span class="token operator">:</span> newFiber<span class="token punctuation">.</span>key
          <span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      lastPlacedIndex <span class="token operator">=</span> <span class="token function">placeChild</span><span class="token punctuation">(</span>newFiber<span class="token punctuation">,</span> lastPlacedIndex<span class="token punctuation">,</span> newIdx<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>previousNewFiber <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        resultingFirstChild <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        previousNewFiber<span class="token punctuation">.</span>sibling <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      previousNewFiber <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>shouldTrackSideEffects<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    existingChildren<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">child</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">deleteChild</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> child<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> resultingFirstChild<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),o=[t];function c(l,i){return s(),a("div",null,o)}const r=n(e,[["render",c],["__file","04.多节点domdiff.html.vue"]]);export{r as default};
