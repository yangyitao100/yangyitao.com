import{_ as n,o as s,c as a,f as e}from"./app.00462568.js";const p={},t=e(`<h1 id="_04-lane模型下的更新队列" tabindex="-1"><a class="header-anchor" href="#_04-lane模型下的更新队列" aria-hidden="true">#</a> 04.lane模型下的更新队列</h1><h2 id="react-reconciler-src-reactfiberclassupdatequeue-js" tabindex="-1"><a class="header-anchor" href="#react-reconciler-src-reactfiberclassupdatequeue-js" aria-hidden="true">#</a> react-reconciler/src/ReactFiberClassUpdateQueue.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> enqueueConcurrentClassUpdate <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberConcurrentUpdates&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> assign <span class="token keyword">from</span> <span class="token string">&quot;shared/assign&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> NoLanes<span class="token punctuation">,</span> mergeLanes<span class="token punctuation">,</span> isSubsetOfLanes <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./ReactFiberLane&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> UpdateState <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 初始化更新队列
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">fiber</span> - 对应的fiber对象
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">initialUpdateQueue</span><span class="token punctuation">(</span><span class="token parameter">fiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> queue <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">baseState</span><span class="token operator">:</span> fiber<span class="token punctuation">.</span>memoizedState<span class="token punctuation">,</span>
    <span class="token literal-property property">firstBaseUpdate</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">lastBaseUpdate</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">shared</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">pending</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  fiber<span class="token punctuation">.</span>updateQueue <span class="token operator">=</span> queue<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 创建更新对象
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">lane</span> - 车道信息
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> update - 返回一个新的更新对象
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createUpdate</span><span class="token punctuation">(</span><span class="token parameter">lane</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> update <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token literal-property property">tag</span><span class="token operator">:</span> UpdateState<span class="token punctuation">,</span> lane<span class="token punctuation">,</span> <span class="token literal-property property">next</span><span class="token operator">:</span> <span class="token keyword">null</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> update<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 将更新加入队列
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">fiber</span> - fiber对象
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">update</span> - 更新对象
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">lane</span> - 车道信息
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> 更新后的fiber对象
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span><span class="token parameter">fiber<span class="token punctuation">,</span> update<span class="token punctuation">,</span> lane</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> updateQueue <span class="token operator">=</span> fiber<span class="token punctuation">.</span>updateQueue<span class="token punctuation">;</span>
  <span class="token keyword">const</span> sharedQueue <span class="token operator">=</span> updateQueue<span class="token punctuation">.</span>shared<span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token function">enqueueConcurrentClassUpdate</span><span class="token punctuation">(</span>fiber<span class="token punctuation">,</span> sharedQueue<span class="token punctuation">,</span> update<span class="token punctuation">,</span> lane<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 处理更新队列
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">workInProgress</span> - 当前工作的fiber
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">nextProps</span> - 下一个属性集合
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">renderLanes</span> - 渲染车道
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">processUpdateQueue</span><span class="token punctuation">(</span><span class="token parameter">workInProgress<span class="token punctuation">,</span> nextProps<span class="token punctuation">,</span> renderLanes</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> queue <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>updateQueue<span class="token punctuation">;</span>
  <span class="token keyword">let</span> firstBaseUpdate <span class="token operator">=</span> queue<span class="token punctuation">.</span>firstBaseUpdate<span class="token punctuation">;</span>
  <span class="token keyword">let</span> lastBaseUpdate <span class="token operator">=</span> queue<span class="token punctuation">.</span>lastBaseUpdate<span class="token punctuation">;</span>
  <span class="token keyword">const</span> pendingQueue <span class="token operator">=</span> queue<span class="token punctuation">.</span>shared<span class="token punctuation">.</span>pending<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>pendingQueue <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    queue<span class="token punctuation">.</span>shared<span class="token punctuation">.</span>pending <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> lastPendingUpdate <span class="token operator">=</span> pendingQueue<span class="token punctuation">;</span>
    <span class="token keyword">const</span> firstPendingUpdate <span class="token operator">=</span> lastPendingUpdate<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    lastPendingUpdate<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>lastBaseUpdate <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      firstBaseUpdate <span class="token operator">=</span> firstPendingUpdate<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      lastBaseUpdate<span class="token punctuation">.</span>next <span class="token operator">=</span> firstPendingUpdate<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    lastBaseUpdate <span class="token operator">=</span> lastPendingUpdate<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>firstBaseUpdate <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> newState <span class="token operator">=</span> queue<span class="token punctuation">.</span>baseState<span class="token punctuation">;</span>
    <span class="token keyword">let</span> newLanes <span class="token operator">=</span> NoLanes<span class="token punctuation">;</span>
    <span class="token keyword">let</span> newBaseState <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">let</span> newFirstBaseUpdate <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">let</span> newLastBaseUpdate <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">let</span> update <span class="token operator">=</span> firstBaseUpdate<span class="token punctuation">;</span>
    <span class="token keyword">do</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> updateLane <span class="token operator">=</span> update<span class="token punctuation">.</span>lane<span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">isSubsetOfLanes</span><span class="token punctuation">(</span>renderLanes<span class="token punctuation">,</span> updateLane<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> clone <span class="token operator">=</span> <span class="token punctuation">{</span>
          <span class="token literal-property property">id</span><span class="token operator">:</span> update<span class="token punctuation">.</span>id<span class="token punctuation">,</span>
          <span class="token literal-property property">lane</span><span class="token operator">:</span> updateLane<span class="token punctuation">,</span>
          <span class="token literal-property property">payload</span><span class="token operator">:</span> update<span class="token punctuation">.</span>payload
        <span class="token punctuation">}</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>newLastBaseUpdate <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          newFirstBaseUpdate <span class="token operator">=</span> newLastBaseUpdate <span class="token operator">=</span> clone<span class="token punctuation">;</span>
          newBaseState <span class="token operator">=</span> newState<span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          newLastBaseUpdate <span class="token operator">=</span> newLastBaseUpdate<span class="token punctuation">.</span>next <span class="token operator">=</span> clone<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        newLanes <span class="token operator">=</span> <span class="token function">mergeLanes</span><span class="token punctuation">(</span>newLanes<span class="token punctuation">,</span> updateLane<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>newLastBaseUpdate <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">const</span> clone <span class="token operator">=</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">id</span><span class="token operator">:</span> update<span class="token punctuation">.</span>id<span class="token punctuation">,</span>
            <span class="token literal-property property">lane</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
            <span class="token literal-property property">payload</span><span class="token operator">:</span> update<span class="token punctuation">.</span>payload
          <span class="token punctuation">}</span><span class="token punctuation">;</span>
          newLastBaseUpdate <span class="token operator">=</span> newLastBaseUpdate<span class="token punctuation">.</span>next <span class="token operator">=</span> clone<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        newState <span class="token operator">=</span> <span class="token function">getStateFromUpdate</span><span class="token punctuation">(</span>update<span class="token punctuation">,</span> newState<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      update <span class="token operator">=</span> update<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">while</span> <span class="token punctuation">(</span>update<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>newLastBaseUpdate<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      newBaseState <span class="token operator">=</span> newState<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    queue<span class="token punctuation">.</span>baseState <span class="token operator">=</span> newBaseState<span class="token punctuation">;</span>
    queue<span class="token punctuation">.</span>firstBaseUpdate <span class="token operator">=</span> newFirstBaseUpdate<span class="token punctuation">;</span>
    queue<span class="token punctuation">.</span>lastBaseUpdate <span class="token operator">=</span> newLastBaseUpdate<span class="token punctuation">;</span>
    workInProgress<span class="token punctuation">.</span>lanes <span class="token operator">=</span> newLanes<span class="token punctuation">;</span>
    workInProgress<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> newState<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 根据更新计算新状态
 * <span class="token keyword">@private</span>
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">update</span> - 更新对象
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">prevState</span> - 上一个状态
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">nextProps</span> - 下一个属性集合
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> 新的状态
 */</span>
<span class="token keyword">function</span> <span class="token function">getStateFromUpdate</span><span class="token punctuation">(</span><span class="token parameter">update<span class="token punctuation">,</span> prevState<span class="token punctuation">,</span> nextProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>update<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">UpdateState</span><span class="token operator">:</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span> payload <span class="token punctuation">}</span> <span class="token operator">=</span> update<span class="token punctuation">;</span>
      <span class="token keyword">let</span> partialState<span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> payload <span class="token operator">===</span> <span class="token string">&#39;function&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        partialState <span class="token operator">=</span> <span class="token function">payload</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> prevState<span class="token punctuation">,</span> nextProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        partialState <span class="token operator">=</span> payload<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">return</span> <span class="token function">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> prevState<span class="token punctuation">,</span> partialState<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 克隆更新队列
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">current</span> - 当前状态下的fiber对象
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">workInProgress</span> - 正在工作的fiber对象
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">cloneUpdateQueue</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> workInProgressQueue <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>updateQueue<span class="token punctuation">;</span>
  <span class="token keyword">const</span> currentQueue <span class="token operator">=</span> current<span class="token punctuation">.</span>updateQueue<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>currentQueue <span class="token operator">===</span> workInProgressQueue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> clone <span class="token operator">=</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">baseState</span><span class="token operator">:</span> currentQueue<span class="token punctuation">.</span>baseState<span class="token punctuation">,</span>
      <span class="token literal-property property">firstBaseUpdate</span><span class="token operator">:</span> currentQueue<span class="token punctuation">.</span>firstBaseUpdate<span class="token punctuation">,</span>
      <span class="token literal-property property">lastBaseUpdate</span><span class="token operator">:</span> currentQueue<span class="token punctuation">.</span>lastBaseUpdate<span class="token punctuation">,</span>
      <span class="token literal-property property">shared</span><span class="token operator">:</span> currentQueue<span class="token punctuation">.</span>shared
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    workInProgress<span class="token punctuation">.</span>updateQueue <span class="token operator">=</span> clone<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="react-reconciler-src-reactfiberconcurrentupdates-js" tabindex="-1"><a class="header-anchor" href="#react-reconciler-src-reactfiberconcurrentupdates-js" aria-hidden="true">#</a> react-reconciler/src/ReactFiberConcurrentUpdates.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> HostRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactWorkTags&quot;</span><span class="token punctuation">;</span>

<span class="token comment">// 并发队列数组</span>
<span class="token keyword">const</span> concurrentQueues <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token comment">// 并发队列索引</span>
<span class="token keyword">let</span> concurrentQueuesIndex <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 将更新加入并发队列
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">fiber</span> - fiber对象
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">queue</span> - 更新队列
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">update</span> - 更新对象
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">lane</span> - 车道信息
 */</span>
<span class="token keyword">function</span> <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span><span class="token parameter">fiber<span class="token punctuation">,</span> queue<span class="token punctuation">,</span> update<span class="token punctuation">,</span> lane</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  concurrentQueues<span class="token punctuation">[</span>concurrentQueuesIndex<span class="token operator">++</span><span class="token punctuation">]</span> <span class="token operator">=</span> fiber<span class="token punctuation">;</span>
  concurrentQueues<span class="token punctuation">[</span>concurrentQueuesIndex<span class="token operator">++</span><span class="token punctuation">]</span> <span class="token operator">=</span> queue<span class="token punctuation">;</span>
  concurrentQueues<span class="token punctuation">[</span>concurrentQueuesIndex<span class="token operator">++</span><span class="token punctuation">]</span> <span class="token operator">=</span> update<span class="token punctuation">;</span>
  concurrentQueues<span class="token punctuation">[</span>concurrentQueuesIndex<span class="token operator">++</span><span class="token punctuation">]</span> <span class="token operator">=</span> lane<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 完成并发更新的排队
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">finishQueueingConcurrentUpdates</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> endIndex <span class="token operator">=</span> concurrentQueuesIndex<span class="token punctuation">;</span>
  concurrentQueuesIndex <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>i <span class="token operator">&lt;</span> endIndex<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> fiber <span class="token operator">=</span> concurrentQueues<span class="token punctuation">[</span>i<span class="token operator">++</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> queue <span class="token operator">=</span> concurrentQueues<span class="token punctuation">[</span>i<span class="token operator">++</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> update <span class="token operator">=</span> concurrentQueues<span class="token punctuation">[</span>i<span class="token operator">++</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> lane <span class="token operator">=</span> concurrentQueues<span class="token punctuation">[</span>i<span class="token operator">++</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>queue <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> update <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> pending <span class="token operator">=</span> queue<span class="token punctuation">.</span>pending<span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>pending <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        update<span class="token punctuation">.</span>next <span class="token operator">=</span> update<span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        update<span class="token punctuation">.</span>next <span class="token operator">=</span> pending<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        pending<span class="token punctuation">.</span>next <span class="token operator">=</span> update<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      queue<span class="token punctuation">.</span>pending <span class="token operator">=</span> update<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 将钩子更新加入并发队列
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">fiber</span> - fiber对象
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">queue</span> - 更新队列
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">update</span> - 更新对象
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">lane</span> - 车道信息
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token operator">|</span><span class="token keyword">null</span><span class="token punctuation">}</span></span> 更新的fiber的根，如果不存在则返回null
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">enqueueConcurrentHookUpdate</span><span class="token punctuation">(</span><span class="token parameter">fiber<span class="token punctuation">,</span> queue<span class="token punctuation">,</span> update<span class="token punctuation">,</span> lane</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>fiber<span class="token punctuation">,</span> queue<span class="token punctuation">,</span> update<span class="token punctuation">,</span> lane<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token function">getRootForUpdatedFiber</span><span class="token punctuation">(</span>fiber<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 将类组件更新加入并发队列
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">fiber</span> - fiber对象
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">queue</span> - 更新队列
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">update</span> - 更新对象
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">lane</span> - 车道信息
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token operator">|</span><span class="token keyword">null</span><span class="token punctuation">}</span></span> 更新的fiber的根，如果不存在则返回null
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">enqueueConcurrentClassUpdate</span><span class="token punctuation">(</span><span class="token parameter">fiber<span class="token punctuation">,</span> queue<span class="token punctuation">,</span> update<span class="token punctuation">,</span> lane</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>fiber<span class="token punctuation">,</span> queue<span class="token punctuation">,</span> update<span class="token punctuation">,</span> lane<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token function">getRootForUpdatedFiber</span><span class="token punctuation">(</span>fiber<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 获取更新的fiber的根节点
 * <span class="token keyword">@private</span>
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">sourceFiber</span> - 源fiber节点
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token operator">|</span><span class="token keyword">null</span><span class="token punctuation">}</span></span> fiber的根节点，如果不存在则返回null
 */</span>
<span class="token keyword">function</span> <span class="token function">getRootForUpdatedFiber</span><span class="token punctuation">(</span><span class="token parameter">sourceFiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> node <span class="token operator">=</span> sourceFiber<span class="token punctuation">;</span>
  <span class="token keyword">let</span> parent <span class="token operator">=</span> node<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>parent <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    node <span class="token operator">=</span> parent<span class="token punctuation">;</span>
    parent <span class="token operator">=</span> node<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> node<span class="token punctuation">.</span>tag <span class="token operator">===</span> HostRoot <span class="token operator">?</span> node<span class="token punctuation">.</span>stateNode <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),o=[t];function c(l,u){return s(),a("div",null,o)}const r=n(p,[["render",c],["__file","04.lane模型下的更新队列.html.vue"]]);export{r as default};
