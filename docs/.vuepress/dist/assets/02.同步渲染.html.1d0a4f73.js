import{_ as n,o as s,c as a,f as e}from"./app.03bf752b.js";const t={},p=e(`<h1 id="_02-同步渲染" tabindex="-1"><a class="header-anchor" href="#_02-同步渲染" aria-hidden="true">#</a> 02.同步渲染</h1><h2 id="react-reconciler-src-reactfibersynctaskqueue-js" tabindex="-1"><a class="header-anchor" href="#react-reconciler-src-reactfibersynctaskqueue-js" aria-hidden="true">#</a> react-reconciler/src/ReactFiberSyncTaskQueue.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> DiscreteEventPriority<span class="token punctuation">,</span> getCurrentUpdatePriority<span class="token punctuation">,</span> setCurrentUpdatePriority <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactEventPriorities&quot;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/** 同步队列 */</span>
<span class="token keyword">let</span> syncQueue <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 是否正在执行同步队列 */</span>
<span class="token keyword">let</span> isFlushingSyncQueue <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 安排同步回调函数。
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Function<span class="token punctuation">}</span></span> <span class="token parameter">callback</span> - 要调度的回调函数。
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">scheduleSyncCallback</span><span class="token punctuation">(</span><span class="token parameter">callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>syncQueue <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    syncQueue <span class="token operator">=</span> <span class="token punctuation">[</span>callback<span class="token punctuation">]</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    syncQueue<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>callback<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 执行并清空同步回调函数队列。
 * 这个函数会在同步模式下执行队列中的所有回调，并在完成后恢复之前的更新优先级。
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">flushSyncCallbacks</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>isFlushingSyncQueue <span class="token operator">&amp;&amp;</span> syncQueue <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    isFlushingSyncQueue <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token doc-comment comment">/** 暂存当前的更新优先级 */</span>
    <span class="token keyword">const</span> previousUpdatePriority <span class="token operator">=</span> <span class="token function">getCurrentUpdatePriority</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> isSync <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
      <span class="token keyword">const</span> queue <span class="token operator">=</span> syncQueue<span class="token punctuation">;</span>
      <span class="token doc-comment comment">/** 把优先级设置为同步优先级 */</span>
      <span class="token function">setCurrentUpdatePriority</span><span class="token punctuation">(</span>DiscreteEventPriority<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> queue<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">let</span> callback <span class="token operator">=</span> queue<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token keyword">do</span> <span class="token punctuation">{</span>
          callback <span class="token operator">=</span> <span class="token function">callback</span><span class="token punctuation">(</span>isSync<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">while</span> <span class="token punctuation">(</span>callback <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
      syncQueue <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
      <span class="token function">setCurrentUpdatePriority</span><span class="token punctuation">(</span>previousUpdatePriority<span class="token punctuation">)</span><span class="token punctuation">;</span>
      isFlushingSyncQueue <span class="token operator">=</span> <span class="token boolean">false</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>function ensureRootIsScheduled(root) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> const nextLanes = getNextLanes(root, NoLanes);
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  if (nextLanes === NoLanes) {
</span><span class="token prefix inserted">+</span><span class="token line">    return;
</span><span class="token prefix inserted">+</span><span class="token line">  }
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> let newCallbackPriority = getHighestPriorityLane(nextLanes);
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  let newCallbackNode;
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> if (newCallbackPriority === SyncLane) {
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">    scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
</span><span class="token prefix inserted">+</span><span class="token line">    queueMicrotask(flushSyncCallbacks);
</span><span class="token prefix inserted">+</span><span class="token line">    newCallbackNode = null;
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> }
</span><span class="token prefix unchanged"> </span><span class="token line"> ...
</span></span>}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">performSyncWorkOnRoot</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> lanes <span class="token operator">=</span> <span class="token function">getNextLanes</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">renderRootSync</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> lanes<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> finishedWork <span class="token operator">=</span> root<span class="token punctuation">.</span>current<span class="token punctuation">.</span>alternate<span class="token punctuation">;</span>
  root<span class="token punctuation">.</span>finishedWork <span class="token operator">=</span> finishedWork<span class="token punctuation">;</span>
  <span class="token function">commitRoot</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),c=[p];function o(i,l){return s(),a("div",null,c)}const r=n(t,[["render",o],["__file","02.同步渲染.html.vue"]]);export{r as default};
