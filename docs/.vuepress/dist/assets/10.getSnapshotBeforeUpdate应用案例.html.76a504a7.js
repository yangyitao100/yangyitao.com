import{_ as n,o as s,c as a,f as t}from"./app.d86bc82c.js";const p={},e=t(`<h1 id="_10-getsnapshotbeforeupdate应用案例" tabindex="-1"><a class="header-anchor" href="#_10-getsnapshotbeforeupdate应用案例" aria-hidden="true">#</a> 10.getSnapshotBeforeUpdate应用案例</h1><p>案例讲解请观看视频，这里呈现相关代码：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>
<span class="token keyword">import</span> React <span class="token keyword">from</span> <span class="token string">&#39;./react&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> ReactDOM <span class="token keyword">from</span> <span class="token string">&#39;./react-dom&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">class</span> <span class="token class-name">ScrollingList</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>
  counter <span class="token operator">=</span> <span class="token number">0</span>
  isAppend <span class="token operator">=</span> <span class="token boolean">true</span>
  intervalId <span class="token operator">=</span> <span class="token number">0</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>listRef <span class="token operator">=</span> React<span class="token punctuation">.</span><span class="token function">createRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>state <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token literal-property property">list</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// https://reactjs.org/docs/react-component.html#getsnapshotbeforeupdate</span>
  <span class="token comment">// 1.该函数在render函数执行完成生成真实DOM后，DOM挂载到页面前执行</span>
  <span class="token comment">// 2.该函数使得组件在DOM发生变化之前可以获取一些信息</span>
  <span class="token comment">// 3.该函数返回的任何值都会作为componentDidUpdate的第三个参数传入</span>
  <span class="token comment">// 4.该生命周期函数并不常用，仅仅在一些特定UI变化的场景才会用到</span>
  <span class="token function">getSnapshotBeforeUpdate</span><span class="token punctuation">(</span><span class="token parameter">prevProps<span class="token punctuation">,</span> prevState</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// Are we adding new items to the list?</span>
    <span class="token comment">// Capture the scroll position so we can adjust scroll later.</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>prevState<span class="token punctuation">.</span>list<span class="token punctuation">.</span>length <span class="token operator">&lt;</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>list<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> list <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>listRef<span class="token punctuation">.</span>current<span class="token punctuation">;</span>
      <span class="token keyword">return</span> list<span class="token punctuation">.</span>scrollHeight <span class="token operator">-</span> list<span class="token punctuation">.</span>scrollTop<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token function">componentDidUpdate</span><span class="token punctuation">(</span><span class="token parameter">prevProps<span class="token punctuation">,</span> prevState<span class="token punctuation">,</span> snapshot</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// If we have a snapshot value, we&#39;ve just added new items.</span>
    <span class="token comment">// Adjust scroll so these new items don&#39;t push the old ones out of view.</span>
    <span class="token comment">// (snapshot here is the value returned from getSnapshotBeforeUpdate)</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>snapshot <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> list <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>listRef<span class="token punctuation">.</span>current<span class="token punctuation">;</span>
      list<span class="token punctuation">.</span>scrollTop <span class="token operator">=</span> list<span class="token punctuation">.</span>scrollHeight <span class="token operator">-</span> snapshot<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token function-variable function">appendData</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>isAppend<span class="token punctuation">)</span><span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>intervalId <span class="token operator">=</span> <span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
          <span class="token literal-property property">list</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token operator">...</span><span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>list<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>counter<span class="token operator">++</span><span class="token punctuation">]</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span><span class="token number">1000</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token keyword">else</span><span class="token punctuation">{</span>
      <span class="token function">clearInterval</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>intervalId<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>isAppend <span class="token operator">=</span> <span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span>isAppend
  <span class="token punctuation">}</span>

  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token operator">&lt;</span>div<span class="token operator">&gt;</span>
      <span class="token operator">&lt;</span>input type<span class="token operator">=</span><span class="token string">&quot;button&quot;</span> onClick<span class="token operator">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">appendData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span>  value<span class="token operator">=</span><span class="token punctuation">{</span><span class="token string">&quot;追加/暂停追加数据&quot;</span><span class="token punctuation">}</span><span class="token operator">/</span><span class="token operator">&gt;</span>
      <span class="token operator">&lt;</span>div  ref<span class="token operator">=</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>listRef<span class="token punctuation">}</span> style<span class="token operator">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token literal-property property">overflow</span><span class="token operator">:</span> <span class="token string">&#39;auto&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">height</span><span class="token operator">:</span><span class="token string">&#39;400px&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">background</span><span class="token operator">:</span> <span class="token string">&#39;#efefef&#39;</span><span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token operator">&gt;</span>
        <span class="token punctuation">{</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>list<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">item</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token operator">&lt;</span>div key<span class="token operator">=</span><span class="token punctuation">{</span>item<span class="token punctuation">}</span> style<span class="token operator">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span>
              <span class="token literal-property property">height</span><span class="token operator">:</span> <span class="token string">&#39;60px&#39;</span><span class="token punctuation">,</span>
              <span class="token literal-property property">padding</span><span class="token operator">:</span> <span class="token string">&#39;10px&#39;</span><span class="token punctuation">,</span>
              <span class="token literal-property property">marginTop</span><span class="token operator">:</span> <span class="token string">&#39;10px&#39;</span><span class="token punctuation">,</span>
              <span class="token literal-property property">border</span><span class="token operator">:</span> <span class="token string">&#39;1px solid blue&#39;</span><span class="token punctuation">,</span>
              <span class="token literal-property property">borderRadius</span><span class="token operator">:</span> <span class="token string">&#39;6px&#39;</span>
            <span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token operator">&gt;</span><span class="token punctuation">{</span>item<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
          <span class="token punctuation">}</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
      <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
      
      <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
ReactDOM<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span><span class="token operator">&lt;</span>ScrollingList<span class="token operator">/</span><span class="token operator">&gt;</span><span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;root&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3),o=[e];function c(l,i){return s(),a("div",null,o)}const r=n(p,[["render",c],["__file","10.getSnapshotBeforeUpdate应用案例.html.vue"]]);export{r as default};
