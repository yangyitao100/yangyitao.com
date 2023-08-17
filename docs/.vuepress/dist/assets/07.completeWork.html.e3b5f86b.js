import{_ as n,o as s,c as a,f as e}from"./app.d86bc82c.js";const p="/assets/fibertree.0509ffa7.png",t={},i=e('<h1 id="_07-completework" tabindex="-1"><a class="header-anchor" href="#_07-completework" aria-hidden="true">#</a> 07.completeWork</h1><p>同学们好，这一小节我们就来实现render函数中completeWork部分的逻辑。 <img src="'+p+`" alt="fibertree"></p><h2 id="packages-react-reconciler-src-reactfiberworkloop-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactfiberworkloop-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactFiberWorkLoop.js</h2><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>import { scheduleCallback } from &quot;scheduler&quot;;
import { createWorkInProgress } from &quot;./ReactFiber&quot;;
import { beginWork } from &quot;./ReactFiberBeginWork&quot;;
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">import { completeWork } from &quot;./ReactFiberCompleteWork&quot;;
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
</span></span><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span><span class="token line"> //commitRoot(root);
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line"> commitRoot(root);
</span></span>}

<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 提交根节点。
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {*} root - 根节点。
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span><span class="token prefix inserted">+</span><span class="token line">function commitRoot(root) {
</span><span class="token prefix inserted">+</span><span class="token line">  console.log(&#39;开始commitWork&#39;)
</span><span class="token prefix inserted">+</span><span class="token line">}
</span></span>
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
</span></span><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span><span class="token line"> workInProgress = null //临时加上，防止死循环 
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> if (next === null) {
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
<span class="token deleted-sign deleted"><span class="token prefix deleted">-</span><span class="token line"> console.log(&#39;开启comleteWork阶段&#39;)
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  let completedWork = unitOfWork;
</span><span class="token prefix inserted">+</span><span class="token line">
</span><span class="token prefix inserted">+</span><span class="token line">  do {
</span><span class="token prefix inserted">+</span><span class="token line">    const current = completedWork.alternate;
</span><span class="token prefix inserted">+</span><span class="token line">    const returnFiber = completedWork.return;
</span><span class="token prefix inserted">+</span><span class="token line">    completeWork(current, completedWork);
</span><span class="token prefix inserted">+</span><span class="token line">
</span><span class="token prefix inserted">+</span><span class="token line">    const siblingFiber = completedWork.sibling;
</span><span class="token prefix inserted">+</span><span class="token line">    if (siblingFiber !== null) {
</span><span class="token prefix inserted">+</span><span class="token line">      workInProgress = siblingFiber;
</span><span class="token prefix inserted">+</span><span class="token line">      return;
</span><span class="token prefix inserted">+</span><span class="token line">    }
</span><span class="token prefix inserted">+</span><span class="token line">
</span><span class="token prefix inserted">+</span><span class="token line">    completedWork = returnFiber;
</span><span class="token prefix inserted">+</span><span class="token line">    workInProgress = completedWork;
</span><span class="token prefix inserted">+</span><span class="token line">  } while (completedWork !== null);
</span></span>}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-reconciler-src-reactfibercompletework-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactfibercompletework-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactFiberCompleteWork.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>
  createTextInstance<span class="token punctuation">,</span>
  createInstance<span class="token punctuation">,</span>
  appendInitialChild<span class="token punctuation">,</span>
  finalizeInitialChildren
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;react-dom-bindings/src/client/ReactDOMHostConfig&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> NoFlags <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberFlags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> HostComponent<span class="token punctuation">,</span> HostRoot<span class="token punctuation">,</span> HostText <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactWorkTags&quot;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 为完成的fiber节点的父DOM节点添加所有子DOM节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>DOM<span class="token punctuation">}</span></span> <span class="token parameter">parent</span> - 完成的fiber节点对应的真实DOM节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">workInProgress</span> - 已完成的Fiber节点
 */</span>
<span class="token keyword">function</span> <span class="token function">appendAllChildren</span><span class="token punctuation">(</span><span class="token parameter">parent<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> node <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>node<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>tag <span class="token operator">===</span> HostComponent <span class="token operator">||</span> node<span class="token punctuation">.</span>tag <span class="token operator">===</span> HostText<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">appendInitialChild</span><span class="token punctuation">(</span>parent<span class="token punctuation">,</span> node<span class="token punctuation">.</span>stateNode<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      node <span class="token operator">=</span> node<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
      <span class="token keyword">continue</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>node <span class="token operator">===</span> workInProgress<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>sibling <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>return <span class="token operator">===</span> <span class="token keyword">null</span> <span class="token operator">||</span> node<span class="token punctuation">.</span>return <span class="token operator">===</span> workInProgress<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      node <span class="token operator">=</span> node<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    node <span class="token operator">=</span> node<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 完成一个Fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">current</span> - 当前旧的Fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">workInProgress</span> - 新建的Fiber节点
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">completeWork</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> newProps <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>pendingProps<span class="token punctuation">;</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>workInProgress<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span>
      <span class="token function">bubbleProperties</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostComponent</span><span class="token operator">:</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span> type <span class="token punctuation">}</span> <span class="token operator">=</span> workInProgress<span class="token punctuation">;</span>
      <span class="token keyword">const</span> instance <span class="token operator">=</span> <span class="token function">createInstance</span><span class="token punctuation">(</span>type<span class="token punctuation">,</span> newProps<span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">appendAllChildren</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
      workInProgress<span class="token punctuation">.</span>stateNode <span class="token operator">=</span> instance<span class="token punctuation">;</span>
      <span class="token function">finalizeInitialChildren</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> type<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">bubbleProperties</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostText</span><span class="token operator">:</span>
      <span class="token keyword">const</span> newText <span class="token operator">=</span> newProps<span class="token punctuation">;</span>
      workInProgress<span class="token punctuation">.</span>stateNode <span class="token operator">=</span> <span class="token function">createTextInstance</span><span class="token punctuation">(</span>newText<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">bubbleProperties</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 冒泡处理已完成Fiber节点的属性
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">completedWork</span> - 已完成的Fiber节点
 */</span>
<span class="token keyword">function</span> <span class="token function">bubbleProperties</span><span class="token punctuation">(</span><span class="token parameter">completedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> subtreeFlags <span class="token operator">=</span> NoFlags<span class="token punctuation">;</span>
  <span class="token keyword">let</span> child <span class="token operator">=</span> completedWork<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    subtreeFlags <span class="token operator">|=</span> child<span class="token punctuation">.</span>subtreeFlags<span class="token punctuation">;</span>
    subtreeFlags <span class="token operator">|=</span> child<span class="token punctuation">.</span>flags<span class="token punctuation">;</span>
    child <span class="token operator">=</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  completedWork<span class="token punctuation">.</span>subtreeFlags <span class="token operator">=</span> subtreeFlags<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-dom-bindings-src-client-reactdomhostconfig-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-client-reactdomhostconfig-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/client/ReactDOMHostConfig.js</h2><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">// 引入初始属性设置函数
</span><span class="token prefix inserted">+</span><span class="token line">import { setInitialProperties } from &#39;./ReactDOMComponent&#39;;
</span></span>
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

<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 创建文本节点实例
</span><span class="token prefix inserted">+</span><span class="token line"> *
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {string} content - 文本内容
</span><span class="token prefix inserted">+</span><span class="token line"> * @return {Text} - 创建的文本节点
</span><span class="token prefix inserted">+</span><span class="token line"> *
</span><span class="token prefix inserted">+</span><span class="token line"> * createTextInstance函数用于创建一个新的文本节点，其中的内容是传入的content参数。
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span><span class="token prefix inserted">+</span><span class="token line">export function createTextInstance(content) {
</span><span class="token prefix inserted">+</span><span class="token line">  return document.createTextNode(content);
</span><span class="token prefix inserted">+</span><span class="token line">}
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 创建DOM元素实例
</span><span class="token prefix inserted">+</span><span class="token line"> *
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {string} type - DOM元素的类型
</span><span class="token prefix inserted">+</span><span class="token line"> * @return {HTMLElement} - 创建的DOM元素
</span><span class="token prefix inserted">+</span><span class="token line"> *
</span><span class="token prefix inserted">+</span><span class="token line"> * createInstance函数用于创建一个新的DOM元素，元素类型由传入的type参数指定。
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span><span class="token prefix inserted">+</span><span class="token line">export function createInstance(type) {
</span><span class="token prefix inserted">+</span><span class="token line">  const domElement = document.createElement(type);
</span><span class="token prefix inserted">+</span><span class="token line">  return domElement;
</span><span class="token prefix inserted">+</span><span class="token line">}
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 将初始子节点附加到父节点
</span><span class="token prefix inserted">+</span><span class="token line"> *
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {HTMLElement} parent - 父节点
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {HTMLElement|Text} child - 子节点
</span><span class="token prefix inserted">+</span><span class="token line"> *
</span><span class="token prefix inserted">+</span><span class="token line"> * appendInitialChild函数用于将子节点附加到指定的父节点。
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span><span class="token prefix inserted">+</span><span class="token line">export function appendInitialChild(parent, child) {
</span><span class="token prefix inserted">+</span><span class="token line">  parent.appendChild(child);
</span><span class="token prefix inserted">+</span><span class="token line">}
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 为DOM元素设置初始属性
</span><span class="token prefix inserted">+</span><span class="token line"> *
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {HTMLElement} domElement - 目标DOM元素
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {string} type - DOM元素的类型
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {Object} props - 需要设置的属性对象
</span><span class="token prefix inserted">+</span><span class="token line"> *
</span><span class="token prefix inserted">+</span><span class="token line"> * finalizeInitialChildren函数用于在DOM元素创建完成后，设置其初始属性。
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span><span class="token prefix inserted">+</span><span class="token line">export function finalizeInitialChildren(domElement, type, props) {
</span><span class="token prefix inserted">+</span><span class="token line">  setInitialProperties(domElement, type, props);
</span><span class="token prefix inserted">+</span><span class="token line">}
</span></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-dom-bindings-src-client-reactdomcomponent-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-client-reactdomcomponent-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/client/ReactDOMComponent.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 引入CSS样式设置函数</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> setValueForStyles <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./CSSPropertyOperations&#39;</span><span class="token punctuation">;</span>
<span class="token comment">// 引入文本设置函数</span>
<span class="token keyword">import</span> setTextContent <span class="token keyword">from</span> <span class="token string">&#39;./setTextContent&#39;</span><span class="token punctuation">;</span>
<span class="token comment">// 引入DOM属性设置函数</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> setValueForProperty <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./DOMPropertyOperations&#39;</span><span class="token punctuation">;</span>


<span class="token doc-comment comment">/**
 * 设置初始DOM属性
 * 
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">tag</span> - DOM元素的标签名
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>HTMLElement<span class="token punctuation">}</span></span> <span class="token parameter">domElement</span> - 目标DOM元素
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">nextProps</span> - 需要设置的属性对象
 *
 * setInitialDOMProperties函数用于设置目标DOM元素的初始属性。它遍历nextProps对象中的所有属性，
 * 对于&#39;style&#39;属性，使用setValueForStyles函数设置DOM元素的样式；
 * 对于&#39;children&#39;属性，根据属性值的类型（字符串或数字），使用setTextContent函数设置DOM元素的文本内容；
 * 对于其他非空属性，使用setValueForProperty函数设置DOM元素的对应属性。
 */</span>
<span class="token keyword">function</span> <span class="token function">setInitialDOMProperties</span><span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> domElement<span class="token punctuation">,</span> nextProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> propKey <span class="token keyword">in</span> nextProps<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>nextProps<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>propKey<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> nextProp <span class="token operator">=</span> nextProps<span class="token punctuation">[</span>propKey<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>propKey <span class="token operator">===</span> <span class="token string">&#39;style&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">setValueForStyles</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> nextProp<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>propKey <span class="token operator">==</span> <span class="token string">&#39;children&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> nextProp <span class="token operator">===</span> <span class="token string">&#39;string&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">setTextContent</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> nextProp<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> nextProp <span class="token operator">===</span> <span class="token string">&#39;number&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">setTextContent</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>nextProp<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>nextProp <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">setValueForProperty</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> propKey<span class="token punctuation">,</span> nextProp<span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 设置初始属性
 *
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>HTMLElement<span class="token punctuation">}</span></span> <span class="token parameter">domElement</span> - 目标DOM元素
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">tag</span> - DOM元素的标签名
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">props</span> - 需要设置的属性对象
 *
 * setInitialProperties函数是setInitialDOMProperties函数的外部接口，它直接调用setInitialDOMProperties函数，
 * 将传入的参数domElement, tag, props作为参数传递给setInitialDOMProperties函数。
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">setInitialProperties</span><span class="token punctuation">(</span><span class="token parameter">domElement<span class="token punctuation">,</span> tag<span class="token punctuation">,</span> props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">setInitialDOMProperties</span><span class="token punctuation">(</span>tag<span class="token punctuation">,</span> domElement<span class="token punctuation">,</span> props<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-dom-bindings-src-client-csspropertyoperations-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-client-csspropertyoperations-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/client/CSSPropertyOperations.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 设置节点的样式
 *
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>HTMLElement<span class="token punctuation">}</span></span> <span class="token parameter">node</span> - 目标节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">styles</span> - 包含样式属性和值的对象
 *
 * setValueForStyles函数用于遍历传入的styles对象，并将其属性值应用到目标节点的style属性中。
 * 该函数首先获取节点的style属性，然后遍历styles对象。如果styles对象有对应的样式属性，则获取对应的样式值，
 * 并将该样式值应用到节点的style属性中。
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">setValueForStyles</span><span class="token punctuation">(</span><span class="token parameter">node<span class="token punctuation">,</span> styles</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> style <span class="token punctuation">}</span> <span class="token operator">=</span> node<span class="token punctuation">;</span>

  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> styleName <span class="token keyword">in</span> styles<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>styles<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>styleName<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> styleValue <span class="token operator">=</span> styles<span class="token punctuation">[</span>styleName<span class="token punctuation">]</span><span class="token punctuation">;</span>
      style<span class="token punctuation">[</span>styleName<span class="token punctuation">]</span> <span class="token operator">=</span> styleValue<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-dom-bindings-src-client-settextcontent-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-client-settextcontent-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/client/setTextContent.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 设置节点的文本内容
 *
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>HTMLElement<span class="token punctuation">}</span></span> <span class="token parameter">node</span> - 需要设置文本内容的DOM节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">text</span> - 需要设置的文本内容
 *
 * setTextContent函数用于设置指定DOM节点的文本内容。
 */</span>
<span class="token keyword">function</span> <span class="token function">setTextContent</span><span class="token punctuation">(</span><span class="token parameter">node<span class="token punctuation">,</span> text</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  node<span class="token punctuation">.</span>textContent <span class="token operator">=</span> text<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 导出setTextContent函数</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> setTextContent<span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-dom-bindings-src-client-dompropertyoperations-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-client-dompropertyoperations-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/client/DOMPropertyOperations.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 设置节点的属性
 *
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>HTMLElement<span class="token punctuation">}</span></span> <span class="token parameter">node</span> - 目标节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">name</span> - 属性名
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">value</span> - 属性值
 *
 * setValueForProperty函数用于设置目标节点的属性。如果传入的属性值为null，
 * 则会移除节点的对应属性，否则，会将属性值设置到节点的对应属性上。
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">setValueForProperty</span><span class="token punctuation">(</span><span class="token parameter">node<span class="token punctuation">,</span> name<span class="token punctuation">,</span> value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>value <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    node<span class="token punctuation">.</span><span class="token function">removeAttribute</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    node<span class="token punctuation">.</span><span class="token function">setAttribute</span><span class="token punctuation">(</span>name<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,16),l=[i];function c(o,r){return s(),a("div",null,l)}const u=n(t,[["render",c],["__file","07.completeWork.html.vue"]]);export{u as default};
