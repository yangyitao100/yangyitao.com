import{_ as n,o as s,c as a,f as e}from"./app.03bf752b.js";const p={},t=e(`<h1 id="_02-调度核心逻辑" tabindex="-1"><a class="header-anchor" href="#_02-调度核心逻辑" aria-hidden="true">#</a> 02.调度核心逻辑</h1><h2 id="scheduler-src-forks-scheduler-js" tabindex="-1"><a class="header-anchor" href="#scheduler-src-forks-scheduler-js" aria-hidden="true">#</a> scheduler/src/forks/Scheduler.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> push<span class="token punctuation">,</span> peek<span class="token punctuation">,</span> pop <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./SchedulerMinHeap&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  ImmediatePriority<span class="token punctuation">,</span> UserBlockingPriority<span class="token punctuation">,</span> NormalPriority<span class="token punctuation">,</span> LowPriority<span class="token punctuation">,</span>
  IdlePriority
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./SchedulerPriorities&#39;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 获取当前时间
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> 当前时间，以毫秒为单位
 */</span>
<span class="token keyword">function</span> <span class="token function">getCurrentTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> performance<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">var</span> maxSigned31BitInt <span class="token operator">=</span> <span class="token number">1073741823</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> <span class="token constant">IMMEDIATE_PRIORITY_TIMEOUT</span> <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> <span class="token constant">USER_BLOCKING_PRIORITY_TIMEOUT</span> <span class="token operator">=</span> <span class="token number">250</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> <span class="token constant">NORMAL_PRIORITY_TIMEOUT</span> <span class="token operator">=</span> <span class="token number">5000</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> <span class="token constant">LOW_PRIORITY_TIMEOUT</span> <span class="token operator">=</span> <span class="token number">10000</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> <span class="token constant">IDLE_PRIORITY_TIMEOUT</span> <span class="token operator">=</span> maxSigned31BitInt<span class="token punctuation">;</span>
<span class="token keyword">let</span> taskIdCounter <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> taskQueue <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> scheduleHostCallback <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> startTime <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> currentTask <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> frameInterval <span class="token operator">=</span> <span class="token number">5</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> channel <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MessageChannel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> port2 <span class="token operator">=</span> channel<span class="token punctuation">.</span>port2<span class="token punctuation">;</span>
<span class="token keyword">var</span> port1 <span class="token operator">=</span> channel<span class="token punctuation">.</span>port1<span class="token punctuation">;</span>
port1<span class="token punctuation">.</span>onmessage <span class="token operator">=</span> performWorkUntilDeadline<span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 调度回调函数
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>ImmediatePriority <span class="token operator">|</span> UserBlockingPriority <span class="token operator">|</span> NormalPriority <span class="token operator">|</span> LowPriority <span class="token operator">|</span> IdlePriority<span class="token punctuation">}</span></span> <span class="token parameter">priorityLevel</span> - 优先级
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Function<span class="token punctuation">}</span></span> <span class="token parameter">callback</span> - 要执行的回调函数
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> 新创建的任务对象
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">scheduleCallback</span><span class="token punctuation">(</span><span class="token parameter">priorityLevel<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> currentTime <span class="token operator">=</span> <span class="token function">getCurrentTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> startTime <span class="token operator">=</span> currentTime<span class="token punctuation">;</span>
  <span class="token keyword">let</span> timeout<span class="token punctuation">;</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>priorityLevel<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">ImmediatePriority</span><span class="token operator">:</span>
      timeout <span class="token operator">=</span> <span class="token constant">IMMEDIATE_PRIORITY_TIMEOUT</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token literal-property property">UserBlockingPriority</span><span class="token operator">:</span>
      timeout <span class="token operator">=</span> <span class="token constant">USER_BLOCKING_PRIORITY_TIMEOUT</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token literal-property property">IdlePriority</span><span class="token operator">:</span>
      timeout <span class="token operator">=</span> <span class="token constant">IDLE_PRIORITY_TIMEOUT</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token literal-property property">LowPriority</span><span class="token operator">:</span>
      timeout <span class="token operator">=</span> <span class="token constant">LOW_PRIORITY_TIMEOUT</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token literal-property property">NormalPriority</span><span class="token operator">:</span>
    <span class="token keyword">default</span><span class="token operator">:</span>
      timeout <span class="token operator">=</span> <span class="token constant">NORMAL_PRIORITY_TIMEOUT</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">const</span> expirationTime <span class="token operator">=</span> startTime <span class="token operator">+</span> timeout<span class="token punctuation">;</span>
  <span class="token keyword">const</span> newTask <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">id</span><span class="token operator">:</span> taskIdCounter<span class="token operator">++</span><span class="token punctuation">,</span>
    callback<span class="token punctuation">,</span>
    priorityLevel<span class="token punctuation">,</span>
    startTime<span class="token punctuation">,</span>
    expirationTime<span class="token punctuation">,</span>
    <span class="token literal-property property">sortIndex</span><span class="token operator">:</span> expirationTime
  <span class="token punctuation">}</span>
  <span class="token function">push</span><span class="token punctuation">(</span>taskQueue<span class="token punctuation">,</span> newTask<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">requestHostCallback</span><span class="token punctuation">(</span>workLoop<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> newTask<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 判断是否应该交还控制权给主机
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>boolean<span class="token punctuation">}</span></span> 如果应该交还控制权给主机，则返回 true；否则返回 false
 */</span>
<span class="token keyword">function</span> <span class="token function">shouldYieldToHost</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> timeElapsed <span class="token operator">=</span> <span class="token function">getCurrentTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> startTime<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>timeElapsed <span class="token operator">&lt;</span> frameInterval<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 工作循环，执行任务队列中的任务
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">startTime</span> - 工作循环的开始时间
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>boolean<span class="token punctuation">}</span></span> 如果还有未完成的任务，返回 true；否则返回 false
 */</span>
<span class="token keyword">function</span> <span class="token function">workLoop</span><span class="token punctuation">(</span><span class="token parameter">startTime</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> currentTime <span class="token operator">=</span> startTime<span class="token punctuation">;</span>
  currentTask <span class="token operator">=</span> <span class="token function">peek</span><span class="token punctuation">(</span>taskQueue<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>currentTask <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>currentTask<span class="token punctuation">.</span>expirationTime <span class="token operator">&gt;</span> currentTime <span class="token operator">&amp;&amp;</span> <span class="token function">shouldYieldToHost</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">const</span> callback <span class="token operator">=</span> currentTask<span class="token punctuation">.</span>callback<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> callback <span class="token operator">===</span> <span class="token string">&#39;function&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      currentTask<span class="token punctuation">.</span>callback <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
      <span class="token keyword">const</span> didUserCallbackTimeout <span class="token operator">=</span> currentTask<span class="token punctuation">.</span>expirationTime <span class="token operator">&lt;=</span> currentTime<span class="token punctuation">;</span>
      <span class="token keyword">const</span> continuationCallback <span class="token operator">=</span> <span class="token function">callback</span><span class="token punctuation">(</span>didUserCallbackTimeout<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> continuationCallback <span class="token operator">===</span> <span class="token string">&#39;function&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        currentTask<span class="token punctuation">.</span>callback <span class="token operator">=</span> continuationCallback<span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>currentTask <span class="token operator">===</span> <span class="token function">peek</span><span class="token punctuation">(</span>taskQueue<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">pop</span><span class="token punctuation">(</span>taskQueue<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token function">pop</span><span class="token punctuation">(</span>taskQueue<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    currentTask <span class="token operator">=</span> <span class="token function">peek</span><span class="token punctuation">(</span>taskQueue<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>currentTask <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 请求主机回调
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Function<span class="token punctuation">}</span></span> <span class="token parameter">workLoop</span> - 工作循环函数
 */</span>
<span class="token keyword">function</span> <span class="token function">requestHostCallback</span><span class="token punctuation">(</span><span class="token parameter">workLoop</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  scheduleHostCallback <span class="token operator">=</span> workLoop<span class="token punctuation">;</span>
  <span class="token function">schedulePerformWorkUntilDeadline</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 安排执行工作直到截止时间
 */</span>
<span class="token keyword">function</span> <span class="token function">schedulePerformWorkUntilDeadline</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  port2<span class="token punctuation">.</span><span class="token function">postMessage</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 执行工作直到截止时间
 */</span>
<span class="token keyword">function</span> <span class="token function">performWorkUntilDeadline</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>scheduleHostCallback<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    startTime <span class="token operator">=</span> <span class="token function">getCurrentTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">let</span> hasMoreWork <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
      hasMoreWork <span class="token operator">=</span> <span class="token function">scheduleHostCallback</span><span class="token punctuation">(</span>startTime<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>hasMoreWork<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">schedulePerformWorkUntilDeadline</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        scheduleHostCallback <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token punctuation">{</span>
  scheduleCallback <span class="token keyword">as</span> unstable_scheduleCallback<span class="token punctuation">,</span>
  shouldYieldToHost <span class="token keyword">as</span> unstable_shouldYield<span class="token punctuation">,</span>
  ImmediatePriority <span class="token keyword">as</span> unstable_ImmediatePriority<span class="token punctuation">,</span>
  UserBlockingPriority <span class="token keyword">as</span> unstable_UserBlockingPriority<span class="token punctuation">,</span>
  NormalPriority <span class="token keyword">as</span> unstable_NormalPriority<span class="token punctuation">,</span>
  LowPriority <span class="token keyword">as</span> unstable_LowPriority<span class="token punctuation">,</span>
  IdlePriority <span class="token keyword">as</span> unstable_IdlePriority
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="react-reconciler-src-scheduler-js" tabindex="-1"><a class="header-anchor" href="#react-reconciler-src-scheduler-js" aria-hidden="true">#</a> react-reconciler/src/Scheduler.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> Scheduler <span class="token keyword">from</span> <span class="token string">&#39;scheduler&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> scheduleCallback <span class="token operator">=</span> Scheduler<span class="token punctuation">.</span>unstable_scheduleCallback<span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> shouldYield <span class="token operator">=</span> Scheduler<span class="token punctuation">.</span>unstable_shouldYield<span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> ImmediatePriority <span class="token operator">=</span> Scheduler<span class="token punctuation">.</span>unstable_ImmediatePriority<span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> UserBlockingPriority <span class="token operator">=</span> Scheduler<span class="token punctuation">.</span>unstable_UserBlockingPriority<span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> NormalPriority <span class="token operator">=</span> Scheduler<span class="token punctuation">.</span>unstable_NormalPriority<span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> IdlePriority <span class="token operator">=</span> Scheduler<span class="token punctuation">.</span>unstable_IdlePriority<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="react-reconciler-src-reactfiberworkloop-js" tabindex="-1"><a class="header-anchor" href="#react-reconciler-src-reactfiberworkloop-js" aria-hidden="true">#</a> react-reconciler/src/ReactFiberWorkLoop.js</h2><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>import {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> scheduleCallback,
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  NormalPriority as NormalSchedulerPriority,
</span><span class="token prefix inserted">+</span><span class="token line">  shouldYield,
</span></span>} from &quot;scheduler&quot;;

function ensureRootIsScheduled(root) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> if (workInProgressRoot) return;
</span><span class="token prefix unchanged"> </span><span class="token line"> workInProgressRoot = root;
</span></span><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span><span class="token line">scheduleCallback(performConcurrentWorkOnRoot.bind(null, root));
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  scheduleCallback(NormalSchedulerPriority, performConcurrentWorkOnRoot.bind(null, root));
</span></span>}

function commitRoot(root) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> const { finishedWork } = root;
</span><span class="token prefix unchanged"> </span><span class="token line"> if ((finishedWork.subtreeFlags &amp; Passive) !== NoFlags
</span><span class="token prefix unchanged"> </span><span class="token line">   || (finishedWork.flags &amp; Passive) !== NoFlags) {
</span><span class="token prefix unchanged"> </span><span class="token line">   if (!rootDoesHavePassiveEffect) {
</span><span class="token prefix unchanged"> </span><span class="token line">     rootDoesHavePassiveEffect = true;
</span></span><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span><span class="token line">     scheduleCallback(flushPassiveEffect);
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">     scheduleCallback(NormalSchedulerPriority, flushPassiveEffect);
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">   }
</span><span class="token prefix unchanged"> </span><span class="token line"> }
</span><span class="token prefix unchanged"> </span><span class="token line"> ...
</span></span>}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="react-reconciler-src-scheduler-js-1" tabindex="-1"><a class="header-anchor" href="#react-reconciler-src-scheduler-js-1" aria-hidden="true">#</a> react-reconciler/src/Scheduler.js</h2>`,8),o=[t];function c(l,i){return s(),a("div",null,o)}const u=n(p,[["render",c],["__file","02.调度核心逻辑.html.vue"]]);export{u as default};
