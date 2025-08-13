# 用户管理API系统

基于Express框架开发的用户管理API，提供用户注册、登录和信息查询功能。

## 功能特性

- 用户注册（用户名+密码）
- 用户登录（JWT认证）
- 根据用户ID查询用户信息
- 获取当前登录用户信息
- 密码加密存储
- JWT令牌认证

## 技术栈

- Node.js
- Express.js
- MySQL
- JWT (JSON Web Token)
- bcryptjs (密码加密)

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

修改 `.env` 文件中的数据库配置：

```env
# 数据库配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=user_management
DB_PORT=3306

# JWT配置
JWT_SECRET=your_jwt_secret_key_here

# 服务器配置
PORT=3000
```

### 3. 创建数据库

在MySQL中创建数据库：

```sql
CREATE DATABASE user_management;
```

### 4. 启动服务器

```bash
# 开发模式（需要安装nodemon）
npm run dev

# 生产模式
npm start
```

服务器将在 `http://localhost:3000` 启动

## API接口

### 1. 用户注册

**接口:** `POST /api/auth/register`

**请求体:**
```json
{
  "username": "testuser",
  "password": "123456",
  "email": "test@example.com"
}
```

**响应:**
```json
{
  "success": true,
  "message": "用户注册成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

### 2. 用户登录

**接口:** `POST /api/auth/login`

**请求体:**
```json
{
  "username": "testuser",
  "password": "123456"
}
```

**响应:**
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. 根据用户ID查询用户信息

**接口:** `GET /api/users/:id`

**请求头:**
```
Authorization: Bearer your_jwt_token_here
```

**响应:**
```json
{
  "success": true,
  "message": "用户信息获取成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. 获取当前登录用户信息

**接口:** `GET /api/users/profile/me`

**请求头:**
```
Authorization: Bearer your_jwt_token_here
```

**响应:**
```json
{
  "success": true,
  "message": "用户信息获取成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## 错误码说明

- `400`: 请求参数错误
- `401`: 未认证或认证失败
- `403`: 令牌无效或已过期
- `404`: 资源不存在
- `409`: 资源冲突（如用户名已存在）
- `500`: 服务器内部错误

## 数据库表结构

### users表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| username | VARCHAR(50) | 用户名，唯一 |
| password | VARCHAR(255) | 加密后的密码 |
| email | VARCHAR(100) | 邮箱（可选） |
| created_at | TIMESTAMP | 创建时间 |

## 注意事项

1. 密码使用bcrypt加密存储，安全性较高
2. JWT令牌有效期为24小时
3. 用户名长度至少3个字符
4. 密码长度至少6个字符
5. 查询用户信息接口需要JWT认证