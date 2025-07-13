import { useState, useEffect, useRef } from 'react';
import { X, Bot, MessageSquare } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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

export default ChatbotModal;