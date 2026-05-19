import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Input, VStack, HStack, Text, Flex, Spinner } from "@chakra-ui/react";
import { LuMessageSquare, LuX, LuSend } from "react-icons/lu";
import axios from "axios";

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "ai", text: "Xin chào! Tôi là trợ lý ảo RealEstatePro. Tôi có thể giúp bạn tìm kiếm nhà đất phù hợp hoặc soạn thảo bài đăng BĐS nhanh chóng. Bạn cần hỗ trợ gì ạ?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Tự động cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        
        // Cập nhật tin nhắn của người dùng lên màn hình ngay lập tức
        const updatedMessages = [...messages, { sender: "user", text: userMessage }];
        setMessages(updatedMessages);
        setIsLoading(true);

        try {
            // Gửi cả tin nhắn mới kèm lịch sử chat để AI hiểu ngữ cảnh cuộc hội thoại
            const response = await axios.post("http://localhost:5000/api/ai/chat-assistant", {
                message: userMessage,
                history: messages
            });

            if (response.data.success) {
                setMessages([...updatedMessages, { sender: "ai", text: response.data.reply }]);
            }
        } catch (error) {
            console.error("Error connecting to chatbot API:", error);
            setMessages([...updatedMessages, { sender: "ai", text: "Rất tiếc, kết nối của tôi đang bị gián đoạn. Bạn thử lại nhé!" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box position="fixed" bottom="20px" right="20px" zIndex="2000">
            {/* NÚT BÓNG CHAT TRÒN */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    borderRadius="full"
                    w="60px"
                    h="60px"
                    bg="red.600"
                    color="white"
                    _hover={{ bg: "red.700" }}
                    shadow="2xl"
                >
                    <LuMessageSquare size={26} />
                </Button>
            )}

            {/* CỬA SỔ KHUNG CHAT KHI MỞ */}
            {isOpen && (
                <Box
                    w={{ base: "320px", sm: "380px" }}
                    h="480px"
                    bg="white"
                    borderRadius="xl"
                    boxShadow="2xl"
                    border="1px solid"
                    borderColor="gray.200"
                    display="flex"
                    flexDirection="column"
                    overflow="hidden"
                >
                    {/* Header Khung Chat */}
                    <Flex bg="red.600" p={4} color="white" align="center" justify="space-between">
                        <HStack gap={2}>
                            <Box w="8px" h="8px" bg="green.400" borderRadius="full" />
                            <Text fontWeight="bold" fontSize="sm">Trợ lý ảo RealEstatePro</Text>
                        </HStack>
                        <LuX cursor="pointer" size={20} onClick={() => setIsOpen(false)} />
                    </Flex>

                    {/* Vùng hiển thị nội dung các Tin nhắn */}
                    <VStack flex={1} p={4} overflowY="auto" align="stretch" gap={3} bg="gray.50">
                        {messages.map((msg, index) => (
                            <Flex key={index} justify={msg.sender === "user" ? "flex-end" : "flex-start"}>
                                <Box
                                    maxW="80%"
                                    bg={msg.sender === "user" ? "red.500" : "white"}
                                    color={msg.sender === "user" ? "white" : "gray.800"}
                                    px={3}
                                    py={2}
                                    borderRadius="lg"
                                    boxShadow="sm"
                                    fontSize="sm"
                                    whiteSpace="pre-line" // Giúp giữ định dạng xuống dòng của Markdown từ AI
                                >
                                    <Text>{msg.text}</Text>
                                </Box>
                            </Flex>
                        ))}
                        {isLoading && (
                            <Flex justify="flex-start" align="center" gap={2}>
                                <Box bg="white" px={4} py={2} borderRadius="lg" boxShadow="sm">
                                    <Spinner size="xs" color="red.500" />
                                </Box>
                            </Flex>
                        )}
                        <div ref={messagesEndRef} />
                    </VStack>

                    {/* Ô Nhập Nội Dung Chat */}
                    <Box p={3} bg="white" borderTop="1px solid" borderColor="gray.150">
                        <form onSubmit={handleSend}>
                            <HStack gap={2}>
                                <Input
                                    placeholder="Nhập câu hỏi tại đây..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    size="sm"
                                    focusBorderColor="red.500"
                                    borderRadius="md"
                                />
                                <Button type="submit" colorPalette="red" size="sm" p={2} isDisabled={isLoading}>
                                    <LuSend size={16} />
                                </Button>
                            </HStack>
                        </form>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default ChatbotWidget;