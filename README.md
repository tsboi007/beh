# Website Bệnh viện Mắt Bà Rịa – Vũng Tàu

Website chính thức kèm trang quản trị. Xây dựng bằng **Next.js 16 (Node.js)**, Tailwind CSS 4, Drizzle ORM và Postgres. Deploy trên **Vercel**.

## Tính năng

**Trang công khai**
- Trang chủ, Giới thiệu (lịch sử, giá trị cốt lõi, trang thiết bị Carl Zeiss, cơ cấu tổ chức)
- Dịch vụ: danh sách và trang chi tiết từng dịch vụ (nội dung chuẩn SEO, schema MedicalWebPage)
- Bảng giá dịch vụ (đánh dấu dịch vụ áp dụng BHYT)
- Đội ngũ bác sĩ
- **Đặt lịch khám online**: chọn dịch vụ, bác sĩ, ngày và khung giờ; nhận mã `BVM-XXXXXX`
- **Tra cứu lịch hẹn** bằng mã và số điện thoại (họ tên được che bớt; không hiển thị kết quả khám)
- **Hỏi đáp bác sĩ**: người bệnh gửi câu hỏi, Admin trả lời và đăng công khai (schema FAQPage)
- Tin tức / Blog SEO, có bài liên quan và thời gian đọc
- Tuyển dụng: tin tuyển dụng, nộp CV (PDF/Word), schema JobPosting
- Liên hệ, có bản đồ Google Maps
- Nút liên hệ nhanh Zalo, Messenger, Hotline nổi trên mọi trang
- SEO: sitemap.xml, robots.txt, Open Graph, JSON-LD (Hospital, Breadcrumb, FAQ…)
- Tiếp cận: chuẩn WCAG AA, điều hướng bằng bàn phím, chữ 17px dễ đọc, tôn trọng thiết lập *giảm chuyển động*

**Trang quản trị `/admin`**
- Tổng quan: lịch chờ xác nhận, lịch hôm nay, câu hỏi và liên hệ mới
- Lịch hẹn: lọc, tìm kiếm, đổi trạng thái, ghi chú nội bộ, **xuất Excel (CSV)**
- Hỏi đáp, Liên hệ, Hồ sơ ứng viên
- Soạn bài viết, dịch vụ, tin tuyển dụng bằng trình soạn thảo Markdown có xem trước; tải ảnh lên
- Bảng giá, Bác sĩ (có ảnh chân dung)
- Cài đặt: hotline, địa chỉ, giờ làm việc, link Zalo/Messenger/Facebook/YouTube/TikTok, bản đồ, email nhận thông báo

Chỉnh sửa trong Admin cập nhật lên website **ngay lập tức** (cache theo tag). Khách xem trang vẫn nhận bản prerender tĩnh nên tốc độ tải rất nhanh.

---

## Chạy trên máy (local)

Yêu cầu Node.js ≥ 20.9.

```bash
npm install
cp .env.example .env.local      # rồi điền AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run db:setup                # tạo bảng + dữ liệu mẫu + tài khoản admin
npm run dev                     # http://localhost:3000  ·  Admin: http://localhost:3000/admin
```

Khi chạy local mà không đặt `DATABASE_URL`, website dùng **PGlite** (Postgres nhúng, lưu ở `./.data/`), không cần cài thêm database.

> ⚠️ Không đặt thư mục dự án trong Google Drive/OneDrive: `node_modules` có hàng chục nghìn file nhỏ, việc đồng bộ sẽ làm hỏng quá trình cài đặt.

---

## Deploy lên Vercel

### 1. Đưa code lên GitHub
Repo: `https://github.com/tsboi007/beh`

### 2. Tạo project trên Vercel
1. Vào https://vercel.com/new và **Import** repo `tsboi007/beh`.
2. Framework: Next.js (Vercel tự nhận diện). Giữ nguyên các thiết lập mặc định.

### 3. Tạo database Neon (miễn phí)
- Trong project Vercel: **Storage → Create Database → Neon (Serverless Postgres)** rồi chọn region **Singapore (sin1)**.
- Vercel sẽ tự thêm biến `DATABASE_URL`.

### 4. (Khuyến nghị) Tạo Vercel Blob để tải ảnh và CV
- **Storage → Create → Blob**. Vercel sẽ tự thêm biến `BLOB_READ_WRITE_TOKEN`.
- Nếu không có Blob, tính năng tải ảnh/CV trên Vercel sẽ báo lỗi (Vercel không cho ghi file lên ổ đĩa).

