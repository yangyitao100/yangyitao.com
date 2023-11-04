import{_ as n,o as s,c as a,f as t}from"./app.4326c516.js";const p={},e=t(`<h1 id="_04-常用生命周期函数应用案例" tabindex="-1"><a class="header-anchor" href="#_04-常用生命周期函数应用案例" aria-hidden="true">#</a> 04.常用生命周期函数应用案例</h1><p>案例解释请观看视频，这里呈现其代码：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">//https://reactjs.org/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class</span>

<span class="token keyword">import</span> React <span class="token keyword">from</span> <span class="token string">&#39;react&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> ReactDOM <span class="token keyword">from</span> <span class="token string">&#39;react-dom&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">class</span> <span class="token class-name">Clock</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>state <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token literal-property property">date</span><span class="token operator">:</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// https://reactjs.org/docs/react-component.html#componentdidmount</span>
  <span class="token comment">// 1.组件挂载到页面上（已经操作了真实DOM）后调用</span>
  <span class="token comment">// 2.需要DOM节点的相关初始化操作需要放在这里</span>
  <span class="token comment">// 3.加载相关数据的好地方</span>
  <span class="token comment">// 4.适合事件订阅的，但要记住订阅的事件要在componentWillUnmount中取消订阅</span>
  <span class="token comment">// 5.不适合在这里调用setState，state初始值最好在constructor中赋值</span>
  <span class="token function">componentDidMount</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;componentDidMount&#39;</span><span class="token punctuation">)</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>timerID <span class="token operator">=</span> <span class="token function">setInterval</span><span class="token punctuation">(</span>
      <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">tick</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token number">1000</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// https://reactjs.org/docs/react-component.html#componentdidupdate</span>
  <span class="token comment">// 1.更新完成后调用，初始化渲染不会调用</span>
  <span class="token comment">// 2.当组件完成更新，需要对DOM进行某种操作的时候，适合在这个函数中进行</span>
  <span class="token comment">// 3.当当前的props和之前的props有所不同，可以在这里进行有必要的网络请求</span>
  <span class="token comment">// 4.这里虽然可以调用setState，但是要记住有条件的调用，否则会陷入死循环</span>
  <span class="token comment">// 5.如果shouldComponentUpdate() 返回false，componentDidUpdate不会执行</span>
  <span class="token comment">// 6.如果实现了getSnapshotBeforeUpdate，componentDidUpdate会接收第三个参数</span>
  <span class="token comment">// 7.如果将props中的内容拷贝到state，可以考虑直接使用props</span>
  <span class="token comment">// https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html</span>
  <span class="token function">componentDidUpdate</span><span class="token punctuation">(</span><span class="token parameter">prevProps<span class="token punctuation">,</span> prevState<span class="token punctuation">,</span> snapshot</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;componentDidUpdated&#39;</span><span class="token punctuation">,</span> prevProps<span class="token punctuation">,</span> prevState<span class="token punctuation">,</span> snapshot<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// https://reactjs.org/docs/react-component.html#componentwillunmount</span>
  <span class="token comment">// 1.组件从DOM树上卸载完成的时候调用该函数</span>
  <span class="token comment">// 2.执行一些清理操作，比如清除定时器，取消事件订阅，取消网络请求等</span>
  <span class="token comment">// 3.不能在该函数中调用setState，不会产生任何效果，卸载后不会重新渲染</span>
  <span class="token function">componentWillUnmount</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;componentWillUnmount&#39;</span><span class="token punctuation">)</span>
    <span class="token function">clearInterval</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>timerID<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token function">tick</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">date</span><span class="token operator">:</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">(</span>
      <span class="token operator">&lt;</span>div<span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span>h1<span class="token operator">&gt;</span>Hello<span class="token punctuation">,</span> world<span class="token operator">!</span><span class="token operator">&lt;</span><span class="token operator">/</span>h1<span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span>h2<span class="token operator">&gt;</span>It is <span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>date<span class="token punctuation">.</span><span class="token function">toLocaleTimeString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">.</span><span class="token operator">&lt;</span><span class="token operator">/</span>h2<span class="token operator">&gt;</span>
      <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

ReactDOM<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span><span class="token operator">&lt;</span>Clock <span class="token operator">/</span><span class="token operator">&gt;</span><span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;root&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3),o=[e];function c(l,i){return s(),a("div",null,o)}const r=n(p,[["render",c],["__file","04.常用生命周期函数应用案例.html.vue"]]);export{r as default};
