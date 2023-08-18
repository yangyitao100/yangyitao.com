import{_ as n,o as s,c as a,f as t}from"./app.a186c370.js";const p={},o=t(`<h1 id="_17-hooks相关源码调试" tabindex="-1"><a class="header-anchor" href="#_17-hooks相关源码调试" aria-hidden="true">#</a> 17.Hooks相关源码调试</h1><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>name<span class="token punctuation">,</span> setName<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">useState</span><span class="token punctuation">(</span><span class="token string">&#39;yangyitao&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>age<span class="token punctuation">,</span> setAge<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">useState</span><span class="token punctuation">(</span><span class="token number">30</span><span class="token punctuation">)</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>address<span class="token punctuation">,</span> setAddress<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">useState</span><span class="token punctuation">(</span><span class="token string">&#39;china&#39;</span><span class="token punctuation">)</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>job<span class="token punctuation">,</span> setJob<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">useState</span><span class="token punctuation">(</span><span class="token string">&#39;front end developer&#39;</span><span class="token punctuation">)</span>
  <span class="token keyword">function</span> <span class="token function">changeState</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token function">setName</span><span class="token punctuation">(</span><span class="token string">&#39;yangyitao plus&#39;</span><span class="token punctuation">)</span>
    <span class="token function">setAge</span><span class="token punctuation">(</span><span class="token number">35</span><span class="token punctuation">)</span>
    <span class="token function">setAddress</span><span class="token punctuation">(</span><span class="token string">&#39;sichuan&#39;</span><span class="token punctuation">)</span>
    <span class="token function">setJob</span><span class="token punctuation">(</span><span class="token string">&#39;full stack developer&#39;</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> <span class="token operator">&lt;</span>div<span class="token operator">&gt;</span>
    <span class="token punctuation">{</span><span class="token string">&#39;name: &#39;</span> <span class="token operator">+</span> name<span class="token punctuation">}</span><span class="token operator">&lt;</span>br<span class="token operator">/</span><span class="token operator">&gt;</span> <span class="token punctuation">{</span> <span class="token string">&#39;age &#39;</span> <span class="token operator">+</span> age<span class="token punctuation">}</span><span class="token operator">&lt;</span>br<span class="token operator">/</span><span class="token operator">&gt;</span> <span class="token punctuation">{</span><span class="token string">&#39;address: &#39;</span> <span class="token operator">+</span> address<span class="token punctuation">}</span><span class="token operator">&lt;</span>br<span class="token operator">/</span><span class="token operator">&gt;</span> <span class="token punctuation">{</span><span class="token string">&#39;job: &#39;</span> <span class="token operator">+</span> job<span class="token punctuation">}</span><span class="token operator">&lt;</span>br<span class="token operator">/</span><span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span>button onClick<span class="token operator">=</span><span class="token punctuation">{</span>changeState<span class="token punctuation">}</span><span class="token operator">&gt;</span>change states<span class="token operator">&lt;</span><span class="token operator">/</span>button<span class="token operator">&gt;</span>
  <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
<span class="token punctuation">}</span>

ReactDOM<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span><span class="token operator">&lt;</span>App<span class="token operator">/</span><span class="token operator">&gt;</span><span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;root&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),e=[o];function c(l,u){return s(),a("div",null,e)}const r=n(p,[["render",c],["__file","13.Hooks相关源码调试.html.vue"]]);export{r as default};
