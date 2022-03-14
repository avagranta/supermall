# 0. 项目结构

文件结构：

- src

  - assets 存放静态文件

    - css 样式相关
    - img 图片相关

  - common 存放公共函数，便于复用

  - components 组件

    - common 存放公共组件，便于复用
    - content 对页面的数据或内容进行展示的组件

  - network 管理网络请求

    - request 对axios进行封装
    - home 主页的网络请求
    - detail 详情页的网络请求

  - router 管理路由

    - index 具体

  - store 管理状态vuex

    - actions.js
    - getters.js
    - index.js
    - mutations.js

  - views 主要界面

    - cart 购物车
    - category 分类（计划）
    - detail 详情页
    - home 主页
      - childComps 存放子组件

    

# 1. 新建vue.config.js

- 用于处理多级目录
- 将几个主要目录添加到配置中



# 2. 封装main-tab-bar

在common中封装结构tab-bar和tab-bar-item。

- tab-bar：使用fixed固定定位定到页面底部，并添加插槽和flex布局。

- tab-bar-item：需要展示的内容为一张图片和一个文字，以及实现点击切换路由让当前页面的图标变红。

  - 做法：
    - 添加图标和文字的插槽，使用v-if、v-else根据计算属性isActive（通过判断当前路径是否和自身路径相同，自身路径path通过props传入）实现活跃的路由变色，其中，图片变色效果通过两张图片实现，文字变色效果通过计算属性activeStyle（内部同样依赖isActive）实现。
    - 添加点击的事件监听，实现点击改变路由

  

到content中的main-tab-bar使用以上两个组件，并传入内容和路由。

- 使用以上两个组件，为tab-bar-item组件传入对应的路径path，以及活跃/不活跃的图片、对应文字。



# 3. 引入vue-router

- 创建router文件夹，创建index.js入口
- 配置路由，使用history模式，使用路由懒加载
  - 引入vue-roter和Vue
  - 引入路由对应的组件
  - 安装插件Vue.use
  - 创建路由对象，默认重定向到主页
  - 导出router
  - 在main.js中引入router
  - 在App.vue中添加<router-view/>



# 4. 创建View文件夹

View文件夹存放每个可视的页面

## 4.0 引入axios 并对其封装

创建request.js并引入axios，将其封装成一个函数。

对外暴露request函数，传参为配置信息

- 创建axios实例，配置baseURL
- 配置请求和响应拦截器
- 返回实例，发送网络请求



## 4.1 主页 Home 的搭建

### 4.1.0 请求主页需要的数据

创建home.js 处理首页发出的网络请求

- getHomeMultidate 函数请求多个数据
- getHomeGoods 函数请求商品的数据，做分页请求
  - ![image-20220308161522845](image/image-20220308161522845.png)
  - 

### 4.1.1 头部 nav-bar

- 设计导航栏为左、中、右三个插槽

在common中封装NavBar组件

- 添加左中右三个插槽
- 通过flex布局，实现左右两侧固定宽度，中间填满

在Home中使用nav-bar并传入文字“购物街”到中部插槽



### 4.1.2 轮播图 swiper

由于逻辑较为复杂，给Home添加一个childComps文件夹，用于存放子组件。创建HomeSwiper组件

同样是common/swiper中创建Swiper 作为结构

- 一个是轮播图片的插槽
  - 监听触碰开始、触碰移动、触碰结束三个事件
  - 
- 另一个是下面小圆点的插槽

common/swiper中创建SwiperItem 作为内容

- 添加插槽，用于展示图片
- 设置图片大小填满父组件，通过flex-shrink

HomeSwiper 中使用以上两个组件，并传入图片数据



### 4.1.3 RecommendView 推荐

展示图片对应文字

- props中接受传入的信息 recommends

- 使用v-for遍历传入的推荐信息进行展示，分为图片和文字
  - 采用flex布局

- 在Home中传入recomms

### 4.1.4  FeatureView 特惠信息

直接摆了一张图



### 4.1.5 TabControl tab栏切换

实现tab栏切换，根据传入的titles展示，并监听点击事件

- props中接受传入的信息 titles
- 使用v-for遍历，采用flex布局
- 维护一个currentIndex数据，表示当前选中
- 监听点击，改变currentIndex，并传给父组件一个itemClick
- Home中接受tabClick事件，将当前展示的类别更换为点击的类别



### 4.1.6 GoodsList 商品展示

展示图片、文字、价格

content/goods中创建GoodsListItem

- props接受GoodsItem，将图片、文字、价格等展示，通过绝对定位。

  - 文字省略号做法：

    ```css
      .goods-info p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 3px;
      }
    ```

  - 商品点击后进入对应详情页

    - ```vue
      this.$router.push('/detail/' + this.goodsItem.iid);
      ```

    - 在router中用:iid传入参数

content/goods中创建GoodsList

- 设置flex布局，一行两个，平分
- props接受goods商品数据
- 通过v-for将商品数据传给GoodsListItem



### 4.1.7 引入Better-Scroll

对滚动的区域做一个封装，该插件给父元素注册滚动，其第一个子元素会实现滚动效果。

- 在子元素中使用插槽，用于放入需要滚动的区域
  - 在mounted中注册scroll并传入配置，需要点击、实时监听滚动、上拉加载更多
  - 滚动时将position通过emit传递给父组件
  - 上拉加载时通过emit传递给父组件
- 在Home中将4.1.2 —— 4.1.6 全部传入Scroll作为滚动区域
  - 接收滚动事件（之后用于显示回到顶部）
  - 接收加载更多事件，根据当前的分类，请求更多的商品数据。为实现分页效果，每次请求完后要给页数+1



### 4.1.8 BackTop回到顶部

```
引入 Better-Scroll 实现移动端滑动效果，解决了原生滚动效果不理想的问题；使用 axios 并对各页面网络请求分别封装，用于获取商品的数据；将页面中重复使用的内容封装成组件，减少代码的冗余；使用 mixin 实现组件选项的复用；使用事件总线实现跨级组件通信；将 toast 以插件形式封装和使用。
```

