import{_ as n,o as s,c as a,f as e}from"./app.d86bc82c.js";const p={},i=e(`<h1 id="_08-commitwork" tabindex="-1"><a class="header-anchor" href="#_08-commitwork" aria-hidden="true">#</a> 08.commitWork</h1><p>同学们好，这一小节我们就来实现render函数中commitWork部分的逻辑。</p><h2 id="packages-react-reconciler-src-reactfiberworkloop-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactfiberworkloop-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactFiberWorkLoop.js</h2><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>import { scheduleCallback } from &quot;scheduler&quot;;
import { createWorkInProgress } from &quot;./ReactFiber&quot;;
import { beginWork } from &quot;./ReactFiberBeginWork&quot;;
import { completeWork } from &quot;./ReactFiberCompleteWork&quot;;
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">import { NoFlags, MutationMask } from &quot;./ReactFiberFlags&quot;;
</span><span class="token prefix inserted">+</span><span class="token line">import { commitMutationEffectsOnFiber } from &#39;./ReactFiberCommitWork&#39;;
</span></span>
let workInProgress = null;

/**
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">* 在 Fiber 上计划更新根节点。
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {*} root - 根节点。
</span><span class="token prefix unchanged"> </span><span class="token line">*/
</span></span>export function scheduleUpdateOnFiber(root) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> ensureRootIsScheduled(root);
</span></span>}

/**
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">* 确保根节点被调度执行。
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {*} root - 根节点。
</span><span class="token prefix unchanged"> </span><span class="token line">*/
</span></span>function ensureRootIsScheduled(root) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> scheduleCallback(performConcurrentWorkOnRoot.bind(null, root));
</span></span>}

/**
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">* 执行根节点上的并发工作。
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {*} root - 根节点。
</span><span class="token prefix unchanged"> </span><span class="token line">*/
</span></span>function performConcurrentWorkOnRoot(root) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> renderRootSync(root);
</span><span class="token prefix unchanged"> </span><span class="token line"> const finishedWork = root.current.alternate;
</span><span class="token prefix unchanged"> </span><span class="token line"> root.finishedWork = finishedWork;
</span><span class="token prefix unchanged"> </span><span class="token line"> commitRoot(root);
</span></span>}

/**
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">* 提交根节点。
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {*} root - 根节点。
</span><span class="token prefix unchanged"> </span><span class="token line">*/
</span></span>function commitRoot(root) {
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  const { finishedWork } = root;
</span><span class="token prefix inserted">+</span><span class="token line">  const subtreeHasEffects = (finishedWork.subtreeFlags &amp; MutationMask) !== NoFlags;
</span><span class="token prefix inserted">+</span><span class="token line">  const rootHasEffect = (finishedWork.flags &amp; MutationMask) !== NoFlags;
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  if (subtreeHasEffects || rootHasEffect) {
</span><span class="token prefix inserted">+</span><span class="token line">    commitMutationEffectsOnFiber(finishedWork, root);
</span><span class="token prefix inserted">+</span><span class="token line">  }
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  root.current = finishedWork;
</span></span>}

/**
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">* 准备一个新的工作栈。
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {*} root - 根节点。
</span><span class="token prefix unchanged"> </span><span class="token line">*/
</span></span>function prepareFreshStack(root) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> workInProgress = createWorkInProgress(root.current, null);
</span></span>}

/**
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">* 同步渲染根节点。
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {*} root - 根节点。
</span><span class="token prefix unchanged"> </span><span class="token line">*/
</span></span>function renderRootSync(root) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> prepareFreshStack(root);
</span><span class="token prefix unchanged"> </span><span class="token line"> workLoopSync();
</span></span>}

/**
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">* 同步工作循环。
</span><span class="token prefix unchanged"> </span><span class="token line">*/
</span></span>function workLoopSync() {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> while (workInProgress !== null) {
</span><span class="token prefix unchanged"> </span><span class="token line">   performUnitOfWork(workInProgress);
</span><span class="token prefix unchanged"> </span><span class="token line"> }
</span></span>}

/**
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">* 执行一个工作单元。
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {*} unitOfWork - 工作单元。
</span><span class="token prefix unchanged"> </span><span class="token line">*/
</span></span>function performUnitOfWork(unitOfWork) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> const current = unitOfWork.alternate;
</span><span class="token prefix unchanged"> </span><span class="token line"> const next = beginWork(current, unitOfWork);
</span><span class="token prefix unchanged"> </span><span class="token line"> unitOfWork.memoizedProps = unitOfWork.pendingProps;
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> if (next === null) {
</span><span class="token prefix unchanged"> </span><span class="token line">   completeUnitOfWork(unitOfWork);
</span><span class="token prefix unchanged"> </span><span class="token line"> } else {
</span><span class="token prefix unchanged"> </span><span class="token line">   workInProgress = next;
</span><span class="token prefix unchanged"> </span><span class="token line"> }
</span></span>}

/**
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">* 完成一个工作单元。
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {*} unitOfWork - 工作单元。
</span><span class="token prefix unchanged"> </span><span class="token line">*/
</span></span>function completeUnitOfWork(unitOfWork) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> let completedWork = unitOfWork;
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> do {
</span><span class="token prefix unchanged"> </span><span class="token line">   const current = completedWork.alternate;
</span><span class="token prefix unchanged"> </span><span class="token line">   const returnFiber = completedWork.return;
</span><span class="token prefix unchanged"> </span><span class="token line">   completeWork(current, completedWork);
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">   const siblingFiber = completedWork.sibling;
</span><span class="token prefix unchanged"> </span><span class="token line">   if (siblingFiber !== null) {
</span><span class="token prefix unchanged"> </span><span class="token line">     workInProgress = siblingFiber;
</span><span class="token prefix unchanged"> </span><span class="token line">     return;
</span><span class="token prefix unchanged"> </span><span class="token line">   }
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">   completedWork = returnFiber;
</span><span class="token prefix unchanged"> </span><span class="token line">   workInProgress = completedWork;
</span><span class="token prefix unchanged"> </span><span class="token line"> } while (completedWork !== null);
</span></span>}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-reconciler-src-reactfibercommitwork-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactfibercommitwork-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactFiberCommitWork.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> appendChild<span class="token punctuation">,</span> insertBefore <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom-bindings/src/client/ReactDOMHostConfig&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Placement<span class="token punctuation">,</span> MutationMask <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberFlags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> HostComponent<span class="token punctuation">,</span> HostRoot<span class="token punctuation">,</span> HostText <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactWorkTags&quot;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 递归遍历所有子节点并在每个fiber上应用mutation副作用
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">root</span> - Fiber树的根节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">parentFiber</span> - 当前fiber节点的父节点
 */</span>
<span class="token keyword">function</span> <span class="token function">recursivelyTraverseMutationEffects</span><span class="token punctuation">(</span><span class="token parameter">root<span class="token punctuation">,</span> parentFiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>parentFiber<span class="token punctuation">.</span>subtreeFlags <span class="token operator">&amp;</span> MutationMask<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> <span class="token punctuation">{</span> child <span class="token punctuation">}</span> <span class="token operator">=</span> parentFiber<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">commitMutationEffectsOnFiber</span><span class="token punctuation">(</span>child<span class="token punctuation">,</span> root<span class="token punctuation">)</span><span class="token punctuation">;</span>
      child <span class="token operator">=</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 应用fiber节点上的调和副作用
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">finishedWork</span> - 已完成的工作单位，即fiber节点
 */</span>
<span class="token keyword">function</span> <span class="token function">commitReconciliationEffects</span><span class="token punctuation">(</span><span class="token parameter">finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> flags <span class="token punctuation">}</span> <span class="token operator">=</span> finishedWork<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">&amp;</span> Placement<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">commitPlacement</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
    finishedWork<span class="token punctuation">.</span>flags <span class="token operator">&amp;=</span> <span class="token operator">~</span>Placement<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 判断是否为宿主父节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">fiber</span> - fiber节点
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>Boolean<span class="token punctuation">}</span></span> 是宿主父节点则返回true，否则返回false
 */</span>
<span class="token keyword">function</span> <span class="token function">isHostParent</span><span class="token punctuation">(</span><span class="token parameter">fiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> fiber<span class="token punctuation">.</span>tag <span class="token operator">===</span> HostComponent <span class="token operator">||</span> fiber<span class="token punctuation">.</span>tag <span class="token operator">==</span> HostRoot<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 获取fiber节点的宿主父节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">fiber</span> - fiber节点
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> fiber节点的宿主父节点
 */</span>
<span class="token keyword">function</span> <span class="token function">getHostParentFiber</span><span class="token punctuation">(</span><span class="token parameter">fiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> parent <span class="token operator">=</span> fiber<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>parent <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isHostParent</span><span class="token punctuation">(</span>parent<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> parent<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    parent <span class="token operator">=</span> parent<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 将节点插入或附加到父节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">node</span> - fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Node<span class="token punctuation">}</span></span> <span class="token parameter">before</span> - 参考节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Node<span class="token punctuation">}</span></span> <span class="token parameter">parent</span> - 父节点
 */</span>
<span class="token keyword">function</span> <span class="token function">insertOrAppendPlacementNode</span><span class="token punctuation">(</span><span class="token parameter">node<span class="token punctuation">,</span> before<span class="token punctuation">,</span> parent</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> tag <span class="token punctuation">}</span> <span class="token operator">=</span> node<span class="token punctuation">;</span>
  <span class="token keyword">const</span> isHost <span class="token operator">=</span> tag <span class="token operator">===</span> HostComponent <span class="token operator">||</span> tag <span class="token operator">===</span> HostText<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>isHost<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span> stateNode <span class="token punctuation">}</span> <span class="token operator">=</span> node<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>before<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">insertBefore</span><span class="token punctuation">(</span>parent<span class="token punctuation">,</span> stateNode<span class="token punctuation">,</span> before<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token function">appendChild</span><span class="token punctuation">(</span>parent<span class="token punctuation">,</span> stateNode<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span> child <span class="token punctuation">}</span> <span class="token operator">=</span> node<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">insertOrAppendPlacementNode</span><span class="token punctuation">(</span>child<span class="token punctuation">,</span> before<span class="token punctuation">,</span> parent<span class="token punctuation">)</span>
      <span class="token keyword">let</span> <span class="token punctuation">{</span> sibling <span class="token punctuation">}</span> <span class="token operator">=</span> child<span class="token punctuation">;</span>
      <span class="token keyword">while</span> <span class="token punctuation">(</span>sibling <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">insertOrAppendPlacementNode</span><span class="token punctuation">(</span>sibling<span class="token punctuation">,</span> before<span class="token punctuation">,</span> parent<span class="token punctuation">)</span>
        sibling <span class="token operator">=</span> sibling<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 获取宿主兄弟节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">fiber</span> - fiber节点
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>Node<span class="token operator">|</span><span class="token keyword">null</span><span class="token punctuation">}</span></span> 如果存在宿主兄弟节点则返回，否则返回null
 */</span>
<span class="token keyword">function</span> <span class="token function">getHostSibling</span><span class="token punctuation">(</span><span class="token parameter">fiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> node <span class="token operator">=</span> fiber<span class="token punctuation">;</span>
  <span class="token literal-property property">siblings</span><span class="token operator">:</span> <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>sibling <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>return <span class="token operator">===</span> <span class="token keyword">null</span> <span class="token operator">||</span> <span class="token function">isHostParent</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span>return<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      node <span class="token operator">=</span> node<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    node <span class="token operator">=</span> node<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>tag <span class="token operator">!==</span> HostComponent <span class="token operator">&amp;&amp;</span> node<span class="token punctuation">.</span>tag <span class="token operator">!==</span> HostText<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>flags <span class="token operator">&amp;</span> Placement<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">continue</span> siblings<span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        node <span class="token operator">=</span> node<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span>flags <span class="token operator">&amp;</span> Placement<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> node<span class="token punctuation">.</span>stateNode<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 提交位置
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">finishedWork</span> - 已完成的工作单位，即fiber节点
 */</span>
<span class="token keyword">function</span> <span class="token function">commitPlacement</span><span class="token punctuation">(</span><span class="token parameter">finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> parentFiber <span class="token operator">=</span> <span class="token function">getHostParentFiber</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>parentFiber<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> parent <span class="token operator">=</span> parentFiber<span class="token punctuation">.</span>stateNode<span class="token punctuation">.</span>containerInfo<span class="token punctuation">;</span>
      <span class="token keyword">const</span> before <span class="token operator">=</span> <span class="token function">getHostSibling</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">insertOrAppendPlacementNode</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">,</span> before<span class="token punctuation">,</span> parent<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> parent <span class="token operator">=</span> parentFiber<span class="token punctuation">.</span>stateNode<span class="token punctuation">;</span>
      <span class="token keyword">const</span> before <span class="token operator">=</span> <span class="token function">getHostSibling</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">insertOrAppendPlacementNode</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">,</span> before<span class="token punctuation">,</span> parent<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 遍历fiber树并在每个fiber上应用mutation副作用
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">finishedWork</span> - 已完成的工作单位，即fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">root</span> - fiber树的根节点
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">commitMutationEffectsOnFiber</span><span class="token punctuation">(</span><span class="token parameter">finishedWork<span class="token punctuation">,</span> root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostComponent</span><span class="token operator">:</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostText</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">recursivelyTraverseMutationEffects</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">commitReconciliationEffects</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-dom-bindings-src-client-reactdomhostconfig-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-client-reactdomhostconfig-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/client/ReactDOMHostConfig.js</h2><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>// 引入初始属性设置函数
import { setInitialProperties } from &#39;./ReactDOMComponent&#39;;

/**
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">* 判断是否需要设置文本内容
</span><span class="token prefix unchanged"> </span><span class="token line">*
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {string} type - DOM元素的类型
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {Object} props - 元素属性对象
</span><span class="token prefix unchanged"> </span><span class="token line">* @return {boolean} - 如果children属性是字符串或数字，返回true，否则返回false
</span><span class="token prefix unchanged"> </span><span class="token line">*
</span><span class="token prefix unchanged"> </span><span class="token line">* shouldSetTextContent函数用于判断基于给定的属性，是否应该设置DOM元素的文本内容。
</span><span class="token prefix unchanged"> </span><span class="token line">*/
</span></span>export function shouldSetTextContent(type, props) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> return typeof props.children === &quot;string&quot; || typeof props.children === &quot;number&quot;;
</span></span>}

/**
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">* 创建文本节点实例
</span><span class="token prefix unchanged"> </span><span class="token line">*
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {string} content - 文本内容
</span><span class="token prefix unchanged"> </span><span class="token line">* @return {Text} - 创建的文本节点
</span><span class="token prefix unchanged"> </span><span class="token line">*
</span><span class="token prefix unchanged"> </span><span class="token line">* createTextInstance函数用于创建一个新的文本节点，其中的内容是传入的content参数。
</span><span class="token prefix unchanged"> </span><span class="token line">*/
</span></span>export function createTextInstance(content) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> return document.createTextNode(content);
</span></span>}

/**
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">* 创建DOM元素实例
</span><span class="token prefix unchanged"> </span><span class="token line">*
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {string} type - DOM元素的类型
</span><span class="token prefix unchanged"> </span><span class="token line">* @return {HTMLElement} - 创建的DOM元素
</span><span class="token prefix unchanged"> </span><span class="token line">*
</span><span class="token prefix unchanged"> </span><span class="token line">* createInstance函数用于创建一个新的DOM元素，元素类型由传入的type参数指定。
</span><span class="token prefix unchanged"> </span><span class="token line">*/
</span></span>export function createInstance(type) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> const domElement = document.createElement(type);
</span><span class="token prefix unchanged"> </span><span class="token line"> return domElement;
</span></span>}

/**
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">* 将初始子节点附加到父节点
</span><span class="token prefix unchanged"> </span><span class="token line">*
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {HTMLElement} parent - 父节点
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {HTMLElement|Text} child - 子节点
</span><span class="token prefix unchanged"> </span><span class="token line">*
</span><span class="token prefix unchanged"> </span><span class="token line">* appendInitialChild函数用于将子节点附加到指定的父节点。
</span><span class="token prefix unchanged"> </span><span class="token line">*/
</span></span>export function appendInitialChild(parent, child) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> parent.appendChild(child);
</span></span>}

/**
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">* 为DOM元素设置初始属性
</span><span class="token prefix unchanged"> </span><span class="token line">*
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {HTMLElement} domElement - 目标DOM元素
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {string} type - DOM元素的类型
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {Object} props - 需要设置的属性对象
</span><span class="token prefix unchanged"> </span><span class="token line">*
</span><span class="token prefix unchanged"> </span><span class="token line">* finalizeInitialChildren函数用于在DOM元素创建完成后，设置其初始属性。
</span><span class="token prefix unchanged"> </span><span class="token line">*/
</span></span>export function finalizeInitialChildren(domElement, type, props) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> setInitialProperties(domElement, type, props);
</span></span>}

<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 将子节点附加到父节点
</span><span class="token prefix inserted">+</span><span class="token line"> *
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {HTMLElement} parentInstance - 父节点
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {HTMLElement|Text} child - 子节点
</span><span class="token prefix inserted">+</span><span class="token line"> *
</span><span class="token prefix inserted">+</span><span class="token line"> * appendChild函数用于将子节点附加到指定的父节点。
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span><span class="token prefix inserted">+</span><span class="token line">export function appendChild(parentInstance, child) {
</span><span class="token prefix inserted">+</span><span class="token line">  parentInstance.appendChild(child);
</span><span class="token prefix inserted">+</span><span class="token line">}
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 在指定子节点前插入新的子节点
</span><span class="token prefix inserted">+</span><span class="token line"> *
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {HTMLElement} parentInstance - 父节点
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {HTMLElement|Text} child - 需要插入的新子节点
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {HTMLElement|Text} beforeChild - 指定的子节点
</span><span class="token prefix inserted">+</span><span class="token line"> *
</span><span class="token prefix inserted">+</span><span class="token line"> * insertBefore函数用于在父节点的指定子节点前插入一个新的子节点。
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span><span class="token prefix inserted">+</span><span class="token line">export function insertBefore(parentInstance, child, beforeChild) {
</span><span class="token prefix inserted">+</span><span class="token line">  parentInstance.insertBefore(child, beforeChild);
</span><span class="token prefix inserted">+</span><span class="token line">}
</span></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8),t=[i];function c(l,o){return s(),a("div",null,t)}const u=n(p,[["render",c],["__file","08.commitWork.html.vue"]]);export{u as default};
