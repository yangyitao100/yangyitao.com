import{_ as n,o as s,c as a,f as e}from"./app.d86bc82c.js";const p={},t=e(`<h1 id="usereducer更新源码实现" tabindex="-1"><a class="header-anchor" href="#usereducer更新源码实现" aria-hidden="true">#</a> useReducer更新源码实现</h1><h2 id="packages-react-reconciler-src-reactfiberhooks-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactfiberhooks-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactFiberHooks.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> currentHook <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> HooksDispatcherOnUpdate <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">useReducer</span><span class="token operator">:</span> updateReducer
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">updateWorkInProgressHook</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>currentHook <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> current <span class="token operator">=</span> currentlyRenderingFiber<span class="token punctuation">.</span>alternate<span class="token punctuation">;</span>
    currentHook <span class="token operator">=</span> current<span class="token punctuation">.</span>memoizedState<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    currentHook <span class="token operator">=</span> currentHook<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">const</span> newHook <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">memoizedState</span><span class="token operator">:</span> currentHook<span class="token punctuation">.</span>memoizedState<span class="token punctuation">,</span>
    <span class="token literal-property property">queue</span><span class="token operator">:</span> currentHook<span class="token punctuation">.</span>queue<span class="token punctuation">,</span>
    <span class="token literal-property property">next</span><span class="token operator">:</span> <span class="token keyword">null</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>workInProgressHook <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    currentlyRenderingFiber<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> workInProgressHook <span class="token operator">=</span> newHook<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    workInProgressHook <span class="token operator">=</span> workInProgressHook<span class="token punctuation">.</span>next <span class="token operator">=</span> newHook<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> workInProgressHook<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">function</span> <span class="token function">updateReducer</span><span class="token punctuation">(</span><span class="token parameter">reducer</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> hook <span class="token operator">=</span> <span class="token function">updateWorkInProgressHook</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> queue <span class="token operator">=</span> hook<span class="token punctuation">.</span>queue<span class="token punctuation">;</span>
  <span class="token keyword">const</span> current <span class="token operator">=</span> currentHook<span class="token punctuation">;</span>
  <span class="token keyword">const</span> pendingQueue <span class="token operator">=</span> queue<span class="token punctuation">.</span>pending<span class="token punctuation">;</span>
  <span class="token keyword">let</span> newState <span class="token operator">=</span> current<span class="token punctuation">.</span>memoizedState<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>pendingQueue <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    queue<span class="token punctuation">.</span>pending <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> firstUpdate <span class="token operator">=</span> pendingQueue<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token keyword">let</span> update <span class="token operator">=</span> firstUpdate<span class="token punctuation">;</span>
    <span class="token keyword">do</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> action <span class="token operator">=</span> update<span class="token punctuation">.</span>action<span class="token punctuation">;</span>
      newState <span class="token operator">=</span> <span class="token function">reducer</span><span class="token punctuation">(</span>newState<span class="token punctuation">,</span> action<span class="token punctuation">)</span><span class="token punctuation">;</span>
      update <span class="token operator">=</span> update<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">while</span> <span class="token punctuation">(</span>update <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> update <span class="token operator">!==</span> firstUpdate<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  hook<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> newState<span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token punctuation">[</span>hook<span class="token punctuation">.</span>memoizedState<span class="token punctuation">,</span> queue<span class="token punctuation">.</span>dispatch<span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">renderWithHooks</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> Component<span class="token punctuation">,</span> props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  currentlyRenderingFiber <span class="token operator">=</span> workInProgress<span class="token punctuation">;</span>  <span class="token comment">// 设置当前正在渲染的fiber节点</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>current <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> current<span class="token punctuation">.</span>memoizedState <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    ReactCurrentDispatcher<span class="token punctuation">.</span>current <span class="token operator">=</span> HooksDispatcherOnUpdate<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    ReactCurrentDispatcher<span class="token punctuation">.</span>current <span class="token operator">=</span> HooksDispatcherOnMount<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">const</span> children <span class="token operator">=</span> <span class="token function">Component</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 通过组件和props渲染子节点</span>
  currentlyRenderingFiber <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  workInProgressHook <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  currentHook <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> children<span class="token punctuation">;</span>  <span class="token comment">// 返回子节点</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-reconciler-src-reactfiberbeginwork-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactfiberbeginwork-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactFiberBeginWork.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">updateFunctionComponent</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> Component<span class="token punctuation">,</span> nextProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> nextChildren <span class="token operator">=</span> <span class="token function">renderWithHooks</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> Component<span class="token punctuation">,</span> nextProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">reconcileChildren</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> nextChildren<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> workInProgress<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">beginWork</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>workInProgress<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">FunctionComponent</span><span class="token operator">:</span> 
      <span class="token keyword">const</span> Component <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>type<span class="token punctuation">;</span>
      <span class="token keyword">const</span> nextProps <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>pendingProps<span class="token punctuation">;</span>
      <span class="token keyword">return</span> <span class="token function">updateFunctionComponent</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> Component<span class="token punctuation">,</span> nextProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-reconciler-src-reactfibercompletework-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactfibercompletework-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactFiberCompleteWork.js</h2><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>import {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> createTextInstance,
</span><span class="token prefix unchanged"> </span><span class="token line"> createInstance,
</span><span class="token prefix unchanged"> </span><span class="token line"> appendInitialChild,
</span><span class="token prefix unchanged"> </span><span class="token line"> finalizeInitialChildren,
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  prepareUpdate
</span></span>} from &#39;react-dom-bindings/src/client/ReactDOMHostConfig&#39;;
import {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">  NoFlags, 
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  Update 
</span></span>} from &quot;./ReactFiberFlags&quot;;
import { 
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> HostComponent, HostRoot, HostText, 
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  FunctionComponent
</span></span>} from &quot;./ReactWorkTags&quot;;

function markUpdate(workInProgress) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> workInProgress.flags |= Update;
</span></span>}
function updateHostComponent(current, workInProgress, type, newProps) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> const oldProps = current.memoizedProps;
</span><span class="token prefix unchanged"> </span><span class="token line"> const instance = workInProgress.stateNode;
</span><span class="token prefix unchanged"> </span><span class="token line"> const updatePayload = prepareUpdate(instance, type, oldProps, newProps);
</span><span class="token prefix unchanged"> </span><span class="token line"> workInProgress.updateQueue = updatePayload;
</span><span class="token prefix unchanged"> </span><span class="token line"> if (updatePayload) {
</span><span class="token prefix unchanged"> </span><span class="token line">   markUpdate(workInProgress);
</span><span class="token prefix unchanged"> </span><span class="token line"> }
</span></span>}

export function completeWork(current, workInProgress) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> const newProps = workInProgress.pendingProps;
</span><span class="token prefix unchanged"> </span><span class="token line"> switch (workInProgress.tag) {
</span><span class="token prefix unchanged"> </span><span class="token line">   case HostRoot:
</span><span class="token prefix unchanged"> </span><span class="token line">     bubbleProperties(workInProgress);
</span><span class="token prefix unchanged"> </span><span class="token line">     break;
</span><span class="token prefix unchanged"> </span><span class="token line">   case HostComponent:
</span><span class="token prefix unchanged"> </span><span class="token line">     const { type } = workInProgress;
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">      if (current !== null &amp;&amp; workInProgress.stateNode !== null) {
</span><span class="token prefix inserted">+</span><span class="token line">        updateHostComponent(current, workInProgress, type, newProps);
</span><span class="token prefix inserted">+</span><span class="token line">      } else {
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">       const instance = createInstance(type, newProps, workInProgress);
</span><span class="token prefix unchanged"> </span><span class="token line">       appendAllChildren(instance, workInProgress);
</span><span class="token prefix unchanged"> </span><span class="token line">       workInProgress.stateNode = instance;
</span><span class="token prefix unchanged"> </span><span class="token line">       finalizeInitialChildren(instance, type, newProps);
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">      }
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">     bubbleProperties(workInProgress);
</span><span class="token prefix unchanged"> </span><span class="token line">     break;
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">    case FunctionComponent:
</span><span class="token prefix inserted">+</span><span class="token line">      bubbleProperties(workInProgress);
</span><span class="token prefix inserted">+</span><span class="token line">      break;
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">   case HostText:
</span><span class="token prefix unchanged"> </span><span class="token line">     const newText = newProps;
</span><span class="token prefix unchanged"> </span><span class="token line">     workInProgress.stateNode = createTextInstance(newText);
</span><span class="token prefix unchanged"> </span><span class="token line">     bubbleProperties(workInProgress);
</span><span class="token prefix unchanged"> </span><span class="token line">     break;
</span><span class="token prefix unchanged"> </span><span class="token line"> }
</span></span>}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7),o=[t];function c(i,l){return s(),a("div",null,o)}const u=n(p,[["render",c],["__file","04.useReducer更新渲染1.html.vue"]]);export{u as default};
