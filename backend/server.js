const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Food = require('./models/Food');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connect MongoDB Atlas Success!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// 1. GET /health - Kiểm tra trạng thái Backend
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend running smoothly' });
});

// 2. GET /api/foods - Lấy danh sách hoặc tìm kiếm món ăn (?search=...)
app.get('/api/foods', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { cuisine: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const foods = await Food.find(query);
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// 3. GET /api/foods/:id - Xem chi tiết 1 món ăn (theo ObjectId hoặc foodId)
app.get('/api/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let food;
    if (mongoose.Types.ObjectId.isValid(id)) {
      food = await Food.findById(id);
    }
    if (!food) {
      food = await Food.findOne({ foodId: id });
    }

    if (!food) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    }
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// 4. POST /api/foods - Thêm món ăn mới (Kiểm tra trùng foodId)
app.post('/api/foods', async (req, res) => {
  try {
    const { foodId, name, category, cuisine, ingredients, price, quantity, description, imageUrl } = req.body;

    // Validate dữ liệu đầu vào
    if (!foodId || !name || !category || !cuisine || price == null || quantity == null) {
      return res.status(400).json({ message: 'Thiếu các trường bắt buộc' });
    }

    // Kiểm tra trùng foodId
    const existingFood = await Food.findOne({ foodId });
    if (existingFood) {
      return res.status(400).json({ message: 'Mã món ăn (foodId) đã tồn tại' });
    }

    const newFood = new Food({
      foodId, name, category, cuisine, ingredients, price, quantity, description, imageUrl
    });

    await newFood.save();
    res.status(201).json(newFood);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// 5. PUT /api/foods/:id - Cập nhật món ăn
app.put('/api/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let food;

    if (mongoose.Types.ObjectId.isValid(id)) {
      food = await Food.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    }
    if (!food) {
      food = await Food.findOneAndUpdate({ foodId: id }, req.body, { new: true, runValidators: true });
    }

    if (!food) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn để cập nhật' });
    }

    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// 6. DELETE /api/foods/:id - Xóa món ăn
app.delete('/api/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let food;

    if (mongoose.Types.ObjectId.isValid(id)) {
      food = await Food.findByIdAndDelete(id);
    }
    if (!food) {
      food = await Food.findOneAndDelete({ foodId: id });
    }

    if (!food) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn để xóa' });
    }

    res.status(200).json({ message: 'Xóa món ăn thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});