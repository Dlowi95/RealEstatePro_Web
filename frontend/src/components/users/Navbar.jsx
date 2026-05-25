import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Image,
  Link,
  Text,
  Drawer,
  Badge,
  Menu,
  Portal,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { LuMenu, LuBell, LuChevronDown, LuBellOff } from "react-icons/lu";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { io } from "socket.io-client";
import axios from "axios";
import { toaster } from "@/components/ui/toaster"; // Import toaster của Chakra UI v3

const navLinks = [
  { label: "Nhà đất bán", href: "/ban" },
  { label: "Nhà đất cho thuê", href: "/cho-thue" },
];

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Navbar = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown riêng cho Desktop
  const [showMobileNoti, setShowMobileNoti] = useState(false); // Trạng thái mở thông báo trên Mobile

  // Tính số lượng thông báo chưa đọc (isRead === false)
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (!user) return;

    // 1. Fetch lịch sử thông báo cũ từ DB
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/notifications/${user.id}`);
        if (res.data?.success) {
          setNotifications(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi lấy lịch sử thông báo:", err);
      }
    };
    fetchNotifications();

    // 2. Kết nối tới Socket.io Server
    const socket = io(API_BASE_URL);

    socket.on("connect", () => {
      socket.emit("register_user", user.id);
    });

    socket.on("new_notification", (newNoti) => {
      setNotifications((prev) => [newNoti, ...prev]);

      toaster.create({
        title: newNoti.title,
        description: newNoti.message,
        type: "info",
        duration: 5000,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Xử lý khi bấm nút "Đọc tất cả"
  const handleMarkAllAsRead = async () => {
    if (!user || unreadCount === 0) return;
    try {
      await axios.put(`${API_BASE_URL}/api/notifications/read-all/${user.id}`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái đã đọc:", err);
    }
  };

  return (
    <Box
      as="nav"
      bg="#fff"
      borderBottom="1px solid"
      borderColor="gray.100"
      py={3}
      position="sticky"
      top="0"
      zIndex="1000"
    >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          {/* ======================================================== */}
          {/* TRÁI: Logo & Menu Desktop */}
          {/* ======================================================== */}
          <HStack gap={8}>
            <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
              <HStack gap={2} align="center">
                <Image
                  src="/imgs/logo.png"
                  alt="RealEstate Pro"
                  w="150px"
                  objectFit="contain"
                />
              </HStack>
            </Link>

            <HStack gap={5} display={{ base: "none", md: "flex" }}>
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  as={RouterLink}
                  to={link.href}
                  fontSize="sm"
                  fontWeight="500"
                  color="gray.700"
                  _hover={{ color: "red.600", textDecoration: "none" }}
                >
                  {link.label}
                </Link>
              ))}
            </HStack>
          </HStack>

          {/* ======================================================== */}
          {/* PHẢI: Buttons, Dropdown Quản lý & Quả chuông Thông báo (Desktop) */}
          {/* ======================================================== */}
          <HStack gap={4} position="relative">
            <SignedIn>
              <HStack gap={4} display={{ base: "none", md: "flex" }}>
                {/* DROPDOWN QUẢN LÝ TIN */}
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      px={2}
                      color="gray.700"
                      _hover={{ color: "red.600" }}
                    >
                      Quản lý tin{" "}
                      <LuChevronDown size={14} style={{ marginLeft: "4px" }} />
                    </Button>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content>
                        <Menu.Item value="create" as={RouterLink} to="/create-property">
                          Đăng tin mới
                        </Menu.Item>
                        <Menu.Item value="manage" as={RouterLink} to="/manage-properties">
                          Tin của tôi
                        </Menu.Item>
                        <Menu.Item value="favorites" as={RouterLink} to="/favorites">
                          Tin yêu thích
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>

                {/* ICON QUẢ CHUÔNG THÔNG BÁO VÀ DROPDOWN DESKTOP */}
                <Box position="relative">
                  <IconButton
                    variant="ghost"
                    aria-label="Notifications"
                    onClick={() => setShowDropdown(!showDropdown)}
                    style={{ borderRadius: "9999px" }}
                  >
                    <LuBell size={22} />
                    {unreadCount > 0 && (
                      <Badge
                        position="absolute"
                        top="-2px"
                        right="-2px"
                        bg="red.500"
                        color="white"
                        fontSize="10px"
                        borderRadius="full"
                        px={1.5}
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </IconButton>

                  {/* DROPDOWN THÔNG BÁO DESKTOP */}
                  {showDropdown && (
                    <Box
                      position="absolute"
                      top="45px"
                      right="0"
                      bg="white"
                      w="340px"
                      boxShadow="xl"
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor="gray.200"
                      overflow="hidden"
                      zIndex="1100"
                    >
                      <Flex justify="space-between" align="center" p={3} bg="gray.50" borderBottomWidth="1px">
                        <Text fontWeight="bold" fontSize="sm">Thông báo cá nhân</Text>
                        {unreadCount > 0 && (
                          <Text fontSize="xs" color="blue.600" fontWeight="500" cursor="pointer" onClick={handleMarkAllAsRead}>
                            Đọc tất cả
                          </Text>
                        )}
                      </Flex>

                      <Box maxH="320px" overflowY="auto">
                        {notifications.length === 0 ? (
                          <Text p={4} fontSize="sm" color="gray.500" textAlign="center">
                            Bạn chưa có thông báo nào.
                          </Text>
                        ) : (
                          notifications.map((noti) => (
                            <Box
                              key={noti._id}
                              p={3}
                              borderBottomWidth="1px"
                              borderColor="gray.100"
                              bg={noti.isRead ? "transparent" : "red.50/30"}
                              _hover={{ bg: "gray.50" }}
                              as={RouterLink}
                              to={`/properties/${noti.propertyId}`}
                              onClick={() => setShowDropdown(false)}
                              display="block"
                            >
                              <Text fontWeight={noti.isRead ? "medium" : "bold"} fontSize="sm" color="gray.800" noOfLines={1}>
                                {noti.title}
                              </Text>
                              <Text fontSize="xs" color="gray.600" mt={0.5} noOfLines={2}>
                                {noti.message}
                              </Text>
                              <Text fontSize="10px" color="gray.400" mt={1}>
                                {new Date(noti.createdAt).toLocaleString("vi-VN")}
                              </Text>
                            </Box>
                          ))
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>
              </HStack>

              <Box display={{ base: "none", md: "block" }}>
                <UserButton afterSignOutUrl="/" />
              </Box>
            </SignedIn>

            <SignedOut>
              <HStack gap={3} display={{ base: "none", md: "flex" }}>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">Đăng nhập</Button>
                </SignInButton>
                <SignInButton mode="modal">
                  <Button bg="red.600" color="white" size="sm" _hover={{ bg: "red.700" }}>
                    Đăng ký
                  </Button>
                </SignInButton>
              </HStack>
            </SignedOut>

            {/* ======================================================== */}
            {/* GIAO DIỆN MOBILE MENU (HAY HAMBURGER BUTTON) */}
            {/* ======================================================== */}
            <Box display={{ base: "block", md: "none" }}>
              <Drawer.Root alternativeTrigger={true}>
                <Drawer.Trigger asChild>
                  <IconButton variant="ghost" aria-label="Open Menu">
                    <LuMenu size={24} />
                  </IconButton>
                </Drawer.Trigger>
                <Drawer.Positioner>
                  <Drawer.Content>
                    <Drawer.Body px={4} py={6}>
                      <Flex direction="column" gap={4} h="full">
                        {/* Các đường dẫn điều hướng chính */}
                        <VStack align="stretch" gap={1}>
                          {navLinks.map((link, index) => (
                            <Link
                              key={index}
                              as={RouterLink}
                              to={link.href}
                              fontSize="md"
                              fontWeight="600"
                              color="gray.800"
                              py={3}
                              borderBottom="1px solid"
                              borderColor="gray.100"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </VStack>

                        {/* Vùng xử lý Authentication & Tính năng riêng tư */}
                        <Box pt={2}>
                          <SignedIn>
                            <Flex direction="column" gap={4}>
                              
                              {/* Cụm Quản lý Tin đăng trên Mobile */}
                              <Menu.Root>
                                <Menu.Trigger asChild>
                                  <Button
                                    variant="outline"
                                    size="md"
                                    w="full"
                                    display="flex"
                                    justifyContent="space-between"
                                    borderColor="gray.200"
                                  >
                                    <Text fontWeight="500">Quản lý tin đăng</Text>
                                    <LuChevronDown size={16} />
                                  </Button>
                                </Menu.Trigger>
                                <Portal>
                                  <Menu.Positioner>
                                    <Menu.Content>
                                      <Menu.Item value="create" as={RouterLink} to="/create-property">
                                        Đăng tin mới
                                      </Menu.Item>
                                      <Menu.Item value="manage" as={RouterLink} to="/manage-properties">
                                        Tin của tôi
                                      </Menu.Item>
                                      <Menu.Item value="favorites" as={RouterLink} to="/favorites">
                                        Tin yêu thích
                                      </Menu.Item>
                                    </Menu.Content>
                                  </Menu.Positioner>
                                </Portal>
                              </Menu.Root>

                              {/* TỐI ƯU THÔNG BÁO MOBILE: Đổ dọc mượt mà trực tiếp trong Drawer */}
                              <Box borderWidth="1px" borderColor="gray.100" borderRadius="xl" bg="gray.50/50" overflow="hidden">
                                <Flex
                                  justify="space-between"
                                  align="center"
                                  p={3}
                                  bg="gray.100/70"
                                  cursor="pointer"
                                  onClick={() => setShowMobileNoti(!showMobileNoti)}
                                >
                                  <HStack gap={2}>
                                    <LuBell size={18} />
                                    <Text fontWeight="600" fontSize="sm">Thông báo của bạn</Text>
                                    {unreadCount > 0 && (
                                      <Badge bg="red.500" color="white" borderRadius="full" fontSize="10px" px={2}>
                                        {unreadCount} mới
                                      </Badge>
                                    )}
                                  </HStack>
                                  <LuChevronDown
                                    size={16}
                                    style={{
                                      transform: showMobileNoti ? "rotate(180deg)" : "none",
                                      transition: "transform 0.2s",
                                    }}
                                  />
                                </Flex>

                                {showMobileNoti && (
                                  <Box bg="white" maxH="260px" overflowY="auto">
                                    {unreadCount > 0 && (
                                      <Flex justify="flex-end" p={2} borderBottomWidth="1px" borderColor="gray.50">
                                        <Button size="xs" variant="ghost" colorPalette="blue" onClick={handleMarkAllAsRead}>
                                          Đánh dấu đọc tất cả
                                        </Button>
                                      </Flex>
                                    )}

                                    {notifications.length === 0 ? (
                                      <Flex direction="column" align="center" gap={1} py={6} color="gray.400">
                                        <LuBellOff size={20} />
                                        <Text fontSize="xs">Không có thông báo nào</Text>
                                      </Flex>
                                    ) : (
                                      notifications.map((noti) => (
                                        <Box
                                          key={noti._id}
                                          p={3}
                                          borderBottomWidth="1px"
                                          borderColor="gray.50"
                                          bg={noti.isRead ? "transparent" : "red.50/40"}
                                          as={RouterLink}
                                          to={`/properties/${noti.propertyId}`}
                                          display="block"
                                        >
                                          <Text fontWeight={noti.isRead ? "medium" : "bold"} fontSize="xs" color="gray.800" noOfLines={1}>
                                            {noti.title}
                                          </Text>
                                          <Text fontSize="11px" color="gray.600" mt={0.5} noOfLines={2}>
                                            {noti.message}
                                          </Text>
                                          <Text fontSize="9px" color="gray.400" mt={1}>
                                            {new Date(noti.createdAt).toLocaleString("vi-VN")}
                                          </Text>
                                        </Box>
                                      ))
                                    )}
                                  </Box>
                                )}
                              </Box>

                              {/* Thanh thông tin tài khoản cá nhân */}
                              <HStack justify="space-between" p={3} bg="gray.50" rounded="xl" borderWidth="1px" borderColor="gray.100" mt="auto">
                                <Text fontWeight="600" fontSize="sm" color="gray.700">Tài khoản</Text>
                                <UserButton afterSignOutUrl="/" />
                              </HStack>
                            </Flex>
                          </SignedIn>

                          <SignedOut>
                            <SignInButton mode="modal">
                              <Button colorPalette="red" w="full" size="md" mt={2}>
                                Đăng nhập / Đăng ký
                              </Button>
                            </SignInButton>
                          </SignedOut>
                        </Box>
                      </Flex>
                    </Drawer.Body>
                  </Drawer.Content>
                </Drawer.Positioner>
              </Drawer.Root>
            </Box>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;