import { AnimatePresence, motion } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

const CartModal = ({ cart, onClose, setCart, addAlert }) => {
  // State to manage selected items for checkout
  const [selectedItems, setSelectedItems] = useState(cart.map((item) => item.id));

  // Calculate subtotal
  const subtotal = cart
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Toggle item selection
  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  // Select/deselect all items
  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((item) => item.id));
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = (itemId) => {
    setCart((prev) => {
      const updatedCart = prev.filter((item) => item.id !== itemId);
      addAlert('warning', 'Đã xóa khóa học khỏi giỏ hàng', 3000);
      return updatedCart;
    });
    setSelectedItems((prev) => prev.filter((id) => id !== itemId));
  };

  // Placeholder for checkout action
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      addAlert('error', 'Vui lòng chọn ít nhất một sản phẩm để thanh toán', 3000);
      return;
    }
    addAlert('success', `Đã chọn ${selectedItems.length} sản phẩm để thanh toán`, 3000);
    // Add checkout logic here (e.g., redirect to payment page)
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 30 }}
        className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Giỏ hàng</h2>
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Giỏ hàng của bạn đang trống.</p>
            <button
              onClick={onClose}
              className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedItems.length === cart.length}
                  onChange={toggleSelectAll}
                  className="form-checkbox h-5 w-5 text-blue-500"
                />
                <span className="text-gray-700 font-medium">Chọn tất cả ({cart.length})</span>
              </label>
              <button
                onClick={() => setCart([])}
                className="text-red-500 hover:text-red-700 flex items-center gap-2"
              >
                <Trash2 size={18} /> Xóa tất cả
              </button>
            </div>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b py-4"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItemSelection(item.id)}
                    className="form-checkbox h-5 w-5 text-blue-500"
                  />
                  <img
                    src={item.image || 'https://via.placeholder.com/80'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</p>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Xóa khỏi giỏ hàng"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between items-center border-t pt-4">
              <div className="text-lg font-semibold text-gray-800">
                Tổng cộng ({selectedItems.length} sản phẩm):{' '}
                <span className="text-red-500">{subtotal.toLocaleString('vi-VN')}₫</span>
              </div>
            <div className="mt-6 flex justify-end">
            <button
                onClick={onClose}
                className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded hover:bg-gray-400 transition-colors"
            >
                Đóng
            </button>
            <button
                onClick={handleCheckout}
                className="ml-5 bg-orange-500 text-white font-semibold py-2 px-6 rounded hover:bg-orange-600 transition-colors"
              >
                Thanh toán
            </button>
            </div> 
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CartModal;