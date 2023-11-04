import{_ as e,r as o,o as p,c,b as s,d as n,e as i,f as a}from"./app.4326c516.js";const l={},u=a(`<h1 id="_13-从ast到render函数-transform与代码生成" tabindex="-1"><a class="header-anchor" href="#_13-从ast到render函数-transform与代码生成" aria-hidden="true">#</a> 13.从AST到render函数（transform与代码生成）</h1><p><strong>欢迎关注 微信公众号：杨艺韬</strong></p><p>我们在上一篇文章中已经知道了从模版字符串到返回<strong>虚拟Node</strong>的<code>render</code>函数需要经历三个阶段：</p><ol><li>模版字符串转化成<strong>AST</strong>;</li><li>模版字符串对应的<strong>AST</strong>转化成可以描述<strong>js</strong>代码的<strong>AST</strong>；</li><li>将可以描述<strong>js</strong>代码的<strong>AST</strong>转化成<code>render</code>函数。</li></ol><p>而本文将要和大家分享第二个阶段和第三阶段的内容。先分析模版字符串对应的<strong>AST</strong>转化成可以描述<strong>js</strong>代码的<strong>AST</strong>，接着分析根据转化后的<strong>AST</strong>生成代码的过程。</p><h1 id="ast转化" tabindex="-1"><a class="header-anchor" href="#ast转化" aria-hidden="true">#</a> AST转化</h1><p>我们可能会很自然的想到，为什么不能直接由描述模版字符串的<strong>AST</strong>转化成<code>render</code>函数，而是有这样一个将模版字符串<strong>AST</strong>转化成描述<strong>js</strong>代码<strong>AST</strong>的中间环节？</p><p>其实我们在描述这个过程的时候已经蕴涵了答案。就像上一篇文章介绍的那样，<strong>AST</strong>是一个对象，这个对象可以用来描述模版字符串。上一篇文章的内容本质上就是在分析不断完善这个<strong>AST</strong>对象的过程，让其可以比较全面的描述模版字符串。但是无论怎么完善，当时还是只能描述模版字符串，不能描述一个函数。而我们整个编译工作的最终结果是返回一个函数，所以我们需要一个可以用来描述函数的<strong>AST</strong>，这也就是为什么需要第二个阶段（对原有的<strong>AST</strong>进行转换）的原因。</p><p>我们先来回顾下<code>baseCompile</code>函数的具体实现：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段1</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">baseCompile</span><span class="token punctuation">(</span>
  template<span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> RootNode<span class="token punctuation">,</span>
  options<span class="token operator">:</span> CompilerOptions <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">)</span><span class="token operator">:</span> CodegenResult <span class="token punctuation">{</span>

  <span class="token comment">// 此处省略许多代码...</span>
  <span class="token keyword">const</span> ast <span class="token operator">=</span> <span class="token function">isString</span><span class="token punctuation">(</span>template<span class="token punctuation">)</span> <span class="token operator">?</span> <span class="token function">baseParse</span><span class="token punctuation">(</span>template<span class="token punctuation">,</span> options<span class="token punctuation">)</span> <span class="token operator">:</span> template
  <span class="token comment">// 此处省略许多代码...</span>
  <span class="token function">transform</span><span class="token punctuation">(</span>
    ast<span class="token punctuation">,</span>
    <span class="token function">extend</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> options<span class="token punctuation">,</span> <span class="token punctuation">{</span>
      prefixIdentifiers<span class="token punctuation">,</span>
      nodeTransforms<span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token operator">...</span>nodeTransforms<span class="token punctuation">,</span>
        <span class="token operator">...</span><span class="token punctuation">(</span>options<span class="token punctuation">.</span>nodeTransforms <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token comment">// user transforms</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>
      directiveTransforms<span class="token operator">:</span> <span class="token function">extend</span><span class="token punctuation">(</span>
        <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
        directiveTransforms<span class="token punctuation">,</span>
        options<span class="token punctuation">.</span>directiveTransforms <span class="token operator">||</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token comment">// user transforms</span>
      <span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">)</span>
  <span class="token keyword">return</span> <span class="token function">generate</span><span class="token punctuation">(</span>
    ast<span class="token punctuation">,</span>
    <span class="token function">extend</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> options<span class="token punctuation">,</span> <span class="token punctuation">{</span>
      prefixIdentifiers
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们从代码片段<strong>1</strong>中发现在生成描述模版字符串的<strong>AST</strong>之后，调用<code>transform</code>函数对其进行了转化。而在转化之后再调用<code>generate</code>函数生成代码。也就是说我们编译过程中所涉及的<strong>AST</strong>对象都是最开始用来描述模版字符串的对象。只不过后来对其进行了增强，让其不仅可以描述模版字符串同时还可以描述一个函数。</p><h2 id="transform" tabindex="-1"><a class="header-anchor" href="#transform" aria-hidden="true">#</a> transform</h2><p>从代码片段<strong>1</strong>中我们发现给<code>transform</code>传入了两个参数，一个参数是待转化的<strong>AST</strong>，另一个参数是一个对象，该对象上集成了很多方法，这些方法具有什么作用，在本文相应的环节会进行解释。 我们来看看函数<code>transform</code>的具体实现：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段2</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">transform</span><span class="token punctuation">(</span>root<span class="token operator">:</span> RootNode<span class="token punctuation">,</span> options<span class="token operator">:</span> TransformOptions<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> context <span class="token operator">=</span> <span class="token function">createTransformContext</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> options<span class="token punctuation">)</span>
  <span class="token function">traverseNode</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> context<span class="token punctuation">)</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>options<span class="token punctuation">.</span>hoistStatic<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">hoistStatic</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> context<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>options<span class="token punctuation">.</span>ssr<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">createRootCodegen</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> context<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// finalize meta information</span>
  root<span class="token punctuation">.</span>helpers <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token operator">...</span>context<span class="token punctuation">.</span>helpers<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">]</span>
  root<span class="token punctuation">.</span>components <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token operator">...</span>context<span class="token punctuation">.</span>components<span class="token punctuation">]</span>
  root<span class="token punctuation">.</span>directives <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token operator">...</span>context<span class="token punctuation">.</span>directives<span class="token punctuation">]</span>
  root<span class="token punctuation">.</span>imports <span class="token operator">=</span> context<span class="token punctuation">.</span>imports
  root<span class="token punctuation">.</span>hoists <span class="token operator">=</span> context<span class="token punctuation">.</span>hoists
  root<span class="token punctuation">.</span>temps <span class="token operator">=</span> context<span class="token punctuation">.</span>temps
  root<span class="token punctuation">.</span>cached <span class="token operator">=</span> context<span class="token punctuation">.</span>cached

  <span class="token keyword">if</span> <span class="token punctuation">(</span>__COMPAT__<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    root<span class="token punctuation">.</span>filters <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token operator">...</span>context<span class="token punctuation">.</span>filters<span class="token operator">!</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>函数<code>transfrom</code>的逻辑很清晰，主要做了下面<strong>3</strong>件事情：</p><ol><li>创建转换上下文；</li><li>调用函数<code>traverseNode</code>对<strong>AST</strong>进行转化；</li><li>对根节点进行处理。</li></ol><p>如果这里不理解上面三件事情的具体含义，不用担心，我们后面逐一进行分析。</p><h3 id="createtransformcontext" tabindex="-1"><a class="header-anchor" href="#createtransformcontext" aria-hidden="true">#</a> createTransformContext</h3><p>函数<code>createTransformContext</code>的功能是创建一个上下文对象，具体代码实现如下：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段3</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createTransformContext</span><span class="token punctuation">(</span>
  root<span class="token operator">:</span> RootNode<span class="token punctuation">,</span>
  <span class="token comment">// 此处省略若干参数...</span>
<span class="token punctuation">)</span><span class="token operator">:</span> TransformContext <span class="token punctuation">{</span>
  <span class="token keyword">const</span> context<span class="token operator">:</span> TransformContext <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token comment">// 此处省略若干属性...</span>
    <span class="token comment">// 此处省略若干方法...</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 此处省略若干代码...</span>
  <span class="token keyword">return</span> context
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们只需要知道，所谓的上下文，其实就是一个对象，这个对象用属性保存了很多转化环节相关的状态信息,比如正在转化哪个节点，用到了哪些创建节点的函数等等，同时也提供了很多能力，至于里面的属性各自代表什么含义，方法具备什么功能，我们暂时先忽略，在分析相关内容的时候再解释。</p><h3 id="traversenode" tabindex="-1"><a class="header-anchor" href="#traversenode" aria-hidden="true">#</a> traverseNode</h3><p>函数<code>tranverseNode</code>是整个<strong>AST</strong>转化环节最核心的方法，我们先来看其代码实现：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段4</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">traverseNode</span><span class="token punctuation">(</span>
  node<span class="token operator">:</span> RootNode <span class="token operator">|</span> TemplateChildNode<span class="token punctuation">,</span>
  context<span class="token operator">:</span> TransformContext
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  context<span class="token punctuation">.</span>currentNode <span class="token operator">=</span> node
  <span class="token keyword">const</span> <span class="token punctuation">{</span> nodeTransforms <span class="token punctuation">}</span> <span class="token operator">=</span> context
  <span class="token keyword">const</span> exitFns <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> nodeTransforms<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> onExit <span class="token operator">=</span> nodeTransforms<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> context<span class="token punctuation">)</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>onExit<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isArray</span><span class="token punctuation">(</span>onExit<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        exitFns<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token operator">...</span>onExit<span class="token punctuation">)</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        exitFns<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>onExit<span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 此处省略若干代码...</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">switch</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>type<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">COMMENT</span><span class="token operator">:</span>
      <span class="token comment">// 此处省略若干代码...</span>
      <span class="token keyword">break</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">INTERPOLATION</span><span class="token operator">:</span>
      <span class="token comment">// 此处省略若干代码...</span>
      <span class="token keyword">break</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">IF</span><span class="token operator">:</span>
      <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> node<span class="token punctuation">.</span>branches<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">traverseNode</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span>branches<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> context<span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">break</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">IF_BRANCH</span><span class="token operator">:</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">FOR</span><span class="token operator">:</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">ELEMENT</span><span class="token operator">:</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">ROOT</span><span class="token operator">:</span>
      <span class="token function">traverseChildren</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> context<span class="token punctuation">)</span>
      <span class="token keyword">break</span>
  <span class="token punctuation">}</span>

  context<span class="token punctuation">.</span>currentNode <span class="token operator">=</span> node
  <span class="token keyword">let</span> i <span class="token operator">=</span> exitFns<span class="token punctuation">.</span>length
  <span class="token keyword">while</span> <span class="token punctuation">(</span>i<span class="token operator">--</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    exitFns<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该函数有<strong>两个</strong>关键点值得我们注意，首先是<code>nodeTransforms</code>所代表的插件化架构；其次，是<code>exitFns</code>所代表的洋葱模型。</p><h4 id="插件化架构" tabindex="-1"><a class="header-anchor" href="#插件化架构" aria-hidden="true">#</a> 插件化架构</h4><p>还记得我们在分析入口函数<code>baseCompile</code>的时候，当时我们忽略了传给<code>transform</code>函数的第二个参数。这个参数实际上包括了很多函数，也就是<code>tranverseNode</code>函数中的<code>nodeTransforms</code>。这个<code>nodeTransforms</code>包括哪些函数呢？我们回顾下<code>baseCompile</code>函数中的相关代码：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段5</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> transform<span class="token punctuation">,</span> NodeTransform<span class="token punctuation">,</span> DirectiveTransform <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./transform&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> transformIf <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./transforms/vIf&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> transformFor <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./transforms/vFor&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> transformExpression <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./transforms/transformExpression&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> transformSlotOutlet <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./transforms/transformSlotOutlet&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> transformElement <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./transforms/transformElement&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> transformOn <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./transforms/vOn&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> transformBind <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./transforms/vBind&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> trackSlotScopes<span class="token punctuation">,</span> trackVForSlotScopes <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./transforms/vSlot&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> transformText <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./transforms/transformText&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> transformOnce <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./transforms/vOnce&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> transformModel <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./transforms/vModel&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> transformFilter <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./compat/transformFilter&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> defaultOnError<span class="token punctuation">,</span> createCompilerError<span class="token punctuation">,</span> ErrorCodes <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./errors&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> transformMemo <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./transforms/vMemo&#39;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">getBaseTransformPreset</span><span class="token punctuation">(</span>
  prefixIdentifiers<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
<span class="token punctuation">)</span><span class="token operator">:</span> TransformPreset <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">[</span>
    <span class="token punctuation">[</span>
      transformOnce<span class="token punctuation">,</span>
      transformIf<span class="token punctuation">,</span>
      transformMemo<span class="token punctuation">,</span>
      transformFor<span class="token punctuation">,</span>
      <span class="token operator">...</span><span class="token punctuation">(</span>__COMPAT__ <span class="token operator">?</span> <span class="token punctuation">[</span>transformFilter<span class="token punctuation">]</span> <span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token operator">...</span><span class="token punctuation">(</span><span class="token operator">!</span>__BROWSER__ <span class="token operator">&amp;&amp;</span> prefixIdentifiers
        <span class="token operator">?</span> <span class="token punctuation">[</span>
            <span class="token comment">// order is important</span>
            trackVForSlotScopes<span class="token punctuation">,</span>
            transformExpression
          <span class="token punctuation">]</span>
        <span class="token operator">:</span> __BROWSER__ <span class="token operator">&amp;&amp;</span> __DEV__
        <span class="token operator">?</span> <span class="token punctuation">[</span>transformExpression<span class="token punctuation">]</span>
        <span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      transformSlotOutlet<span class="token punctuation">,</span>
      transformElement<span class="token punctuation">,</span>
      trackSlotScopes<span class="token punctuation">,</span>
      transformText
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
      on<span class="token operator">:</span> transformOn<span class="token punctuation">,</span>
      bind<span class="token operator">:</span> transformBind<span class="token punctuation">,</span>
      model<span class="token operator">:</span> transformModel
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>


<span class="token keyword">const</span> <span class="token punctuation">[</span>nodeTransforms<span class="token punctuation">,</span> directiveTransforms<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">getBaseTransformPreset</span><span class="token punctuation">(</span>prefixIdentifiers<span class="token punctuation">)</span>


<span class="token function">transform</span><span class="token punctuation">(</span>
    ast<span class="token punctuation">,</span>
    <span class="token function">extend</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> options<span class="token punctuation">,</span> <span class="token punctuation">{</span>
      prefixIdentifiers<span class="token punctuation">,</span>
      nodeTransforms<span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token operator">...</span>nodeTransforms<span class="token punctuation">,</span>
        <span class="token operator">...</span><span class="token punctuation">(</span>options<span class="token punctuation">.</span>nodeTransforms <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token comment">// user transforms</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>
      directiveTransforms<span class="token operator">:</span> <span class="token function">extend</span><span class="token punctuation">(</span>
        <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
        directiveTransforms<span class="token punctuation">,</span>
        options<span class="token punctuation">.</span>directiveTransforms <span class="token operator">||</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token comment">// user transforms</span>
      <span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们从代码片段<strong>5</strong>中可以很直观的看到，所谓的<code>nodeTransforms</code>实际上就是一系列函数。这些函数各自承担着对节点的某个特定部分的内容进行转化的功能。比如有专门解析标签的，有专门解析文本节点的，有专门解析<code>v-if</code>指令的等等。这样设计有什么好处呢，一个明显的好处是可扩展性会很强，这些转换函数各司其职，如果将来有新的内容类型需要解析，那直接添加一个处理函数即可。当然这样的结构代码可维护性也会大大增强。处理特定内容的函数各自独立互不干扰。</p><p>需要注意的是，<code>nodeTransforms</code>是一个数组，里面会存放很多转换函数，这些转换函数是有序的，不可以随意调换位置，比如对于<code>if</code>的处理优先级就比较高，因为如果条件不满足很可能有大部分内容都没必要进行转换。</p><h4 id="洋葱模型" tabindex="-1"><a class="header-anchor" href="#洋葱模型" aria-hidden="true">#</a> 洋葱模型</h4><p>从代码片段<strong>4</strong>中我们可以发现，代码大致可以分为三个部分：</p><ol><li>遍历<code>nodeTransforms</code>上的函数并依次执行，每个函数执行的返回结果都是一个函数，将这些返回的函数存放在一个数组中；</li><li>对子节点进行转化操作；</li><li>遍历第一步中数组中保存的函数并执行。</li></ol><p>从这个过程中我们首先要明白这里的转化操作是从根节点深度遍历子节点，结合上面提到的代码片段<strong>4</strong>中的三个部分，我们可以这样理解，我们对节点进行转化的时候是从根节点出发进行处理，也就是说相当于对一棵树进行深度遍历，但是父节点的处理是依赖于子节点的，所以虽然是自顶向下进行遍历，但是实际处理过程却是只下而上进行处理。这也就是为什么要将父节点的处理函数存放在数组中，在子节点处理完成后再遍历执行这些函数。</p><h3 id="transformelement" tabindex="-1"><a class="header-anchor" href="#transformelement" aria-hidden="true">#</a> transformElement</h3><p>根据上文我们知道了对节点进行处理，就是通过一系列函数对节点的的各个部分的内容分别进行处理。鉴于这些函数很多内容也很庞杂，我们拿其中一个函数<code>transformElement</code>进行分析，理解对<strong>AST</strong>的转化过程。我们先来看看其代码实现：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段6</span>
<span class="token comment">// generate a JavaScript AST for this element&#39;s codegen</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> transformElement<span class="token operator">:</span> <span class="token function-variable function">NodeTransform</span> <span class="token operator">=</span> <span class="token punctuation">(</span>node<span class="token punctuation">,</span> context<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">function</span> <span class="token function">postTransformElement</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 此处省略了绝大部分代码...</span>
    node<span class="token punctuation">.</span>codegenNode <span class="token operator">=</span> <span class="token function">createVNodeCall</span><span class="token punctuation">(</span>
      context<span class="token punctuation">,</span>
      vnodeTag<span class="token punctuation">,</span>
      vnodeProps<span class="token punctuation">,</span>
      vnodeChildren<span class="token punctuation">,</span>
      vnodePatchFlag<span class="token punctuation">,</span>
      vnodeDynamicProps<span class="token punctuation">,</span>
      vnodeDirectives<span class="token punctuation">,</span>
      <span class="token operator">!</span><span class="token operator">!</span>shouldUseBlock<span class="token punctuation">,</span>
      <span class="token boolean">false</span> <span class="token comment">/* disableTracking */</span><span class="token punctuation">,</span>
      isComponent<span class="token punctuation">,</span>
      node<span class="token punctuation">.</span>loc
    <span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>代码片段<strong>6</strong>省略了绝大部分代码，只留下了最后一行代码，调用<code>createVNodeCall</code>函数获取描述<strong>js</strong>代码的对象，并赋值给<code>node.codegenNode</code>。到了这里我们就可以很清楚的意识到，所谓的对<strong>AST</strong>进行转化，实际上就是给<strong>AST</strong>的<code>codegenNode</code>属性赋值，该属性的值就是用来描述<strong>js</strong>代码的。接下来我们继续深入到<code>createVNodeCall</code>函数中去。</p><h3 id="createvnodecall" tabindex="-1"><a class="header-anchor" href="#createvnodecall" aria-hidden="true">#</a> createVNodeCall</h3><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段7</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createVNodeCall</span><span class="token punctuation">(</span>
  context<span class="token operator">:</span> TransformContext <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
  tag<span class="token operator">:</span> VNodeCall<span class="token punctuation">[</span><span class="token string">&#39;tag&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  props<span class="token operator">?</span><span class="token operator">:</span> VNodeCall<span class="token punctuation">[</span><span class="token string">&#39;props&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  children<span class="token operator">?</span><span class="token operator">:</span> VNodeCall<span class="token punctuation">[</span><span class="token string">&#39;children&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  patchFlag<span class="token operator">?</span><span class="token operator">:</span> VNodeCall<span class="token punctuation">[</span><span class="token string">&#39;patchFlag&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  dynamicProps<span class="token operator">?</span><span class="token operator">:</span> VNodeCall<span class="token punctuation">[</span><span class="token string">&#39;dynamicProps&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  directives<span class="token operator">?</span><span class="token operator">:</span> VNodeCall<span class="token punctuation">[</span><span class="token string">&#39;directives&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  isBlock<span class="token operator">:</span> VNodeCall<span class="token punctuation">[</span><span class="token string">&#39;isBlock&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  disableTracking<span class="token operator">:</span> VNodeCall<span class="token punctuation">[</span><span class="token string">&#39;disableTracking&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  isComponent<span class="token operator">:</span> VNodeCall<span class="token punctuation">[</span><span class="token string">&#39;isComponent&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  loc <span class="token operator">=</span> locStub
<span class="token punctuation">)</span><span class="token operator">:</span> VNodeCall <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>context<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>isBlock<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      context<span class="token punctuation">.</span><span class="token function">helper</span><span class="token punctuation">(</span><span class="token constant">OPEN_BLOCK</span><span class="token punctuation">)</span>
      context<span class="token punctuation">.</span><span class="token function">helper</span><span class="token punctuation">(</span><span class="token function">getVNodeBlockHelper</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span>inSSR<span class="token punctuation">,</span> isComponent<span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      context<span class="token punctuation">.</span><span class="token function">helper</span><span class="token punctuation">(</span><span class="token function">getVNodeHelper</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span>inSSR<span class="token punctuation">,</span> isComponent<span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>directives<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      context<span class="token punctuation">.</span><span class="token function">helper</span><span class="token punctuation">(</span><span class="token constant">WITH_DIRECTIVES</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    type<span class="token operator">:</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">VNODE_CALL</span><span class="token punctuation">,</span>
    tag<span class="token punctuation">,</span>
    props<span class="token punctuation">,</span>
    children<span class="token punctuation">,</span>
    patchFlag<span class="token punctuation">,</span>
    dynamicProps<span class="token punctuation">,</span>
    directives<span class="token punctuation">,</span>
    isBlock<span class="token punctuation">,</span>
    disableTracking<span class="token punctuation">,</span>
    isComponent<span class="token punctuation">,</span>
    loc
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>函数<code>createVNodeCall</code>的逻辑很清晰，最终结果是返回一个对象。这里的函数<code>context.helper</code>其实就是在统计生成这些代码需要导入哪些函数，在生成代码拼接字符串的时候会用到。至于<code>openBlock</code>的含义，我们在前面的关于编译优化的文章中已经分析过了。我们从这个返回的对象可以获取生成代码所需要的内容，回顾我们前面讲到的<code>render</code>函数其实就是一个返回<strong>虚拟Node</strong>的函数，那我们在生成这些代码的时候需要知道的是调用什么方法来创建<strong>虚拟Node</strong>，同时要知道该节点有什么样子的属性？以及有什么样的指令？是不是组件？是不是动态节点？是否需要优化？等等内容在函数<code>createVNodeCall</code>的返回结果对象中都有体现。</p><p>其实从这里也可以理解为什么要利用洋葱模型，因为在调用类似<code>createVNodeCall</code>这种创建<code>codegenNode</code>对象的时候，需要有<code>children</code>，而<code>children</code>只有解析完成之后才能获取其子节点的<code>codegenNode</code>。</p><h3 id="createrootcodegen" tabindex="-1"><a class="header-anchor" href="#createrootcodegen" aria-hidden="true">#</a> createRootCodegen</h3><p>我们先来观察<code>createRootCodegen</code>的函数实现：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段8</span>
<span class="token keyword">function</span> <span class="token function">createRootCodegen</span><span class="token punctuation">(</span>root<span class="token operator">:</span> RootNode<span class="token punctuation">,</span> context<span class="token operator">:</span> TransformContext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> helper <span class="token punctuation">}</span> <span class="token operator">=</span> context
  <span class="token keyword">const</span> <span class="token punctuation">{</span> children <span class="token punctuation">}</span> <span class="token operator">=</span> root
  <span class="token keyword">if</span> <span class="token punctuation">(</span>children<span class="token punctuation">.</span>length <span class="token operator">===</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> child <span class="token operator">=</span> children<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isSingleElementRoot</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> child<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> child<span class="token punctuation">.</span>codegenNode<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> codegenNode <span class="token operator">=</span> child<span class="token punctuation">.</span>codegenNode
      <span class="token keyword">if</span> <span class="token punctuation">(</span>codegenNode<span class="token punctuation">.</span>type <span class="token operator">===</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">VNODE_CALL</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">makeBlock</span><span class="token punctuation">(</span>codegenNode<span class="token punctuation">,</span> context<span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
      root<span class="token punctuation">.</span>codegenNode <span class="token operator">=</span> codegenNode
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      root<span class="token punctuation">.</span>codegenNode <span class="token operator">=</span> child
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>children<span class="token punctuation">.</span>length <span class="token operator">&gt;</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> patchFlag <span class="token operator">=</span> PatchFlags<span class="token punctuation">.</span><span class="token constant">STABLE_FRAGMENT</span>
    <span class="token keyword">let</span> patchFlagText <span class="token operator">=</span> PatchFlagNames<span class="token punctuation">[</span>PatchFlags<span class="token punctuation">.</span><span class="token constant">STABLE_FRAGMENT</span><span class="token punctuation">]</span>
    <span class="token comment">// 此处省略若干代码...</span>
    root<span class="token punctuation">.</span>codegenNode <span class="token operator">=</span> <span class="token function">createVNodeCall</span><span class="token punctuation">(</span>
      context<span class="token punctuation">,</span>
      <span class="token function">helper</span><span class="token punctuation">(</span><span class="token constant">FRAGMENT</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token keyword">undefined</span><span class="token punctuation">,</span>
      root<span class="token punctuation">.</span>children<span class="token punctuation">,</span>
      patchFlag <span class="token operator">+</span> <span class="token punctuation">(</span>__DEV__ <span class="token operator">?</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string"> /* </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>patchFlagText<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> */</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token keyword">undefined</span><span class="token punctuation">,</span>
      <span class="token keyword">undefined</span><span class="token punctuation">,</span>
      <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token keyword">undefined</span><span class="token punctuation">,</span>
      <span class="token boolean">false</span> <span class="token comment">/* isComponent */</span>
    <span class="token punctuation">)</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// no children = noop. codegen will return null.</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所谓<code>createRootCodegen</code>，就是创建根节点的<code>codegenNode</code>对象。由于<strong>Vue3</strong>可以在模版中写多个根节点，所以需要处理成<code>Fragment</code>，这也就是为什么代码片段<strong>8</strong>中在<code>children.length&gt;1</code>的时候会调用<code>createVNodeCall</code>创建<code>codegenNode</code>对象的原因。否则，就代表着只有一个根节点不需要额外处理，直接让根节点的<code>codegenNode</code>等于第一个子节点的根节点的<code>codegenNode</code>即可。</p><h1 id="代码生成" tabindex="-1"><a class="header-anchor" href="#代码生成" aria-hidden="true">#</a> 代码生成</h1><p>有了上文分析过的<code>codegenNode</code>对象，接下来的代码生成实际上就是一个拼接字符串的过程。我们来看看代码生成相关的函数<code>generate</code>：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段9</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">generate</span><span class="token punctuation">(</span>
  ast<span class="token operator">:</span> RootNode<span class="token punctuation">,</span>
  options<span class="token operator">:</span> CodegenOptions <span class="token operator">&amp;</span> <span class="token punctuation">{</span>
    onContextCreated<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">(</span>context<span class="token operator">:</span> CodegenContext<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span>
  <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">)</span><span class="token operator">:</span> CodegenResult <span class="token punctuation">{</span>
  <span class="token keyword">const</span> context <span class="token operator">=</span> <span class="token function">createCodegenContext</span><span class="token punctuation">(</span>ast<span class="token punctuation">,</span> options<span class="token punctuation">)</span>
  <span class="token comment">// 省略若干代码生成过程相关的代码...</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    ast<span class="token punctuation">,</span>
    code<span class="token operator">:</span> context<span class="token punctuation">.</span>code<span class="token punctuation">,</span>
    preamble<span class="token operator">:</span> isSetupInlined <span class="token operator">?</span> preambleContext<span class="token punctuation">.</span>code <span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span>
    <span class="token comment">// SourceMapGenerator does have toJSON() method but it&#39;s not in the types</span>
    map<span class="token operator">:</span> context<span class="token punctuation">.</span>map <span class="token operator">?</span> <span class="token punctuation">(</span>context<span class="token punctuation">.</span>map <span class="token keyword">as</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toJSON</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">:</span> <span class="token keyword">undefined</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在省略大量代码后，我们可以认为函数<code>generate</code>做了三件事情：</p><ol><li>创建<code>context</code>，<code>context</code>上包括了若干字符串拼接相关的方法；</li><li>对<strong>AST</strong>的<code>codegenNode</code>对象进行深度递归，并利用<code>context</code>提供的方法拼接相关字符串；</li><li>返回结果对象，包括<code>code</code>属性，<code>code</code>属性值就是生成的<code>render</code>函数代码字符串。</li></ol><h2 id="createcodegencontext" tabindex="-1"><a class="header-anchor" href="#createcodegencontext" aria-hidden="true">#</a> createCodegenContext</h2><p>函数<code>createCodegenContext</code>的代码实现如下：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段10</span>
<span class="token keyword">function</span> <span class="token function">createCodegenContext</span><span class="token punctuation">(</span>
  ast<span class="token operator">:</span> RootNode<span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token comment">// 此处省略若干参数...</span>
  <span class="token punctuation">}</span><span class="token operator">:</span> CodegenOptions
<span class="token punctuation">)</span><span class="token operator">:</span> CodegenContext <span class="token punctuation">{</span>
  <span class="token keyword">const</span> context<span class="token operator">:</span> CodegenContext <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token comment">// 此处省略若干属性...</span>
    <span class="token function">helper</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">_</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>helperNameMap<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">push</span><span class="token punctuation">(</span>code<span class="token punctuation">,</span> node<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      context<span class="token punctuation">.</span>code <span class="token operator">+=</span> code
      <span class="token comment">// 此处省略若干属性...</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">indent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">newline</span><span class="token punctuation">(</span><span class="token operator">++</span>context<span class="token punctuation">.</span>indentLevel<span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">deindent</span><span class="token punctuation">(</span>withoutNewLine <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>withoutNewLine<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token operator">--</span>context<span class="token punctuation">.</span>indentLevel
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token function">newline</span><span class="token punctuation">(</span><span class="token operator">--</span>context<span class="token punctuation">.</span>indentLevel<span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">newline</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">newline</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span>indentLevel<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 此处省略若干属性...</span>
  <span class="token keyword">return</span> context
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在省略大量代码后，我们可以清晰的看到，<code>context</code>对象包括的重要的方法：</p><ol><li>代码缩进相关的<code>indent</code>、<code>deindent</code>两个函数；</li><li>代码拼接函数<code>push</code>；</li><li><code>helper</code>函数主要用于获取创建节点时候用到的具体函数。</li></ol><h2 id="gennode" tabindex="-1"><a class="header-anchor" href="#gennode" aria-hidden="true">#</a> genNode</h2><p>函数<code>genNode</code>就是根据<strong>AST</strong>的属性<code>codegenNode</code>的值生成字符串的过程：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 代码片段11</span>
<span class="token keyword">function</span> <span class="token function">genNode</span><span class="token punctuation">(</span>node<span class="token operator">:</span> CodegenNode <span class="token operator">|</span> <span class="token builtin">symbol</span> <span class="token operator">|</span> <span class="token builtin">string</span><span class="token punctuation">,</span> context<span class="token operator">:</span> CodegenContext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isString</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    context<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span>
    <span class="token keyword">return</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isSymbol</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    context<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">helper</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>type<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">ELEMENT</span><span class="token operator">:</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">IF</span><span class="token operator">:</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">FOR</span><span class="token operator">:</span>
      <span class="token comment">// 省略若干代码...</span>
      <span class="token function">genNode</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span>codegenNode<span class="token operator">!</span><span class="token punctuation">,</span> context<span class="token punctuation">)</span>
      <span class="token keyword">break</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">TEXT</span><span class="token operator">:</span>
      <span class="token function">genText</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> context<span class="token punctuation">)</span>
      <span class="token keyword">break</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">SIMPLE_EXPRESSION</span><span class="token operator">:</span>
      <span class="token function">genExpression</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> context<span class="token punctuation">)</span>
      <span class="token keyword">break</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">INTERPOLATION</span><span class="token operator">:</span>
      <span class="token function">genInterpolation</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> context<span class="token punctuation">)</span>
      <span class="token keyword">break</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">TEXT_CALL</span><span class="token operator">:</span>
      <span class="token function">genNode</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span>codegenNode<span class="token punctuation">,</span> context<span class="token punctuation">)</span>
      <span class="token keyword">break</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">COMPOUND_EXPRESSION</span><span class="token operator">:</span>
      <span class="token function">genCompoundExpression</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> context<span class="token punctuation">)</span>
      <span class="token keyword">break</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">COMMENT</span><span class="token operator">:</span>
      <span class="token function">genComment</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> context<span class="token punctuation">)</span>
      <span class="token keyword">break</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">VNODE_CALL</span><span class="token operator">:</span>
      <span class="token function">genVNodeCall</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> context<span class="token punctuation">)</span>
      <span class="token keyword">break</span>

    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">JS_CALL_EXPRESSION</span><span class="token operator">:</span>
      <span class="token function">genCallExpression</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> context<span class="token punctuation">)</span>
      <span class="token keyword">break</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">JS_OBJECT_EXPRESSION</span><span class="token operator">:</span>
      <span class="token function">genObjectExpression</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> context<span class="token punctuation">)</span>
      <span class="token keyword">break</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">JS_ARRAY_EXPRESSION</span><span class="token operator">:</span>
      <span class="token function">genArrayExpression</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> context<span class="token punctuation">)</span>
      <span class="token keyword">break</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">JS_FUNCTION_EXPRESSION</span><span class="token operator">:</span>
      <span class="token function">genFunctionExpression</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> context<span class="token punctuation">)</span>
      <span class="token keyword">break</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">JS_CONDITIONAL_EXPRESSION</span><span class="token operator">:</span>
      <span class="token function">genConditionalExpression</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> context<span class="token punctuation">)</span>
      <span class="token keyword">break</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">JS_CACHE_EXPRESSION</span><span class="token operator">:</span>
      <span class="token function">genCacheExpression</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> context<span class="token punctuation">)</span>
      <span class="token keyword">break</span>
    <span class="token keyword">case</span> NodeTypes<span class="token punctuation">.</span><span class="token constant">JS_BLOCK_STATEMENT</span><span class="token operator">:</span>
      <span class="token function">genNodeList</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span>body<span class="token punctuation">,</span> context<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>
      <span class="token keyword">break</span>
    <span class="token comment">// 省略若干代码...</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从代码片段<strong>11</strong>不难看出，生成代码需要根据不同的节点类型单独进行处理，因为不同类型的节点的代码结构上不相同的。至于各个函数内部，都是调用<code>context</code>对象提供的方法对字符串进行拼接。</p><h2 id="学习方法" tabindex="-1"><a class="header-anchor" href="#学习方法" aria-hidden="true">#</a> 学习方法</h2>`,61),r={href:"https://vue-next-template-explorer.netlify.app/",target:"_blank",rel:"noopener noreferrer"},d=s("code",null,"render",-1),k=s("strong",null,"debug",-1),v=s("code",null,"render",-1),m=a('<h2 id="写在最后" tabindex="-1"><a class="header-anchor" href="#写在最后" aria-hidden="true">#</a> 写在最后</h2><p>读完文章觉得有收获的朋友们，可以做下面几件事情支持：</p><ul><li>如果<code>点赞，点在看，转发</code>可以让文章帮助到更多需要帮助的人；</li><li>如果是微信公众号的作者，可以找我开通<code>白名单</code>，<code>转载</code>我的原创文章；</li></ul><p>最后，请朋友们关注我的<code>微信公众号: 杨艺韬</code>，可以获取我的最新动态。</p>',4);function b(f,g){const t=o("ExternalLinkIcon");return p(),c("div",null,[u,s("p",null,[n("大家可以在网址"),s("a",r,[n("https://vue-next-template-explorer.netlify.app/"),i(t)]),n("上直观感受到模版字符串和对应的"),d,n("函数。在"),k,n("的过程中对照这里的"),v,n("函数，相信大家可以快速的深入理解代码生成的过程。")]),m])}const h=e(l,[["render",b],["__file","13.从AST到render函数（transform与代码生成）.html.vue"]]);export{h as default};
