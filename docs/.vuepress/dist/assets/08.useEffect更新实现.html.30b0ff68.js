import{_ as n,o as s,c as a,f as e}from"./app.03bf752b.js";const t={},p=e(`<h1 id="useeffect更新" tabindex="-1"><a class="header-anchor" href="#useeffect更新" aria-hidden="true">#</a> useEffect更新</h1><h2 id="packages-react-reconciler-src-reactfiberhooks-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactfiberhooks-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactFiberHooks.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>
<span class="token keyword">function</span> <span class="token function">updateEffect</span><span class="token punctuation">(</span><span class="token parameter">create<span class="token punctuation">,</span> deps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">updateEffectImpl</span><span class="token punctuation">(</span>PassiveEffect<span class="token punctuation">,</span> HookPassive<span class="token punctuation">,</span> create<span class="token punctuation">,</span> deps<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">function</span> <span class="token function">updateEffectImpl</span><span class="token punctuation">(</span><span class="token parameter">fiberFlags<span class="token punctuation">,</span> hookFlags<span class="token punctuation">,</span> create<span class="token punctuation">,</span> deps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> hook <span class="token operator">=</span> <span class="token function">updateWorkInProgressHook</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> nextDeps <span class="token operator">=</span> deps <span class="token operator">===</span> <span class="token keyword">undefined</span> <span class="token operator">?</span> <span class="token keyword">null</span> <span class="token operator">:</span> deps<span class="token punctuation">;</span>
  <span class="token keyword">let</span> destroy<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>currentHook <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> prevEffect <span class="token operator">=</span> currentHook<span class="token punctuation">.</span>memoizedState<span class="token punctuation">;</span>
    destroy <span class="token operator">=</span> prevEffect<span class="token punctuation">.</span>destroy<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>nextDeps <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> prevDeps <span class="token operator">=</span> prevEffect<span class="token punctuation">.</span>deps<span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">areHookInputsEqual</span><span class="token punctuation">(</span>nextDeps<span class="token punctuation">,</span> prevDeps<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        hook<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> <span class="token function">pushEffect</span><span class="token punctuation">(</span>hookFlags<span class="token punctuation">,</span> create<span class="token punctuation">,</span> destroy<span class="token punctuation">,</span> nextDeps<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  currentlyRenderingFiber<span class="token punctuation">.</span>flags <span class="token operator">|=</span> fiberFlags<span class="token punctuation">;</span>
  hook<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> <span class="token function">pushEffect</span><span class="token punctuation">(</span>HookHasEffect <span class="token operator">|</span> hookFlags<span class="token punctuation">,</span> create<span class="token punctuation">,</span> destroy<span class="token punctuation">,</span> nextDeps<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">function</span> <span class="token function">areHookInputsEqual</span><span class="token punctuation">(</span><span class="token parameter">nextDeps<span class="token punctuation">,</span> prevDeps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>prevDeps <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> prevDeps<span class="token punctuation">.</span>length <span class="token operator">&amp;&amp;</span> i <span class="token operator">&lt;</span> nextDeps<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>Object<span class="token punctuation">.</span><span class="token function">is</span><span class="token punctuation">(</span>nextDeps<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> prevDeps<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">continue</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>export function renderWithHooks(current, workInProgress, Component, props) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> currentlyRenderingFiber = workInProgress;  // 设置当前正在渲染的fiber节点
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  workInProgress.updateQueue = null;
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> if (current !== null &amp;&amp; current.memoizedState !== null) {
</span><span class="token prefix unchanged"> </span><span class="token line">   ReactCurrentDispatcher.current = HooksDispatcherOnUpdate;
</span><span class="token prefix unchanged"> </span><span class="token line"> } else {
</span><span class="token prefix unchanged"> </span><span class="token line">   ReactCurrentDispatcher.current = HooksDispatcherOnMount;
</span><span class="token prefix unchanged"> </span><span class="token line"> }
</span><span class="token prefix unchanged"> </span><span class="token line"> const children = Component(props);  // 通过组件和props渲染子节点
</span><span class="token prefix unchanged"> </span><span class="token line"> currentlyRenderingFiber = null;
</span><span class="token prefix unchanged"> </span><span class="token line"> workInProgressHook = null;
</span><span class="token prefix unchanged"> </span><span class="token line"> currentHook = null;
</span><span class="token prefix unchanged"> </span><span class="token line"> return children;  // 返回子节点
</span></span>}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-reconciler-src-reactfiberworkloop-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactfiberworkloop-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactFiberWorkLoop.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> 
  commitMutationEffectsOnFiber<span class="token punctuation">,</span>
  commitPassiveUnmountEffects<span class="token punctuation">,</span>
  commitPassiveMountEffects 
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./ReactFiberCommitWork&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">let</span> rootDoesHavePassiveEffect <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> rootWithPendingPassiveEffects <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token keyword">function</span> <span class="token function">flushPassiveEffect</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>rootWithPendingPassiveEffects <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> root <span class="token operator">=</span> rootWithPendingPassiveEffects<span class="token punctuation">;</span>
    <span class="token function">commitPassiveUnmountEffects</span><span class="token punctuation">(</span>root<span class="token punctuation">.</span>current<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">commitPassiveMountEffects</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> root<span class="token punctuation">.</span>current<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-diff line-numbers-mode" data-ext="diff"><pre class="language-diff"><code>function commitRoot(root) {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> const { finishedWork } = root;
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">  if ((finishedWork.subtreeFlags &amp; Passive) !== NoFlags || (finishedWork.flags &amp; Passive) !== NoFlags) {
</span><span class="token prefix inserted">+</span><span class="token line">    if (!rootDoesHavePassiveEffect) {
</span><span class="token prefix inserted">+</span><span class="token line">      rootDoesHavePassiveEffect = true;
</span><span class="token prefix inserted">+</span><span class="token line">      scheduleCallback(flushPassiveEffect);
</span><span class="token prefix inserted">+</span><span class="token line">    }
</span><span class="token prefix inserted">+</span><span class="token line">  }
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> const subtreeHasEffects = (finishedWork.subtreeFlags &amp; MutationMask) !== NoFlags;
</span><span class="token prefix unchanged"> </span><span class="token line"> const rootHasEffect = (finishedWork.flags &amp; MutationMask) !== NoFlags;
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> if (subtreeHasEffects || rootHasEffect) {
</span><span class="token prefix unchanged"> </span><span class="token line">   commitMutationEffectsOnFiber(finishedWork, root);
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">    if (rootDoesHavePassiveEffect) {
</span><span class="token prefix inserted">+</span><span class="token line">      rootDoesHavePassiveEffect = false;
</span><span class="token prefix inserted">+</span><span class="token line">      rootWithPendingPassiveEffects = root;
</span><span class="token prefix inserted">+</span><span class="token line">    }
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> }
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> root.current = finishedWork;
</span></span>}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="packages-react-reconciler-src-reactfibercommitwork-js" tabindex="-1"><a class="header-anchor" href="#packages-react-reconciler-src-reactfibercommitwork-js" aria-hidden="true">#</a> packages/react-reconciler/src/ReactFiberCommitWork.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Placement<span class="token punctuation">,</span> MutationMask<span class="token punctuation">,</span> Update<span class="token punctuation">,</span> Passive <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberFlags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> HasEffect <span class="token keyword">as</span> HookHasEffect<span class="token punctuation">,</span> Passive <span class="token keyword">as</span> HookPassive <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./ReactHookEffectTags&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">commitPassiveUnmountEffects</span><span class="token punctuation">(</span><span class="token parameter">finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">commitPassiveUnmountOnFiber</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitPassiveUnmountOnFiber</span><span class="token punctuation">(</span><span class="token parameter">finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> flags <span class="token operator">=</span> finishedWork<span class="token punctuation">.</span>flags<span class="token punctuation">;</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">recursivelyTraversePassiveUnmountEffects</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">case</span> <span class="token literal-property property">FunctionComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">recursivelyTraversePassiveUnmountEffects</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">&amp;</span> Passive<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">commitHookPassiveUnmountEffects</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">,</span> HookHasEffect <span class="token operator">|</span> HookPassive<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">recursivelyTraversePassiveUnmountEffects</span><span class="token punctuation">(</span><span class="token parameter">parentFiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>parentFiber<span class="token punctuation">.</span>subtreeFlags <span class="token operator">&amp;</span> Passive<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> child <span class="token operator">=</span> parentFiber<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">commitPassiveUnmountOnFiber</span><span class="token punctuation">(</span>child<span class="token punctuation">)</span><span class="token punctuation">;</span>
      child <span class="token operator">=</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitHookPassiveUnmountEffects</span><span class="token punctuation">(</span><span class="token parameter">finishedWork<span class="token punctuation">,</span> hookFlags</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">commitHookEffectListUnmount</span><span class="token punctuation">(</span>hookFlags<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitHookEffectListUnmount</span><span class="token punctuation">(</span><span class="token parameter">flags<span class="token punctuation">,</span> finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> updateQueue <span class="token operator">=</span> finishedWork<span class="token punctuation">.</span>updateQueue<span class="token punctuation">;</span>
  <span class="token keyword">const</span> lastEffect <span class="token operator">=</span> updateQueue <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">?</span> updateQueue<span class="token punctuation">.</span>lastEffect <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>lastEffect <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> firstEffect <span class="token operator">=</span> lastEffect<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token keyword">let</span> effect <span class="token operator">=</span> firstEffect<span class="token punctuation">;</span>
    <span class="token keyword">do</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>effect<span class="token punctuation">.</span>tag <span class="token operator">&amp;</span> flags<span class="token punctuation">)</span> <span class="token operator">===</span> flags<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> destroy <span class="token operator">=</span> effect<span class="token punctuation">.</span>destroy<span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>destroy <span class="token operator">!==</span> <span class="token keyword">undefined</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">destroy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      effect <span class="token operator">=</span> effect<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">while</span> <span class="token punctuation">(</span>effect <span class="token operator">!==</span> firstEffect<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">commitPassiveMountEffects</span><span class="token punctuation">(</span><span class="token parameter">root<span class="token punctuation">,</span> finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">commitPassiveMountOnFiber</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitPassiveMountOnFiber</span><span class="token punctuation">(</span><span class="token parameter">finishedRoot<span class="token punctuation">,</span> finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> flags <span class="token operator">=</span> finishedWork<span class="token punctuation">.</span>flags<span class="token punctuation">;</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">recursivelyTraversePassiveMountEffects</span><span class="token punctuation">(</span>finishedRoot<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">case</span> <span class="token literal-property property">FunctionComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">recursivelyTraversePassiveMountEffects</span><span class="token punctuation">(</span>finishedRoot<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">&amp;</span> Passive<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">commitHookPassiveMountEffects</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">,</span> HookHasEffect <span class="token operator">|</span> HookPassive<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">recursivelyTraversePassiveMountEffects</span><span class="token punctuation">(</span><span class="token parameter">root<span class="token punctuation">,</span> parentFiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>parentFiber<span class="token punctuation">.</span>subtreeFlags <span class="token operator">&amp;</span> Passive<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> child <span class="token operator">=</span> parentFiber<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">commitPassiveMountOnFiber</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> child<span class="token punctuation">)</span><span class="token punctuation">;</span>
      child <span class="token operator">=</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitHookPassiveMountEffects</span><span class="token punctuation">(</span><span class="token parameter">finishedWork<span class="token punctuation">,</span> hookFlags</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">commitHookEffectListMount</span><span class="token punctuation">(</span>hookFlags<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitHookEffectListMount</span><span class="token punctuation">(</span><span class="token parameter">flags<span class="token punctuation">,</span> finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> updateQueue <span class="token operator">=</span> finishedWork<span class="token punctuation">.</span>updateQueue<span class="token punctuation">;</span>
  <span class="token keyword">const</span> lastEffect <span class="token operator">=</span> updateQueue <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">?</span> updateQueue<span class="token punctuation">.</span>lastEffect <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>lastEffect <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> firstEffect <span class="token operator">=</span> lastEffect<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token keyword">let</span> effect <span class="token operator">=</span> firstEffect<span class="token punctuation">;</span>
    <span class="token keyword">do</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>effect<span class="token punctuation">.</span>tag <span class="token operator">&amp;</span> flags<span class="token punctuation">)</span> <span class="token operator">===</span> flags<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> create <span class="token operator">=</span> effect<span class="token punctuation">.</span>create<span class="token punctuation">;</span>
        effect<span class="token punctuation">.</span>destroy <span class="token operator">=</span> <span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      effect <span class="token operator">=</span> effect<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">while</span> <span class="token punctuation">(</span>effect <span class="token operator">!==</span> firstEffect<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,9),o=[p];function c(i,l){return s(),a("div",null,o)}const r=n(t,[["render",c],["__file","08.useEffect更新实现.html.vue"]]);export{r as default};
