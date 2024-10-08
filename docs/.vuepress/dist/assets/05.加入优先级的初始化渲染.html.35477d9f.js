import{_ as n,o as s,c as a,f as e}from"./app.c996eb5c.js";const i={},t=e(`<h1 id="_05-加入优先级的初始化渲染" tabindex="-1"><a class="header-anchor" href="#_05-加入优先级的初始化渲染" aria-hidden="true">#</a> 05.加入优先级的初始化渲染</h1><h2 id="react-reconciler-src-reactfiberroot-js" tabindex="-1"><a class="header-anchor" href="#react-reconciler-src-reactfiberroot-js" aria-hidden="true">#</a> react-reconciler/src/ReactFiberRoot.js</h2><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">import { NoLanes } from &#39;./ReactFiberLane&#39;;
</span></span>
function FiberRootNode(containerInfo) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> this.containerInfo = containerInfo;
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line"> this.pendingLanes = NoLanes;
</span></span>}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="react-reconciler-src-reactfiber-js" tabindex="-1"><a class="header-anchor" href="#react-reconciler-src-reactfiber-js" aria-hidden="true">#</a> react-reconciler/src/ReactFiber.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> NoLanes <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./ReactFiberLane&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">FiberNode</span><span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> pendingProps<span class="token punctuation">,</span> key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token operator">...</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>lanes <span class="token operator">=</span> NoLanes<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="react-reconciler-src-reactfiberreconciler-js" tabindex="-1"><a class="header-anchor" href="#react-reconciler-src-reactfiberreconciler-js" aria-hidden="true">#</a> react-reconciler/src/ReactFiberReconciler.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createFiberRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberRoot&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createUpdate<span class="token punctuation">,</span> enqueueUpdate <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberClassUpdateQueue&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> scheduleUpdateOnFiber<span class="token punctuation">,</span> requestUpdateLane <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberWorkLoop&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createContainer</span><span class="token punctuation">(</span><span class="token parameter">containerInfo</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">createFiberRoot</span><span class="token punctuation">(</span>containerInfo<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">updateContainer</span><span class="token punctuation">(</span><span class="token parameter">element<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> current <span class="token operator">=</span> container<span class="token punctuation">.</span>current<span class="token punctuation">;</span>
  <span class="token keyword">const</span> lane <span class="token operator">=</span> <span class="token function">requestUpdateLane</span><span class="token punctuation">(</span>current<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> update <span class="token operator">=</span> <span class="token function">createUpdate</span><span class="token punctuation">(</span>lane<span class="token punctuation">)</span><span class="token punctuation">;</span>
  update<span class="token punctuation">.</span>payload <span class="token operator">=</span> <span class="token punctuation">{</span> element <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> update<span class="token punctuation">,</span> lane<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">scheduleUpdateOnFiber</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> current<span class="token punctuation">,</span> lane<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="react-reconciler-src-reactfiberworkloop-js" tabindex="-1"><a class="header-anchor" href="#react-reconciler-src-reactfiberworkloop-js" aria-hidden="true">#</a> react-reconciler/src/ReactFiberWorkLoop.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">requestUpdateLane</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> updateLane <span class="token operator">=</span> <span class="token function">getCurrentUpdatePriority</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>updateLane <span class="token operator">!==</span> NoLanes<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> updateLane<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">const</span> eventLane <span class="token operator">=</span> <span class="token function">getCurrentEventPriority</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> eventLane<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>
  scheduleCallback <span class="token keyword">as</span> Scheduler_scheduleCallback<span class="token punctuation">,</span>
  shouldYield<span class="token punctuation">,</span>
  ImmediatePriority <span class="token keyword">as</span> ImmediateSchedulerPriority<span class="token punctuation">,</span>
  UserBlockingPriority <span class="token keyword">as</span> UserBlockingSchedulerPriority<span class="token punctuation">,</span>
  NormalPriority <span class="token keyword">as</span> NormalSchedulerPriority<span class="token punctuation">,</span>
  IdlePriority <span class="token keyword">as</span> IdleSchedulerPriority<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./scheduler&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span>
  NoLanes<span class="token punctuation">,</span> markRootUpdated<span class="token punctuation">,</span> getNextLanes<span class="token punctuation">,</span>
  getHighestPriorityLane<span class="token punctuation">,</span> SyncLane
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./ReactFiberLane&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  getCurrentUpdatePriority<span class="token punctuation">,</span>
  lanesToEventPriority<span class="token punctuation">,</span>
  DiscreteEventPriority<span class="token punctuation">,</span>
  ContinuousEventPriority<span class="token punctuation">,</span>
  DefaultEventPriority<span class="token punctuation">,</span>
  IdleEventPriority
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./ReactEventPriorities&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> getCurrentEventPriority <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;react-dom-bindings/src/client/ReactDOMHostConfig&#39;</span>

<span class="token keyword">let</span> workInProgressRoot <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> workInProgressRenderLanes <span class="token operator">=</span> NoLanes<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span><span class="token line">export function scheduleUpdateOnFiber(root, fiber, lane) {
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">export function scheduleUpdateOnFiber(root, fiber, lane) {
</span><span class="token prefix inserted">+</span><span class="token line"> markRootUpdated(root, lane);
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> ensureRootIsScheduled(root);
</span></span>}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">ensureRootIsScheduled</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> nextLanes <span class="token operator">=</span> <span class="token function">getNextLanes</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> NoLanes<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> newCallbackPriority <span class="token operator">=</span> <span class="token function">getHighestPriorityLane</span><span class="token punctuation">(</span>nextLanes<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>newCallbackPriority <span class="token operator">===</span> SyncLane<span class="token punctuation">)</span> <span class="token punctuation">{</span>

  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> schedulerPriorityLevel<span class="token punctuation">;</span>
    <span class="token keyword">switch</span> <span class="token punctuation">(</span><span class="token function">lanesToEventPriority</span><span class="token punctuation">(</span>nextLanes<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">case</span> <span class="token literal-property property">DiscreteEventPriority</span><span class="token operator">:</span>
        schedulerPriorityLevel <span class="token operator">=</span> ImmediateSchedulerPriority<span class="token punctuation">;</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token keyword">case</span> <span class="token literal-property property">ContinuousEventPriority</span><span class="token operator">:</span>
        schedulerPriorityLevel <span class="token operator">=</span> UserBlockingSchedulerPriority<span class="token punctuation">;</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token keyword">case</span> <span class="token literal-property property">DefaultEventPriority</span><span class="token operator">:</span>
        schedulerPriorityLevel <span class="token operator">=</span> NormalSchedulerPriority<span class="token punctuation">;</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token keyword">case</span> <span class="token literal-property property">IdleEventPriority</span><span class="token operator">:</span>
        schedulerPriorityLevel <span class="token operator">=</span> IdleSchedulerPriority<span class="token punctuation">;</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token keyword">default</span><span class="token operator">:</span>
        schedulerPriorityLevel <span class="token operator">=</span> NormalSchedulerPriority<span class="token punctuation">;</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token function">Scheduler_scheduleCallback</span><span class="token punctuation">(</span>schedulerPriorityLevel<span class="token punctuation">,</span> <span class="token function">performConcurrentWorkOnRoot</span><span class="token punctuation">.</span><span class="token function">bind</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> root<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>function performConcurrentWorkOnRoot(root, timeout) {
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  const nextLanes = getNextLanes(root, NoLanes);
</span><span class="token prefix inserted">+</span><span class="token line">  if (nextLanes === NoLanes) {
</span><span class="token prefix inserted">+</span><span class="token line">    return null;
</span><span class="token prefix inserted">+</span><span class="token line">  }
</span><span class="token prefix inserted">+</span><span class="token line">  renderRootSync(root, nextLanes);
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> const finishedWork = root.current.alternate;
</span><span class="token prefix unchanged"> </span><span class="token line"> root.finishedWork = finishedWork;
</span><span class="token prefix unchanged"> </span><span class="token line"> commitRoot(root);
</span><span class="token prefix unchanged"> </span><span class="token line"> return null;
</span></span>}
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">function prepareFreshStack(root, renderLanes) {
</span><span class="token prefix inserted">+</span><span class="token line">  if (root !== workInProgressRoot || workInProgressRenderLanes !== renderLanes) {
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">   workInProgress = createWorkInProgress(root.current, null);
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  }
</span><span class="token prefix inserted">+</span><span class="token line">  workInProgressRenderLanes = renderLanes;
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> finishQueueingConcurrentUpdates();
</span></span>}
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">function renderRootSync(root, renderLanes) {
</span><span class="token prefix inserted">+</span><span class="token line">  prepareFreshStack(root, renderLanes);
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> workLoopSync();
</span></span>}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>function performUnitOfWork(unitOfWork) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> const current = unitOfWork.alternate;
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line"> const next = beginWork(current, unitOfWork, workInProgressRenderLanes);
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> unitOfWork.memoizedProps = unitOfWork.pendingProps;
</span><span class="token prefix unchanged"> </span><span class="token line"> if (next === null) {
</span><span class="token prefix unchanged"> </span><span class="token line">   completeUnitOfWork(unitOfWork);
</span><span class="token prefix unchanged"> </span><span class="token line"> } else {
</span><span class="token prefix unchanged"> </span><span class="token line">   workInProgress = next;
</span><span class="token prefix unchanged"> </span><span class="token line"> }
</span></span>}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>function commitRoot(root) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> const { finishedWork } = root;
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  workInProgressRoot = null;
</span><span class="token prefix inserted">+</span><span class="token line">  workInProgressRenderLanes = null;
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> if ((finishedWork.subtreeFlags &amp; Passive) !== NoFlags
</span><span class="token prefix unchanged"> </span><span class="token line">   || (finishedWork.flags &amp; Passive) !== NoFlags) {
</span><span class="token prefix unchanged"> </span><span class="token line">   if (!rootDoesHavePassiveEffect) {
</span><span class="token prefix unchanged"> </span><span class="token line">     rootDoesHavePassiveEffect = true;
</span><span class="token prefix unchanged"> </span><span class="token line">     scheduleCallback(NormalSchedulerPriority, flushPassiveEffect);
</span><span class="token prefix unchanged"> </span><span class="token line">   }
</span><span class="token prefix unchanged"> </span><span class="token line"> }
</span><span class="token prefix unchanged"> </span><span class="token line"> const subtreeHasEffects = (finishedWork.subtreeFlags &amp; MutationMask) !== NoFlags;
</span><span class="token prefix unchanged"> </span><span class="token line"> const rootHasEffect = (finishedWork.flags &amp; MutationMask) !== NoFlags;
</span><span class="token prefix unchanged"> </span><span class="token line"> if (subtreeHasEffects || rootHasEffect) {
</span><span class="token prefix unchanged"> </span><span class="token line">   commitMutationEffectsOnFiber(finishedWork, root);
</span><span class="token prefix unchanged"> </span><span class="token line">   commitLayoutEffects(finishedWork, root);
</span><span class="token prefix unchanged"> </span><span class="token line">   if (rootDoesHavePassiveEffect) {
</span><span class="token prefix unchanged"> </span><span class="token line">     rootDoesHavePassiveEffect = false;
</span><span class="token prefix unchanged"> </span><span class="token line">     rootWithPendingPassiveEffects = root;
</span><span class="token prefix unchanged"> </span><span class="token line">   }
</span><span class="token prefix unchanged"> </span><span class="token line"> }
</span><span class="token prefix unchanged"> </span><span class="token line"> root.current = finishedWork;
</span></span>}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="react-reconciler-src-reactfiberhooks-js" tabindex="-1"><a class="header-anchor" href="#react-reconciler-src-reactfiberhooks-js" aria-hidden="true">#</a> react-reconciler/src/ReactFiberHooks.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> scheduleUpdateOnFiber<span class="token punctuation">,</span> requestUpdateLane <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberWorkLoop&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> NoLane<span class="token punctuation">,</span> NoLanes <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./ReactFiberLane&#39;</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>function dispatchSetState(fiber, queue, action) {
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  const lane = requestUpdateLane();
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> const update = {
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">   lane,
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">   action,
</span><span class="token prefix unchanged"> </span><span class="token line">   hasEagerState: false,
</span><span class="token prefix unchanged"> </span><span class="token line">   eagerState: null,
</span><span class="token prefix unchanged"> </span><span class="token line">   next: null
</span><span class="token prefix unchanged"> </span><span class="token line"> }
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line"> const alternate = fiber.alternate;
</span><span class="token prefix inserted">+</span><span class="token line">  if (fiber.lanes === NoLanes &amp;&amp; (alternate === null || alternate.lanes == NoLanes)) {
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">   const { lastRenderedReducer, lastRenderedState } = queue;
</span><span class="token prefix unchanged"> </span><span class="token line">   const eagerState = lastRenderedReducer(lastRenderedState, action);
</span><span class="token prefix unchanged"> </span><span class="token line">   update.hasEagerState = true;
</span><span class="token prefix unchanged"> </span><span class="token line">   update.eagerState = eagerState;
</span><span class="token prefix unchanged"> </span><span class="token line">   if (Object.is(eagerState, lastRenderedState)) {
</span><span class="token prefix unchanged"> </span><span class="token line">     return;
</span><span class="token prefix unchanged"> </span><span class="token line">   }
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  }
</span><span class="token prefix inserted">+</span><span class="token line">  const root = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
</span><span class="token prefix inserted">+</span><span class="token line">  scheduleUpdateOnFiber(root, fiber, lane);
</span></span>}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>function mountReducer(reducer, initialArg) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> const hook = mountWorkInProgressHook();
</span><span class="token prefix unchanged"> </span><span class="token line"> hook.memoizedState = initialArg;
</span><span class="token prefix unchanged"> </span><span class="token line"> const queue = {
</span><span class="token prefix unchanged"> </span><span class="token line">   pending: null,
</span><span class="token prefix unchanged"> </span><span class="token line">   dispatch: null,
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">   lastRenderedReducer: reducer,
</span><span class="token prefix inserted">+</span><span class="token line">   lastRenderedState: initialArg
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> }
</span><span class="token prefix unchanged"> </span><span class="token line"> hook.queue = queue;
</span><span class="token prefix unchanged"> </span><span class="token line"> const dispatch = (queue.dispatch = dispatchReducerAction.bind(null, currentlyRenderingFiber, queue));
</span><span class="token prefix unchanged"> </span><span class="token line"> return [hook.memoizedState, dispatch];
</span></span>}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,19),p=[t];function c(o,l){return s(),a("div",null,p)}const d=n(i,[["render",c],["__file","05.加入优先级的初始化渲染.html.vue"]]);export{d as default};
