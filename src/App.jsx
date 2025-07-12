import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Heart, Search, X, Star, Bot, Clock, Loader, AlertCircle, Trash2, LogOut, UserPlus, User, ChevronDown, MessageSquare } from 'lucide-react'; // Add MessageSquare icon
import { AnimatePresence, motion } from 'framer-motion';

// Mock Data remains the same...
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


// Component: Card sản phẩm
const ProductCard = ({ product, onDetailsClick, onWishlistToggle, isWishlisted, showDelete, onDelete }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-1 transition-transform duration-300"
    >
        <div className="relative">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <div className="absolute top-3 right-3 flex flex-col gap-2">
                 <button
                    onClick={(e) => { e.stopPropagation(); onWishlistToggle(product.id); }}
                    className={`bg-white p-2 rounded-full shadow-lg transition-colors duration-300 ${isWishlisted ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                    aria-label="Thêm vào yêu thích"
                >
                    <Heart fill={isWishlisted ? 'currentColor' : 'none'} size={20}/>
                </button>
                {showDelete && (
                     <button
                        onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
                        className="bg-white p-2 rounded-full shadow-lg text-gray-500 hover:text-red-500 transition-colors duration-300"
                        aria-label="Xóa khỏi lịch sử"
                    >
                        <Trash2 size={20} />
                    </button>
                )}
            </div>
        </div>
        <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
            <p className="text-sm text-gray-600 mt-1 h-10">{product.shortDescription}</p>
            <div className="flex justify-between items-center mt-4">
                <p className="text-xl font-bold text-blue-600">
                    {product.price.toLocaleString('vi-VN')}₫
                </p>
                <button
                    onClick={() => onDetailsClick(product)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-600 transition-colors duration-300"
                >
                    Xem chi tiết
                </button>
            </div>
        </div>
    </motion.div>
);

// Other components (ProductModal, SkeletonCard, AuthModal) remain the same...
// Component: Modal chi tiết sản phẩm
const ProductModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 relative">
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                            <X size={24} />
                        </button>
                        <div className="grid md:grid-cols-2 gap-6">
                            <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-lg" />
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
                                <div className="flex items-center gap-2 mt-2 text-yellow-500">
                                    <Star fill="currentColor" size={20} />
                                    <span className="text-gray-700 font-semibold">{product.rating} ({product.reviews} đánh giá)</span>
                                </div>
                                <p className="text-3xl font-extrabold text-blue-600 my-4">
                                    {product.price.toLocaleString('vi-VN')}₫
                                </p>
                                <button className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors duration-300">
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Mô tả chi tiết</h3>
                            <p className="text-gray-700 leading-relaxed">{product.longDescription}</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Component: Loading Skeleton
const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="w-full h-48 bg-gray-300"></div>
        <div className="p-4">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="flex justify-between items-center mt-4">
                <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                <div className="h-10 bg-gray-300 rounded w-1/4"></div>
            </div>
        </div>
    </div>
);

// Component: Modal Đăng nhập/Đăng ký
const AuthModal = ({ onLogin, onRegister }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Vui lòng nhập email và mật khẩu.');
            return;
        }
        setError('');
        if (isRegister) {
            onRegister(email, password);
        } else {
            onLogin(email, password);
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-80 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-8"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">{isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}</h2>
                <p className="text-center text-gray-500 mb-6">Chào mừng đến với EduAI Platform</p>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="your.email@example.com"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Mật khẩu</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors">
                        {isRegister ? 'Đăng ký' : 'Đăng nhập'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
                    <button onClick={() => setIsRegister(!isRegister)} className="text-blue-500 hover:underline font-semibold ml-1">
                        {isRegister ? 'Đăng nhập ngay' : 'Đăng ký'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

// New Component: Profile Modal (simple placeholder)
const ProfileModal = ({ user, onClose }) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 backdrop-blur-sm bg-opacity-60 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 relative">
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                            <X size={24} />
                        </button>
                        <div className="flex flex-col items-center justify-center pt-4">
                            <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold mb-4">
                                {user.email.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thông tin tài khoản</h2>
                            <p className="text-lg text-gray-700 mb-2">Email: <span className="font-semibold">{user.email}</span></p>
                            <p className="text-sm text-gray-500">Đây là trang hồ sơ mẫu. Bạn có thể thêm thông tin chi tiết khác tại đây.</p>
                        </div>
                        <div className="mt-6 border-t pt-4 text-center">
                            <p className="text-gray-600 text-sm">Cảm ơn bạn đã sử dụng EduAI Platform!</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// NEW: ChatbotModal Component
const ChatbotModal = ({ products, onClose, onSuggestProductClick }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Initial message from the bot
    useEffect(() => {
        setMessages([
            { type: 'bot', text: 'Chào bạn! Tôi là trợ lý AI của EduAI Platform. Bạn muốn tìm khóa học gì?' },
        ]);
    }, []);

    // Scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (inputMessage.trim() === '') return;

        const userMessage = inputMessage.trim();
        setMessages((prev) => [...prev, { type: 'user', text: userMessage }]);
        setInputMessage('');

        // Simulate AI response
        setTimeout(() => {
            const botResponse = generateBotResponse(userMessage, products);
            setMessages((prev) => [...prev, { type: 'bot', ...botResponse }]);
        }, 1000); // Simulate AI processing time
    };

    const generateBotResponse = (query, products) => {
        const lowerCaseQuery = query.toLowerCase();
        let matchedProducts = [];
        let responseText = '';

        // Keywords for categories/topics
        const keywords = {
            'reactjs': 'Lập trình Web', 'react': 'Lập trình Web', 'lập trình web': 'Lập trình Web',
            'tiếng anh': 'Ngoại ngữ', 'english': 'Ngoại ngữ', 'ielts': 'Ngoại ngữ', 'giao tiếp': 'Ngoại ngữ',
            'ui/ux': 'Thiết kế', 'thiết kế': 'Thiết kế', 'figma': 'Thiết kế',
            'marketing': 'Marketing', 'digital marketing': 'Marketing', 'seo': 'Marketing', 'ads': 'Marketing',
            'python': 'Lập trình', 'khoa học dữ liệu': 'Lập trình', 'data science': 'Lập trình',
        };

        let foundCategory = null;
        for (const [keyword, category] of Object.entries(keywords)) {
            if (lowerCaseQuery.includes(keyword)) {
                foundCategory = category;
                break;
            }
        }

        if (foundCategory) {
            matchedProducts = products.filter(p => p.category === foundCategory);
        } else {
            // General keyword search across names and short descriptions
            matchedProducts = products.filter(p =>
                p.name.toLowerCase().includes(lowerCaseQuery) ||
                p.shortDescription.toLowerCase().includes(lowerCaseQuery) ||
                p.longDescription.toLowerCase().includes(lowerCaseQuery)
            );
        }

        if (matchedProducts.length > 0) {
            responseText = `Tuyệt vời! Dưới đây là một số khóa học ${foundCategory ? foundCategory : ''} mà tôi tìm thấy cho bạn:`;
            return { type: 'bot', text: responseText, products: matchedProducts };
        } else {
            responseText = "Xin lỗi, tôi không tìm thấy khóa học nào phù hợp với yêu cầu của bạn. Bạn có muốn thử tìm kiếm với từ khóa khác không?";
            return { type: 'bot', text: responseText, products: [] };
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed drop-shadow-xl/50 inset-0 z-50 flex justify-end items-end bg-opacity-40"
                // bg-black
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="bg-white rounded-xl shadow-2xl w-full md:max-w-1/4 max-w-100 max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center p-4 border-b bg-blue-600 text-white rounded-t-xl">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Bot size={24} /> AI Chatbot
                        </h2>
                        <button onClick={onClose} className="text-white hover:text-gray-200">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-grow p-4 overflow-y-auto space-y-4 custom-scrollbar">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`p-3 rounded-lg max-w-[75%] ${
                                        msg.type === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    <p>{msg.text}</p>
                                    {msg.products && msg.products.length > 0 && (
                                        <div className="mt-2 space-y-2">
                                            {msg.products.map(product => (
                                                <div key={product.id} className="bg-white p-3 rounded-md shadow-sm flex items-center gap-3">
                                                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{product.name}</p>
                                                        <p className="text-sm text-gray-600">{product.price.toLocaleString('vi-VN')}₫</p>
                                                        <button
                                                            onClick={() => onSuggestProductClick(product)}
                                                            className="text-blue-500 hover:underline text-sm mt-1"
                                                        >
                                                            Xem chi tiết
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50 flex gap-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Nhập yêu cầu của bạn..."
                            className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors"
                            aria-label="Gửi tin nhắn"
                        >
                            <MessageSquare size={20} />
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};


// Component chính của ứng dụng
export default function App() {
    const [products] = useState(mockProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceFilter, setPriceFilter] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [viewHistory, setViewHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [suggestionError, setSuggestionError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [showUserDropdown, setShowUserDropdown] = useState(false); // New state for dropdown
    const [showProfileModal, setShowProfileModal] = useState(false); // New state for profile modal
    const [showChatbotModal, setShowChatbotModal] = useState(false); // NEW: State for chatbot modal

    const dropdownRef = useRef(null); // Ref for dropdown to handle clicks outside

    // Lấy dữ liệu người dùng từ localStorage khi component mount
    useEffect(() => {
        const loggedInUser = localStorage.getItem('currentUser');
        if (loggedInUser) {
            setCurrentUser(JSON.parse(loggedInUser));
        }
    }, []);

    // Load wishlist và view history của user khi đăng nhập
    useEffect(() => {
        if (currentUser) {
            const savedWishlist = localStorage.getItem(`wishlist_${currentUser.email}`);
            const savedHistory = localStorage.getItem(`viewHistory_${currentUser.email}`);
            setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
            setViewHistory(savedHistory ? JSON.parse(savedHistory) : []);
        } else {
            // Reset khi logout
            setWishlist([]);
            setViewHistory([]);
        }
    }, [currentUser]);


    // Lưu wishlist và lịch sử xem vào localStorage khi thay đổi
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(`wishlist_${currentUser.email}`, JSON.stringify(wishlist));
        }
    }, [wishlist, currentUser]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(`viewHistory_${currentUser.email}`, JSON.stringify(viewHistory));
        }
    }, [viewHistory, currentUser]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    // Lọc sản phẩm
    const filteredProducts = useMemo(() => {
        let itemsToDisplay = [];
        if (activeTab === 'all') {
            itemsToDisplay = products;
        } else if (activeTab === 'wishlist') {
            itemsToDisplay = products.filter(p => wishlist.includes(p.id));
        } else if (activeTab === 'history') {
            // Hiển thị theo thứ tự đã xem gần nhất
            const historyProducts = viewHistory.map(id => products.find(p => p.id === id)).filter(Boolean);
            itemsToDisplay = historyProducts;
        } else if (activeTab === 'suggestions') {
            itemsToDisplay = suggestedProducts;
        }

        // Áp dụng bộ lọc tìm kiếm và giá chỉ khi không ở tab lịch sử (vì nó đã được lọc)
        if (activeTab !== 'history') {
             return itemsToDisplay.filter(product => {
                const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesPrice =
                    priceFilter === 'all' ||
                    (priceFilter === 'lt500' && product.price < 500000) ||
                    (priceFilter === '500-1m' && product.price >= 500000 && product.price <= 1000000) ||
                    (priceFilter === 'gt1m' && product.price > 1000000);
                return matchesSearch && matchesPrice;
            });
        }
        
        return itemsToDisplay;

    }, [searchTerm, priceFilter, products, wishlist, viewHistory, activeTab, suggestedProducts]);

    // --- Các hàm xử lý ---
    const handleDetailsClick = (product) => {
        setSelectedProduct(product);
        // Thêm vào đầu mảng lịch sử xem, không thêm trùng lặp
        setViewHistory(prev => [product.id, ...prev.filter(id => id !== product.id)]);
    };

    const handleCloseModal = () => setSelectedProduct(null);

    const handleWishlistToggle = (productId) => {
        setWishlist(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    /**
     * Xóa lịch sử xem. 
     * Nếu có productId, chỉ xóa sản phẩm đó.
     * Nếu không có, xóa toàn bộ lịch sử.
     */
    const handleClearHistory = (productId = null) => {
        let updatedHistory;
        if (productId) {
            // Xóa một sản phẩm cụ thể
            updatedHistory = viewHistory.filter(id => id !== productId);
        } else {
            // Xóa toàn bộ
            updatedHistory = [];
        }
        setViewHistory(updatedHistory);

        // Cập nhật localStorage
        if (currentUser) {
            if (updatedHistory.length > 0) {
                 localStorage.setItem(`viewHistory_${currentUser.email}`, JSON.stringify(updatedHistory));
            } else {
                 localStorage.removeItem(`viewHistory_${currentUser.email}`);
            }
        }
    };


    // --- Xử lý Auth ---
    const handleRegister = (email, password) => {
        // Giả lập lưu user vào localStorage
        localStorage.setItem(`user_${email}`, JSON.stringify({ email, password }));
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
    };

    const handleLogin = (email, password) => {
        const user = JSON.parse(localStorage.getItem(`user_${email}`));
        if (user && user.password === password) {
            const userData = { email };
            setCurrentUser(userData);
            localStorage.setItem('currentUser', JSON.stringify(userData));
        } else {
            alert('Email hoặc mật khẩu không chính xác.');
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
        setShowUserDropdown(false); // Close dropdown on logout
    };

    const handleProfileClick = () => {
        setShowProfileModal(true);
        setShowUserDropdown(false); // Close dropdown
    };

    const handleCloseProfileModal = () => {
        setShowProfileModal(false);
    };

    // --- Gợi ý AI ---
    const fetchSuggestions = () => {
        setIsLoadingSuggestions(true);
        setSuggestionError(null);
        setActiveTab('suggestions');

        setTimeout(() => {
            try {
                const suggestions = products
                    .filter(p => !viewHistory.includes(p.id) && !wishlist.includes(p.id))
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 3);

                if (suggestions.length === 0 && products.length > 0) {
                    const randomSuggestions = [...products].sort(() => 0.5 - Math.random()).slice(0, 3);
                    setSuggestedProducts(randomSuggestions);
                } else {
                    setSuggestedProducts(suggestions);
                }

            } catch (error) {
                setSuggestionError("Có lỗi xảy ra khi lấy gợi ý.");
                setSuggestedProducts([]);
            } finally {
                setIsLoadingSuggestions(false);
            }
        }, 1500);
    };

    // --- Chatbot Handlers ---
    const handleOpenChatbot = () => {
        setShowChatbotModal(true);
    };

    const handleCloseChatbot = () => {
        setShowChatbotModal(false);
    };

    // When a product is suggested by the chatbot and clicked
    const handleChatbotSuggestProductClick = (product) => {
        setSelectedProduct(product); // Open product details modal
        setShowChatbotModal(false); // Close chatbot modal
        setViewHistory(prev => [product.id, ...prev.filter(id => id !== product.id)]); // Add to history
    };


    // --- Render Content ---
    const renderContent = () => {
        if (activeTab === 'suggestions') {
            if (isLoadingSuggestions) {
                return (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                );
            }
            if (suggestionError) {
                return (
                    <div className="text-center py-10 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="mx-auto text-red-500" size={48} />
                        <h3 className="mt-4 text-xl font-semibold text-red-700">Đã xảy ra lỗi</h3>
                        <p className="text-red-600 mt-2">{suggestionError}</p>
                        <p className="text-sm text-gray-500 mt-1">Vui lòng thử lại sau.</p>
                    </div>
                );
            }
             if (filteredProducts.length === 0) {
                return (
                    <div className="text-center py-10 bg-gray-50 border rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-700">Không có gợi ý nào</h3>
                        <p className="text-gray-500 mt-2">Chúng tôi chưa có gợi ý nào phù hợp cho bạn. Hãy khám phá thêm khóa học nhé!</p>
                    </div>
                );
            }
        }

        if (filteredProducts.length === 0 && !isLoadingSuggestions) {
            const message = activeTab === 'wishlist' 
                ? 'Danh sách yêu thích của bạn đang trống.' 
                : activeTab === 'history'
                ? 'Bạn chưa xem khóa học nào.'
                : 'Không tìm thấy sản phẩm nào.';
            
            const subMessage = activeTab === 'wishlist' 
                ? 'Hãy thêm các khóa học bạn quan tâm vào đây nhé!'
                : activeTab === 'history'
                ? 'Lịch sử xem các khóa học sẽ được lưu tại đây.'
                : 'Vui lòng thử lại với từ khóa hoặc bộ lọc khác.';

            return (
                <div className="text-center py-10 col-span-full">
                    <h3 className="text-xl font-semibold text-gray-700">{message}</h3>
                    <p className="text-gray-500 mt-2">{subMessage}</p>
                </div>
            );
        }

        return (
            <AnimatePresence>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard
                            key={`${product.id}-${activeTab}`} // Add activeTab to key for re-rendering
                            product={product}
                            onDetailsClick={handleDetailsClick}
                            onWishlistToggle={handleWishlistToggle}
                            isWishlisted={wishlist.includes(product.id)}
                            showDelete={activeTab === 'history'} // Chỉ hiển thị nút xóa ở tab Lịch sử
                            onDelete={handleClearHistory} // Hàm xóa item
                        />
                    ))}
                </div>
            </AnimatePresence>
        );
    };

    if (!currentUser) {
        return <AuthModal onLogin={handleLogin} onRegister={handleRegister} />;
    }

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <header className="bg-white shadow-md sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
                    {/* Updated header layout for mobile */}
                    <div className="flex justify-between items-center w-full md:w-auto mb-4 md:mb-0">
                        <h1 className="text-2xl font-bold text-blue-600">EduAI Platform</h1>
                        <div className="flex items-center gap-4 relative md:hidden" ref={dropdownRef}>
                            <button
                                onClick={() => setShowUserDropdown(!showUserDropdown)}
                                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                                aria-expanded={showUserDropdown}
                                aria-haspopup="true"
                            >
                                <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                    {currentUser.email.charAt(0).toUpperCase()}
                                </div>
                                <ChevronDown size={16} className={`transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {showUserDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                                    >
                                        <button
                                            onClick={handleProfileClick}
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                        >
                                            <User size={18} /> Hồ sơ
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2 border-t border-gray-100"
                                        >
                                            <LogOut size={18} /> Đăng xuất
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
                        <input
                            type="text"
                            placeholder="Tìm kiếm khóa học..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                    <div className="hidden md:flex items-center gap-4 relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowUserDropdown(!showUserDropdown)}
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                            aria-expanded={showUserDropdown}
                            aria-haspopup="true"
                        >
                            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                {currentUser.email.charAt(0).toUpperCase()}
                            </div>
                            <span className="hidden md:block">{currentUser.email}</span>
                            <ChevronDown size={16} className={`transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showUserDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                                >
                                    <button
                                        onClick={handleProfileClick}
                                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <User size={18} /> Hồ sơ
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2 border-t border-gray-100"
                                    >
                                        <LogOut size={18} /> Đăng xuất
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-1/4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="font-bold text-lg mb-4 border-b pb-2">Bộ lọc giá</h3>
                            <div className="space-y-2">
                                {['all', 'lt500', '500-1m', 'gt1m'].map(value => (
                                    <label key={value} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price"
                                            value={value}
                                            checked={priceFilter === value}
                                            onChange={(e) => setPriceFilter(e.target.value)}
                                            className="form-radio text-blue-500"
                                        />
                                        <span>
                                            {value === 'all' && 'Tất cả'}
                                            {value === 'lt500' && '< 500.000₫'}
                                            {value === '500-1m' && '500.000₫ - 1.000.000₫'}
                                            {value === 'gt1m' && '> 1.000.000₫'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
                            <h3 className="font-bold text-lg mb-4 border-b pb-2">Gợi ý AI</h3>
                            <button
                                onClick={fetchSuggestions}
                                disabled={isLoadingSuggestions}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoadingSuggestions ? (
                                    <>
                                        <Loader className="animate-spin" size={20} />
                                        Đang tìm...
                                    </>
                                ) : (
                                    <>
                                        <Bot size={20} />
                                        Gợi ý cho tôi
                                    </>
                                )}
                            </button>

                            {/* NEW: Chatbot Button */}
                            <button
                            onClick={handleOpenChatbot}
                            className="fixed bottom-4 right-4 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white drop-shadow-xl/25 hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-110"
                            title="Chat với AI"
                            >
                            <MessageSquare size={24} />
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="w-full md:w-3/4">
                        <div className="flex flex-wrap border-b border-gray-200 mb-6 items-center justify-between md:mb-2">
                             <div className="flex items-center overflow-x-auto gap-4 whitespace-nowrap py-2">
                                <button onClick={() => setActiveTab('all')} className={`py-2 px-4 font-semibold ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Tất cả sản phẩm</button>
                                <button onClick={() => setActiveTab('wishlist')} className={`py-2 px-4 font-semibold flex items-center gap-2 ${activeTab === 'wishlist' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500'}`}>
                                    <Heart size={16} /> Yêu thích ({wishlist.length})
                                </button>
                                <button onClick={() => setActiveTab('history')} className={`py-2 px-4 font-semibold flex items-center gap-2 ${activeTab === 'history' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500'}`}>
                                    <Clock size={16} /> Lịch sử xem ({viewHistory.length})
                                </button>
                                <button onClick={() => setActiveTab('suggestions')} className={`py-2 px-4 font-semibold flex items-center gap-2 ${activeTab === 'suggestions' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-gray-500'}`}>
                                    <Bot size={16} /> Gợi ý AI ({isLoadingSuggestions ? '...' : suggestedProducts.length})
                                </button>
                             </div>
                              {activeTab === 'history' && viewHistory.length > 0 && (
                                <button
                                    onClick={() => handleClearHistory()} // Gọi hàm không có đối số để xóa tất cả
                                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors mt-2 md:mt-0"
                                >
                                    <Trash2 size={14} /> Xóa tất cả
                                </button>
                            )}
                        </div>
                        {renderContent()}
                    </div>
                </div>
            </main>

            {selectedProduct && <ProductModal product={selectedProduct} onClose={handleCloseModal} />}
            {showProfileModal && currentUser && <ProfileModal user={currentUser} onClose={handleCloseProfileModal} />}
            {showChatbotModal && (
                <ChatbotModal
                    products={products}
                    onClose={handleCloseChatbot}
                    onSuggestProductClick={handleChatbotSuggestProductClick}
                />
            )}
        </div>
    );
}