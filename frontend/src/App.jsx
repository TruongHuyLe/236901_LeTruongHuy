import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/foods';

function App() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const [selectedFood, setSelectedFood] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    foodId: '',
    name: '',
    category: '',
    cuisine: '',
    ingredients: '',
    price: '',
    quantity: '',
    description: '',
    imageUrl: ''
  });

  // Tải danh sách món ăn
  const fetchFoods = async (keyword = '') => {
    setLoading(true);
    setError('');
    try {
      const url = keyword ? `${API_URL}?search=${encodeURIComponent(keyword)}` : API_URL;
      const res = await axios.get(url);
      setFoods(res.data);
    } catch (err) {
      setError('Lỗi khi tải danh sách món ăn!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    fetchFoods(search);
  };

  // Xử lý nhập form
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Thêm hoặc Cập nhật món ăn
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const payload = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      ingredients: typeof formData.ingredients === 'string' 
        ? formData.ingredients.split(',').map(i => i.trim()).filter(Boolean)
        : formData.ingredients
    };

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${selectedFood._id || selectedFood.foodId}`, payload);
        setMessage('Cập nhật món ăn thành công!');
      } else {
        await axios.post(API_URL, payload);
        setMessage('Thêm món ăn mới thành công!');
      }
      resetForm();
      fetchFoods();
    } catch (err) {
      setError(err.response?.data?.message || 'Thao tác thất bại!');
    }
  };

  // Sửa món ăn
  const handleEdit = (food) => {
    setSelectedFood(food);
    setIsEditing(true);
    setFormData({
      foodId: food.foodId,
      name: food.name,
      category: food.category,
      cuisine: food.cuisine,
      ingredients: Array.isArray(food.ingredients) ? food.ingredients.join(', ') : '',
      price: food.price,
      quantity: food.quantity,
      description: food.description || '',
      imageUrl: food.imageUrl || ''
    });
  };

  // Xóa món ăn
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa món ăn này?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessage('Xóa món ăn thành công!');
      fetchFoods();
    } catch (err) {
      setError('Xóa món ăn thất bại!');
    }
  };

  const resetForm = () => {
    setFormData({
      foodId: '', name: '', category: '', cuisine: '',
      ingredients: '', price: '', quantity: '', description: '', imageUrl: ''
    });
    setIsEditing(false);
    setSelectedFood(null);
  };

  return (
    <div className="container">
      <h1>HỆ THỐNG QUẢN LÝ MÓN ĂN</h1>

      {/* Thông báo */}
      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}

      {/* Thanh tìm kiếm */}
      <form onSubmit={handleSearch} className="search-box">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, loại, vùng miền..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Tìm kiếm</button>
      </form>

      {/* Form Thêm/Sửa */}
      <div className="form-container">
        <h2>{isEditing ? 'CẬP NHẬT MÓN ĂN' : 'THÊM MÓN ĂN MỚI'}</h2>
        <form onSubmit={handleSubmit} className="food-form">
          <input name="foodId" placeholder="Mã món ăn (VD: F04)" value={formData.foodId} onChange={handleInputChange} disabled={isEditing} required />
          <input name="name" placeholder="Tên món ăn" value={formData.name} onChange={handleInputChange} required />
          <input name="category" placeholder="Loại (Món nước, cơm...)" value={formData.category} onChange={handleInputChange} required />
          <input name="cuisine" placeholder="Vùng miền (Miền Bắc, Nam...)" value={formData.cuisine} onChange={handleInputChange} required />
          <input name="price" type="number" placeholder="Giá bán" value={formData.price} onChange={handleInputChange} required />
          <input name="quantity" type="number" placeholder="Số lượng" value={formData.quantity} onChange={handleInputChange} required />
          <input name="ingredients" placeholder="Nguyên liệu (phân cách bằng dấu phẩy)" value={formData.ingredients} onChange={handleInputChange} />
          <input name="imageUrl" placeholder="Link ảnh (URL)" value={formData.imageUrl} onChange={handleInputChange} />
          <textarea name="description" placeholder="Mô tả món ăn" value={formData.description} onChange={handleInputChange} />
          
          <div className="form-buttons">
            <button type="submit">{isEditing ? 'Lưu cập nhật' : 'Thêm món ăn'}</button>
            {isEditing && <button type="button" onClick={resetForm}>Hủy</button>}
          </div>
        </form>
      </div>

      {/* Danh sách món ăn */}
      <h2>DANH SÁCH MÓN ĂN</h2>
      {loading ? <p>Đang tải dữ liệu...</p> : (
        <div className="food-grid">
          {foods.map((food) => (
            <div key={food._id || food.foodId} className="food-card">
              {food.imageUrl && <img src={food.imageUrl} alt={food.name} />}
              <h3>[{food.foodId}] {food.name}</h3>
              <p><strong>Loại:</strong> {food.category} | <strong>Vùng:</strong> {food.cuisine}</p>
              <p><strong>Giá:</strong> {food.price.toLocaleString()} VNĐ</p>
              <p><strong>Số lượng:</strong> {food.quantity}</p>
              {food.description && <p><em>{food.description}</em></p>}
              
              <div className="card-buttons">
                <button className="btn-edit" onClick={() => handleEdit(food)}>Sửa</button>
                <button className="btn-delete" onClick={() => handleDelete(food._id || food.foodId)}>Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;