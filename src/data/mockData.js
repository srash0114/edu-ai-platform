const mockProducts = [
    {
        id: 1,
        name: 'Khóa học ReactJS từ Cơ bản đến Nâng cao',
        price: 799000,
        image: 'https://placehold.co/600x400/3498db/ffffff?text=ReactJS',
        shortDescription: 'Trở thành master ReactJS sau 30 ngày. Phù hợp cho người mới bắt đầu.',
        longDescription: 'Đây là khóa học toàn diện nhất về ReactJS, bao gồm Hooks, Context API, Redux, React Router và xây dựng dự án thực tế. Bạn sẽ được học qua các video bài giảng chi tiết và bài tập thực hành.',
        rating: 4.8,
        reviews: 1250,
        category: 'Lập trình Web'
    },
    {
        id: 2,
        name: 'Tiếng Anh Giao tiếp cho người đi làm',
        price: 1200000,
        image: 'https://placehold.co/600x400/e74c3c/ffffff?text=English',
        shortDescription: 'Tự tin giao tiếp tiếng Anh trong môi trường công sở.',
        longDescription: 'Khóa học tập trung vào các tình huống giao tiếp thực tế như họp, thuyết trình, viết email. Giáo viên bản ngữ giàu kinh nghiệm sẽ hướng dẫn bạn.',
        rating: 4.9,
        reviews: 2300,
        category: 'Ngoại ngữ'
    },
    {
        id: 3,
        name: 'Thiết kế UI/UX cho người mới bắt đầu',
        price: 450000,
        image: 'https://placehold.co/600x400/9b59b6/ffffff?text=UI/UX',
        shortDescription: 'Học các nguyên tắc thiết kế và sử dụng Figma để tạo ra giao diện đẹp.',
        longDescription: 'Khóa học này sẽ dẫn dắt bạn từ những khái niệm cơ bản về UI/UX, tâm lý học người dùng đến việc sử dụng thành thạo công cụ Figma để thiết kế web và app.',
        rating: 4.7,
        reviews: 850,
        category: 'Thiết kế'
    },
    {
        id: 4,
        name: 'Digital Marketing Toàn tập 2025',
        price: 1500000,
        image: 'https://placehold.co/600x400/2ecc71/ffffff?text=Marketing',
        shortDescription: 'Nắm vững SEO, Google Ads, Facebook Ads, và Content Marketing.',
        longDescription: 'Cập nhật những kiến thức và chiến lược mới nhất trong ngành Digital Marketing. Khóa học phù hợp cho chủ doanh nghiệp, marketer và sinh viên.',
        rating: 4.8,
        reviews: 1800,
        category: 'Marketing'
    },
    {
        id: 5,
        name: 'Python cho Khoa học Dữ liệu',
        price: 950000,
        image: 'https://placehold.co/600x400/f1c40f/ffffff?text=Python',
        shortDescription: 'Xử lý và trực quan hóa dữ liệu với Pandas, Matplotlib.',
        longDescription: 'Khóa học cung cấp nền tảng vững chắc về Python và các thư viện phổ biến trong Khoa học Dữ liệu như NumPy, Pandas, Matplotlib và Scikit-learn.',
        rating: 4.9,
        reviews: 3100,
        category: 'Lập trình'
    },
    {
        id: 6,
        name: 'Luyện thi IELTS 7.0+',
        price: 2500000,
        image: 'https://placehold.co/600x400/1abc9c/ffffff?text=IELTS',
        shortDescription: 'Chiến lược làm bài và luyện đề chuyên sâu cho cả 4 kỹ năng.',
        longDescription: 'Chương trình học được thiết kế bởi các chuyên gia IELTS hàng đầu, giúp bạn tối ưu hóa điểm số trong thời gian ngắn nhất. Bao gồm các bài thi thử và feedback chi tiết.',
        rating: 4.9,
        reviews: 1500,
        category: 'Ngoại ngữ'
    },
];

export default mockProducts;