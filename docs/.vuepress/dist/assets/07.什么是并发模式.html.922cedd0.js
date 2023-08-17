import{_ as e,o as t,c,f as i}from"./app.d86bc82c.js";const n={},a=i('<h1 id="并发模式" tabindex="-1"><a class="header-anchor" href="#并发模式" aria-hidden="true">#</a> 并发模式</h1><p>Concurrent Mode 允许 React 在用户界面更新期间执行多个任务，从而实现流畅、响应迅速的用户体验。以下是一些与 Concurrent Mode 相关的核心概念，需要说明的是由于我们还没开始编写源码，这些概念可能会听起来比较抽象，但很有必要先在这里过一遍，在后续手写源码的过程中会不断回顾这些概念：</p><ul><li><p>并发（Concurrency）：并发是指在同一时间执行多个任务的能力。在 JavaScript 中，由于其单线程特性，我们无法实现真正的并发。然而，通过将任务分解为更小的部分并在事件循环中交替执行它们，我们可以模拟并发。这有助于避免长时间运行的任务阻塞用户界面。</p></li><li><p>时间切片（Time Slicing）：React 通过将工作拆分为更小的部分并在事件循环中交替执行它们，实现了一种称为时间切片的技术。这允许 React 在执行长时间运行的更新任务时保持用户界面的响应性。通过将工作划分为时间切片，React 可以在处理高优先级更新（如用户输入）时暂停低优先级更新。</p></li><li><p>优先级调度（Priority Scheduling）：在 Concurrent Mode 中，React 可以根据任务的优先级对它们进行调度。例如，用户输入和动画等交互类任务具有较高优先级，而数据获取和大型计算任务则具有较低优先级。这种优先级调度使 React 能够确保用户界面始终保持流畅且响应迅速。</p></li><li><p>阻塞渲染（Blocking Rendering）：在传统的 React 更新模式中，当组件发生更新时，React 会立即计算并应用 DOM 更新。这可能导致长时间运行的任务阻塞浏览器的主线程，从而降低用户体验。在 Concurrent Mode 中，React 可以通过将更新任务拆分为时间切片并根据优先级对其进行调度，来避免阻塞渲染问题。</p></li><li><p>有条件的渲染（Transition）：React 18 引入了新的 startTransition API，允许开发者在组件中显式地声明某些更新具有较低优先级。这有助于确保高优先级的用户交互任务不会被较低优先级的任务阻塞。例如，在数据获取期间，您可以使用 startTransition 使 UI 保持响应并显示加载指示器，直到数据准备就绪。</p></li></ul>',3),r=[a];function o(l,_){return t(),c("div",null,r)}const d=e(n,[["render",o],["__file","07.什么是并发模式.html.vue"]]);export{d as default};
