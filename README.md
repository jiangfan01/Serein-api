# Serein
### 个人第一个api项目

### 项目技术栈
```bash
#### 语言框架
node.js + Express

#### 自动代码更新
nodemon 

```

### 项目启动
```bash

   "cd"   # api文件路径 
   "yarn"  # 安装模块包到api,没有yarn使用npm包
   "yarn start"  # 启动项目 
  
```

### 生成迁移命令

```bash
# 文章
sequelize model:generate --name Article --attributes title:string,content:text

# 分类
sequelize model:generate --name Category --attributes name:string,sort:integer

# 课程
sequelize model:generate --name Course --attributes categoryId:integer,userId:integer,name:string,image:string,recommended:boolean,introductory:boolean,content:text

# 章节
sequelize model:generate --name Chapter --attributes courseId:integer,title:string,video:string,content:text

# 用户
sequelize model:generate --name User --attributes username:string,password:string,avatar:string,sex:tinyint,signature:string,introduce:string,company:string

# 点赞
sequelize model:generate --name Like --attributes userId:integer,courseId:integer

# 浏览记录
sequelize model:generate --name History --attributes userId:integer,courseId:integer,chapterId:integer
```

### 运行迁移
```bash
sequelize db:migrate
```