### 5. Thêm biến môi trường (Settings → Environment Variables)

| Biến | Bắt buộc | Ghi chú |
|---|---|---|
| `DATABASE_URL` | ✅ | Tự thêm ở bước 3 |
| `AUTH_SECRET` | ✅ | Chuỗi ngẫu nhiên ≥ 32 ký tự, tạo bằng `openssl rand -hex 32` |
| `ADMIN_EMAIL` | ✅ | Email đăng nhập Admin |
| `ADMIN_PASSWORD` | ✅ | Mật khẩu Admin (mạnh, ≥ 12 ký tự) |
| `NEXT_PUBLIC_SITE_URL` | ✅ | VD: `https://beh.vn` hoặc `https://beh.vercel.app` |
| `BLOB_READ_WRITE_TOKEN` | Nên có | Tự thêm ở bước 4 |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Tùy chọn | Gửi email báo lịch hẹn mới (Gmail: dùng *App Password*) |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Tùy chọn | Báo lịch hẹn mới qua Telegram |

### 6. Deploy
Bấm **Deploy**. Script `vercel-build` sẽ tự **chạy migration, nạp dữ liệu mẫu (chỉ khi bảng trống) và tạo/cập nhật tài khoản Admin**, sau đó build website.

Từ đó, mỗi lần `git push` lên nhánh `main`, Vercel sẽ tự deploy lại.

### 7. Gắn tên miền riêng (tùy chọn)
Vào **Settings → Domains**, thêm tên miền rồi trỏ DNS theo hướng dẫn của Vercel. Nhớ cập nhật lại `NEXT_PUBLIC_SITE_URL`.

---

## Việc cần làm trước khi công bố chính thức

- [ ] **Nhập giá chính thức** trong Admin → Bảng giá (hiện tất cả đang là “Liên hệ”).
- [ ] **Kiểm tra giờ làm việc** trong Admin → Cài đặt (hiện tạm đặt “Thứ 2 – Thứ 7: 7:00 – 16:30”).
- [ ] **Link Zalo**: thay bằng link Zalo OA hoặc số di động có Zalo (`https://zalo.me/<số>`). Số máy bàn không dùng được Zalo.
- [ ] Thêm **bác sĩ** (ảnh, học vị, chức vụ) và **ảnh** cho bài viết.
- [ ] **Khoa chuyên môn duyệt nội dung y khoa** (trang dịch vụ, bài viết, câu trả lời mẫu ở mục Hỏi đáp) trước khi đăng.
- [ ] Thay logo SVG tạm (`src/components/logo.tsx`, `src/app/icon.svg`) bằng **file vector logo chính thức** khi bệnh viện cung cấp.
- [ ] Đặt mật khẩu Admin mạnh và lưu ở nơi an toàn.

## Cấu trúc thư mục

```
src/
  app/(site)/        Các trang công khai
  app/admin/         Trang quản trị (login, (panel)/…, actions.ts)
  app/actions.ts     Xử lý form công khai (đặt lịch, tra cứu, hỏi đáp, liên hệ, ứng tuyển)
  components/        Giao diện (header, footer, form, admin…)
  lib/db/            Schema Drizzle & kết nối DB (Neon / PGlite)
  lib/data.ts        Truy vấn có cache ("use cache" + cacheTag)
  lib/site.ts        Thông tin thương hiệu, thiết bị (đã xác minh), cài đặt mặc định
scripts/
  setup-db.mjs       Migration + seed + tạo admin
  seed-data.mjs      Nội dung khởi tạo
drizzle/             File migration SQL
```

Khi thay đổi schema (`src/lib/db/schema.ts`): chạy `npm run db:generate` rồi commit thư mục `drizzle/`.

## Bảo mật & quyền riêng tư

- Mật khẩu Admin được băm bằng bcrypt. Phiên đăng nhập lưu trong cookie httpOnly có ký JWT, hết hạn sau 12 giờ. Sai mật khẩu 8 lần thì tạm khóa 15 phút.
- Mọi thao tác trong Admin đều kiểm tra quyền lại ở phía server.
- Form công khai có bẫy chống bot (honeypot), giới hạn số lần gửi và kiểm tra dữ liệu bằng Zod.
- Tra cứu lịch hẹn cần cả mã đặt lịch và số điện thoại, đồng thời che bớt họ tên. Website **không** lưu hay hiển thị kết quả khám.
- File CV được lưu với tên ngẫu nhiên khó đoán. Nếu cần bảo mật cao hơn, có thể chuyển sang Blob riêng tư.
