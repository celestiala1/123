const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// 根据用户ID查询用户信息接口
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // 验证用户ID格式
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: '无效的用户ID'
      });
    }

    // 查找用户
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      message: '用户信息获取成功',
      data: user.toJSON()
    });

  } catch (error) {
    console.error('查询用户信息错误:', error.message);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取当前登录用户信息接口
router.get('/profile/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      message: '用户信息获取成功',
      data: user.toJSON()
    });

  } catch (error) {
    console.error('查询用户信息错误:', error.message);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;