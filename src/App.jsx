import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Heart, Search, X, Star, Bot, Clock, Loader, AlertCircle, Trash2, LogOut, UserPlus, User, ChevronDown, MessageSquare } from 'lucide-react'; // Add MessageSquare icon
import { AnimatePresence, motion } from 'framer-motion';
import mockProducts from  './data/mockData.js';
import ProductCard from './components/ProductCard.jsx';
import ProductModal from './components/ProductModal.jsx';
import SkeletonCard from './components/SkeletonCard.jsx'
import AuthModal from './components/AuthModal.jsx';
import ProfileModal from './components/ProfileModal.jsx';
import ChatbotModal from './components/ChatbotModal.jsx';
import AlertButton from './components/AlertButton.jsx';
import { div } from 'framer-motion/client';

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

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const handleRegister = (email, password) => {
        // Giả lập lưu user vào localStorage
        localStorage.setItem(`user_${email}`, JSON.stringify({ email, password }));
        setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
    };

    const handleLogin = (email, password) => {
        const user = JSON.parse(localStorage.getItem(`user_${email}`));
        if (user && user.password === password) {
            const userData = { email };
            setCurrentUser(userData);
            localStorage.setItem('currentUser', JSON.stringify(userData));
        } else {
            setError('Email hoặc mật khẩu không chính xác.');
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
        return <AuthModal onLogin={handleLogin} onRegister={handleRegister} setError={setError} error={error} setSuccess={setSuccess} success={success}/>
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