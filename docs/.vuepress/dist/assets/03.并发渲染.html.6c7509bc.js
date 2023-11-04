import{_ as n,o as s,c as a,f as e}from"./app.4326c516.js";const i={},l=e(`<h1 id="_03-并发渲染" tabindex="-1"><a class="header-anchor" href="#_03-并发渲染" aria-hidden="true">#</a> 03.并发渲染</h1><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> scheduleSyncCallback<span class="token punctuation">,</span> flushSyncCallbacks <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./ReactFiberSyncTaskQueue&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> RootInProgress <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> RootCompleted <span class="token operator">=</span> <span class="token number">5</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> workInProgressRootExitStatus <span class="token operator">=</span> RootInProgress<span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>function ensureRootIsScheduled(root) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> const nextLanes = getNextLanes(root, NoLanes);
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  if (nextLanes === NoLanes) {
</span><span class="token prefix inserted">+</span><span class="token line">    return;
</span><span class="token prefix inserted">+</span><span class="token line">  }
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> let newCallbackPriority = getHighestPriorityLane(nextLanes);
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line"> let newCallbackNode;
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> if (newCallbackPriority === SyncLane) {
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">   scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
</span><span class="token prefix inserted">+</span><span class="token line">   queueMicrotask(flushSyncCallbacks);
</span><span class="token prefix inserted">+</span><span class="token line">   newCallbackNode = null;
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> } else {
</span><span class="token prefix unchanged"> </span><span class="token line">   let schedulerPriorityLevel;
</span><span class="token prefix unchanged"> </span><span class="token line">   switch (lanesToEventPriority(nextLanes)) {
</span><span class="token prefix unchanged"> </span><span class="token line">     case DiscreteEventPriority:
</span><span class="token prefix unchanged"> </span><span class="token line">       schedulerPriorityLevel = ImmediateSchedulerPriority;
</span><span class="token prefix unchanged"> </span><span class="token line">       break;
</span><span class="token prefix unchanged"> </span><span class="token line">     case ContinuousEventPriority:
</span><span class="token prefix unchanged"> </span><span class="token line">       schedulerPriorityLevel = UserBlockingSchedulerPriority;
</span><span class="token prefix unchanged"> </span><span class="token line">       break;
</span><span class="token prefix unchanged"> </span><span class="token line">     case DefaultEventPriority:
</span><span class="token prefix unchanged"> </span><span class="token line">       schedulerPriorityLevel = NormalSchedulerPriority;
</span><span class="token prefix unchanged"> </span><span class="token line">       break;
</span><span class="token prefix unchanged"> </span><span class="token line">     case IdleEventPriority:
</span><span class="token prefix unchanged"> </span><span class="token line">       schedulerPriorityLevel = IdleSchedulerPriority;
</span><span class="token prefix unchanged"> </span><span class="token line">       break;
</span><span class="token prefix unchanged"> </span><span class="token line">     default:
</span><span class="token prefix unchanged"> </span><span class="token line">       schedulerPriorityLevel = NormalSchedulerPriority;
</span><span class="token prefix unchanged"> </span><span class="token line">       break;
</span><span class="token prefix unchanged"> </span><span class="token line">   }
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">   newCallbackNode = Scheduler_scheduleCallback(schedulerPriorityLevel, performConcurrentWorkOnRoot.bind(null, root));
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> }
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line"> root.callbackNode = newCallbackNode
</span></span>}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">performSyncWorkOnRoot</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> lanes <span class="token operator">=</span> <span class="token function">getNextLanes</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">renderRootSync</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> lanes<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> finishedWork <span class="token operator">=</span> root<span class="token punctuation">.</span>current<span class="token punctuation">.</span>alternate<span class="token punctuation">;</span>
  root<span class="token punctuation">.</span>finishedWork <span class="token operator">=</span> finishedWork<span class="token punctuation">;</span>
  <span class="token function">commitRoot</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>function performConcurrentWorkOnRoot(root, didTimeout) {
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line"> const originalCallbackNode = root.callbackNode;
</span><span class="token prefix inserted">+</span><span class="token line">  const lanes = getNextLanes(root, NoLanes);
</span><span class="token prefix inserted">+</span><span class="token line">  if (lanes === NoLanes) {
</span><span class="token prefix inserted">+</span><span class="token line">    return null;
</span><span class="token prefix inserted">+</span><span class="token line">  }
</span><span class="token prefix inserted">+</span><span class="token line">  const shouldTimeSlice = !includesBlockingLane(root, lanes) &amp;&amp; (!didTimeout);
</span><span class="token prefix inserted">+</span><span class="token line">  const exitStatus = shouldTimeSlice ?
</span><span class="token prefix inserted">+</span><span class="token line">    renderRootConcurrent(root, lanes) : renderRootSync(root, lanes);
</span><span class="token prefix inserted">+</span><span class="token line">  if (exitStatus !== RootInProgress) {
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">   const finishedWork = root.current.alternate;
</span><span class="token prefix unchanged"> </span><span class="token line">   root.finishedWork = finishedWork;
</span><span class="token prefix unchanged"> </span><span class="token line">   commitRoot(root);
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  }
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> if (root.callbackNode === originalCallbackNode) {
</span><span class="token prefix unchanged"> </span><span class="token line">   return performConcurrentWorkOnRoot.bind(null, root);
</span><span class="token prefix unchanged"> </span><span class="token line"> }
</span><span class="token prefix unchanged"> </span><span class="token line"> return null;
</span></span>}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">renderRootConcurrent</span><span class="token punctuation">(</span><span class="token parameter">root<span class="token punctuation">,</span> lanes</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>workInProgressRoot <span class="token operator">!==</span> root <span class="token operator">||</span> workInProgressRootRenderLanes <span class="token operator">!==</span> lanes<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">prepareFreshStack</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> lanes<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">workLoopConcurrent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>workInProgress <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> RootInProgress<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> workInProgressRootExitStatus<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">commitRoot</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> previousUpdatePriority <span class="token operator">=</span> <span class="token function">getCurrentUpdatePriority</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">try</span> <span class="token punctuation">{</span>
    <span class="token function">setCurrentUpdatePriority</span><span class="token punctuation">(</span>DiscreteEventPriority<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">commitRootImpl</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span>
  <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
    <span class="token function">setCurrentUpdatePriority</span><span class="token punctuation">(</span>previousUpdatePriority<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">function commitRootImpl(root) {
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> const { finishedWork } = root;
</span><span class="token prefix unchanged"> </span><span class="token line"> workInProgressRoot = null;
</span><span class="token prefix unchanged"> </span><span class="token line"> workInProgressRootRenderLanes = null;
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line"> root.callbackNode = null;
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> if ((finishedWork.subtreeFlags &amp; Passive) !== NoFlags
</span><span class="token prefix unchanged"> </span><span class="token line">   || (finishedWork.flags &amp; Passive) !== NoFlags) {
</span><span class="token prefix unchanged"> </span><span class="token line">   if (!rootDoesHavePassiveEffect) {
</span><span class="token prefix unchanged"> </span><span class="token line">     rootDoesHavePassiveEffect = true;
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">     Scheduler_scheduleCallback(NormalSchedulerPriority, flushPassiveEffect);
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">   }
</span><span class="token prefix unchanged"> </span><span class="token line"> }
</span><span class="token prefix unchanged"> </span><span class="token line"> ...
</span></span>}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>function prepareFreshStack(root, renderLanes) {
<span class="token deleted-sign deleted"><span class="token prefix deleted">-</span><span class="token line">if (root !== workInProgressRoot || workInProgressRenderLanes !== renderLanes) {
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> workInProgress = createWorkInProgress(root.current, null);
</span></span><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span><span class="token line">}
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> workInProgressRootRenderLanes = renderLanes;
</span><span class="token prefix unchanged"> </span><span class="token line"> workInProgressRoot = root;
</span><span class="token prefix unchanged"> </span><span class="token line"> finishQueueingConcurrentUpdates();
</span></span>}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>function renderRootSync(root, renderLanes) {
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line"> if (root !== workInProgressRoot || workInProgressRootRenderLanes !== renderLanes) {
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">   prepareFreshStack(root, renderLanes);
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line"> }
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> workLoopSync();
</span></span>}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>function completeUnitOfWork(unitOfWork) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> let completedWork = unitOfWork;
</span><span class="token prefix unchanged"> </span><span class="token line"> do {
</span><span class="token prefix unchanged"> </span><span class="token line">   const current = completedWork.alternate;
</span><span class="token prefix unchanged"> </span><span class="token line">   const returnFiber = completedWork.return;
</span><span class="token prefix unchanged"> </span><span class="token line">   completeWork(current, completedWork);
</span><span class="token prefix unchanged"> </span><span class="token line">   const siblingFiber = completedWork.sibling;
</span><span class="token prefix unchanged"> </span><span class="token line">   if (siblingFiber !== null) {
</span><span class="token prefix unchanged"> </span><span class="token line">     workInProgress = siblingFiber;
</span><span class="token prefix unchanged"> </span><span class="token line">     return;
</span><span class="token prefix unchanged"> </span><span class="token line">   }
</span><span class="token prefix unchanged"> </span><span class="token line">   completedWork = returnFiber;
</span><span class="token prefix unchanged"> </span><span class="token line">   workInProgress = completedWork;
</span><span class="token prefix unchanged"> </span><span class="token line"> } while (completedWork !== null);
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  if (workInProgressRootExitStatus === RootInProgress) {
</span><span class="token prefix inserted">+</span><span class="token line">    workInProgressRootExitStatus = RootCompleted;
</span><span class="token prefix inserted">+</span><span class="token line">  }
</span></span>}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,11),p=[l];function t(o,c){return s(),a("div",null,p)}const d=n(i,[["render",t],["__file","03.并发渲染.html.vue"]]);export{d as default};
