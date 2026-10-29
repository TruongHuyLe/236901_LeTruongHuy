# Hệ Thống Quản Lý Món Ăn - Cloud Application

## Thông Tin Sinh Viên
- **MSSV**: 236901
- **Họ tên**: Lê Trương Huy

## Đề Tài & Công Nghệ
- **Mô tả**: Ứng dụng quản lý danh mục món ăn (CRUD + Search).
- **Công nghệ**: React (Vite), Node.js, Express, MongoDB Atlas, Docker, Render.

## Cấu Trúc Thư Mục
- `/backend`: Node.js Express REST API
- `/frontend`: React Web Client

## Hướng Dẫn Chạy Chương Trình

### 1. Backend:
- Chạy local: `cd backend && npm install && node server.js`
- Chạy Docker: `docker run -d -p 5000:5000 -e MONGO_URI="chuỗi_kết_nối" trhuyle/backend:latest`

### 2. Frontend:
- Chạy local: `cd frontend && npm install && npm run dev`
- Chạy Docker: `docker run -d -p 80:80 trhuyle/frontend:latest`

## Thông Tin Triển Khai & Links Nộp Bài
- Link_GitHub: https://github.com/TruongHuyLe/236901_LeTruongHuy.git
- Link_Docker_Backend: https://hub.docker.com/r/trhuyle/backend
- Link_Docker_Frontend: https://hub.docker.com/r/trhuyle/frontend
- Link_Render_App: https://web-236901.onrender.com
- Link_Render_API: https://api-236901.onrender.com/api/foods
- Link_Data_MongoDB: mongodb+srv://236901_LeTruongHuy:Dkgh72113221@cluster0.lzelvpa.mongodb.net/236901_LeTruongHuy?retryWrites=true&w=majority