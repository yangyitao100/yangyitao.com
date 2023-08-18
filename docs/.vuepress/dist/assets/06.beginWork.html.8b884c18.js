import{_ as n,o as s,c as a,f as e}from"./app.00462568.js";const p={},i=e(`<h1 id="_06-beginwork" tabindex="-1"><a class="header-anchor" href="#_06-beginwork" aria-hidden="true">#</a> 06.beginWork</h1><p>同学们好，这一小节我们就来实现render函数中beginWork部分的逻辑。</p><h2 id="packages-react-reconciler-src-reactfiberworkloop-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactfiberworkloop-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactFiberWorkLoop.js</h2><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>import { scheduleCallback } from &quot;scheduler&quot;;
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line"> import { createWorkInProgress } from &quot;./ReactFiber&quot;;
</span><span class="token prefix inserted">+</span><span class="token line"> import { beginWork } from &quot;./ReactFiberBeginWork&quot;;
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line"> let workInProgress = null;
</span></span>
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
<span class="token deleted-sign deleted"><span class="token prefix deleted">-</span><span class="token line"> console.log(&#39;正式开启beginwork、completeWork、commitWork&#39;)
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  renderRootSync(root);
</span><span class="token prefix inserted">+</span><span class="token line">  const finishedWork = root.current.alternate;
</span><span class="token prefix inserted">+</span><span class="token line">  root.finishedWork = finishedWork;
</span><span class="token prefix inserted">+</span><span class="token line">  // commitRoot(root);
</span></span>}

<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 准备一个新的工作栈。
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {*} root - 根节点。
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span><span class="token prefix inserted">+</span><span class="token line">function prepareFreshStack(root) {
</span><span class="token prefix inserted">+</span><span class="token line">  workInProgress = createWorkInProgress(root.current, null);
</span><span class="token prefix inserted">+</span><span class="token line">}
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 同步渲染根节点。
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {*} root - 根节点。
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span><span class="token prefix inserted">+</span><span class="token line">function renderRootSync(root) {
</span><span class="token prefix inserted">+</span><span class="token line">  prepareFreshStack(root);
</span><span class="token prefix inserted">+</span><span class="token line">  workLoopSync();
</span><span class="token prefix inserted">+</span><span class="token line">}
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 同步工作循环。
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span><span class="token prefix inserted">+</span><span class="token line">function workLoopSync() {
</span><span class="token prefix inserted">+</span><span class="token line">  while (workInProgress !== null) {
</span><span class="token prefix inserted">+</span><span class="token line">    performUnitOfWork(workInProgress);
</span><span class="token prefix inserted">+</span><span class="token line">  }
</span><span class="token prefix inserted">+</span><span class="token line">}
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 执行一个工作单元。
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {*} unitOfWork - 工作单元。
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span><span class="token prefix inserted">+</span><span class="token line">function performUnitOfWork(unitOfWork) {
</span><span class="token prefix inserted">+</span><span class="token line">  const current = unitOfWork.alternate;
</span><span class="token prefix inserted">+</span><span class="token line">  const next = beginWork(current, unitOfWork);
</span><span class="token prefix inserted">+</span><span class="token line">  unitOfWork.memoizedProps = unitOfWork.pendingProps;
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  workInProgress = null //临时加上，防止死循环 
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  if (next === null) {
</span><span class="token prefix inserted">+</span><span class="token line">    completeUnitOfWork(unitOfWork);
</span><span class="token prefix inserted">+</span><span class="token line">  } else {
</span><span class="token prefix inserted">+</span><span class="token line">    workInProgress = next;
</span><span class="token prefix inserted">+</span><span class="token line">  }
</span><span class="token prefix inserted">+</span><span class="token line">}
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 完成一个工作单元。
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {*} unitOfWork - 工作单元。
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span><span class="token prefix inserted">+</span><span class="token line">function completeUnitOfWork(unitOfWork) {
</span><span class="token prefix inserted">+</span><span class="token line">  console.log(&#39;开启comleteWork阶段&#39;)
</span><span class="token prefix inserted">+</span><span class="token line">}
</span></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-reconciler-src-reactfiber-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactfiber-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactFiber.js</h2><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>// 导入React中的一些工作标签和标记
<span class="token deleted-sign deleted"><span class="token prefix deleted">-</span><span class="token line">import { HostRoot} from &quot;./ReactWorkTags&quot;;
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">import { HostComponent, HostRoot, IndeterminateComponent, HostText } from &quot;./ReactWorkTags&quot;;
</span></span>import { NoFlags } from &quot;./ReactFiberFlags&quot;;

/**
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">* 构造函数，用于创建一个新的Fiber节点
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {number} tag - fiber的类型，如函数组件、类组件、原生组件、根元素等
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {*} pendingProps - 新属性，等待处理或者说生效的属性
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {*} key - 唯一标识
</span><span class="token prefix unchanged"> </span><span class="token line">*/
</span></span>export function FiberNode(tag, pendingProps, key) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> this.tag = tag;
</span><span class="token prefix unchanged"> </span><span class="token line"> this.key = key;
</span><span class="token prefix unchanged"> </span><span class="token line"> this.type = null; 
</span><span class="token prefix unchanged"> </span><span class="token line"> this.stateNode = null; 
</span><span class="token prefix unchanged"> </span><span class="token line"> this.return = null; 
</span><span class="token prefix unchanged"> </span><span class="token line"> this.child = null;
</span><span class="token prefix unchanged"> </span><span class="token line"> this.sibling = null;
</span><span class="token prefix unchanged"> </span><span class="token line"> this.pendingProps = pendingProps; 
</span><span class="token prefix unchanged"> </span><span class="token line"> this.memoizedProps = null; 
</span><span class="token prefix unchanged"> </span><span class="token line"> this.memoizedState = null;
</span><span class="token prefix unchanged"> </span><span class="token line"> this.updateQueue = null;
</span><span class="token prefix unchanged"> </span><span class="token line"> this.flags = NoFlags; 
</span><span class="token prefix unchanged"> </span><span class="token line"> this.subtreeFlags = NoFlags;
</span><span class="token prefix unchanged"> </span><span class="token line"> this.alternate = null;
</span><span class="token prefix unchanged"> </span><span class="token line"> this.index = 0;
</span></span>}

/**
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">* 用于创建新的Fiber节点
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {number} tag - fiber的类型
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {*} pendingProps - 新属性
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {*} key - 唯一标识
</span><span class="token prefix unchanged"> </span><span class="token line">* @returns {FiberNode} 新的Fiber节点
</span><span class="token prefix unchanged"> </span><span class="token line">*/
</span></span>export function createFiber(tag, pendingProps, key) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> return new FiberNode(tag, pendingProps, key);
</span></span>}

/**
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">* 创建新的HostRoot类型的Fiber节点
</span><span class="token prefix unchanged"> </span><span class="token line">* @returns {FiberNode} 新的HostRoot类型的Fiber节点
</span><span class="token prefix unchanged"> </span><span class="token line">*/
</span></span>export function createHostRootFiber() {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> return createFiber(HostRoot, null, null);
</span></span>}

<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 基于旧的Fiber节点和新的属性创建一个新的Fiber节点
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {FiberNode} current - 旧的Fiber节点
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {*} pendingProps - 新的属性
</span><span class="token prefix inserted">+</span><span class="token line"> * @returns {FiberNode} 新的Fiber节点
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span><span class="token prefix inserted">+</span><span class="token line">export function createWorkInProgress(current, pendingProps) {
</span><span class="token prefix inserted">+</span><span class="token line">  let workInProgress = current.alternate;
</span><span class="token prefix inserted">+</span><span class="token line">  if (workInProgress === null) {
</span><span class="token prefix inserted">+</span><span class="token line">    workInProgress = createFiber(current.tag, pendingProps, current.key);
</span><span class="token prefix inserted">+</span><span class="token line">    workInProgress.type = current.type;
</span><span class="token prefix inserted">+</span><span class="token line">    workInProgress.stateNode = current.stateNode;
</span><span class="token prefix inserted">+</span><span class="token line">    workInProgress.alternate = current;
</span><span class="token prefix inserted">+</span><span class="token line">    current.alternate = workInProgress;
</span><span class="token prefix inserted">+</span><span class="token line">  } else {
</span><span class="token prefix inserted">+</span><span class="token line">    workInProgress.pendingProps = pendingProps;
</span><span class="token prefix inserted">+</span><span class="token line">    workInProgress.type = current.type;
</span><span class="token prefix inserted">+</span><span class="token line">    workInProgress.flags = NoFlags;
</span><span class="token prefix inserted">+</span><span class="token line">    workInProgress.subtreeFlags = NoFlags;
</span><span class="token prefix inserted">+</span><span class="token line">  }
</span><span class="token prefix inserted">+</span><span class="token line">  workInProgress.child = current.child;
</span><span class="token prefix inserted">+</span><span class="token line">  workInProgress.memoizedProps = current.memoizedProps;
</span><span class="token prefix inserted">+</span><span class="token line">  workInProgress.memoizedState = current.memoizedState;
</span><span class="token prefix inserted">+</span><span class="token line">  workInProgress.updateQueue = current.updateQueue;
</span><span class="token prefix inserted">+</span><span class="token line">  workInProgress.sibling = current.sibling;
</span><span class="token prefix inserted">+</span><span class="token line">  workInProgress.index = current.index;
</span><span class="token prefix inserted">+</span><span class="token line">  return workInProgress;
</span><span class="token prefix inserted">+</span><span class="token line">}
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 从虚拟DOM创建新的Fiber节点
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {*} element - 虚拟DOM元素
</span><span class="token prefix inserted">+</span><span class="token line"> * @returns {FiberNode} 新的Fiber节点
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span><span class="token prefix inserted">+</span><span class="token line">export function createFiberFromElement(element) {
</span><span class="token prefix inserted">+</span><span class="token line">  const { type, key, props: pendingProps } = element;
</span><span class="token prefix inserted">+</span><span class="token line">  return createFiberFromTypeAndProps(type, key, pendingProps);
</span><span class="token prefix inserted">+</span><span class="token line">}
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 从类型和属性创建新的Fiber节点
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {*} type - Fiber节点的类型
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {*} key - 唯一标识
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {*} pendingProps - 新的属性
</span><span class="token prefix inserted">+</span><span class="token line"> * @returns {FiberNode} 新的Fiber节点
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span><span class="token prefix inserted">+</span><span class="token line">function createFiberFromTypeAndProps(type, key, pendingProps) {
</span><span class="token prefix inserted">+</span><span class="token line">  let tag = IndeterminateComponent;
</span><span class="token prefix inserted">+</span><span class="token line">  if (typeof type === &quot;string&quot;) {
</span><span class="token prefix inserted">+</span><span class="token line">    tag = HostComponent;
</span><span class="token prefix inserted">+</span><span class="token line">  }
</span><span class="token prefix inserted">+</span><span class="token line">  const fiber = createFiber(tag, pendingProps, key);
</span><span class="token prefix inserted">+</span><span class="token line">  fiber.type = type;
</span><span class="token prefix inserted">+</span><span class="token line">  return fiber;
</span><span class="token prefix inserted">+</span><span class="token line">}
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 创建一个新的文本类型的Fiber节点
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {*} content - 文本内容
</span><span class="token prefix inserted">+</span><span class="token line"> * @returns {FiberNode} 新的文本类型的Fiber节点
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span><span class="token prefix inserted">+</span><span class="token line">export function createFiberFromText(content) {
</span><span class="token prefix inserted">+</span><span class="token line">  return createFiber(HostText, content, null);
</span><span class="token prefix inserted">+</span><span class="token line">}
</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-reconciler-src-reactfiberbeginwork-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactfiberbeginwork-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactFiberBeginWork.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> HostComponent<span class="token punctuation">,</span> HostRoot<span class="token punctuation">,</span> HostText <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactWorkTags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> processUpdateQueue <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberClassUpdateQueue&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> mountChildFibers<span class="token punctuation">,</span> reconcileChildFibers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactChildFiber&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> shouldSetTextContent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom-bindings/src/client/ReactDOMHostConfig&quot;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 根据新的虚拟DOM生成新的Fiber链表
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> <span class="token parameter">current</span> - 老的父Fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> <span class="token parameter">workInProgress</span> - 新的Fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">nextChildren</span> - 新的子虚拟DOM
 */</span>
<span class="token keyword">function</span> <span class="token function">reconcileChildren</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> nextChildren</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>current <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    workInProgress<span class="token punctuation">.</span>child <span class="token operator">=</span> <span class="token function">mountChildFibers</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> nextChildren<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    workInProgress<span class="token punctuation">.</span>child <span class="token operator">=</span> <span class="token function">reconcileChildFibers</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">,</span> current<span class="token punctuation">.</span>child<span class="token punctuation">,</span> nextChildren<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 更新HostRoot类型的Fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> <span class="token parameter">current</span> - 老的Fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> <span class="token parameter">workInProgress</span> - 新的Fiber节点
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> 新的子Fiber节点
 */</span>
<span class="token keyword">function</span> <span class="token function">updateHostRoot</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">processUpdateQueue</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> nextState <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>memoizedState<span class="token punctuation">;</span>
  <span class="token keyword">const</span> nextChildren <span class="token operator">=</span> nextState<span class="token punctuation">.</span>element<span class="token punctuation">;</span>
  <span class="token function">reconcileChildren</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> nextChildren<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> workInProgress<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 更新原生组件的Fiber节点并构建子Fiber链表
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> <span class="token parameter">current</span> - 老的Fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> <span class="token parameter">workInProgress</span> - 新的Fiber节点
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> 新的子Fiber节点
 */</span>
<span class="token keyword">function</span> <span class="token function">updateHostComponent</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> type <span class="token punctuation">}</span> <span class="token operator">=</span> workInProgress<span class="token punctuation">;</span>
  <span class="token keyword">const</span> nextProps <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>pendingProps<span class="token punctuation">;</span>
  <span class="token keyword">let</span> nextChildren <span class="token operator">=</span> nextProps<span class="token punctuation">.</span>children<span class="token punctuation">;</span>
  <span class="token keyword">const</span> isDirectTextChild <span class="token operator">=</span> <span class="token function">shouldSetTextContent</span><span class="token punctuation">(</span>type<span class="token punctuation">,</span> nextProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>isDirectTextChild<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    nextChildren <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">reconcileChildren</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> nextChildren<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> workInProgress<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 开始根据新的虚拟DOM构建新的Fiber子链表
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> <span class="token parameter">current</span> - 老的Fiber节点
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token punctuation">}</span></span> <span class="token parameter">workInProgress</span> - 新的Fiber节点
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>FiberNode<span class="token operator">|</span><span class="token keyword">null</span><span class="token punctuation">}</span></span> 新的子Fiber节点或者null
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">beginWork</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>workInProgress<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span>
      <span class="token keyword">return</span> <span class="token function">updateHostRoot</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostComponent</span><span class="token operator">:</span>
      <span class="token keyword">return</span> <span class="token function">updateHostComponent</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostText</span><span class="token operator">:</span>
      <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">default</span><span class="token operator">:</span>
      <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-dom-bindings-src-client-reactdomhostconfig-js" tabindex="-1"><a class="header-anchor" href="#packages-react-dom-bindings-src-client-reactdomhostconfig-js" aria-hidden="true">#</a> packages/react-dom-bindings/src/client/ReactDOMHostConfig.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 判断是否需要设置文本内容
 *
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">type</span> - DOM元素的类型
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">props</span> - 元素属性对象
 * <span class="token keyword">@return</span> <span class="token class-name"><span class="token punctuation">{</span>boolean<span class="token punctuation">}</span></span> - 如果children属性是字符串或数字，返回true，否则返回false
 *
 * shouldSetTextContent函数用于判断基于给定的属性，是否应该设置DOM元素的文本内容。
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">shouldSetTextContent</span><span class="token punctuation">(</span><span class="token parameter">type<span class="token punctuation">,</span> props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">typeof</span> props<span class="token punctuation">.</span>children <span class="token operator">===</span> <span class="token string">&quot;string&quot;</span> <span class="token operator">||</span> <span class="token keyword">typeof</span> props<span class="token punctuation">.</span>children <span class="token operator">===</span> <span class="token string">&quot;number&quot;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-reconciler-src-reactfiberclassupdatequeue-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactfiberclassupdatequeue-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactFiberClassUpdateQueue.js</h2><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>import { markUpdateLaneFromFiberToRoot } from &quot;./ReactFiberConcurrentUpdates&quot;;
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">import assign from &quot;shared/assign&quot;;
</span></span>
// 定义状态更新的类型标签
export const UpdateState = 0;

/**
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">* 初始化fiber节点的更新队列
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {FiberNode} fiber - 需要初始化更新队列的fiber节点
</span><span class="token prefix unchanged"> </span><span class="token line">*/
</span></span>export function initialUpdateQueue(fiber) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> const queue = {
</span><span class="token prefix unchanged"> </span><span class="token line">   shared: {
</span><span class="token prefix unchanged"> </span><span class="token line">     pending: null, // 创建一个新的更新队列，其中pending是一个循环链表
</span><span class="token prefix unchanged"> </span><span class="token line">   },
</span><span class="token prefix unchanged"> </span><span class="token line"> };
</span><span class="token prefix unchanged"> </span><span class="token line"> fiber.updateQueue = queue;
</span></span>}

/**
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">* 创建一个状态更新对象
</span><span class="token prefix unchanged"> </span><span class="token line">* @returns {Update} 更新对象
</span><span class="token prefix unchanged"> </span><span class="token line">*/
</span></span>export function createUpdate() {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> const update = { tag: UpdateState };
</span><span class="token prefix unchanged"> </span><span class="token line"> return update;
</span></span>}

/**
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">* 将更新对象添加到fiber节点的更新队列中
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {FiberNode} fiber - 需要添加更新的fiber节点
</span><span class="token prefix unchanged"> </span><span class="token line">* @param {Update} update - 待添加的更新对象
</span><span class="token prefix unchanged"> </span><span class="token line">* @returns {FiberNode} fiber根节点
</span><span class="token prefix unchanged"> </span><span class="token line">*/
</span></span>export function enqueueUpdate(fiber, update) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> const updateQueue = fiber.updateQueue;
</span><span class="token prefix unchanged"> </span><span class="token line"> const pending = updateQueue.shared.pending;
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> // 如果pending为空，则让update自引用形成一个循环链表
</span><span class="token prefix unchanged"> </span><span class="token line"> if (pending === null) {
</span><span class="token prefix unchanged"> </span><span class="token line">   update.next = update;
</span><span class="token prefix unchanged"> </span><span class="token line"> } else {
</span><span class="token prefix unchanged"> </span><span class="token line">   update.next = pending.next;
</span><span class="token prefix unchanged"> </span><span class="token line">   pending.next = update;
</span><span class="token prefix unchanged"> </span><span class="token line"> }
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> // pending始终指向最后一个更新对象，形成一个单向循环链表
</span><span class="token prefix unchanged"> </span><span class="token line"> updateQueue.shared.pending = update;
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> return markUpdateLaneFromFiberToRoot(fiber);
</span></span>}

<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 根据老状态和更新队列中的更新计算最新的状态
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {FiberNode} workInProgress - 需要计算新状态的fiber节点
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span><span class="token prefix inserted">+</span><span class="token line">export function processUpdateQueue(workInProgress) {
</span><span class="token prefix inserted">+</span><span class="token line">  const queue = workInProgress.updateQueue;
</span><span class="token prefix inserted">+</span><span class="token line">  const pendingQueue = queue.shared.pending;
</span><span class="token prefix inserted">+</span><span class="token line">
</span><span class="token prefix inserted">+</span><span class="token line">  // 如果有更新，则清空更新队列并开始计算新的状态
</span><span class="token prefix inserted">+</span><span class="token line">  if (pendingQueue !== null) {
</span><span class="token prefix inserted">+</span><span class="token line">    queue.shared.pending = null;
</span><span class="token prefix inserted">+</span><span class="token line">    const lastPendingUpdate = pendingQueue;
</span><span class="token prefix inserted">+</span><span class="token line">    const firstPendingUpdate = lastPendingUpdate.next;
</span><span class="token prefix inserted">+</span><span class="token line">
</span><span class="token prefix inserted">+</span><span class="token line">    // 把更新链表剪开，变成一个单链表
</span><span class="token prefix inserted">+</span><span class="token line">    lastPendingUpdate.next = null;
</span><span class="token prefix inserted">+</span><span class="token line">    let newState = workInProgress.memoizedState;
</span><span class="token prefix inserted">+</span><span class="token line">    let update = firstPendingUpdate;
</span><span class="token prefix inserted">+</span><span class="token line">
</span><span class="token prefix inserted">+</span><span class="token line">    // 遍历更新队列，根据老状态和更新对象计算新状态
</span><span class="token prefix inserted">+</span><span class="token line">    while (update) {
</span><span class="token prefix inserted">+</span><span class="token line">      newState = getStateFromUpdate(update, newState);
</span><span class="token prefix inserted">+</span><span class="token line">      update = update.next;
</span><span class="token prefix inserted">+</span><span class="token line">    }
</span><span class="token prefix inserted">+</span><span class="token line">
</span><span class="token prefix inserted">+</span><span class="token line">    // 更新fiber节点的memoizedState
</span><span class="token prefix inserted">+</span><span class="token line">    workInProgress.memoizedState = newState;
</span><span class="token prefix inserted">+</span><span class="token line">  }
</span><span class="token prefix inserted">+</span><span class="token line">}
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">/**
</span><span class="token prefix inserted">+</span><span class="token line"> * 根据老状态和更新对象计算新状态
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {Update} update - 更新对象
</span><span class="token prefix inserted">+</span><span class="token line"> * @param {*} prevState - 老状态
</span><span class="token prefix inserted">+</span><span class="token line"> * @returns {*} 新状态
</span><span class="token prefix inserted">+</span><span class="token line"> */
</span><span class="token prefix inserted">+</span><span class="token line">function getStateFromUpdate(update, prevState) {
</span><span class="token prefix inserted">+</span><span class="token line">  switch (update.tag) {
</span><span class="token prefix inserted">+</span><span class="token line">    case UpdateState:
</span><span class="token prefix inserted">+</span><span class="token line">      const { payload } = update;
</span><span class="token prefix inserted">+</span><span class="token line">      // 合并prevState和payload为新状态
</span><span class="token prefix inserted">+</span><span class="token line">      return assign({}, prevState, payload);
</span><span class="token prefix inserted">+</span><span class="token line">  }
</span><span class="token prefix inserted">+</span><span class="token line">}
</span></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-reconciler-src-reactchildfiber-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactchildfiber-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactChildFiber.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> <span class="token constant">REACT_ELEMENT_TYPE</span> <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;shared/ReactSymbols&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createFiberFromElement<span class="token punctuation">,</span> createFiberFromText <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiber&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Placement <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberFlags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> isArray <span class="token keyword">from</span> <span class="token string">&quot;shared/isArray&quot;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 创建Child Reconciler的函数
 *
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>boolean<span class="token punctuation">}</span></span> <span class="token parameter">shouldTrackSideEffects</span> - 是否需要跟踪副作用
 * <span class="token keyword">@return</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token keyword">function</span><span class="token punctuation">}</span></span> reconcileChildFibers - 用于处理子fiber的函数
 *
 * 这个函数会根据传入的shouldTrackSideEffects参数返回一个函数reconcileChildFibers，
 * reconcileChildFibers函数可以根据新旧Fiber进行比较并返回处理结果。
 */</span>
<span class="token keyword">function</span> <span class="token function">createChildReconciler</span><span class="token punctuation">(</span><span class="token parameter">shouldTrackSideEffects</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  
  <span class="token doc-comment comment">/**
   * 将新创建的元素转换为fiber
   *
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">returnFiber</span> - 新的父Fiber
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">currentFirstFiber</span> - 老fiber第一个子fiber
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>object<span class="token punctuation">}</span></span> <span class="token parameter">element</span> - 新的子虚拟DOM元素
   * <span class="token keyword">@return</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> created - 返回新创建的Fiber
   */</span>
  <span class="token keyword">function</span> <span class="token function">reconcileSingleElement</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstFiber<span class="token punctuation">,</span> element</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> created <span class="token operator">=</span> <span class="token function">createFiberFromElement</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span>
    created<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
    <span class="token keyword">return</span> created<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 设置副作用
   *
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">newFiber</span> - 新创建的Fiber
   * <span class="token keyword">@return</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> newFiber - 返回新创建的Fiber
   */</span>
  <span class="token keyword">function</span> <span class="token function">placeSingleChild</span><span class="token punctuation">(</span><span class="token parameter">newFiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>shouldTrackSideEffects<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      newFiber<span class="token punctuation">.</span>flags <span class="token operator">|=</span> Placement<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> newFiber<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 根据新的子节点创建Fiber
   *
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">returnFiber</span> - 新的父Fiber
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>object<span class="token punctuation">}</span></span> <span class="token parameter">newChild</span> - 新的子节点
   * <span class="token keyword">@return</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">}</span></span> created - 返回新创建的Fiber，或null
   */</span>
  <span class="token keyword">function</span> <span class="token function">createChild</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> newChild</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">&quot;string&quot;</span> <span class="token operator">&amp;&amp;</span> newChild <span class="token operator">!==</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">&quot;number&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> created <span class="token operator">=</span> <span class="token function">createFiberFromText</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>newChild<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      created<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
      <span class="token keyword">return</span> created<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">&quot;object&quot;</span> <span class="token operator">&amp;&amp;</span> newChild <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">switch</span> <span class="token punctuation">(</span>newChild<span class="token punctuation">.</span>$$<span class="token keyword">typeof</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">case</span> <span class="token constant">REACT_ELEMENT_TYPE</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token keyword">const</span> created <span class="token operator">=</span> <span class="token function">createFiberFromElement</span><span class="token punctuation">(</span>newChild<span class="token punctuation">)</span><span class="token punctuation">;</span>
          created<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
          <span class="token keyword">return</span> created<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">default</span><span class="token operator">:</span>
          <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 为新创建的Fiber设置索引，并在必要时设置副作用
   *
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">newFiber</span> - 新创建的Fiber
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">newIdx</span> - 新的索引
   */</span>
  <span class="token keyword">function</span> <span class="token function">placeChild</span><span class="token punctuation">(</span><span class="token parameter">newFiber<span class="token punctuation">,</span> newIdx</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    newFiber<span class="token punctuation">.</span>index <span class="token operator">=</span> newIdx<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>shouldTrackSideEffects<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      newFiber<span class="token punctuation">.</span>flags <span class="token operator">|=</span> Placement<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 将新的子节点数组与旧的子Fiber进行比较，并返回新的子Fiber
   *
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">returnFiber</span> - 新的父Fiber
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">currentFirstFiber</span> - 老fiber第一个子fiber
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">}</span></span> <span class="token parameter">newChildren</span> - 新的子节点数组
   * <span class="token keyword">@return</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> resultingFirstChild - 返回的新的子Fiber
   */</span>
  <span class="token keyword">function</span> <span class="token function">reconcileChildrenArray</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstFiber<span class="token punctuation">,</span> newChildren</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> resultingFirstChild <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> 
    <span class="token keyword">let</span> previousNewFiber <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> 
    <span class="token keyword">let</span> newIdx <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span> newIdx <span class="token operator">&lt;</span> newChildren<span class="token punctuation">.</span>length<span class="token punctuation">;</span> newIdx<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> newFiber <span class="token operator">=</span> <span class="token function">createChild</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> newChildren<span class="token punctuation">[</span>newIdx<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>newFiber <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token keyword">continue</span><span class="token punctuation">;</span>
      <span class="token function">placeChild</span><span class="token punctuation">(</span>newFiber<span class="token punctuation">,</span> newIdx<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>previousNewFiber <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        resultingFirstChild <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        previousNewFiber<span class="token punctuation">.</span>sibling <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      previousNewFiber <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> resultingFirstChild<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 比较子Fibers
   *
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">returnFiber</span> - 新的父Fiber
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber<span class="token punctuation">}</span></span> <span class="token parameter">currentFirstFiber</span> - 老fiber第一个子fiber
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>object<span class="token punctuation">}</span></span> <span class="token parameter">newChild</span> - 新的子虚拟DOM
   * <span class="token keyword">@return</span> <span class="token class-name"><span class="token punctuation">{</span>Fiber <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">}</span></span> result - 返回的新的子Fiber，或null
   */</span>
  <span class="token keyword">function</span> <span class="token function">reconcileChildFibers</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstFiber<span class="token punctuation">,</span> newChild</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">&quot;object&quot;</span> <span class="token operator">&amp;&amp;</span> newChild <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">switch</span> <span class="token punctuation">(</span>newChild<span class="token punctuation">.</span>$$<span class="token keyword">typeof</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">case</span> <span class="token constant">REACT_ELEMENT_TYPE</span><span class="token operator">:</span>
          <span class="token keyword">return</span> <span class="token function">placeSingleChild</span><span class="token punctuation">(</span><span class="token function">reconcileSingleElement</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> currentFirstFiber<span class="token punctuation">,</span> newChild<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">default</span><span class="token operator">:</span>
          <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isArray</span><span class="token punctuation">(</span>newChild<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token function">reconcileChildrenArray</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> currentFirstFiber<span class="token punctuation">,</span> newChild<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> reconcileChildFibers<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">//有老父fiber更新的时候用这个</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> reconcileChildFibers <span class="token operator">=</span> <span class="token function">createChildReconciler</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//如果没有老父fiber,初次挂载的时候用这个</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> mountChildFibers <span class="token operator">=</span> <span class="token function">createChildReconciler</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-shared-assign-js" tabindex="-1"><a class="header-anchor" href="#packages-shared-assign-js" aria-hidden="true">#</a> packages/shared/assign.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> assign <span class="token punctuation">}</span> <span class="token operator">=</span> Object<span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> assign<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-shared-isarray-js" tabindex="-1"><a class="header-anchor" href="#packages-shared-isarray-js" aria-hidden="true">#</a> packages/shared/isArray.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> isArray <span class="token punctuation">}</span> <span class="token operator">=</span> Array<span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> isArray<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,18),t=[i];function l(c,o){return s(),a("div",null,t)}const d=n(p,[["render",l],["__file","06.beginWork.html.vue"]]);export{d as default};
