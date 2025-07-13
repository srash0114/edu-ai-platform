import { useState } from 'react';
import { motion } from 'framer-motion';

const AuthModal = ({ onLogin, onRegister, setError, error, setSuccess, success }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Vui lòng nhập email và mật khẩu.');
            return;
        }
        setError('');
        setSuccess(''); // Clear success message on new submission
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
                {error && (
                    <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {error}
                    </p>
                )}
                {success && (
                    <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {success}
                    </p>
                )}
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
                    <button 
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError('');
                            setSuccess('');
                        }} 
                        className="text-blue-500 hover:underline font-semibold ml-1"
                    >
                        {isRegister ? 'Đăng nhập ngay' : 'Đăng ký'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default AuthModal;