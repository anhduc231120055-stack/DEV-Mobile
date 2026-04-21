import type { Booking, Category, Tour } from "../types/models";

export const categories: Category[] = [
  { id: "beach", label: "Biển", emoji: "🏖️" },
  { id: "mountain", label: "Núi", emoji: "⛰️" },
  { id: "heritage", label: "Di tích", emoji: "🏯" },
  { id: "resort", label: "Nghỉ dưỡng", emoji: "🌿" },
  { id: "food", label: "Ẩm thực", emoji: "🍜" },
];

export const tours: Tour[] = [
  {
    id: "ha-long",
    title: "Vịnh Hạ Long: Du thuyền 5 sao đẳng cấp",
    location: "Quảng Ninh",
    duration: "3 ngày 2 đêm",
    price: "12.500.000đ",
    rating: "4.9",
    tagline: "Trải nghiệm kỳ quan thiên nhiên với hải trình sang trọng.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZBxzsaYBFjovnyoRD6PZFEvDmxkaueaNyp_uVRIhhBT4X1krRVQyyO5mZgttrOGaCp5K1X32dcWX_hfzlBxa9wyVzUPK2q7anmtwS3dHnUhPxuiJqyCpye6ktSwHxqYAsMfRd9dYFRMQPkbQnOY3RX0ALBlA8WS5q6dnXGmPtidRABhRGGFCu9Jk5j5cYRyCewhhVpGomiOPBf3edSAJFIjwYEWX9IDbxox-3gewxDR168z_7if7q8yRY5j9gvLd-OX0l_GWVG_jU",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD3JZEuQ2Rj0eRlf6c-LdbZ-mCndXoC-ezoAjwDiRbyaRZNMkrFqLO8TAXS1WDnIEX3HsIMzEMmTjgfwxsUgjBtcYbPhxTkdgWLhDYG1ZeWpG0Uw1-Bao_u94MaqcHBk1akUDDMbQnQM6Q3P3dEa7wTXEQ74lNEyhopKc5nX1tbJcOUx0l7qEwcDlNPuEuNk2ZOOayg34MaGPJb7cmnDMVBvbI_M-Fcinsw4Ew84hkSNTkOcOTR2QRTCWYSMONOt3vSc7PGKsHqFVeL",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBVhaXZ62ae7XqTF34974tFEu-6fazIH7GP5_sqYjKRVnvSsGC0DdpVEpRXRTc9aEbnM0O9KOyBPzw68kLx1F_bZOF_UrSgxqx_uxXfJWEJsipSlmZBybWRUSWQomnX7fHv4xg9_2Kwf7-0GNwQIle_qy6bEOlB_4OTx-ghaq3KJzNZrSBFhShuLw49zIVFLqcKwM39Y4N6AjOFRbMLgzZVzOck-w0UWNip6ASfpsxrxGgg0CVMPF2IRsA36GzdwGmfbBoWfmijvjB",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCa9qMwMQ4zXbX5AeWRMAQUnWmTpbIpA90XOBqWfDwjKndrMpEO5X2hTO32ZzTPG4qxN2fO20fZxBevvn2bQeuPNyKzEO_5XFSqbbdzBPSeK5vHMhm2X_D9mwd7fZiJNCVOeHWXKiutI6iKkzP0NYCQAt99oyMm_FROitdUSLR9KJW5bRCrDHZnPolFO7jQgiuIzU9fftw_yyfEhg7V2OhVvshEhY9-R7EQdjyV4EVgh1K_N0MIAlnu0Djfq-lkwDYcda4Ltopbd-At",
    ],
    highlights: [
      "Suite cao cấp nhìn toàn cảnh vịnh",
      "Bữa tối hải sản trên boong tàu",
      "Chèo kayak và tham quan hang Sửng Sốt",
    ],
    itinerary: [
      {
        time: "08:00",
        title: "Khởi hành từ Hà Nội",
        description: "Xe limousine đón khách tại trung tâm thành phố.",
      },
      {
        time: "12:30",
        title: "Check-in du thuyền",
        description: "Nhận phòng và briefing hành trình trên tàu.",
      },
      {
        time: "15:00",
        title: "Khám phá hang Sửng Sốt",
        description: "Tham quan hang động và ngắm hoàng hôn trên vịnh.",
      },
    ],
  },
  {
    id: "phu-quoc",
    title: "Phú Quốc: Thiên đường nắng vàng biển xanh",
    location: "Kiên Giang",
    duration: "4 ngày 3 đêm",
    price: "8.200.000đ",
    rating: "4.7",
    tagline: "Kỳ nghỉ thư giãn cho gia đình và cặp đôi bên biển.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCvycl8RwNtL3C26AiyyBpk-wMmGnuqTwLTu82BOiB84aLS6ZW1U6DnxGUIh_57GztzbWNJRt7VKC9lAHDiTRJfgVLucY7JdY95t-WVhjh1b97Ium2i1lQamljr0upSCckw6UO317asqLatsqVYfQ3JM1vtZ6JeiGucRqAVCt93CJVfI96BuZ2vtN6RicW58gv6nyoJ7-8jz-bY9HYbNiLBb0seQn5hkMW_GyLlzz64NGARvuXYRjngKkeK3tsa-WRIUc1KM1oVYyu4",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAYGCh-jralRHpev9cxw10SOJFOaT7jkNo9-IO8aZYOndCfcBtdOtGR11ePTm2MFUY_PU7al4V6nNsxzkrtXZfhK68AhKS269_HFmAzTIAAnw9TmD-wAc16L1qwyyl7HC6OVtZR0qtPCQKLeYR6apQRMXpPOox4Fc0YHJePiDqyo5DmKRB5wacwOB28CDeQtJFh2_fLJsR9XKhvKaP3CGF2-Dtk3hFeUjEJHuxfl3fIO2qSXY---YXV-1AmpT9Wt95bL80Q8tSrdck5",
    ],
    highlights: [
      "Resort sát biển với hồ bơi vô cực",
      "Lặn ngắm san hô và tour đảo",
      "Hải sản địa phương và chợ đêm",
    ],
    itinerary: [
      {
        time: "09:00",
        title: "Bay đến Phú Quốc",
        description: "Đón sân bay và di chuyển về resort check-in.",
      },
      {
        time: "14:00",
        title: "Tự do tắm biển",
        description: "Nghỉ ngơi tại bãi biển riêng và hồ bơi.",
      },
    ],
  },
  {
    id: "tokyo-kyoto",
    title: "Mùa Hoa Anh Đào: Hành trình Tokyo - Kyoto",
    location: "Nhật Bản",
    duration: "6 ngày 5 đêm",
    price: "28.900.000đ",
    rating: "4.8",
    tagline: "Hành trình văn hóa, ẩm thực và cảnh sắc mùa sakura.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCPefNXvWR55S4wqshQM0tE2M8fCYxztdPsPcQEQPSjbgVflTDlPwYVxZoLcfyet1AGQERnOwt2zBegmBv82F9dC92e8PFPhZ9I7n6AGiK6mGELixFAsc3Sq0iAj-0ugq-ivQQcQLBCJuAGzQKo3j8pDxWIJRadZdA8pxe8HGUuwFyjD3GwAtRKNR6kYRTq8CtWexmXLWEehldyF8FE43KvRLpgGo7NmfiKuyd6FMh4zYi6xj5BArvg86S4INTxdW-7_axdegmOjyGl",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCPefNXvWR55S4wqshQM0tE2M8fCYxztdPsPcQEQPSjbgVflTDlPwYVxZoLcfyet1AGQERnOwt2zBegmBv82F9dC92e8PFPhZ9I7n6AGiK6mGELixFAsc3Sq0iAj-0ugq-ivQQcQLBCJuAGzQKo3j8pDxWIJRadZdA8pxe8HGUuwFyjD3GwAtRKNR6kYRTq8CtWexmXLWEehldyF8FE43KvRLpgGo7NmfiKuyd6FMh4zYi6xj5BArvg86S4INTxdW-7_axdegmOjyGl",
    ],
    highlights: [
      "Tham quan Tokyo, Kyoto, núi Phú Sĩ",
      "Trải nghiệm onsen và tàu Shinkansen",
      "Check-in mùa hoa anh đào đẹp nhất năm",
    ],
    itinerary: [
      {
        time: "07:30",
        title: "Khởi hành đến Tokyo",
        description: "Bay thẳng và nhận phòng khách sạn trung tâm.",
      },
      {
        time: "13:00",
        title: "Tham quan Asakusa",
        description: "Khám phá đền Sensoji và khu phố cổ.",
      },
    ],
  },
];

export const bookings: Booking[] = [
  {
    id: "BK-001",
    tourId: "ha-long",
    customerName: "Nguyễn Minh Anh",
    total: "25.000.000đ",
    status: "Đã xác nhận",
    travelDate: "12/05/2026",
  },
  {
    id: "BK-002",
    tourId: "phu-quoc",
    customerName: "Trần Hữu Nam",
    total: "8.200.000đ",
    status: "Chờ thanh toán",
    travelDate: "20/06/2026",
  },
];
