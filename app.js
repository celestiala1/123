const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: '用户管理API系统',
    version: '1.0.0',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      getUserInfo: 'GET /api/users/:id',
      getCurrentUser: 'GET /api/users/profile/me'
    }
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('错误:', error);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// 启动服务器
async function startServer() {
  try {
    // 测试数据库连接
    await testConnection();
    
    // 创建用户表
    await User.createTable();
    
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
      console.log('API接口:');
      console.log('- POST /api/auth/register - 用户注册');
      console.log('- POST /api/auth/login - 用户登录');
      console.log('- GET /api/users/:id - 根据ID查询用户信息 (需要认证)');
      console.log('- GET /api/users/profile/me - 获取当前用户信息 (需要认证)');
    });
  } catch (error) {
    console.error('启动服务器失败:', error.message);
    process.exit(1);
  }
}

startServer();