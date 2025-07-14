import { X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const AlertButton = ({ id, type = 'success', message, onClose, className = '' }) => {
    const alertStyles = {
        error: 'bg-red-100 text-red-800 border-red-300',
        success: 'bg-green-100 text-green-800 border-green-300',
        warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    };

    const buttonStyles = {
        error: 'text-red-600 hover:bg-red-200',
        success: 'text-green-600 hover:bg-green-200',
        warning: 'text-yellow-600 hover:bg-yellow-200',
    };

    const icons = {
        error: <AlertCircle size={16} className="mr-2" />,
        success: <CheckCircle size={16} className="mr-2" />,
        warning: <AlertTriangle size={16} className="mr-2" />,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center justify-between p-4 rounded-lg border shadow-sm w-full max-w-md mx-auto ${alertStyles[type] || alertStyles.success} ${className}`}
        >
            <div className="flex items-center">
                {icons[type] || icons.success}
                <p className="text-sm font-medium">{message}</p>
            </div>
            {onClose && (
                <button
                    onClick={() => onClose(id)}
                    className={`p-1 rounded-full ${buttonStyles[type] || buttonStyles.success} transition-colors`}
                    aria-label="Đóng thông báo"
                >
                    <X size={16} />
                </button>
            )}
        </motion.div>
    );
};

export default AlertButton;