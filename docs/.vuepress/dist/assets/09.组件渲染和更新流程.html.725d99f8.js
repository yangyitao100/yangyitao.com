import{_ as n,o as s,c as a,f as e}from"./app.c996eb5c.js";const t="/assets/09-01.a408d8d7.webp",p={},o=e(`<h1 id="_09-组件渲染和更新流程" tabindex="-1"><a class="header-anchor" href="#_09-组件渲染和更新流程" aria-hidden="true">#</a> 09.组件渲染和更新流程</h1><p><strong>欢迎关注微信公众号：杨艺韬</strong></p><p>前面我们分析<code>patch</code>函数的时候，我们知道了内部通过不同类型的判断来调用不同的函数来比较新旧<strong>虚拟Node</strong>之间的差异并抹平这种差异，当时也介绍了<code>patch</code>函数调用的部分函数实现细节。本文会带着大家分析<code>processElement</code>和<code>processComponent</code>这两个函数的大部分源码实现，并在文末以一张流程图来概括<code>patch</code>函数的核心工作流程，至于<code>diff</code>函数的具体实现，作为一个难点，将会在下一篇文章中深入讲解。</p><h1 id="processelement" tabindex="-1"><a class="header-anchor" href="#processelement" aria-hidden="true">#</a> processElement</h1><p>我们先看看<code>processElement</code>的代码实现：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段1</span>
<span class="token keyword">const</span> <span class="token function-variable function">processElement</span> <span class="token operator">=</span> <span class="token punctuation">(</span>
    n1<span class="token operator">:</span> VNode <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    n2<span class="token operator">:</span> VNode<span class="token punctuation">,</span>
    container<span class="token operator">:</span> RendererElement<span class="token punctuation">,</span>
    anchor<span class="token operator">:</span> RendererNode <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    parentComponent<span class="token operator">:</span> ComponentInternalInstance <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    parentSuspense<span class="token operator">:</span> SuspenseBoundary <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    isSVG<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">,</span>
    slotScopeIds<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    optimized<span class="token operator">:</span> <span class="token builtin">boolean</span>
  <span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    isSVG <span class="token operator">=</span> isSVG <span class="token operator">||</span> <span class="token punctuation">(</span>n2<span class="token punctuation">.</span><span class="token keyword">type</span> <span class="token class-name"><span class="token keyword">as</span></span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">===</span> <span class="token string">&#39;svg&#39;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>n1 <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">mountElement</span><span class="token punctuation">(</span>
        n2<span class="token punctuation">,</span>
        container<span class="token punctuation">,</span>
        anchor<span class="token punctuation">,</span>
        parentComponent<span class="token punctuation">,</span>
        parentSuspense<span class="token punctuation">,</span>
        isSVG<span class="token punctuation">,</span>
        slotScopeIds<span class="token punctuation">,</span>
        optimized
      <span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token function">patchElement</span><span class="token punctuation">(</span>
        n1<span class="token punctuation">,</span>
        n2<span class="token punctuation">,</span>
        parentComponent<span class="token punctuation">,</span>
        parentSuspense<span class="token punctuation">,</span>
        isSVG<span class="token punctuation">,</span>
        slotScopeIds<span class="token punctuation">,</span>
        optimized
      <span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们目前暂时只关注<code>processElement</code>的前<strong>4</strong>个参数。</p><ol><li><code>n1</code>: 旧<strong>虚拟Node</strong>；</li><li><code>n2</code>: 新<strong>虚拟Node</strong>；</li><li><code>container</code>: <strong>虚拟Node</strong>转化为<strong>真实Node</strong>后将要挂载到的<strong>DOM</strong>元素；</li><li><code>anchor</code>:<strong>虚拟Node</strong>转化为<strong>真实Node</strong>后将要挂载到的<strong>DOM</strong>元素上的具体哪个位置。</li></ol><p>对参数有了了解后，我们来看条件判断：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段2</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>n1 <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">mountElement</span><span class="token punctuation">(</span>
        <span class="token comment">// 此处省略若干代码...</span>
      <span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token function">patchElement</span><span class="token punctuation">(</span>
        <span class="token comment">// 此处省略若干代码...</span>
      <span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>代码片段<strong>2</strong>表达的含义很简单，如果<strong>旧虚拟Node</strong>为<code>null</code>，说明旧节点不存在，也就没必要进行所谓的比较，直接调用函数<code>mountElement</code>将<strong>新虚拟Node</strong>也就是参数<code>n2</code>所对应的值，挂载到容器节点中即可。如果<strong>旧虚拟Node</strong>不为<code>null</code>，说明旧节点是存在的，就需要我们比较二者的差异，并以具备优良性能的代码实现来抹平这种差异，而<code>patchElement</code>函数正具备这样的能力。下面我们开始进入到<code>mountElement</code>和<code>patchElement</code>两个函数内部进行分析。</p><h2 id="mountelement" tabindex="-1"><a class="header-anchor" href="#mountelement" aria-hidden="true">#</a> mountElement</h2><p>我们先看看<code>mountElement</code>的源码实现：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段3</span>
<span class="token keyword">const</span> <span class="token function-variable function">mountElement</span> <span class="token operator">=</span> <span class="token punctuation">(</span>
    vnode<span class="token operator">:</span> VNode<span class="token punctuation">,</span>
    container<span class="token operator">:</span> RendererElement<span class="token punctuation">,</span>
    anchor<span class="token operator">:</span> RendererNode <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    parentComponent<span class="token operator">:</span> ComponentInternalInstance <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    parentSuspense<span class="token operator">:</span> SuspenseBoundary <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    isSVG<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">,</span>
    slotScopeIds<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    optimized<span class="token operator">:</span> <span class="token builtin">boolean</span>
  <span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> el<span class="token operator">:</span> RendererElement
    <span class="token keyword">let</span> vnodeHook<span class="token operator">:</span> VNodeHook <span class="token operator">|</span> <span class="token keyword">undefined</span> <span class="token operator">|</span> <span class="token keyword">null</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span> type<span class="token punctuation">,</span> props<span class="token punctuation">,</span> shapeFlag<span class="token punctuation">,</span> transition<span class="token punctuation">,</span> patchFlag<span class="token punctuation">,</span> dirs <span class="token punctuation">}</span> <span class="token operator">=</span> vnode
    <span class="token keyword">if</span> <span class="token punctuation">(</span>
      <span class="token operator">!</span>__DEV__ <span class="token operator">&amp;&amp;</span>
      vnode<span class="token punctuation">.</span>el <span class="token operator">&amp;&amp;</span>
      hostCloneNode <span class="token operator">!==</span> <span class="token keyword">undefined</span> <span class="token operator">&amp;&amp;</span>
      patchFlag <span class="token operator">===</span> PatchFlags<span class="token punctuation">.</span><span class="token constant">HOISTED</span>
    <span class="token punctuation">)</span> <span class="token punctuation">{</span>
      el <span class="token operator">=</span> vnode<span class="token punctuation">.</span>el <span class="token operator">=</span> <span class="token function">hostCloneNode</span><span class="token punctuation">(</span>vnode<span class="token punctuation">.</span>el<span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      el <span class="token operator">=</span> vnode<span class="token punctuation">.</span>el <span class="token operator">=</span> <span class="token function">hostCreateElement</span><span class="token punctuation">(</span>
        vnode<span class="token punctuation">.</span><span class="token keyword">type</span> <span class="token class-name"><span class="token keyword">as</span></span> <span class="token builtin">string</span><span class="token punctuation">,</span>
        isSVG<span class="token punctuation">,</span>
        props <span class="token operator">&amp;&amp;</span> props<span class="token punctuation">.</span><span class="token keyword">is</span><span class="token punctuation">,</span>
        props
      <span class="token punctuation">)</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>shapeFlag <span class="token operator">&amp;</span> ShapeFlags<span class="token punctuation">.</span><span class="token constant">TEXT_CHILDREN</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">hostSetElementText</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> vnode<span class="token punctuation">.</span>children <span class="token keyword">as</span> <span class="token builtin">string</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>shapeFlag <span class="token operator">&amp;</span> ShapeFlags<span class="token punctuation">.</span><span class="token constant">ARRAY_CHILDREN</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">mountChildren</span><span class="token punctuation">(</span>
          vnode<span class="token punctuation">.</span>children <span class="token keyword">as</span> VNodeArrayChildren<span class="token punctuation">,</span>
          el<span class="token punctuation">,</span>
          <span class="token keyword">null</span><span class="token punctuation">,</span>
          parentComponent<span class="token punctuation">,</span>
          parentSuspense<span class="token punctuation">,</span>
          isSVG <span class="token operator">&amp;&amp;</span> type <span class="token operator">!==</span> <span class="token string">&#39;foreignObject&#39;</span><span class="token punctuation">,</span>
          slotScopeIds<span class="token punctuation">,</span>
          optimized
        <span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
      <span class="token comment">// 此处省略了若干代码...</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 此处省略了若干代码...</span>
    <span class="token function">hostInsert</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> container<span class="token punctuation">,</span> anchor<span class="token punctuation">)</span>
    <span class="token comment">// 此处省略了若干代码...</span>
  <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>mountElement</code>内部的实现逻辑是比较丰富了，但为了突出主线，我将回掉<strong>指令</strong>声明周期函数以及处理动画和异步等逻辑相关代码，还有为创建好的<code>DOM</code>元素添加属性的逻辑都省略掉了，这些省略的内容会在特定主题的文章中进行阐述。从代码片段<strong>3</strong>中内容，我们可以认为<code>mountElement</code>主要完成了下面几项工作：</p><ol><li>根据传入的<strong>虚拟Node</strong>创建相应的<strong>真实Node</strong>元素<code>el</code>；</li><li>如果<code>el</code>的子元素为文本，则将文本设置到该元素中，如果子元素为数组，则调用<code>mountChildren</code>函数对每一个子元素进行挂载，而挂载到容器就是我们这里创建的<code>el</code>，当然如果子元素的子元素仍然是数组，则会不断递归直到没有子元素；</li><li>将<code>el</code>挂载到<code>container</code>元素中。</li></ol><p>对于代码片段<strong>3</strong>的第一个<code>if</code>条件判断可能让人疑惑：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段4</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>
      <span class="token operator">!</span>__DEV__ <span class="token operator">&amp;&amp;</span>
      vnode<span class="token punctuation">.</span>el <span class="token operator">&amp;&amp;</span>
      hostCloneNode <span class="token operator">!==</span> <span class="token keyword">undefined</span> <span class="token operator">&amp;&amp;</span>
      patchFlag <span class="token operator">===</span> PatchFlags<span class="token punctuation">.</span><span class="token constant">HOISTED</span>
    <span class="token punctuation">)</span> <span class="token punctuation">{</span>
      el <span class="token operator">=</span> vnode<span class="token punctuation">.</span>el <span class="token operator">=</span> <span class="token function">hostCloneNode</span><span class="token punctuation">(</span>vnode<span class="token punctuation">.</span>el<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们前面说过，所谓挂载就是将创建好的<code>DOM</code>元素添加到目标<code>DOM</code>节点中。那为什么这里还能在某些条件下进行复用呢，实际上<code>Vue3</code>在编译过程中做了静态变量提升，进行了一定程度的优化，才有了这里的判断条件，相关内容会在编译相关的文章中介绍，此处先简单了解即可。</p><h2 id="patchelement" tabindex="-1"><a class="header-anchor" href="#patchelement" aria-hidden="true">#</a> patchElement</h2><p>相较于<code>mountElement</code>，<code>patchElement</code>的逻辑会复杂不少，为什么呢，因为<code>mountElement</code>是不存在寻找差异的，只需要根据<strong>虚拟Node</strong>创建元素并挂载到目标节点上即可。而<code>patchElement</code>需要找出<strong>新虚拟Node</strong>和<strong>旧虚拟Node</strong>之前的不同，而且还要在性能比较优良的情况下对当前的<code>DOM</code>元素进行增加、删出、修改等操作。</p><p>鉴于<code>patchElement</code>内容较多，即使是关键的内容也不少。为了方便描述，我分几个方面来介绍，介绍相关内容的时候把局部代码以单独的代码块呈现。主要涉及到下面几个方面：</p><ol><li><code>patchElement</code>的核心逻辑</li><li><code>patchBlockChildren</code> 与 <code>patchChildren</code>各自的职责</li><li><code>patchFlag</code></li></ol><h3 id="patchelement的核心功能" tabindex="-1"><a class="header-anchor" href="#patchelement的核心功能" aria-hidden="true">#</a> <code>patchElement</code>的核心功能</h3><p>前面我们提到过<code>patchElement</code>的核心功能是寻找差异并抹平差异。但是寻找和抹平什么差异呢？顾名思义<code>patchElement</code>操作的对象是<code>DOM</code>元素，而一个<code>DOM</code>元素其实含有两大块内容，第一块是<code>DOM</code>元素自身的各种属性状态；第二块是<code>DOM</code>元素的子元素。那<code>patchElement</code>其实的核心功能就是利用<code>patchChildren</code>和<code>patchProps</code>分别寻找和抹平子元素的差异及当前<code>DOM</code>元素的属性的差异。由于<code>Vue3</code>内部作来优化，所以不一定总是调用<code>patchChildren</code>和<code>patchProps</code>，也可能是<code>patchBlockChildren</code>或其他函数完成相关工作。</p><p>当然除了核心功能，还有分支功能，分支功能包括调用<strong>指令</strong>和<strong>虚拟Node</strong>对应的和更新相关的生命周期函数以及一些异步流程的处理，介绍完核心流程，后续会有专门的文章介绍相关内容。</p><h3 id="patchblockchildren-与-patchchildren" tabindex="-1"><a class="header-anchor" href="#patchblockchildren-与-patchchildren" aria-hidden="true">#</a> <code>patchBlockChildren</code> 与 <code>patchChildren</code></h3><p>我们这里只需要知道<code>patchBlockChildren</code>和优化相关，相关内容会在后续文章中合适的时机进行介绍，而<code>patchChildren</code>本文也不会讲，因为该函数可以说是整个<code>patchElement</code>函数的灵魂所在，逻辑比较复杂。众所周知的<code>diff</code>算法也会从<code>patchChildren</code>函数开始讲起，请大家期待下一篇文章关于<code>diff</code>算法的解析。</p><h3 id="patchflag" tabindex="-1"><a class="header-anchor" href="#patchflag" aria-hidden="true">#</a> <code>patchFlag</code></h3><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段5</span>
 <span class="token keyword">if</span> <span class="token punctuation">(</span>patchFlag <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>patchFlag <span class="token operator">&amp;</span> PatchFlags<span class="token punctuation">.</span><span class="token constant">FULL_PROPS</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">patchProps</span><span class="token punctuation">(</span>
          el<span class="token punctuation">,</span>
          n2<span class="token punctuation">,</span>
          oldProps<span class="token punctuation">,</span>
          newProps<span class="token punctuation">,</span>
          parentComponent<span class="token punctuation">,</span>
          parentSuspense<span class="token punctuation">,</span>
          isSVG
        <span class="token punctuation">)</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>patchFlag <span class="token operator">&amp;</span> PatchFlags<span class="token punctuation">.</span><span class="token constant">CLASS</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>oldProps<span class="token punctuation">.</span>class <span class="token operator">!==</span> newProps<span class="token punctuation">.</span>class<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">hostPatchProp</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> <span class="token string">&#39;class&#39;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> newProps<span class="token punctuation">.</span>class<span class="token punctuation">,</span> isSVG<span class="token punctuation">)</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>patchFlag <span class="token operator">&amp;</span> PatchFlags<span class="token punctuation">.</span><span class="token constant">STYLE</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">hostPatchProp</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> <span class="token string">&#39;style&#39;</span><span class="token punctuation">,</span> oldProps<span class="token punctuation">.</span>style<span class="token punctuation">,</span> newProps<span class="token punctuation">.</span>style<span class="token punctuation">,</span> isSVG<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>patchFlag <span class="token operator">&amp;</span> PatchFlags<span class="token punctuation">.</span><span class="token constant">PROPS</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">const</span> propsToUpdate <span class="token operator">=</span> n2<span class="token punctuation">.</span>dynamicProps<span class="token operator">!</span>
          <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> propsToUpdate<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">const</span> key <span class="token operator">=</span> propsToUpdate<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
            <span class="token keyword">const</span> prev <span class="token operator">=</span> oldProps<span class="token punctuation">[</span>key<span class="token punctuation">]</span>
            <span class="token keyword">const</span> next <span class="token operator">=</span> newProps<span class="token punctuation">[</span>key<span class="token punctuation">]</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>next <span class="token operator">!==</span> prev <span class="token operator">||</span> key <span class="token operator">===</span> <span class="token string">&#39;value&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
              <span class="token function">hostPatchProp</span><span class="token punctuation">(</span>
                el<span class="token punctuation">,</span>
                key<span class="token punctuation">,</span>
                prev<span class="token punctuation">,</span>
                next<span class="token punctuation">,</span>
                isSVG<span class="token punctuation">,</span>
                n1<span class="token punctuation">.</span>children <span class="token keyword">as</span> VNode<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
                parentComponent<span class="token punctuation">,</span>
                parentSuspense<span class="token punctuation">,</span>
                unmountChildren
              <span class="token punctuation">)</span>
            <span class="token punctuation">}</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>patchFlag <span class="token operator">&amp;</span> PatchFlags<span class="token punctuation">.</span><span class="token constant">TEXT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>n1<span class="token punctuation">.</span>children <span class="token operator">!==</span> n2<span class="token punctuation">.</span>children<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">hostSetElementText</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> n2<span class="token punctuation">.</span>children <span class="token keyword">as</span> <span class="token builtin">string</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>optimized <span class="token operator">&amp;&amp;</span> dynamicChildren <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">patchProps</span><span class="token punctuation">(</span>
        el<span class="token punctuation">,</span>
        n2<span class="token punctuation">,</span>
        oldProps<span class="token punctuation">,</span>
        newProps<span class="token punctuation">,</span>
        parentComponent<span class="token punctuation">,</span>
        parentSuspense<span class="token punctuation">,</span>
        isSVG
      <span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>代码片段<strong>5</strong>的内容逻辑还是很清晰的，但是有一点需要提出来，就是形如<code>patchFlag &amp; PatchFlags.TEXT</code>的代码，这雨上一篇文章介绍的<code>ShapeFlags</code>原理是一致的。我们来看看<code>PatchFlags</code>的代码实现：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段6</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token keyword">enum</span> PatchFlags <span class="token punctuation">{</span>
  <span class="token constant">TEXT</span> <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">,</span>
  <span class="token constant">CLASS</span> <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">1</span><span class="token punctuation">,</span>
  <span class="token constant">STYLE</span> <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">2</span><span class="token punctuation">,</span>
  <span class="token constant">PROPS</span> <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">3</span><span class="token punctuation">,</span>
  <span class="token constant">FULL_PROPS</span> <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">4</span><span class="token punctuation">,</span>
  <span class="token constant">HYDRATE_EVENTS</span> <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">5</span><span class="token punctuation">,</span>
  <span class="token constant">STABLE_FRAGMENT</span> <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">6</span><span class="token punctuation">,</span>
  <span class="token constant">KEYED_FRAGMENT</span> <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">7</span><span class="token punctuation">,</span>
  <span class="token constant">UNKEYED_FRAGMENT</span> <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">8</span><span class="token punctuation">,</span>
  <span class="token constant">NEED_PATCH</span> <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">9</span><span class="token punctuation">,</span>
  <span class="token constant">DYNAMIC_SLOTS</span> <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">10</span><span class="token punctuation">,</span>
  <span class="token constant">DEV_ROOT_FRAGMENT</span> <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">11</span><span class="token punctuation">,</span>
  <span class="token constant">HOISTED</span> <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">,</span>
  <span class="token constant">BAIL</span> <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">2</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从代码片段<strong>6</strong>中不难发现，<code>PatchFlags</code>代表了要操作哪种类型的属性，同时从代码片段<strong>5</strong>结合上一篇文章中关于位运算的介绍，也不难发现变量<code>patchFlag</code>可以同时表达多种状态，比如既可以操作<code>class</code>属性又可以操作<code>style</code>属性等等。</p><h1 id="processcomponent" tabindex="-1"><a class="header-anchor" href="#processcomponent" aria-hidden="true">#</a> processComponent</h1><p>我们先看看<code>processComponent</code>函数的源码实现：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段7</span>
<span class="token keyword">const</span> <span class="token function-variable function">processComponent</span> <span class="token operator">=</span> <span class="token punctuation">(</span>
    n1<span class="token operator">:</span> VNode <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    n2<span class="token operator">:</span> VNode<span class="token punctuation">,</span>
    container<span class="token operator">:</span> RendererElement<span class="token punctuation">,</span>
    anchor<span class="token operator">:</span> RendererNode <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    parentComponent<span class="token operator">:</span> ComponentInternalInstance <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    parentSuspense<span class="token operator">:</span> SuspenseBoundary <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    isSVG<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">,</span>
    slotScopeIds<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    optimized<span class="token operator">:</span> <span class="token builtin">boolean</span>
  <span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    n2<span class="token punctuation">.</span>slotScopeIds <span class="token operator">=</span> slotScopeIds
    <span class="token keyword">if</span> <span class="token punctuation">(</span>n1 <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>n2<span class="token punctuation">.</span>shapeFlag <span class="token operator">&amp;</span> ShapeFlags<span class="token punctuation">.</span><span class="token constant">COMPONENT_KEPT_ALIVE</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token punctuation">;</span><span class="token punctuation">(</span>parentComponent<span class="token operator">!</span><span class="token punctuation">.</span>ctx <span class="token keyword">as</span> KeepAliveContext<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">activate</span><span class="token punctuation">(</span>
          n2<span class="token punctuation">,</span>
          container<span class="token punctuation">,</span>
          anchor<span class="token punctuation">,</span>
          isSVG<span class="token punctuation">,</span>
          optimized
        <span class="token punctuation">)</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token function">mountComponent</span><span class="token punctuation">(</span>
          n2<span class="token punctuation">,</span>
          container<span class="token punctuation">,</span>
          anchor<span class="token punctuation">,</span>
          parentComponent<span class="token punctuation">,</span>
          parentSuspense<span class="token punctuation">,</span>
          isSVG<span class="token punctuation">,</span>
          optimized
        <span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token function">updateComponent</span><span class="token punctuation">(</span>n1<span class="token punctuation">,</span> n2<span class="token punctuation">,</span> optimized<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这一块逻辑其实和<code>processComponent</code>有高的相似度，不同的是对于组件有<code>keep-alive</code>相关特性，本文暂不做介绍。接下来我们就进行<code>mountComponent</code>和<code>updateComponent</code>两个函数中分析其实现。</p><h2 id="mountcomponent" tabindex="-1"><a class="header-anchor" href="#mountcomponent" aria-hidden="true">#</a> mountComponent</h2><p>我们先进入<code>mountComponent</code>函数中去：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段8</span>
<span class="token keyword">const</span> mountComponent<span class="token operator">:</span> <span class="token function-variable function">MountComponentFn</span> <span class="token operator">=</span> <span class="token punctuation">(</span>
    initialVNode<span class="token punctuation">,</span>
    container<span class="token punctuation">,</span>
    anchor<span class="token punctuation">,</span>
    parentComponent<span class="token punctuation">,</span>
    parentSuspense<span class="token punctuation">,</span>
    isSVG<span class="token punctuation">,</span>
    optimized
  <span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token comment">// 此处省略若干代码...</span>
    <span class="token keyword">const</span> instance<span class="token operator">:</span> ComponentInternalInstance <span class="token operator">=</span>
      compatMountInstance <span class="token operator">||</span>
      <span class="token punctuation">(</span>initialVNode<span class="token punctuation">.</span>component <span class="token operator">=</span> <span class="token function">createComponentInstance</span><span class="token punctuation">(</span>
        initialVNode<span class="token punctuation">,</span>
        parentComponent<span class="token punctuation">,</span>
        parentSuspense
      <span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token comment">// 此处省略若干代码...</span>
    <span class="token function">setupRenderEffect</span><span class="token punctuation">(</span>
      instance<span class="token punctuation">,</span>
      initialVNode<span class="token punctuation">,</span>
      container<span class="token punctuation">,</span>
      anchor<span class="token punctuation">,</span>
      parentSuspense<span class="token punctuation">,</span>
      isSVG<span class="token punctuation">,</span>
      optimized
    <span class="token punctuation">)</span>
    <span class="token comment">// 此处省略若干代码...</span>
  <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在省略了若干代码后，留下了最关键的代码，体现了<code>mountComponent</code>函数的关键的两项工作：</p><ol><li>通过函数<code>createComponentInstance</code>创建组件实例；</li><li>在函数<code>setupRenderEffect</code>中为组件实例创建渲染子组件的函数并传给<code>ReactiveEffect</code>实例，使该函数能够在响应式数据发生变化的时候重新执行。</li></ol><p>接下来我们就进入<code>createComponentInstance</code>和<code>setupRenderEffect</code>两个函数中一探究竟。</p><h3 id="createcomponentinstance" tabindex="-1"><a class="header-anchor" href="#createcomponentinstance" aria-hidden="true">#</a> createComponentInstance</h3><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段9</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createComponentInstance</span><span class="token punctuation">(</span>
  vnode<span class="token operator">:</span> VNode<span class="token punctuation">,</span>
  parent<span class="token operator">:</span> ComponentInternalInstance <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
  suspense<span class="token operator">:</span> SuspenseBoundary <span class="token operator">|</span> <span class="token keyword">null</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 此处省略若干代码...</span>
  <span class="token keyword">const</span> instance<span class="token operator">:</span> ComponentInternalInstance <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token comment">// 此处省略若干代码...</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 此处省略若干代码...</span>

  <span class="token keyword">return</span> instance
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们需要知道，所谓的组件实例实际上就是一个对象，对应代码片段<strong>9</strong>中的对象<code>instance</code>。当然既然是组件实例，意味着这里的参数<code>vnode</code>代表的<strong>虚拟Node</strong>的类型是组件，接着会将该组件实例作为参数传给<code>setupRenderEffect</code>，现在我们进入该函数进行分析。</p><h3 id="setuprendereffect" tabindex="-1"><a class="header-anchor" href="#setuprendereffect" aria-hidden="true">#</a> setupRenderEffect</h3><p>先查看相关代码实现：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段10</span>
<span class="token keyword">const</span> setupRenderEffect<span class="token operator">:</span> <span class="token function-variable function">SetupRenderEffectFn</span> <span class="token operator">=</span> <span class="token punctuation">(</span>
    instance<span class="token punctuation">,</span>
    initialVNode<span class="token punctuation">,</span>
    container<span class="token punctuation">,</span>
    anchor<span class="token punctuation">,</span>
    parentSuspense<span class="token punctuation">,</span>
    isSVG<span class="token punctuation">,</span>
    optimized
  <span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token function-variable function">componentUpdateFn</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token comment">// 此处省略若干代码...</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">const</span> effect <span class="token operator">=</span> <span class="token punctuation">(</span>instance<span class="token punctuation">.</span>effect <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ReactiveEffect</span><span class="token punctuation">(</span>
      componentUpdateFn<span class="token punctuation">,</span>
      <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">queueJob</span><span class="token punctuation">(</span>instance<span class="token punctuation">.</span>update<span class="token punctuation">)</span><span class="token punctuation">,</span>
      instance<span class="token punctuation">.</span>scope 
    <span class="token punctuation">)</span><span class="token punctuation">)</span>

    <span class="token keyword">const</span> update <span class="token operator">=</span> <span class="token punctuation">(</span>instance<span class="token punctuation">.</span>update <span class="token operator">=</span> effect<span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">.</span><span class="token function">bind</span><span class="token punctuation">(</span>effect<span class="token punctuation">)</span> <span class="token keyword">as</span> SchedulerJob<span class="token punctuation">)</span>
    update<span class="token punctuation">.</span>id <span class="token operator">=</span> instance<span class="token punctuation">.</span>uid
    <span class="token comment">// 此处省略若干代码...</span>
    <span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>代码片段<strong>10</strong>中对逻辑进行了大量精简只留下了最关键的逻辑。不难看出，函数<code>setupRenderEffect</code>主要完成了<strong>3</strong>项工作：</p><ol><li>定义函数<code>componentUpdateFn</code>;</li><li>创建<code>ReactiveEffect</code>实例，将定义的函数<code>componentUpdateFn</code>作为构造函数的参数传入；</li><li>把<code>effect.run.bind(effect)</code>作为组件实例<code>instance</code>的<code>update</code>属性的值；</li></ol><p>完成这<strong>3</strong>步后会带来什么结果呢？结果就是当函数<code>componentUpdateFn</code>中用到的响应式数据发生变化后会被重新执行。我们知道函数<code>mountComponent</code>的功能是将组件所对应的<code>DOM</code>树挂载到目标节点上。那也就不难知道函数<code>componentUpdateFn</code>的核心作用就是将组件实例转化成真实的<code>DOM</code>树并把该<code>DOM</code>树挂载到容器节点上。至于具体怎么实现，请看下文。</p><h3 id="componentupdatefn" tabindex="-1"><a class="header-anchor" href="#componentupdatefn" aria-hidden="true">#</a> componentUpdateFn</h3><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段11</span>
   <span class="token keyword">const</span> <span class="token function-variable function">componentUpdateFn</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>instance<span class="token punctuation">.</span>isMounted<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 此处省略若干代码...</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>el <span class="token operator">&amp;&amp;</span> hydrateNode<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token comment">// 此处省略若干代码...</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          <span class="token comment">// 此处省略若干代码...</span>
          <span class="token keyword">const</span> subTree <span class="token operator">=</span> <span class="token punctuation">(</span>instance<span class="token punctuation">.</span>subTree <span class="token operator">=</span> <span class="token function">renderComponentRoot</span><span class="token punctuation">(</span>instance<span class="token punctuation">)</span><span class="token punctuation">)</span>
          <span class="token comment">// 此处省略若干代码...</span>
          <span class="token function">patch</span><span class="token punctuation">(</span>
            <span class="token keyword">null</span><span class="token punctuation">,</span>
            subTree<span class="token punctuation">,</span>
            container<span class="token punctuation">,</span>
            anchor<span class="token punctuation">,</span>
            instance<span class="token punctuation">,</span>
            parentSuspense<span class="token punctuation">,</span>
            isSVG
          <span class="token punctuation">)</span>
          <span class="token comment">// 此处省略若干代码...</span>
          initialVNode<span class="token punctuation">.</span>el <span class="token operator">=</span> subTree<span class="token punctuation">.</span>el
        <span class="token punctuation">}</span>
        <span class="token comment">// 此处省略若干代码...</span>
        instance<span class="token punctuation">.</span>isMounted <span class="token operator">=</span> <span class="token boolean">true</span>
        <span class="token comment">// 此处省略若干代码...</span>
        initialVNode <span class="token operator">=</span> container <span class="token operator">=</span> anchor <span class="token operator">=</span> <span class="token keyword">null</span> <span class="token keyword">as</span> <span class="token builtin">any</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token comment">// 此处省略若干代码...</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>next<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          next<span class="token punctuation">.</span>el <span class="token operator">=</span> vnode<span class="token punctuation">.</span>el
          <span class="token function">updateComponentPreRender</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> next<span class="token punctuation">,</span> optimized<span class="token punctuation">)</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          next <span class="token operator">=</span> vnode
        <span class="token punctuation">}</span>
        <span class="token comment">// 此处省略若干代码...</span>
        <span class="token keyword">const</span> nextTree <span class="token operator">=</span> <span class="token function">renderComponentRoot</span><span class="token punctuation">(</span>instance<span class="token punctuation">)</span>
        <span class="token comment">// 此处省略若干代码...</span>
        <span class="token keyword">const</span> prevTree <span class="token operator">=</span> instance<span class="token punctuation">.</span>subTree
        instance<span class="token punctuation">.</span>subTree <span class="token operator">=</span> nextTree
        <span class="token comment">// 此处省略若干代码...</span>
        <span class="token function">patch</span><span class="token punctuation">(</span>
          prevTree<span class="token punctuation">,</span>
          nextTree<span class="token punctuation">,</span>
          <span class="token comment">// parent may have changed if it&#39;s in a teleport</span>
          <span class="token function">hostParentNode</span><span class="token punctuation">(</span>prevTree<span class="token punctuation">.</span>el<span class="token operator">!</span><span class="token punctuation">)</span><span class="token operator">!</span><span class="token punctuation">,</span>
          <span class="token comment">// anchor may have changed if it&#39;s in a fragment</span>
          <span class="token function">getNextHostNode</span><span class="token punctuation">(</span>prevTree<span class="token punctuation">)</span><span class="token punctuation">,</span>
          instance<span class="token punctuation">,</span>
          parentSuspense<span class="token punctuation">,</span>
          isSVG
        <span class="token punctuation">)</span>
        <span class="token comment">// 此处省略若干代码...</span>
        next<span class="token punctuation">.</span>el <span class="token operator">=</span> nextTree<span class="token punctuation">.</span>el
        <span class="token comment">// 此处省略若干代码...</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>函数<code>componentUpdateFn</code>包含了<strong>200</strong>多行代码，代码片段<strong>11</strong>进行了大量的精简。这个函数可以说是组件渲染和更新的灵魂。从顶层的逻辑判断<code>if (!instance.isMounted) {}else{}</code>就能直观的感受到，其既处理了<strong>挂载</strong>又处理了<strong>更新</strong>。</p><h4 id="挂载相关逻辑" tabindex="-1"><a class="header-anchor" href="#挂载相关逻辑" aria-hidden="true">#</a> 挂载相关逻辑</h4><p>对于挂载操作，函数<code>componentUpdateFn</code>处理了服务端渲染的逻辑本文不作讨论。正常情况下，对于挂载的操作主要做了两件事：</p><ol><li>调用<code>renderComponentRoot</code>函数，将组件实例<code>instance</code>转化成子<strong>虚拟Node</strong>树，并赋值给<code>instance.subTree</code>，进而调用<code>patch</code>函数将该子<strong>虚拟Node</strong>树挂载到目标容器节点上；</li><li>执行<code>initialVNode.el = subTree.el</code>，将子节点对应的<code>el</code>节点赋值给组件<strong>虚拟Node</strong>的<code>el</code>属性。</li></ol><p>这里需要注意的是，组件类型的<strong>虚拟Node</strong>和<code>subTree</code>之间的关系，假设有下面的代码：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>// 代码片段12 文件index.vue
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>App</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>App</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>// 代码片段13 文件App.vue
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>Hello World<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们可以直观的这样理解，组件类型的<strong>虚拟Node</strong>代表的是<code>&lt;App&gt;&lt;/App&gt;</code>，而组件类型的<strong>虚拟Node</strong>的<code>subTree</code>代表的是<code>&lt;div&gt;Hello World&lt;/div&gt;</code>。</p><h5 id="rendercomponentroot" tabindex="-1"><a class="header-anchor" href="#rendercomponentroot" aria-hidden="true">#</a> renderComponentRoot</h5><p>下面我们进入<code>renderComponentRoot</code>探索如何根据组件实例获得<code>subTree</code>:</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段14</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">renderComponentRoot</span><span class="token punctuation">(</span>
  instance<span class="token operator">:</span> ComponentInternalInstance
<span class="token punctuation">)</span><span class="token operator">:</span> VNode <span class="token punctuation">{</span>
    <span class="token comment">// 此处省略若干代码...</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>vnode<span class="token punctuation">.</span>shapeFlag <span class="token operator">&amp;</span> ShapeFlags<span class="token punctuation">.</span><span class="token constant">STATEFUL_COMPONENT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> proxyToUse <span class="token operator">=</span> withProxy <span class="token operator">||</span> proxy
      result <span class="token operator">=</span> <span class="token function">normalizeVNode</span><span class="token punctuation">(</span>
        render<span class="token operator">!</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>
          proxyToUse<span class="token punctuation">,</span>
          proxyToUse<span class="token operator">!</span><span class="token punctuation">,</span>
          renderCache<span class="token punctuation">,</span>
          props<span class="token punctuation">,</span>
          setupState<span class="token punctuation">,</span>
          data<span class="token punctuation">,</span>
          ctx
        <span class="token punctuation">)</span>
      <span class="token punctuation">)</span>
      fallthroughAttrs <span class="token operator">=</span> attrs
    <span class="token punctuation">}</span>
  <span class="token comment">// 此处省略若干代码...</span>
  <span class="token keyword">return</span> result
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在省略大量代码后，我们能很轻松的发现，函数<code>renderComponentRoot</code>的核心工作是通过一个代理对象调用了组件的<code>render</code>函数。为什么要代理对象？答案其实在前面的文章中已经回答过了，其中一个重要原因是对<code>ref</code>值的访问不需要再使用<code>.value</code>的形式，另一方面可以保护子组件的内容不被父组件随意访问。至于<code>render</code>函数的作用我们也在前面的文章中解释过，就不在此处赘述了。</p><h4 id="更新相关逻辑" tabindex="-1"><a class="header-anchor" href="#更新相关逻辑" aria-hidden="true">#</a> 更新相关逻辑</h4><p>有了上文对挂载逻辑的分析，更新逻辑就显得很简单了。可以概括为下面两步工作：</p><ol><li>获取组件新的<code>subTree</code>和当前所具备的<code>subTree</code>;</li><li>调用<code>patch</code>函数来进行更新操作。</li></ol><h2 id="updatecomponent" tabindex="-1"><a class="header-anchor" href="#updatecomponent" aria-hidden="true">#</a> updateComponent</h2><p>我们先来看看<code>updateComponent</code>函数的具体实现：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段15</span>
<span class="token keyword">const</span> <span class="token function-variable function">updateComponent</span> <span class="token operator">=</span> <span class="token punctuation">(</span>n1<span class="token operator">:</span> VNode<span class="token punctuation">,</span> n2<span class="token operator">:</span> VNode<span class="token punctuation">,</span> optimized<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> instance <span class="token operator">=</span> <span class="token punctuation">(</span>n2<span class="token punctuation">.</span>component <span class="token operator">=</span> n1<span class="token punctuation">.</span>component<span class="token punctuation">)</span><span class="token operator">!</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">shouldUpdateComponent</span><span class="token punctuation">(</span>n1<span class="token punctuation">,</span> n2<span class="token punctuation">,</span> optimized<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>
        __FEATURE_SUSPENSE__ <span class="token operator">&amp;&amp;</span>
        instance<span class="token punctuation">.</span>asyncDep <span class="token operator">&amp;&amp;</span>
        <span class="token operator">!</span>instance<span class="token punctuation">.</span>asyncResolved
      <span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 此处省略若干代码...</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        instance<span class="token punctuation">.</span>next <span class="token operator">=</span> n2
        <span class="token function">invalidateJob</span><span class="token punctuation">(</span>instance<span class="token punctuation">.</span>update<span class="token punctuation">)</span>
        instance<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token comment">// no update needed. just copy over properties</span>
      n2<span class="token punctuation">.</span>component <span class="token operator">=</span> n1<span class="token punctuation">.</span>component
      n2<span class="token punctuation">.</span>el <span class="token operator">=</span> n1<span class="token punctuation">.</span>el
      instance<span class="token punctuation">.</span>vnode <span class="token operator">=</span> n2
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有了上文的基础，我们可以说函数<code>updateComponent</code>的核心就是执行<code>instance.update()</code>。</p><h1 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h1><p>结合上一篇文章，到目前为止我们可以说已经理解了<code>Vue3</code>渲染机制的核心工作流程。请大家先看这张流程图：</p><p><img src="`+t+'" alt="patch函数流程图.jpg"> 结合这张流程图和上一篇和本文的内容，我们可以比较清晰的理解将<strong>虚拟Node</strong>转化为<strong>真实Node</strong>的实现过程。敬请朋友们期待下一篇文章关于<code>diff</code>算法的描述。</p><h2 id="写在最后" tabindex="-1"><a class="header-anchor" href="#写在最后" aria-hidden="true">#</a> 写在最后</h2><p>读完文章觉得有收获的朋友们，可以做下面几件事情支持：</p><ul><li>如果<code>点赞，点在看，转发</code>可以让文章帮助到更多需要帮助的人；</li><li>如果是微信公众号的作者，可以找我开通<code>白名单</code>，<code>转载</code>我的原创文章；</li></ul><p>最后，请朋友们关注我的<code>微信公众号: 杨艺韬</code>，可以获取我的最新动态。</p>',80),c=[o];function l(i,u){return s(),a("div",null,c)}const r=n(p,[["render",l],["__file","09.组件渲染和更新流程.html.vue"]]);export{r as default};
