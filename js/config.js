export const CONFIG = {
  API_URL: "YOUR_APPS_SCRIPT_WEB_APP_URL",
  SHEET_ID: "YOUR_GOOGLE_SHEET_ID",
  CACHE_TTL: 300000,
  CACHE_VERSION: "v2",
  DEFAULT_TAB: "overview",
  PERIOD: "1 - 25 Mei 2026",
  COLORS: {
    cyan: "#7CA6D5",
    violet: "#FF6A2B",
    green: "#00FF94",
    amber: "#FFC263",
    red: "#FF6A2B",
    text: "#B0B7C4",
    grid: "rgba(255,255,255,0.08)"
  }
};

export const STORE_FILTERS = [
  "Semua",
  "ERAFONE",
  "IBOX",
  "ERA & MORE",
  "ERABLUE",
  "SAMSUNG STORE",
  "XIAOMI STORE"
];

export const STORE_SORTS = [
  { key: "sales", label: "Sales Tertinggi" },
  { key: "dos", label: "DOS Tertinggi" },
  { key: "qty", label: "Qty Terbanyak" }
];

export const MOCK_DATA = {
  summary: {
    totalSalesMay: 327832583338,
    totalSalesApril: 444485475623,
    qtyMay: 144349,
    qtyApril: 192844,
    totalStock: 75769,
    avgDos: 70.28,
    criticalStores: 48,
    storeCount: 267
  },
  overview: {
    title: "Sales Performance - B2C Region 5",
    periodLabel: "1 - 25 Mei 2026",
    timegone: 81,
    underTimegone: 19,
    targetUnits: 445091,
    mtdUnits: 325198,
    estUnits: 403246,
    rings: [
      { label: "MTD", value: 73, tone: "red" },
      { label: "EST", value: 91, tone: "red" }
    ],
    quickStats: [
      { label: "WoW", value: "-18%" },
      { label: "MoM", value: "0%" },
      { label: "YoY", value: "-10%" },
      { label: "AVG", value: "7.273" },
      { label: "ASP", value: "10.326" }
    ],
    segments: [
      { title: "All B2C", est: 79, target: 192807, mtd: 123271, estValue: 152856, wow: "-13%", mom: "-12%", yoy: "-9%", tone: "red" },
      { title: "Multibrand", brand: "erafone", est: 77, target: 180286, mtd: 112041, estValue: 138931, wow: "-13%", mom: "-13%", yoy: "-1%", tone: "red" },
      { title: "Operator Store", brand: "operator", est: 121, target: 2847, mtd: 2767, estValue: 3431, wow: "-4%", mom: "0%", yoy: "-2%", tone: "green" },
      { title: "Monobrand", brand: "ibox", est: 99, target: 252284, mtd: 201927, estValue: 250390, wow: "-22%", mom: "9%", yoy: "-11%", tone: "amber" },
      { title: "Xiaomi", brand: "xiaomi", est: 87, target: 18361, mtd: 12950, estValue: 16058, wow: "-25%", mom: "-7%", yoy: "-4%", tone: "red" },
      { title: "Honor", brand: "honor", est: 234, target: 259, mtd: 489, estValue: 606, wow: "123%", mom: "32%", yoy: "0%", tone: "green" }
    ],
    categories: [
      { label: "Device", target: 371898, mtd: 69, est: 86, wow: "-10%", mom: "-4%", yoy: "-16%" },
      { label: "Acc", target: 31780, mtd: 83, est: 103, wow: "-18%", mom: "10%", yoy: "-2%" },
      { label: "Repair Contract", target: 8687, mtd: 59, est: 73, wow: "-32%", mom: "11%", yoy: "22%" },
      { label: "Operator", target: 11825, mtd: 93, est: 115, wow: "-28%", mom: "13%", yoy: "32%" },
      { label: "CE", target: 3106, mtd: 60, est: 75, wow: "1%", mom: "-21%", yoy: "-20%" },
      { label: "Laptop", target: 17795, mtd: 127, est: 158, wow: "53%", mom: "40%", yoy: "50%" }
    ]
  },
  trend: [
    { month: "April", po: -168291869, nonPo: 444653767492 },
    { month: "May", po: 789320749, nonPo: 327043262589 }
  ],
  tshRanking: [
    ["ANDRY UTAMA", 46451316039],
    ["JOKO SUPRASTIO", 40935495984],
    ["RIZKY KURNIAWAN", 33762641607],
    ["ARDILESACH", 32031243153],
    ["SOPIYAN SAURI", 18860397691],
    ["LIA ASTUTI", 14894014392],
    ["ARENGGA", 13752712494],
    ["LIM PING KIAN", 13283157219],
    ["NURUL ZAMAN", 12899797699],
    ["FEBRIAN TRI WIBOWO", 12479555852]
  ],
  stores: [
    { siteCode: "M193", siteDesc: "ERAFONE & MORE EDC", april: 1158, may: 1286, stock: 347, est: 1594.64, dos: 6.62, channel: "ERA & MORE", tsh: "VACANT" },
    { siteCode: "X022", siteDesc: "IBOX FLAGSHIP SENAYAN CITY", april: 977, may: 796, stock: 657, est: 987.04, dos: 20.25, channel: "IBOX", tsh: "ANDRY UTAMA" },
    { siteCode: "X012", siteDesc: "IBOX FLAGSHIP CENTRAL PARK", april: 956, may: 748, stock: 670, est: 927.52, dos: 21.97, channel: "IBOX", tsh: "JOKO SUPRASTIO" },
    { siteCode: "X035", siteDesc: "IBOX FLAGSHIP SUMMARECON MALL SERPONG", april: 834, may: 738, stock: 635, est: 915.12, dos: 21.11, channel: "IBOX", tsh: "RIZKY KURNIAWAN" },
    { siteCode: "X011", siteDesc: "IBOX LIPPO MALL PURI", april: 674, may: 572, stock: 599, est: 709.28, dos: 25.69, channel: "IBOX", tsh: "JOKO SUPRASTIO" },
    { siteCode: "M014", siteDesc: "ERAFONE AND MORE BINTARO X-CHANGE", april: 809, may: 541, stock: 1206, est: 670.84, dos: 54.69, channel: "ERA & MORE", tsh: "ARENGGA" },
    { siteCode: "X168", siteDesc: "IBOX BINTARO XCHANGE MALL II", april: 530, may: 522, stock: 680, est: 647.28, dos: 31.96, channel: "IBOX", tsh: "ARDILESACH" },
    { siteCode: "M019", siteDesc: "MEGASTORE SUMMARECON MALL SERPONG", april: 652, may: 481, stock: 831, est: 596.44, dos: 42.38, channel: "ERAFONE", tsh: "SANDI MAULANA" },
    { siteCode: "M021", siteDesc: "ERAFONE & MORE RUKO CILEDUG", april: 664, may: 458, stock: 1010, est: 567.92, dos: 54.1, channel: "ERA & MORE", tsh: "ABDILLAH" },
    { siteCode: "X015", siteDesc: "IBOX PLAZA INDONESIA", april: 720, may: 451, stock: 524, est: 559.24, dos: 28.5, channel: "IBOX", tsh: "ANDRY UTAMA" },
    { siteCode: "M091", siteDesc: "MEGASTORE CENTRAL PARK 3.0", april: 627, may: 403, stock: 900, est: 499.72, dos: 54.79, channel: "ERAFONE", tsh: "RENDY NUR SETIAWAN" },
    { siteCode: "M013", siteDesc: "MEGASTORE SUPERMAL KARAWACI", april: 429, may: 384, stock: 657, est: 476.16, dos: 41.97, channel: "ERAFONE", tsh: "SANDI MAULANA" },
    { siteCode: "E027", siteDesc: "ERAFONE DAAN MOGOT MALL", april: 430, may: 381, stock: 728, est: 472.44, dos: 46.88, channel: "ERAFONE", tsh: "IRMAN PERMANA" },
    { siteCode: "X058", siteDesc: "IBOX TANGERANG CITY MALL", april: 523, may: 373, stock: 436, est: 462.52, dos: 28.68, channel: "IBOX", tsh: "RIZKY KURNIAWAN" },
    { siteCode: "E221", siteDesc: "ERAFONE AND MORE CIPUTRA CITRA RAYA", april: 480, may: 347, stock: 737, est: 430.28, dos: 52.1, channel: "ERA & MORE", tsh: "RENDI JANUARDI" },
    { siteCode: "E119", siteDesc: "ERAFONE TANGERANG CITY MALL", april: 407, may: 340, stock: 619, est: 421.6, dos: 44.66, channel: "ERAFONE", tsh: "ARI HIDAYAT" }
  ],
  brandMix: [
    { label: "Apple", value: 8711 },
    { label: "Samsung", value: 7418 },
    { label: "Lainnya", value: 19628 }
  ],
  modelTable: [
    ["APPLE", "IPHONE 15", "128 GB", 2448, 1301, 3658, 68.98],
    ["APPLE", "IPHONE 17", "256 GB", 1864, 1291, 2577, 48.97],
    ["APPLE", "IPHONE 17 PRO MAX", "256 GB", 1172, 1238, 315, 6.24],
    ["SAMSUNG", "A07", "4/64 GB", 1623, 1056, 3246, 75.41],
    ["APPLE", "IPHONE 17 PRO", "256 GB", 976, 1046, 1462, 34.29],
    ["SAMSUNG", "A57 5G", "8/256 GB", 674, 688, 1924, 68.6],
    ["APPLE", "IPAD 11", "128 GB WIFI", 882, 556, 823, 36.31],
    ["SAMSUNG", "A17", "8/128 GB", 725, 542, 1156, 52.32],
    ["SAMSUNG", "A37 5G", "8/256 GB", 330, 507, 1410, 68.23],
    ["APPLE", "IPHONE 16", "128 GB", 547, 420, 1343, 78.44],
    ["APPLE", "IPHONE 14", "256 GB", 434, 400, 51, 3.13],
    ["APPLE", "IPHONE 16 PRO MAX", "256 GB", 684, 392, 633, 39.61]
  ],
  highlights: {
    bestSeller: { title: "Best Seller", model: "iPhone 15 128 GB", value: "1.301 unit", note: "Momentum Mei paling tinggi di preview ini." },
    deadStock: { title: "Dead Stock", model: "iPhone 16 128 GB", value: "DOS 78,4 hari", note: "Butuh intervensi pricing dan rotasi stok." }
  },
  stockSummary: [
    ["Total Stock", "75.769 unit"],
    ["DOS Rata-rata", "70,3 hari"],
    ["Toko Kritis", "48 toko"],
    ["Active Stores", "267 toko"]
  ],
  stockStack: [
    { tsh: "SOPIYAN SAURI", erafone: 0, ibox: 0, eramore: 0, erablue: 0, samsung: 0, xiaomi: 7079 },
    { tsh: "RENDI JANUARDI", erafone: 3028, ibox: 0, eramore: 1165, erablue: 1247, samsung: 0, xiaomi: 0 },
    { tsh: "ARENGGA", erafone: 3814, ibox: 0, eramore: 1586, erablue: 480, samsung: 0, xiaomi: 0 },
    { tsh: "NURUL ZAMAN", erafone: 4975, ibox: 0, eramore: 0, erablue: 134, samsung: 0, xiaomi: 0 },
    { tsh: "FEBRIAN TRI WIBOWO", erafone: 4043, ibox: 0, eramore: 386, erablue: 188, samsung: 0, xiaomi: 0 },
    { tsh: "IRMAN PERMANA", erafone: 2975, ibox: 0, eramore: 575, erablue: 347, samsung: 0, xiaomi: 0 }
  ],
  risk: [
    ["XLC ITC ROXY MAS", "XL STORE", 48, 1177.55, "MENSI ALEXANDER"],
    ["AGRES MANGGA DUA SQUARE", "ERAFONE", 252, 562.01, "MENSI ALEXANDER"],
    ["SAMSUNG AGORA MALL", "SAMSUNG STORE", 135, 473.12, "LIA ASTUTI"],
    ["GALERI ISAT MANGGA DUA", "INDOSAT STORE", 46, 376.16, "MENSI ALEXANDER"],
    ["ERAFONE SENAYAN PARK MALL", "ERAFONE", 211, 369.74, "MENSI ALEXANDER"],
    ["XLC HYBRID BINTARO JAYA XCHANGE", "XL STORE", 70, 286.21, "ARENGGA"]
  ],
  accessories: [
    { label: "Shopping Bag", value: 30105 },
    { label: "Screen Protector", value: 13378 },
    { label: "Charger", value: 8438 },
    { label: "Audio Products", value: 8253 },
    { label: "Wearable", value: 5116 },
    { label: "Case & Sleeve", value: 3818 }
  ]
};
