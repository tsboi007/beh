/** Verified brand facts (source: beh.vn + fanpage, 10/2026). Editable values live in Admin → Cài đặt. */
export const SITE = {
  name: "Bệnh viện Mắt Bà Rịa – Vũng Tàu",
  shortName: "BV Mắt BR-VT",
  tagline: "Kỹ thuật cao – Chất lượng cao – Hiệu quả cao",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
  description:
    "Bệnh viện chuyên khoa Mắt tuyến tỉnh: khám mắt, điều trị tật khúc xạ (ReLEx SMILE, LASIK), phẫu thuật Phaco, Glôcôm, nhãn nhi – lác, chấn thương và tạo hình thẩm mỹ mắt. Hệ thống thiết bị Carl Zeiss hiện đại.",
  founded: 2006,
  upgraded: 2014,
  owner: "Sở Y tế Thành phố Hồ Chí Minh",
} as const;

export type SiteSettings = {
  address: string;
  phone: string;
  hotline: string;
  email: string;
  workingHours: string;
  emergencyNote: string;
  zaloUrl: string;
  messengerUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  mapEmbedUrl: string;
  notifyEmail: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  address: "17 Phạm Ngọc Thạch, Phường Bà Rịa, TP. Hồ Chí Minh",
  phone: "0254.3732 718",
  hotline: "0254.2205.129",
  email: "benhvienmatbaria@gmail.com",
  workingHours: "Thứ 2 – Thứ 7: 7:00 – 16:30",
  emergencyNote: "Khoa Khám bệnh – Cấp cứu tiếp nhận cấp cứu mắt",
  zaloUrl: "https://zalo.me/02542205129",
  messengerUrl: "https://m.me/benhvienmatbrvt",
  facebookUrl: "https://www.facebook.com/benhvienmatbrvt",
  youtubeUrl: "https://www.youtube.com/watch?v=4l8GzUIbokI",
  tiktokUrl: "https://www.tiktok.com/@benhvienmatbrvt",
  mapEmbedUrl:
    "https://www.google.com/maps?q=17+Ph%E1%BA%A1m+Ng%E1%BB%8Dc+Th%E1%BA%A1ch,+B%C3%A0+R%E1%BB%8Ba&output=embed",
  notifyEmail: "",
};

export const SETTING_LABELS: Record<keyof SiteSettings, string> = {
  address: "Địa chỉ",
  phone: "Điện thoại tổng đài",
  hotline: "Hotline tư vấn / đặt lịch",
  email: "Email liên hệ",
  workingHours: "Giờ làm việc",
  emergencyNote: "Ghi chú cấp cứu",
  zaloUrl: "Link Zalo OA / Zalo hotline",
  messengerUrl: "Link Messenger",
  facebookUrl: "Fanpage Facebook",
  youtubeUrl: "YouTube",
  tiktokUrl: "TikTok",
  mapEmbedUrl: "Link nhúng Google Maps",
  notifyEmail: "Email nhận thông báo lịch hẹn mới (để trống nếu không dùng)",
};

/** Verified equipment list (brand guideline 08/2026). Do not add unconfirmed devices. */
export const EQUIPMENT = [
  {
    name: "VISUMAX 800",
    kind: "Laser Femtosecond điều trị tật khúc xạ",
    detail: "Nền tảng cho phẫu thuật ReLEx SMILE – xâm lấn tối thiểu, hồi phục nhanh.",
    group: "Khúc xạ",
  },
  {
    name: "MEL 90",
    kind: "Laser Excimer điều trị tật khúc xạ",
    detail: "Laser Excimer thế hệ mới cho các kỹ thuật LASIK, Femto-LASIK, PRK.",
    group: "Khúc xạ",
  },
  {
    name: "CIRRUS HD-OCT 6000",
    kind: "Chụp cắt lớp võng mạc (OCT)",
    detail: "Chụp cắt lớp độ phân giải cao, phát hiện sớm bệnh lý võng mạc, hoàng điểm, Glôcôm.",
    group: "Chẩn đoán",
  },
  {
    name: "IOLMaster 700",
    kind: "Sinh trắc học nhãn cầu không tiếp xúc",
    detail: "Đo công suất thủy tinh thể nhân tạo chính xác bằng công nghệ SWEPT Source.",
    group: "Chẩn đoán",
  },
  {
    name: "OPMI Lumera 700",
    kind: "Kính hiển vi phẫu thuật",
    detail: "Hình ảnh phẫu trường sắc nét, ánh đồng tử đỏ ổn định cho phẫu thuật nội nhãn.",
    group: "Phẫu thuật",
  },
  {
    name: "QUATERA 700",
    kind: "Máy phẫu thuật đục thủy tinh thể (Phaco)",
    detail: "Kiểm soát dịch chủ động, an toàn tiền phòng trong phẫu thuật Phaco.",
    group: "Phẫu thuật",
  },
  {
    name: "HFA3 850",
    kind: "Thị trường kế tự động",
    detail: "Tiêu chuẩn vàng đánh giá tổn thương thị trường trong theo dõi Glôcôm.",
    group: "Chẩn đoán",
  },
  {
    name: "CLARUS 700",
    kind: "Chụp đáy mắt & huỳnh quang đáy mắt",
    detail: "Ảnh đáy mắt siêu rộng, màu thật – tầm soát bệnh võng mạc đái tháo đường.",
    group: "Chẩn đoán",
  },
  {
    name: "VISULAS + VISUCOMBI",
    kind: "Laser quang đông",
    detail: "Điều trị bệnh lý võng mạc, laser quang đông toàn võng mạc.",
    group: "Điều trị",
  },
] as const;

export const NAV = [
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/dich-vu", label: "Dịch vụ" },
  { href: "/bang-gia", label: "Bảng giá" },
  { href: "/bac-si", label: "Bác sĩ" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/hoi-dap", label: "Hỏi đáp" },
  { href: "/lien-he", label: "Liên hệ" },
] as const;

export const TIME_SLOTS = [
  "07:00 – 08:00",
  "08:00 – 09:00",
  "09:00 – 10:00",
  "10:00 – 11:00",
  "13:30 – 14:30",
  "14:30 – 15:30",
  "15:30 – 16:30",
] as const;

export const QUESTION_TOPICS = [
  "Tật khúc xạ (cận, viễn, loạn)",
  "Đục thủy tinh thể / Phaco",
  "Glôcôm (cườm nước)",
  "Mắt trẻ em / Lác",
  "Bệnh võng mạc / Đái tháo đường",
  "Bảo hiểm y tế / Thủ tục",
  "Khác",
] as const;
