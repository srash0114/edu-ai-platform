import { X, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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

export default ProfileModal;