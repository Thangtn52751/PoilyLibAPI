# PolyLib API

🚀 **PolyLib API** là một hệ thống quản lý thư viện bao gồm các chức năng:
- Quản lý sách (`books`)
- Quản lý loại sách (`bookTypes`)
- Quản lý người dùng (`users`)
- Đăng ký mượn sách (`regbooks`)
- Trả sách (`returns`)

## 📂 Cấu Trúc Dự Án
📦PolyLib-API ┣ 📂config ┃ ┗ 📜db.js # Kết nối MongoDB ┣ 📂models ┃ ┣ 📜Book.js # Model cho bảng books ┃ ┣ 📜BookType.js # Model cho bảng bookTypes ┃ ┣ 📜Return.js # Model cho bảng returns ┃ ┣ 📜Loan.js # Model cho bảng loans ┃ ┗ 📜User.js # Model cho bảng users ┣ 📂routes ┃ ┣ 📜bookRoutes.js # Route quản lý books ┃ ┣ 📜bookTypeRoutes.js # Route quản lý bookTypes ┃ ┣ 📜regBookRoutes.js # Route đăng ký mượn sách ┃ ┗ 📜returnRoutes.js # Route trả sách ┣ 📜server.js # Server chính ┣ 📜.env.example # File mẫu cho biến môi trường ┗ 📜README.md # Hướng dẫn sử dụng

bash
Copy
Edit

## 🚀 **Hướng Dẫn Cài Đặt**

### 1️⃣ **Clone Repo**
```bash
git clone https://github.com/<tên-user>/PolyLib-API.git
cd PolyLib-API
2️⃣ Cài Đặt Dependencies
bash
Copy
Edit
npm install
3️⃣ Tạo File .env
Tạo file .env và điền các biến môi trường:

env
Copy
Edit
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/PolyLib?retryWrites=true&w=majority
💡 Ghi chú: Thay <username> và <password> bằng thông tin MongoDB Atlas của bạn.

4️⃣ Chạy Server
bash
Copy
Edit
npm start
🧪 Test API
Sử dụng Postman hoặc cURL để kiểm tra các endpoint sau:

📘 Books API
Phương thức	Endpoint	Mô tả
GET	/api/books	Lấy danh sách sách
POST	/api/books	Thêm sách mới
PUT	/api/books/:id	Cập nhật thông tin sách
DELETE	/api/books/:id	Xóa sách
📗 Book Types API
Phương thức	Endpoint	Mô tả
GET	/api/bookTypes	Lấy danh sách loại sách
POST	/api/bookTypes	Thêm loại sách mới
PUT	/api/bookTypes/:id	Cập nhật loại sách
DELETE	/api/bookTypes/:id	Xóa loại sách
📕 Returns API
Phương thức	Endpoint	Mô tả
GET	/api/returns	Lấy danh sách trả sách
POST	/api/returns	Thêm thông tin trả sách
DELETE	/api/returns/:id	Xóa thông tin trả sách
🛠 Công Nghệ Sử Dụng
Node.js với Express.js
MongoDB (Atlas)
Mongoose (ODM)

