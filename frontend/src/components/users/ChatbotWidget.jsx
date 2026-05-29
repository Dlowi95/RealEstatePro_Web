import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { LuMessageSquare, LuX, LuSend } from "react-icons/lu";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";

const ChatbotWidget = () => {
  const { user: dbUser } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Xin chào! Tôi là trợ lý ảo RealEstatePro. Tôi có thể giúp bạn tìm kiếm nhà đất phù hợp hoặc soạn thảo bài đăng BĐS nhanh chóng. Bạn cần hỗ trợ gì ạ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const lastUserRef = useRef(null);

  // Cấu hình URL động để không bị sập kết nối khi lên Production (Vercel)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // State và Ref xử lý Logic Kéo/Thả (Drag & Drop) thông minh
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const hasMoved = useRef(false);

  const quickReplies = [
    "Tôi muốn tìm nhà đất ở Hồ Chí Minh",
    "Tôi muốn tìm nhà đất ở Hà Nội",
    "Khu vực nào đang có nhiều nhà đất nhất?",
    "Tôi muốn tìm nhà đất giá dưới 2 tỷ",
    "Hướng dẫn tôi cách đăng tin",
  ];

  useEffect(() => {
    const currentUserId = dbUser?._id || dbUser?.id || "guest";
    if (currentUserId !== lastUserRef.current) {
      lastUserRef.current = currentUserId;
      setShowTooltip(true);
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [dbUser]);

  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Thiết lập cơ chế bắt sự kiện chuột và chạm trên toàn hệ thống cửa sổ
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      hasMoved.current = true;
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    };

    const handleTouchMove = (e) => {
      if (!isDragging.current) return;
      hasMoved.current = true;
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.current.x,
        y: touch.clientY - dragStart.current.y,
      });
    };

    const handleDragEnd = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleDragEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, []);

  const startDragMouse = (e) => {
    // Chỉ cho kéo khi bấm vào phần tử điều khiển, tránh cản trở việc cuộn tin nhắn hoặc gõ chữ
    if (isOpen && e.target.closest("form, input, vstack, button")) return;
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    isDragging.current = true;
    hasMoved.current = false;
  };

  const startDragTouch = (e) => {
    if (isOpen && e.target.closest("form, input, vstack, button")) return;
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX - position.x, y: touch.clientY - position.y };
    isDragging.current = true;
    hasMoved.current = false;
  };

  const handleButtonClick = () => {
    // Nếu ngón tay có di chuyển dịch chuyển vị trí thì tính là kéo, ngược lại mới mở chat
    if (!hasMoved.current) {
      setIsOpen(true);
    }
  };

  const sendMessageToServer = async (userMessage, currentMessages) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/ai/chat-assistant`, {
        message: userMessage,
        history: currentMessages,
      });

      if (response.data.success) {
        setMessages([
          ...currentMessages,
          { sender: "ai", text: response.data.reply },
        ]);
      }
    } catch (error) {
      console.error("Error connecting to chatbot API:", error);
      setMessages([
        ...currentMessages,
        {
          sender: "ai",
          text: "Rất tiếc, kết nối của tôi đang bị gián đoạn. Bạn thử lại nhé!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    const updatedMessages = [
      ...messages,
      { sender: "user", text: userMessage },
    ];
    setMessages(updatedMessages);
    await sendMessageToServer(userMessage, updatedMessages);
  };

  const handleQuickReply = async (replyText) => {
    if (isLoading) return;
    const updatedMessages = [...messages, { sender: "user", text: replyText }];
    setMessages(updatedMessages);
    await sendMessageToServer(replyText, updatedMessages);
  };

  return (
    <Box
      position="fixed"
      bottom="20px"
      right="20px"
      zIndex="9999"
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
      gap={3}
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
    >
      {!isOpen && showTooltip && (
        <Box
          bg={{ base: "white", _dark: "gray.900" }}
          p={3}
          borderRadius="lg"
          boxShadow="2xl"
          border="1px solid"
          borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
          maxW="280px"
          position="relative"
          animation="fadeIn 0.3s ease-out"
          color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
        >
          <Flex justify="space-between" align="start" mb={1}>
            <Text fontWeight="bold" fontSize="xs" color="#E65C00">
              🤖 Trợ lý RealEstatePro
            </Text>
            <LuX
              cursor="pointer"
              size={14}
              onClick={() => setShowTooltip(false)}
            />
          </Flex>
          <Text fontSize="xs" lineHeight="short">
            Bấm vào đây để tôi hỗ trợ bạn tìm kiếm nhà đất nhanh chóng nhé!
          </Text>
          <Box
            position="absolute"
            bottom="0"
            left="0"
            h="3px"
            bg="#FF944D"
            w="100%"
            style={{ animation: "shrinkWidth 5s linear forwards" }}
          />
          <style>{`
            @keyframes shrinkWidth { from { width: 100%; } to { width: 0%; } }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          `}</style>
        </Box>
      )}

      {!isOpen && (
        <Button
          onMouseDown={startDragMouse}
          onTouchStart={startDragTouch}
          onClick={handleButtonClick}
          borderRadius="full"
          w="60px"
          h="60px"
          bg="#E65C00"
          color="white"
          _hover={{ bg: "#CC5200" }}
          shadow="2xl"
          cursor="move"
          style={{ touchAction: "none" }}
        >
          <LuMessageSquare size={26} />
        </Button>
      )}

      {isOpen && (
        <Box
          w={{ base: "300px", sm: "360px" }}
          h="440px"
          bg={{ base: "white", _dark: "gray.900" }}
          borderRadius="xl"
          boxShadow="2xl"
          border="1px solid"
          borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
          display="flex"
          flexDirection="column"
          overflow="hidden"
        >
          {/* Thanh Header này đóng vai trò làm thanh cầm để kéo cả hộp chat đi chỗ khác */}
          <Flex
            onMouseDown={startDragMouse}
            onTouchStart={startDragTouch}
            bg="#E65C00"
            p={4}
            color="white"
            align="center"
            justify="space-between"
            cursor="move"
            style={{ touchAction: "none" }}
          >
            <HStack gap={2}>
              <Box w="8px" h="8px" bg="green.400" borderRadius="full" />
              <Text fontWeight="bold" fontSize="sm" userSelect="none">
                Trợ lý ảo RealEstatePro
              </Text>
            </HStack>
            <LuX cursor="pointer" size={20} onClick={() => setIsOpen(false)} />
          </Flex>

          <VStack
            flex={1}
            p={4}
            overflowY="auto"
            align="stretch"
            gap={3}
            bg={{ base: "gray.50", _dark: "gray.950" }}
          >
            {messages.map((msg, index) => (
              <Flex
                key={index}
                justify={msg.sender === "user" ? "flex-end" : "flex-start"}
              >
                <Box
                  maxW="80%"
                  bg={
                    msg.sender === "user"
                      ? "#E65C00"
                      : { base: "white", _dark: "gray.800" }
                  }
                  color={
                    msg.sender === "user"
                      ? "white"
                      : { base: "gray.800", _dark: "whiteAlpha.900" }
                  }
                  px={3}
                  py={2}
                  borderRadius="lg"
                  boxShadow="sm"
                  fontSize="sm"
                  whiteSpace="pre-line"
                >
                  <Text>{msg.text}</Text>
                </Box>
              </Flex>
            ))}

            {messages.length === 1 && (
              <VStack align="flex-start" gap={2} mt={2} pl={2}>
                {quickReplies.map((reply, idx) => (
                  <Button
                    key={idx}
                    size="xs"
                    colorPalette="orange"
                    variant="outline"
                    borderRadius="full"
                    onClick={() => handleQuickReply(reply)}
                    isDisabled={isLoading}
                    _hover={{ bg: "orange.50" }}
                  >
                    {reply}
                  </Button>
                ))}
              </VStack>
            )}

            {isLoading && (
              <Flex justify="flex-start" align="center" gap={2}>
                <Box
                  bg={{ base: "white", _dark: "gray.800" }}
                  px={4}
                  py={2}
                  borderRadius="lg"
                  boxShadow="sm"
                >
                  <Spinner size="xs" color="#E65C00" />
                </Box>
              </Flex>
            )}
            <div ref={messagesEndRef} />
          </VStack>

          <Box
            p={3}
            bg={{ base: "white", _dark: "gray.950" }}
            borderTop="1px solid"
            borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
          >
            <form onSubmit={handleSend}>
              <HStack gap={2}>
                <Input
                  placeholder="Nhập câu hỏi tại đây..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  size="sm"
                  focusBorderColor="#E65C00"
                  borderRadius="md"
                  bg={{ base: "white", _dark: "gray.800" }}
                  color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
                />
                <Button
                  type="submit"
                  bg="#E65C00"
                  color="white"
                  size="sm"
                  p={2}
                  isDisabled={isLoading}
                  _hover={{ bg: "#CC5200" }}
                >
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