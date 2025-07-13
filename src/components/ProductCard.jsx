import { Heart, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
                    <Heart fill={isWishlisted ? 'currentColor' : 'none'} size={20} />
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

export default ProductCard;