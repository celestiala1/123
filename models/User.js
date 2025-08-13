const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(id, username, password, email, created_at) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.created_at = created_at;
  }

  // 创建用户表
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    try {
      await pool.execute(query);
      console.log('用户表创建成功');
    } catch (error) {
      console.error('创建用户表失败:', error.message);
      throw error;
    }
  }

  // 通过用户名查找用户
  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    
    try {
      const [rows] = await pool.execute(query, [username]);
      if (rows.length > 0) {
        const user = rows[0];
        return new User(user.id, user.username, user.password, user.email, user.created_at);
      }
      return null;
    } catch (error) {
      console.error('查找用户失败:', error.message);
      throw error;
    }
  }

  // 通过ID查找用户
  static async findById(id) {
    const query = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
    
    try {
      const [rows] = await pool.execute(query, [id]);
      if (rows.length > 0) {
        const user = rows[0];
        return new User(user.id, user.username, null, user.email, user.created_at);
      }
      return null;
    } catch (error) {
      console.error('查找用户失败:', error.message);
      throw error;
    }
  }

  // 创建新用户
  static async create(username, password, email = null) {
    // 检查用户名是否已存在
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      throw new Error('用户名已存在');
    }

    // 加密密码
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    
    try {
      const [result] = await pool.execute(query, [username, hashedPassword, email]);
      return result.insertId;
    } catch (error) {
      console.error('创建用户失败:', error.message);
      throw error;
    }
  }

  // 验证密码
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // 获取用户信息（不包含密码）
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      created_at: this.created_at
    };
  }
}

module.exports = User;