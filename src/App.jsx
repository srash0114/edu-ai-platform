import { useState, useEffect, useMemo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Heart, Search, Bot, Clock, Loader, AlertCircle, Trash2, LogOut, User, ChevronDown, MessageSquare, ShoppingCart } from 'lucide-react'; // Add MessageSquare icon
import { AnimatePresence, motion } from 'framer-motion';
import mockProducts from  './data/mockData.js';
import ProductCard from './components/ProductCard.jsx';
import ProductModal from './components/ProductModal.jsx';
import SkeletonCard from './components/SkeletonCard.jsx'
import AuthModal from './components/AuthModal.jsx';
import ProfileModal from './components/ProfileModal.jsx';
import ChatbotModal from './components/ChatbotModal.jsx';
import AlertManager from './components/AlertManager.jsx';
import Header from './components/Header.jsx';
import CartModal from './components/CartModal.jsx';

export default function App() {
    const [products] = useState(mockProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceFilter, setPriceFilter] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [viewHistory, setViewHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [cart, setCart] = useState([]);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [suggestionError, setSuggestionError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [showUserDropdown, setShowUserDropdown] = useState(false); // New state for dropdown
    const [showProfileModal, setShowProfileModal] = useState(false); // New state for profile modal
    const [showChatbotModal, setShowChatbotModal] = useState(false); // NEW: State for chatbot modal
    const dropdownRef = useRef(null); // Ref for dropdown to handle clicks outside
    const [alerts, setAlerts] = useState([]);



    const [showCartModal, setShowCartModal] = useState(false);

    // New handler for opening cart modal
    const handleOpenCart = () => {
        setShowCartModal(true);
    };

    const handleCloseCart = () => {
        setShowCartModal(false);
    };

    const addAlert = (type, message, duration = 5000) => {
        const id = uuidv4();
        setAlerts((prev) => [...prev, { id, type, message }]);
        if (duration) {
            setTimeout(() => {
                removeAlert(id);
            }, duration);
        }
    };

    const removeAlert = (id) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };
    
    // Lấy dữ liệu người dùng từ localStorage khi component mount
    useEffect(() => {
        const loggedInUser = localStorage.getItem('currentUser');
        if (loggedInUser) {
            setCurrentUser(JSON.parse(loggedInUser));
        }
    }, []);

    // Load wishlist, card và view history của user khi đăng nhập
    useEffect(() => {
        if (currentUser) {
            const savedWishlist = localStorage.getItem(`wishlist_${currentUser.email}`);
            const savedHistory = localStorage.getItem(`viewHistory_${currentUser.email}`);
            const savedCart = localStorage.getItem(`cart_${currentUser.email}`);
            setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
            setViewHistory(savedHistory ? JSON.parse(savedHistory) : []);
            setCart(savedCart ? JSON.parse(savedCart) : []);
        } else {
            // Reset khi logout
            setWishlist([]);
            setViewHistory([]);
            setCart([]);
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

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(`cart_${currentUser.email}`, JSON.stringify(cart));
        }
    }, [cart, currentUser]);

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

        // Thông báo khi xem chi tiết khóa học
        const alertDetails = {
            type: 'info',
            message: `Đã xem chi tiết khóa học: ${product.name}`,
            duration: 3000,
        };

        // Gọi addAlert sau khi cập nhật state
        try {
            addAlert(alertDetails.type, alertDetails.message, alertDetails.duration);
        } catch (error) {
            console.error('Error in addAlert:', error);
        }
    };

    // NEW: Hàm thêm sản phẩm vào giỏ hàng
    const handleAddToCart = (productToAdd) => {
        // Kiểm tra nếu sản phẩm chưa có trong giỏ hàng
        if (!cart.find(item => item.id === productToAdd.id)) {
            setCart(prevCart => [...prevCart, productToAdd]);
            // (Tùy chọn) Hiển thị thông báo thành công
            // alert(`${productToAdd.name} đã được thêm vào giỏ hàng!`);
        }
    };

    const handleCloseModal = () => setSelectedProduct(null);

    const handleWishlistToggle = (productId) => {
        let alertDetails = null; // Store alert details

        setWishlist(prev => {
            if (prev.includes(productId)) {
            alertDetails = {
                type: 'warning',
                message: 'Đã xóa khóa học khỏi danh sách yêu thích',
                duration: 3000,
            };
            return prev.filter(id => id !== productId);
            } else {
            alertDetails = {
                type: 'success',
                message: 'Đã thêm khóa học vào danh sách yêu thích',
                duration: 3000,
            };
            return [...prev, productId];
            }
        });

        // Call addAlert after state update
        if (alertDetails) {
            try {
            addAlert(alertDetails.type, alertDetails.message, alertDetails.duration);
            } catch (error) {
            console.error('Error in addAlert:', error);
            }
        }
    };

    /**
     * Xóa lịch sử xem. 
     * Nếu có productId, chỉ xóa sản phẩm đó.
     * Nếu không có, xóa toàn bộ lịch sử.
     */
const handleClearHistory = (productId = null) => {
    let updatedHistory;
    let alertDetails;

    if (productId) {
        // Xóa một sản phẩm cụ thể
        updatedHistory = viewHistory.filter(id => id !== productId);
        alertDetails = {
            type: 'warning',
            message: 'Đã xóa khóa học khỏi lịch sử xem',
            duration: 3000,
        };
    } else {
        // Xóa toàn bộ
        updatedHistory = [];
        alertDetails = {
            type: 'warning',
            message: 'Đã xóa toàn bộ lịch sử xem',
            duration: 3000,
        };
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

    // Gọi addAlert sau khi cập nhật state
    try {
        addAlert(alertDetails.type, alertDetails.message, alertDetails.duration);
    } catch (error) {
        console.error('Error in addAlert:', error);
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
                    try {
                        addAlert('info', 'Không tìm thấy gợi ý phù hợp, hiển thị các khóa học ngẫu nhiên', 3000);
                    } catch (error) {
                        console.error('Error in addAlert:', error);
                    }
                } else {
                    setSuggestedProducts(suggestions);
                    try {
                        addAlert('success', 'Đã tải gợi ý khóa học thành công', 3000);
                    } catch (error) {
                        console.error('Error in addAlert:', error);
                    }
                }
            } catch (error) {
                setSuggestionError("Có lỗi xảy ra khi lấy gợi ý.");
                setSuggestedProducts([]);
                try {
                    addAlert('error', 'Có lỗi xảy ra khi lấy gợi ý khóa học', 3000);
                } catch (error) {
                    console.error('Error in addAlert:', error);
                }
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
                            onAddToCart={handleAddToCart} // Truyền hàm vào Card
                            isInCart={!!cart.find(item => item.id === product.id)} // Kiểm tra sản phẩm có trong giỏ không
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
           
            <AlertManager alerts={alerts} removeAlert={removeAlert} />

            <Header cart={cart} handleLogout={handleLogout} handleProfileClick={handleProfileClick} currentUsers={currentUser} dropdownRef={dropdownRef} onOpenCart={handleOpenCart} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            
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
            {showCartModal && (
            <CartModal cart={cart} onClose={handleCloseCart} setCart={setCart} addAlert={addAlert} />
            )}
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