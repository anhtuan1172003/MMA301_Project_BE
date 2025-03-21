const User = require("../models/User")

// Get all users
const getUsers = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const users = await User.find().skip(skip).limit(limit)

    const total = await User.countDocuments()

    res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: users,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

// Get single user
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

// Create new user
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body)

    res.status(201).json({
      success: true,
      data: user,
    })
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message)
      return res.status(400).json({
        success: false,
        error: messages,
      })
    } else {
      return res.status(500).json({
        success: false,
        error: "Server Error",
      })
    }
  }
}

// Update user
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message)
      return res.status(400).json({
        success: false,
        error: messages,
      })
    } else {
      return res.status(500).json({
        success: false,
        error: "Server Error",
      })
    }
  }
}

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Vui lòng cung cấp email và mật khẩu",
      });
    }

    // Tìm người dùng theo email
    const user = await User.findOne({ "account.email": email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Email không tồn tại",
      });
    }

    // Kiểm tra trạng thái kích hoạt
    if (!user.account.isActive) {
      return res.status(401).json({
        success: false,
        error: "Tài khoản chưa kích hoạt! Kiểm tra email để kích hoạt.",
      });
    }

    // Kiểm tra mật khẩu
    if (user.account.password !== password) {
      return res.status(401).json({
        success: false,
        error: "Mật khẩu không đúng",
      });
    }

    // Trả về thông tin người dùng (trong thực tế nên trả về JWT token)
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

module.exports={
  getUser,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  loginUser
}
