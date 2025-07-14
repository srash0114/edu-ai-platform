import { X, Star, ShoppingCart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const ProductModal = ({ product, onClose, isInCart, handleAddToCart }) => {
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
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleAddToCart(product);
                                    }}
                                    disabled={isInCart}
                                    className={`w-full mt-3 py-2 rounded-md text-sm font-semibold transition-colors duration-300 flex items-center justify-center gap-2 ${isInCart ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                                >
                                    <ShoppingCart size={16} />
                                    {isInCart ? 'Đã trong giỏ hàng' : 'Thêm vào giỏ'}
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

export default ProductModal;