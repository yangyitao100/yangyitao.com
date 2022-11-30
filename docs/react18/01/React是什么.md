# React是什么
React的官方文档上有一句非常醒目的话：
> React is a JavaScript library for building user interfaces. 

这个解释很简洁也很准确，但是对于很多对React了解有限的朋友来讲，听起来太过抽象。所以要想真正的理解React是什么，我们还得理解React有什么用，换句话说要理解React有什么存在的价值，才能真正的明白React究竟是什么。

## React有什么价值
有句讽刺人没有价值的话叫“有你没你都一样”，我个人觉得这句话很有攻击性和侮辱性因而几乎不用，但这其中却隐藏了一个道理，那就是通过对比来体现价值。那反过来我们问一问：“有React和没React有什么区别？”。如果能回答这个问题，相信很多朋友也就能很直观的理解React到底是什么了。那既然是对比，我们就通过一个小案例来进行讲解。那既然是对比，当然这个案例就要通过两种方式来实现：
1. 用原始的JavaScript代码来实现
2. 用React来实现

## 案例需求
在页面上显示一个按钮，按钮显示的文字内容为：`Hello, Count: 0`，每点击一次该按钮，Count后的数字加1。
## 案例实现-原始版
```html
<html>
    <head>
        <title>Test</title>
    </head>
    <body>
        <div id="root">
            <div id="content" onclick="changeText()">Click Me, Count: 0</div>
        </div>
    </body>
    <style>
        #content{
            font-size:22px;
            border: 1px solid gray;
            cursor: pointer;
            padding: 6px 10px;
            display: inline-block;
            border-radius: 10px;
        }
    </style>
    <script lang="javascript">
        let count = 0
        function changeText(){
            count ++
            document.getElementById('content').innerText = "Click Me, Count: " + count
        }
    </script>
</html>
```
## 案例实现-React版
```html
<html>
  <head>
    <title>Test</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <!-- Don't use this in production: -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <style>
    #content{
        font-size:22px;
        border: 1px solid gray;
        cursor: pointer;
        padding: 6px 10px;
        display: inline-block;
        border-radius: 10px;
    }
  </style>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      function MyFunctionComponent() {
        let [count, setCount] = React.useState(0)
        return <div id="content" onClick={()=>setCount(++count)}>Click Me, Count: {count}</div>
      }
      const container = document.getElementById('root');
      const root = ReactDOM.createRoot(container);
      root.render(<MyFunctionComponent />);
    </script>
    <!--
      Note: this page is a great way to try React but it's not suitable for production.
      It slowly compiles JSX with Babel in the browser and uses a large development build of React.
    -->
  </body>
</html>
```
> 需要说明的是，为了便于大家理解，案例的React版本的实现仅仅是为了验证原理，其中的代码只适用于学习用，不适用于生产环境，本教程的所有示例代码同理。对于不了解React版本为什么这么实现的朋友不用担心，暂时不用关心实现细节，后续内容会涉及到对相关语法详细而深入的讲解。
## 小结
根据上面案例的原始版本实现和React版实现，即使不知道React的语法，不去深究React版本实现的细节，我们也能从宏观上进行比较二者的一些不同：
1. 案例的React版本实现中引入了三个外部链接
2. 相较于原始版本，React版本的代码实现只关注了变量`count`值的变化，并没有手动去操作DOM

根据上面观察到的两点差异，我们可以得出这样一个结论：**React本质上就是一个根据数据变化来操作DOM的工具库**。这个结论与本文开始提到的React定义是相吻合的。这也是为什么本教程后续对React的一切讲解可以说都是以DOM变化为中心进行的。