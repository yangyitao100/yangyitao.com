import{_ as s,r as c,o as d,c as r,b as e,d as n,e as i,f as o}from"./app.4326c516.js";const t="/assets/01-01.e8270574.webp",p={},l=o(`<h1 id="_01-代码管理策略-monorepo" tabindex="-1"><a class="header-anchor" href="#_01-代码管理策略-monorepo" aria-hidden="true">#</a> 01.代码管理策略-monorepo</h1><blockquote><p><code>Vue3</code>采用了<code>monorepo</code>的方式来对项目代码进行管理。本文首先会介绍<code>monorepo</code>的一些基础知识，接着会介绍几种实现<code>monorepo</code>策略的具体方案，最后再进入<code>Vue3</code>的源码中了解其采取的具体方案和实施细节。</p></blockquote><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token doc-comment comment">/******************************************************************/</span>
<span class="token doc-comment comment">/*****************     欢迎关注微信公众号：杨艺韬     *****************/</span>
<span class="token doc-comment comment">/******************************************************************/</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="基础知识" tabindex="-1"><a class="header-anchor" href="#基础知识" aria-hidden="true">#</a> 基础知识</h1><h2 id="monorepo是什么" tabindex="-1"><a class="header-anchor" href="#monorepo是什么" aria-hidden="true">#</a> monorepo是什么</h2><p>我们先看看维基百科是怎么给<code>monorepo</code>定义的：</p><blockquote><p>In version control systems, a <code>monorepo</code> (&quot;mono&quot; meaning &#39;single&#39; and &quot;repo&quot; being short for &#39;repository&#39;) <code>is a</code> software development <code>strategy</code> where code for many projects is stored in the same repository.</p></blockquote><p>从定义中可以知道，<code>monorepo</code>是一种策略，该策略的具体内容是：<strong>多个项目存储在同一个代码仓库中</strong>。采用一种策略，肯定是因为该策略具备一些优点。当然，也要认清其缺点。从下面这张图中，我们可以看出，项目代码的组织策略是在实践中诞生，不断发展变化的。 <img src="`+t+`" alt="monorepo.jpeg"></p><p>在软件开发实践过程中，最初采用的代码组织策略很简单，不管有多少代码都放在一个项目中进行管理，这也就是单项目单仓库的策略，对应图中的<code>monolith</code>。随着时间的流逝，代码量多到一定程度的时候，会发现每一次构建都会花费很长时间，代码耦合度强可维护性差，代码冲突频繁等各种问题逐渐显现且愈加严重。于是聪明的工程师们，将业务相对独立的功能以不同的项目进行维护，对应图中的<code>multi repo</code>。这样确实解决了一些问题，比如项目自治，可维护性变强。但是也有一些新的问题出现，比如：</p><ul><li>项目不同但相关联的功能联合调试困难，项目<code>A</code>想要调用项目<code>B</code>的能力，只能安装<code>B</code>发布的包进行依赖，所依赖的项目代码发生变化后也无法及时做出响应；</li><li>如果一个功能涉及到<code>A</code>和<code>B</code>两个项目，但因为项目在各自的仓库中维护，代码提交记录都无法完整反映出一个功能相关的所有代码；</li><li>效率低下，每个项目都需要独立配置相关项目环境，独立进行安装依赖、启动项目、版本发布等操作。</li></ul><p>问题的出现，意味着问题的解决方案也快出现，<code>monorepo</code>就在工程师们感到头疼的时候诞生了。需要提示大家，<code>monorepo</code>作为一种代码管理策略，并不是新生事物，已经有20年以上的历史了，最初这种策略的名字叫<code>shared codebase</code>，只不过以<code>monorepo</code>这个称呼闻名于世。我们接下来就看看<code>monorepo</code>有什么优势和缺陷。</p><h2 id="monorepo有什么优势" tabindex="-1"><a class="header-anchor" href="#monorepo有什么优势" aria-hidden="true">#</a> monorepo有什么优势</h2><h3 id="优势1-重用代码更加容易" tabindex="-1"><a class="header-anchor" href="#优势1-重用代码更加容易" aria-hidden="true">#</a> 优势1:重用代码更加容易</h3><p>相似的功能可以抽取到一个单独的项目中进行维护，并且不需要借助依赖包管理器就可以在其所在仓库下的其他项目中进行引用。</p><h3 id="优势2-简化依赖管理" tabindex="-1"><a class="header-anchor" href="#优势2-简化依赖管理" aria-hidden="true">#</a> 优势2:简化依赖管理</h3><p>在<code>multi repo</code>策略下，对于不同的项目，相同的三方依赖库可能需要各自进行下载、构建，重复工作。而在<code>monorepo</code>策略中，所有的依赖项都存放在同一个地方，这不仅方便管理，还可以进行很多优化。</p><h3 id="优势3-提交记录原子化" tabindex="-1"><a class="header-anchor" href="#优势3-提交记录原子化" aria-hidden="true">#</a> 优势3:提交记录原子化</h3><p>由于是单个仓库对代码进行维护管理，那一次改动无论涉及几个项目，都能在当次提交记录中完整反映出来。比如一个功能需要改动两个项目，如果是两个仓库来维护这两个项目，那么追溯该功能所对应修改的代码，就显得很困难。</p><h3 id="优势4-便于大规模代码重构" tabindex="-1"><a class="header-anchor" href="#优势4-便于大规模代码重构" aria-hidden="true">#</a> 优势4:便于大规模代码重构</h3><p>开发者可以访问仓库下的所有项目，对某个项目进行重构的时候，可以保证该项目重构后和其他项目组合在一起是可以正常运行的。反之如果开发者独立维护一个项目，对该项目重构后，是不是能在整个系统中正常运转很难去验证。</p><h3 id="优势5-便于跨团队协作" tabindex="-1"><a class="header-anchor" href="#优势5-便于跨团队协作" aria-hidden="true">#</a> 优势5:便于跨团队协作</h3><p>比如团队<code>A</code>维护项目<strong>一</strong>，而团队<code>B</code>用到了项目<strong>一</strong>提供的能力，因为代码共享，可以及时跟踪项目<strong>一</strong>中的具体代码，甚至对该项目中的代码提供改进意见。</p><h3 id="小结" tabindex="-1"><a class="header-anchor" href="#小结" aria-hidden="true">#</a> 小结</h3><p>上面列出了<code>monorepo</code>的几个优势，对于我们实际开发来讲，优势<strong>1</strong>、<strong>2</strong>、<strong>3</strong>，显得更加重要。至于优势<strong>4</strong>、<strong>5</strong>可能在其他团队会发挥比较大的作用，笔者的实践经历中没有明显的体会。同时，优势<strong>3</strong>、<strong>4</strong>、<strong>5</strong>都是单仓库天然的作用，没有太多内容可以讨论。而优势<strong>1</strong>和<strong>2</strong>在下文会有较多内容涉及到。</p><h2 id="monorepo有什么缺陷" tabindex="-1"><a class="header-anchor" href="#monorepo有什么缺陷" aria-hidden="true">#</a> monorepo有什么缺陷</h2><h3 id="丢失了版本信息" tabindex="-1"><a class="header-anchor" href="#丢失了版本信息" aria-hidden="true">#</a> 丢失了版本信息</h3><p>有些采用<code>monorepo</code>策略进行管理的代码，在构建的时候对仓库中所有的项目采用同一个版本号，这样导致每个项目自身丢失了符合语义的版本号。比如我在<code>vue3</code>中看仓库中的每个版本号也确实是一致的。</p><h3 id="失去了对每个项目的访问权限控制" tabindex="-1"><a class="header-anchor" href="#失去了对每个项目的访问权限控制" aria-hidden="true">#</a> 失去了对每个项目的访问权限控制</h3><p>如果每个项目存放在单独的仓库，控制仓库权限就可以控制项目的访问权限。但在<code>monorepo</code>的策略下，多个项目的代码存放在同一个仓库中，难以对权限进行控制。当然，一般来说版本控制工具可以对权限进行细致的控制，这个缺陷可以规避。</p><h3 id="默认需要更大的存储空间" tabindex="-1"><a class="header-anchor" href="#默认需要更大的存储空间" aria-hidden="true">#</a> 默认需要更大的存储空间</h3><p>这一点很好理解，在<code>monorepo</code>的策略下，默认会下载该仓库下的所有项目的代码。虽然这可以通过版本控制工具的能力来弥补这个权限，但是又会削弱<code>monorepo</code>原本具备的优势。</p><h3 id="其他缺陷" tabindex="-1"><a class="header-anchor" href="#其他缺陷" aria-hidden="true">#</a> 其他缺陷</h3><p>比如代码规模大到一定程度，有海量频繁提交会触发<code>git</code>的能力瓶颈，导致无法正常工作。但鉴于普通企业普通项目，难以涉及这类特殊场景，本文就不做介绍了。</p><h3 id="小结-1" tabindex="-1"><a class="header-anchor" href="#小结-1" aria-hidden="true">#</a> 小结</h3><p>古人说用人用的是其长处，我们采用<code>monorepo</code>更多的是因为其自身的优点，后文不会再讨论其缺陷。</p><h1 id="管理monorepo类型项目的方案" tabindex="-1"><a class="header-anchor" href="#管理monorepo类型项目的方案" aria-hidden="true">#</a> 管理monorepo类型项目的方案</h1><p>上文解释过，<code>monorepo</code>是一种策略。理解这个概念很重要，因为刚接触<code>monorepo</code>的朋友容易把<code>monorepo</code>和某个具体的工具画上等号。比如存在下面的错误认识：&quot;monorepo就是yarn提供的workspace&quot;、&quot;monorepo就是yarn和lerna的组合&quot;等等。<code>monorepo</code>是一个策略，是一种思想，而不是一个具体的工具。基于这个认识，我们就不难理解将一个策略落地，可以有多种方案。而本文将会由不断将方案进行增强演进，最终得出两个管理<code>monorepo</code>类型项目的优良方案。</p><h2 id="方式1-手动管理" tabindex="-1"><a class="header-anchor" href="#方式1-手动管理" aria-hidden="true">#</a> 方式1:手动管理</h2><p>事实上实现<code>monorepo</code>策略，并不一定要借助额外的工具。那没有工具我们该具体怎么做呢？在行动之前我们要把握住<code>monorepo</code>一个核心要点，一个明显特征。核心要点是：<strong>多个项目存放在同一个代码仓库中</strong>。明显特征是：<strong>项目可以引用其仓库下其他项目的代码</strong>。 假设我们有三个拥有独立仓库的项目<code>A、B、C</code>，改造成以<code>monorepo</code>方式进行管理。改造后的项目结构如下：</p><div class="language-markdown line-numbers-mode" data-ext="md"><pre class="language-markdown"><code><span class="token list punctuation">-</span> root
    <span class="token list punctuation">-</span> package.json
    <span class="token list punctuation">-</span> projects
        <span class="token list punctuation">-</span> projectA
            <span class="token list punctuation">-</span> package.json
            <span class="token list punctuation">-</span> src
                <span class="token list punctuation">-</span> index.js
        <span class="token list punctuation">-</span> projectB
            <span class="token list punctuation">-</span> package.json
            <span class="token list punctuation">-</span> src
                <span class="token list punctuation">-</span> index.js
        <span class="token list punctuation">-</span> projectC
            <span class="token list punctuation">-</span> package.json
            <span class="token list punctuation">-</span> src
                <span class="token list punctuation">-</span> index.js
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>假设这三个项目的职责如下：</p><ul><li>projectA: 一个依赖库，供其他项目访问</li><li>projectB: 一个<code>API</code>程序，启动后访问其监听的端口可以获取数据</li><li>projectC: 一个<code>H5</code>页面，需要使用<code>projectA</code>提供的功能，需要访问<code>projectB</code>提供的<code>API</code></li></ul><p>在实际开发中，可能会逐一执行形如下面的命令行：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token builtin class-name">cd</span> projects/projectA
$ <span class="token function">npm</span> <span class="token function">install</span>
$ <span class="token function">npm</span> build
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token builtin class-name">cd</span> projects/projectB
$ <span class="token function">npm</span> <span class="token function">install</span>
$ <span class="token function">npm</span> serve <span class="token comment"># 启动api服务项目</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token builtin class-name">cd</span> projects/projectC
$ <span class="token function">npm</span> <span class="token function">install</span>
$ <span class="token function">npm</span> start <span class="token comment"># 启动H5页面项目</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>另外在<code>projectB</code>的<code>package.json</code>可能会有下面的配置：</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
 <span class="token comment">// 此处省略许多内容...</span>
 <span class="token property">&quot;dependencies&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;vue&quot;</span><span class="token operator">:</span> <span class="token string">&quot;^2.5.17&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;@monorepo/A&quot;</span><span class="token operator">:</span> <span class="token string">&quot;一个可以访问到projectA构建结果文件的相对路径&quot;</span>  <span class="token comment">// &quot;@monorepo/A&quot;是projectA中的package.json配置的name属性值</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token comment">// 此处省略许多内容...</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>一系列手动操作，完成了<strong>3</strong>项工作：</p><ul><li>多个项目在同一个仓库下进行管理；</li><li>安装各个项目的依赖包，并启动各项目；</li><li>让<code>projectB</code>可以访问其所在仓库下的<code>projectA</code>的代码；</li></ul><p>可以直观的感受到，要想让这个系统正常运行，需要我们重复的手动执行一系列命令。这种方式很落后，但不可否认，这确实是一个<code>monorepo</code>类型项目的管理方案。</p><h2 id="方式2-lerna-npm" tabindex="-1"><a class="header-anchor" href="#方式2-lerna-npm" aria-hidden="true">#</a> 方式2: lerna + npm</h2><p>既然手动管理<code>monorepo</code>项目如上文描述的那般笨拙，那管理<code>monorepo</code>类型项目的工具也就诞生了，而<code>lerna</code>就是其中的佼佼者。<code>lerna</code>是什么呢？看官方文档是这样描述的：</p><blockquote><p>Lerna is a tool that optimizes the workflow around managing multi-package repositories with git and npm.</p></blockquote><p>可以理解为这是一个为了<code>monorepo</code>而生的工具。我们可以看<code>lerna</code>的两个重要的命令：</p><ul><li><code>lerna bootstrap</code> will link dependencies in the repo together.</li><li><code>lerna publish</code> will help publish any updated packages.</li></ul><p>可以看出<code>lerna pulish</code>命令是和版本发布相关的。<code>lerna bootstrap</code>主要完成了这么一项工作：进入所有的项目（如上文中<code>projectA、projectB、projectC</code>）目录，执行<code>npm install</code>命令安装依赖包。注意，在这里我们会发现，<code>lerna</code>会在每个子项目的根路径下面创建一个<code>node_modules</code>目录。</p><p>刚才讲了<code>lerna boostrap</code>这个命令的功能，下面简要介绍下如何配置<code>lerna</code>。</p><ul><li>在根目录下新建一个<code>lerna.json</code>文件，按照惯例<code>lerna</code>默认使用的是<code>npm</code>。也就是说可以省略配置项<code>&quot;npmClient&quot;: &quot;npm&quot;</code>。</li><li><code>lerna.json</code>中添加下面一个配置项，以便于<code>lerna</code>知道该去哪里寻找仓库中的项目：</li></ul><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
    packages<span class="token operator">:</span><span class="token punctuation">[</span>
        <span class="token string">&quot;projects/*&quot;</span>
    <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>在根项目<code>package.json</code>中应该有下面的配置，然后执行<code>npm run bootstrap</code>：</li></ul><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
    scripts<span class="token operator">:</span><span class="token punctuation">{</span>
        &#39;bootstrap&#39;<span class="token operator">:</span>&#39;lerna bootstrap&#39;
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><code>lerna</code>为什么默认配置不是<code>&quot;npmClient&quot;: &quot;yarn&quot;</code>呢？实际上<code>lerna</code>出现的时间甚至要早于<code>yarn</code>。</p></blockquote><p>做了相应配置，执行相应的命令后，最终的结果和我们在<strong>方式1</strong>中的结果几乎是一模一样的。</p><h2 id="方式3-lerna-yarn" tabindex="-1"><a class="header-anchor" href="#方式3-lerna-yarn" aria-hidden="true">#</a> 方式3: lerna + yarn</h2><p>方式<strong>3</strong>和方式<strong>2</strong>相比很相似。不同的是，在<code>lerna.json</code>文件中需要将<code>npmClient</code>的值变更为<code>yarn</code>。既然<code>lerna</code>和<code>npm</code>结合或者<code>yarn</code>结合实现的功能是如此的相似，那我们如何选择呢？可以问问自己下面两个问题：</p><ul><li>自己是喜欢坚持行业标准呢还是喜欢Facebook提供的各种新特性？</li><li>是否真的关心安装依赖包的时间长短？ 事实上，不管选哪一个差别都不会太大，按自己感觉来就行。</li></ul><h2 id="方式4-yarn-workspaces" tabindex="-1"><a class="header-anchor" href="#方式4-yarn-workspaces" aria-hidden="true">#</a> 方式4: yarn workspaces</h2><p>对于这种方式，我们不需要形如<code>lerna.json</code>的配置文件，因为<code>yarn workspaces</code>天然自带<code>monorepo</code>相关能力。虽然没有专用的配置文件，但需要在项目根路径下的<code>package.json</code>文件中做些配置，例如：</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
    workspaces<span class="token operator">:</span><span class="token punctuation">[</span>
        <span class="token string">&quot;projects/*&quot;</span>
    <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样<code>yarn</code>后续就知道在哪里去寻找<code>workspace</code>，这里的<code>workspace</code>其实就是各个子项目。当我们在项目根目录执行命令<code>yarn install</code>（这里的<code>install</code>可以省略）的时候，各个子项目也会安装各自的依赖项。这里和<strong>方式1</strong>与<strong>方式2</strong>有一个巨大的不同，执行完<code>yarn install</code>命令，只会在项目根路径下创建<code>node_modules</code>目录，各个子项目并没有这样一个目录来存放各自的依赖包。所有的依赖项都提升到了根路径下。事实上，<strong>方式2</strong>中如果执行<code>lerna boostrap</code>命令的时候加上<code>-hoist</code>标志，那么子项目的依赖项也会进行提升到根路径下。</p><h2 id="方式5-lerna-yarn-workspace" tabindex="-1"><a class="header-anchor" href="#方式5-lerna-yarn-workspace" aria-hidden="true">#</a> 方式5: lerna + yarn workspace</h2><p>到了这里，大家可能会觉得奇怪，<code>yarn workspace</code>可以管理<code>monorepo</code>类型的项目，<code>lerna + npm/yarn</code>也可以管理<code>monorepo</code>类型的项目。为什么又将二者相结合起来呢？实际上，这里的<code>lerna</code>角色发生了变化，在<strong>方式2</strong>、<strong>方式3</strong>中，<code>lerna</code>需要执行<code>lerna boostrap</code>进入各个子项目安装相关依赖。而和<code>yarn workspaces</code>相结合的情况下，这些依赖管理的工作都交给了<code>yarn worksapces</code>。之所以使用<code>lerna</code>，是希望利用<code>lerna</code>提供的一些工具命令来优化对<code>monorepo</code>类型项目的管理，比如测试的时候，可以利用<code>lerna</code>选择性的执行某些命令。同时<code>lerna</code>还提供了诸如版本发布等可以优化开发体验的工具。具体怎么配置，有哪些命令，怎么使用这些命令，朋友们可以查阅相关文档，就不在本文赘述了。</p><h2 id="方式6-pnpm-workspace" tabindex="-1"><a class="header-anchor" href="#方式6-pnpm-workspace" aria-hidden="true">#</a> 方式6: pnpm workspace</h2><p><code>pnpm</code>作为一个比较新的工具，肯定是解决了旧工具中存在的一些问题。我们先看看<code>yarn</code>存在什么问题，<code>yarn</code>文档中有这样一段描述：</p><blockquote><p>Be careful when publishing packages in a workspace. If you are preparing your next release and you decided to use a new dependency but forgot to declare it in the package.json file, your tests might still pass locally if another package already downloaded that dependency into the workspace root. However, it will be broken for consumers that pull it from a registry, since the dependency list is now incomplete so they have no way to download the new dependency. Currently, there is no way to throw a warning in this scenario.</p></blockquote><p>大意是说，在子项目（<code>yarn</code>称之为<code>workspace</code>）中当引用了一个三方依赖，如果没在该<code>workspace</code>下声明这个依赖，可能程序还能顺利执行，因为这个依赖库可能在别的<code>workspace</code>中安装过，由于<code>yarn</code>提升了所有<code>workspace</code>的依赖库到根路径下的<code>node_modules</code>进行管理，所以会出现这种情况，并且<code>yarn</code>也说了，这问题解决不了。</p><p>当然<code>yarn</code>还有其他问题，本文就不一一阐述。这里只需要知道，<code>pnpm</code>是一个相对新的，性能比较优良的包管理工具。</p><p><code>pnpm</code>也有类似<code>yarn</code>的<code>workspace</code>机制。不过和<code>yarn</code>不同，<code>pnpm</code>也需要配置独有的配置文件。而在<code>Vue3</code>中，目前也采用的<code>pnpm</code>来进行包的管理。</p><h1 id="vue3代码组织方式" tabindex="-1"><a class="header-anchor" href="#vue3代码组织方式" aria-hidden="true">#</a> Vue3代码组织方式</h1><p>先看看<code>Vue3</code>的包依赖关系：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>                                    +---------------------+
                                    |                     |
                                    |  @vue/compiler-sfc  |
                                    |                     |
                                    +-----+--------+------+
                                          |        |
                                          v        v
                      +---------------------+    +----------------------+
                      |                     |    |                      |
        +------------&gt;|  @vue/compiler-dom  +---&gt;|  @vue/compiler-core  |
        |             |                     |    |                      |
   +----+----+        +---------------------+    +----------------------+
   |         |
   |   vue   |
   |         |
   +----+----+        +---------------------+    +----------------------+    +-------------------+
        |             |                     |    |                      |    |                   |
        +------------&gt;|  @vue/runtime-dom   +---&gt;|  @vue/runtime-core   +---&gt;|  @vue/reactivity  |
                      |                     |    |                      |    |                   |
                      +---------------------+    +----------------------+    +-------------------+
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>与之匹配的，跟<code>pnpm</code>管理<code>monorepo</code>项目相关的代码如下：</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token comment">// 所在文件：core/pnpm-workspace.yaml ，注：vue3目前的仓库名叫core</span>
packages<span class="token operator">:</span>
  - &#39;packages<span class="token comment">/*&#39;
</span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token comment">// 所在文件: core/package.json， 部分配置</span>
<span class="token punctuation">{</span>
    <span class="token property">&quot;devDependencies&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;@vue/reactivity&quot;</span><span class="token operator">:</span> <span class="token string">&quot;workspace:*&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;@vue/runtime-core&quot;</span><span class="token operator">:</span> <span class="token string">&quot;workspace:*&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;@vue/runtime-dom&quot;</span><span class="token operator">:</span> <span class="token string">&quot;workspace:*&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;vue&quot;</span><span class="token operator">:</span> <span class="token string">&quot;workspace:*&quot;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样带来的好处是，如<code>Vue3</code>文档描述的那样：</p>`,86),u=e("p",null,[n("The packages can import each other directly using their package names. Note that when importing a package, the name listed in its "),e("code",null,"package.json"),n(" should be used. Most of the time the "),e("code",null,"@vue/"),n(" prefix is needed: "),e("code",null,"import { h } from '@vue/runtime-core"),n(". This is made possible via several configurations:")],-1),m=e("li",null,[n("For TypeScript, "),e("code",null,"compilerOptions.paths"),n(" in "),e("code",null,"tsconfig.json")],-1),v=e("li",null,[n("For Jest, "),e("code",null,"moduleNameMapper"),n(" in "),e("code",null,"jest.config.js")],-1),h={href:"https://pnpm.io/workspaces",target:"_blank",rel:"noopener noreferrer"},b=o('<h1 id="小结-2" tabindex="-1"><a class="header-anchor" href="#小结-2" aria-hidden="true">#</a> 小结</h1><p>本文介绍了<code>monorepo</code>的基础概念。接着介绍了管理<code>monorepo</code>的几种方案，从原始的手动管理到<code>lerna + yarn</code> 、<code>pnpm</code>两种优良的管理方式。文末介绍了<code>Vue3</code>中关于<code>pnpm</code>管理<code>monorepo</code>类型项目的的相关配置。限于篇幅，文中并未从细节处系统性的去描述如何配置文件，如何执行命令，笔者后续会产出一系列的关于前端工具的文章，目前就先到这里。本文的目标是帮助大家理解<code>monorepo</code>的基本概念，知道日常开发中一些<code>monorepo</code>相关的工具的名称（<code>lerna、npm、yarn、yarn workspace、pnpm</code>）背后的含义和具备的能力，不会因为对<code>monorepo</code>认知的模糊而阻碍我们进入<code>Vue3</code>源码的世界，朋友们可以查阅文档了解这些工具的具体使用方式。下一篇文章，将会带着大家了解<code>Vue3</code>代码的构建流程。有了这些基础，我们才能在后续对<code>Vue3</code>源码进行顺利的调试，敬请朋友们期待。</p><p>参考资料：</p><ul><li>https://doppelmutzi.github.io/monorepo-lerna-yarn-workspaces/</li><li>https://pnpm.io/workspaces</li><li>https://yarnpkg.com/features/workspaces</li><li>https://lerna.js.org/</li></ul><h2 id="写在最后" tabindex="-1"><a class="header-anchor" href="#写在最后" aria-hidden="true">#</a> 写在最后</h2><p>读完文章觉得有收获的朋友们，可以做下面几件事情支持一下：</p><ul><li>如果您此刻在掘金看见这篇文章，辛苦<code>点赞</code>，增加掘力值，助我早日成为掘金优秀作者；</li><li>如果您此刻在微信公众号，请<code>点赞，点在看，转发</code>，让文章帮助到更多需要帮助的人；</li><li>如果是微信公众号的作者，可以找我开通<code>白名单</code>，<code>转载</code>我的原创文章；</li></ul><p>最后，请朋友们关注我的<code>微信公众号: 杨艺韬</code>，可以获取我的最新动态。</p>',8);function k(g,y){const a=c("ExternalLinkIcon");return d(),r("div",null,[l,e("blockquote",null,[u,e("ul",null,[m,v,e("li",null,[n("For plain Node.js, they are linked using "),e("a",h,[n("PNPM Workspaces"),i(a)]),n(".")])])]),b])}const f=s(p,[["render",k],["__file","01.代码管理策略-monorepo.html.vue"]]);export{f as default};
