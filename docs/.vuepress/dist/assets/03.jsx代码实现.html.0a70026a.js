import{_ as n,o as s,c as a,f as e}from"./app.d90d410b.js";const p={},t=e(`<h1 id="_03-jsx代码实现" tabindex="-1"><a class="header-anchor" href="#_03-jsx代码实现" aria-hidden="true">#</a> 03.jsx代码实现</h1><h2 id="react-jsx-dev-runtime-js" tabindex="-1"><a class="header-anchor" href="#react-jsx-dev-runtime-js" aria-hidden="true">#</a> react/jsx-dev-runtime.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token punctuation">{</span> jsxDEV <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./src/jsx/ReactJSXElement&#39;</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="react-src-jsx-reactjsxelement-js" tabindex="-1"><a class="header-anchor" href="#react-src-jsx-reactjsxelement-js" aria-hidden="true">#</a> react/src/jsx/ReactJSXElement.js:</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 引入hasOwnProperty函数和REACT_ELEMENT_TYPE常量</span>
<span class="token keyword">import</span> hasOwnProperty <span class="token keyword">from</span> <span class="token string">&#39;shared/hasOwnProperty&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> <span class="token constant">REACT_ELEMENT_TYPE</span> <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;shared/ReactSymbols&#39;</span><span class="token punctuation">;</span>

<span class="token comment">// 定义一些在React元素中保留的属性</span>
<span class="token keyword">const</span> <span class="token constant">RESERVED_PROPS</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token literal-property property">ref</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token literal-property property">__self</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token literal-property property">__source</span><span class="token operator">:</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>

<span class="token comment">// 检查config对象中是否有ref属性</span>
<span class="token keyword">function</span> <span class="token function">hasValidRef</span><span class="token punctuation">(</span><span class="token parameter">config</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> config<span class="token punctuation">.</span>ref <span class="token operator">!==</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">// 检查config对象中是否有key属性</span>
<span class="token keyword">function</span> <span class="token function">hasValidKey</span><span class="token punctuation">(</span><span class="token parameter">config</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> config<span class="token punctuation">.</span>key <span class="token operator">!==</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 创建一个React元素（虚拟DOM）</span>
<span class="token keyword">function</span> <span class="token function">ReactElement</span><span class="token punctuation">(</span><span class="token parameter">type<span class="token punctuation">,</span> key<span class="token punctuation">,</span> ref<span class="token punctuation">,</span> props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    $$<span class="token keyword">typeof</span><span class="token operator">:</span> <span class="token constant">REACT_ELEMENT_TYPE</span><span class="token punctuation">,</span>
    type<span class="token punctuation">,</span>
    key<span class="token punctuation">,</span>
    ref<span class="token punctuation">,</span>
    props
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// 创建一个React元素的函数，处理key和ref属性，并将其他属性添加到props对象中</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">jsxDEV</span><span class="token punctuation">(</span><span class="token parameter">type<span class="token punctuation">,</span> config<span class="token punctuation">,</span> maybeKey</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> propName<span class="token punctuation">;</span>
  <span class="token keyword">const</span> props <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> key <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> ref <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token comment">// 如果maybeKey参数存在，将其赋值给key</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> maybeKey <span class="token operator">!==</span> <span class="token string">&#39;undefined&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    key <span class="token operator">=</span> maybeKey<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">hasValidKey</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    key <span class="token operator">=</span> <span class="token string">&#39;&#39;</span> <span class="token operator">+</span> config<span class="token punctuation">.</span>key<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 如果config对象中有ref属性，将其赋值给ref</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">hasValidRef</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    ref <span class="token operator">=</span> config<span class="token punctuation">.</span>ref<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 遍历config对象，将非保留属性添加到props对象中</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span>propName <span class="token keyword">in</span> config<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">hasOwnProperty</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>config<span class="token punctuation">,</span> propName<span class="token punctuation">)</span>
      <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span><span class="token constant">RESERVED_PROPS</span><span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>propName<span class="token punctuation">)</span>
    <span class="token punctuation">)</span> <span class="token punctuation">{</span>
      props<span class="token punctuation">[</span>propName<span class="token punctuation">]</span> <span class="token operator">=</span> config<span class="token punctuation">[</span>propName<span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 返回一个新的React元素</span>
  <span class="token keyword">return</span> <span class="token function">ReactElement</span><span class="token punctuation">(</span>type<span class="token punctuation">,</span> key<span class="token punctuation">,</span> ref<span class="token punctuation">,</span> props<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="shared-hasownproperty-js" tabindex="-1"><a class="header-anchor" href="#shared-hasownproperty-js" aria-hidden="true">#</a> shared/hasOwnProperty.js</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> hasOwnProperty <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token class-name">Object</span><span class="token punctuation">.</span>prototype<span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> hasOwnProperty<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,7),o=[t];function c(i,l){return s(),a("div",null,o)}const r=n(p,[["render",c],["__file","03.jsx代码实现.html.vue"]]);export{r as default};
