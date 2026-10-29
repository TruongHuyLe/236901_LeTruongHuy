# ĐỀ THI THỰC HÀNH ĐIỆN TOÁN ĐÁM MÂY
- Họ và tên: Lê Trương Huy
- MSSV: 236901
- Repository: 236901_LeTruongHuy
## Hướng dẫn chạy Backend bằng Docker
```bash
docker pull trhuyle/backend:latest
docker run -d -p 5000:5000 -e MONGO_URI="chuỗi_ket_noi_mongodb" trhuyle/backend:latest
```