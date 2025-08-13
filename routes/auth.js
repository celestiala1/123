const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// 用户注册接口
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // 输入验证
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码不能为空'
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: '用户名长度至少为3个字符'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度至少为6个字符'
      });
    }

    // 创建用户
    const userId = await User.create(username, password, email);

    res.status(201).json({
      success: true,
      message: '用户注册成功',
      data: {
        id: userId,
        username: username,
        email: email
      }
    });

  } catch (error) {
    console.error('注册错误:', error.message);
    
    if (error.message === '用户名已存在') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 用户登录接口
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 输入验证
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码不能为空'
      });
    }

    // 查找用户
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 验证密码
    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: user.toJSON(),
        token: token
      }
    });

  } catch (error) {
    console.error('登录错误:', error.message);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;