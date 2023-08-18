import{_ as n,o as s,c as a,f as e}from"./app.00462568.js";const t={},p=e(`<h1 id="_03-reactfiberlane与reacteventpriority-md" tabindex="-1"><a class="header-anchor" href="#_03-reactfiberlane与reacteventpriority-md" aria-hidden="true">#</a> 03.ReactFiberLane与ReactEventPriority.md</h1><h2 id="react-reconciler-src-reacteventpriorities-js" tabindex="-1"><a class="header-anchor" href="#react-reconciler-src-reacteventpriorities-js" aria-hidden="true">#</a> react-reconciler/src/ReactEventPriorities.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>
  NoLane<span class="token punctuation">,</span> SyncLane<span class="token punctuation">,</span> InputContinuousLane<span class="token punctuation">,</span> DefaultLane<span class="token punctuation">,</span> IdleLane<span class="token punctuation">,</span>
  getHighestPriorityLane<span class="token punctuation">,</span> includesNonIdleWork
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./ReactFiberLane&#39;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/** 离散事件优先级，与SyncLane相关联 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> DiscreteEventPriority <span class="token operator">=</span> SyncLane<span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 连续事件优先级，与InputContinuousLane相关联 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> ContinuousEventPriority <span class="token operator">=</span> InputContinuousLane<span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 默认事件优先级，与DefaultLane相关联 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> DefaultEventPriority <span class="token operator">=</span> DefaultLane<span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 空闲事件优先级，与IdleLane相关联 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> IdleEventPriority <span class="token operator">=</span> IdleLane<span class="token punctuation">;</span>

<span class="token doc-comment comment">/** 当前更新优先级值 */</span>
<span class="token keyword">let</span> currentUpdatePriority <span class="token operator">=</span> NoLane<span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 获取当前更新优先级。
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> 当前更新优先级。
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">getCurrentUpdatePriority</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> currentUpdatePriority<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 设置当前更新优先级。
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">newPriority</span> - 要设置的新优先级。
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">setCurrentUpdatePriority</span><span class="token punctuation">(</span><span class="token parameter">newPriority</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  currentUpdatePriority <span class="token operator">=</span> newPriority<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 判断事件优先级是否高于（数值更小）车道。
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">eventPriority</span> - 要比较的事件优先级。
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">lane</span> - 要与之比较的车道值。
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>boolean<span class="token punctuation">}</span></span> 如果事件优先级更高则返回真；否则返回假。
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">isHigherEventPriority</span><span class="token punctuation">(</span><span class="token parameter">eventPriority<span class="token punctuation">,</span> lane</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>eventPriority <span class="token operator">!==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> eventPriority <span class="token operator">&lt;</span> lane<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 将车道转换为事件优先级。
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">lanes</span> - 车道值。
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> 与车道相对应的事件优先级。
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">lanesToEventPriority</span><span class="token punctuation">(</span><span class="token parameter">lanes</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> lane <span class="token operator">=</span> <span class="token function">getHighestPriorityLane</span><span class="token punctuation">(</span>lanes<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">isHigherEventPriority</span><span class="token punctuation">(</span>DiscreteEventPriority<span class="token punctuation">,</span> lane<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> DiscreteEventPriority<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">isHigherEventPriority</span><span class="token punctuation">(</span>ContinuousEventPriority<span class="token punctuation">,</span> lane<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> ContinuousEventPriority<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">includesNonIdleWork</span><span class="token punctuation">(</span>lane<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> DefaultEventPriority<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> IdleEventPriority<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="react-reconciler-src-reactfiberlane-js" tabindex="-1"><a class="header-anchor" href="#react-reconciler-src-reactfiberlane-js" aria-hidden="true">#</a> react-reconciler/src/ReactFiberLane.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> allowConcurrentByDefault <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;shared/ReactFeatureFlags&#39;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/** 总车道数量 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> TotalLanes <span class="token operator">=</span> <span class="token number">31</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 无车道 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> NoLanes <span class="token operator">=</span> <span class="token number">0b0000000000000000000000000000000</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 无车道 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> NoLane <span class="token operator">=</span> <span class="token number">0b0000000000000000000000000000000</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 同步车道 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> SyncLane <span class="token operator">=</span> <span class="token number">0b0000000000000000000000000000001</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 输入连续水合车道 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> InputContinuousHydrationLane <span class="token operator">=</span> <span class="token number">0b0000000000000000000000000000010</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 输入连续车道 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> InputContinuousLane <span class="token operator">=</span> <span class="token number">0b0000000000000000000000000000100</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 默认水合车道 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> DefaultHydrationLane <span class="token operator">=</span> <span class="token number">0b0000000000000000000000000001000</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 默认车道 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> DefaultLane <span class="token operator">=</span> <span class="token number">0b0000000000000000000000000010000</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 选择性水合车道 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> SelectiveHydrationLane <span class="token operator">=</span> <span class="token number">0b0001000000000000000000000000000</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 空闲水合车道 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> IdleHydrationLane <span class="token operator">=</span> <span class="token number">0b0010000000000000000000000000000</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 空闲车道 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> IdleLane <span class="token operator">=</span> <span class="token number">0b0100000000000000000000000000000</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 屏幕外车道 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> OffscreenLane <span class="token operator">=</span> <span class="token number">0b1000000000000000000000000000000</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 非空闲车道 */</span>
<span class="token keyword">const</span> NonIdleLanes <span class="token operator">=</span> <span class="token number">0b0001111111111111111111111111111</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 标记根节点更新
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>object<span class="token punctuation">}</span></span> <span class="token parameter">root</span> - 根节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">updateLane</span> - 更新的车道
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">markRootUpdated</span><span class="token punctuation">(</span><span class="token parameter">root<span class="token punctuation">,</span> updateLane</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  root<span class="token punctuation">.</span>pendingLanes <span class="token operator">|=</span> updateLane<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 获取下一个车道
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>object<span class="token punctuation">}</span></span> <span class="token parameter">root</span> - 根节点
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> 下一个车道
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">getNextLanes</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> pendingLanes <span class="token operator">=</span> root<span class="token punctuation">.</span>pendingLanes<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>pendingLanes <span class="token operator">==</span> NoLanes<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> NoLanes<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">const</span> nextLanes <span class="token operator">=</span> <span class="token function">getHighestPriorityLanes</span><span class="token punctuation">(</span>pendingLanes<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> nextLanes<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 获取最高优先级的车道
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">lanes</span> - 车道
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> 最高优先级的车道
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">getHighestPriorityLanes</span><span class="token punctuation">(</span><span class="token parameter">lanes</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">getHighestPriorityLane</span><span class="token punctuation">(</span>lanes<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 获取最高优先级的车道
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">lanes</span> - 车道
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> 最高优先级的车道
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">getHighestPriorityLane</span><span class="token punctuation">(</span><span class="token parameter">lanes</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> lanes <span class="token operator">&amp;</span> <span class="token operator">-</span>lanes<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 包括非空闲工作
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">lanes</span> - 车道
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>boolean<span class="token punctuation">}</span></span> 如果包括非空闲工作则返回真
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">includesNonIdleWork</span><span class="token punctuation">(</span><span class="token parameter">lanes</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>lanes <span class="token operator">&amp;</span> NonIdleLanes<span class="token punctuation">)</span> <span class="token operator">!==</span> NoLanes<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 是否为车道的子集
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">set</span> - 集合
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">subset</span> - 子集
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>boolean<span class="token punctuation">}</span></span> 如果是子集则返回真
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">isSubsetOfLanes</span><span class="token punctuation">(</span><span class="token parameter">set<span class="token punctuation">,</span> subset</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>set <span class="token operator">&amp;</span> subset<span class="token punctuation">)</span> <span class="token operator">===</span> subset<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 合并车道
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">a</span> - 车道a
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">b</span> - 车道b
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> 合并后的车道
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">mergeLanes</span><span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> a <span class="token operator">|</span> b<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 包括阻塞车道
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>object<span class="token punctuation">}</span></span> <span class="token parameter">root</span> - 根节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">lanes</span> - 车道
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>boolean<span class="token punctuation">}</span></span> 如果包括阻塞车道则返回假
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">includesBlockingLane</span><span class="token punctuation">(</span><span class="token parameter">root<span class="token punctuation">,</span> lanes</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>allowConcurrentByDefault<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">const</span> SyncDefaultLanes <span class="token operator">=</span> InputContinuousLane <span class="token operator">|</span> DefaultLane<span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>lanes <span class="token operator">&amp;</span> SyncDefaultLanes<span class="token punctuation">)</span> <span class="token operator">!==</span> NoLane<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="shared-reactfeatureflags-js" tabindex="-1"><a class="header-anchor" href="#shared-reactfeatureflags-js" aria-hidden="true">#</a> shared/ReactFeatureFlags.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">const</span> allowConcurrentByDefault <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,7),o=[p];function c(l,i){return s(),a("div",null,o)}const u=n(t,[["render",c],["__file","03.任务优先级与事件优先级.html.vue"]]);export{u as default};
