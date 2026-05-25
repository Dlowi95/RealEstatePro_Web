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
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { LuMenu, LuBell, LuChevronDown } from "react-icons/lu";
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
  const [showDropdown, setShowDropdown] = useState(false);

  // Tính số lượng thông báo chưa đọc (isRead === false)
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (!user) return;

    console.log("User ID từ Clerk:", user.id);

    // 1. Fetch lịch sử thông báo cũ từ DB khi vừa vào web
    const fetchNotifications = async () => {
      try {
        const url = `${API_BASE_URL}/api/notifications/${user.id}`;
        console.log("Fetching từ URL:", url);
        const res = await axios.get(url);
        console.log("Response từ API:", res.data);
        if (res.data?.success) {
          setNotifications(res.data.data);
          console.log("Notifications đã được set:", res.data.data);
        }
      } catch (err) {
        console.error("Lỗi lấy lịch sử thông báo:", err);
      }
    };
    fetchNotifications();

    // 2. Kết nối tới Socket.io Server thời gian thực
    const socket = io(API_BASE_URL);

    socket.on("connect", () => {
      console.log("✅ Socket.io đã kết nối với ID:", socket.id);
      // Đăng ký định danh của user (ClerkId) với Server
      socket.emit("register_user", user.id);
      console.log("📤 Đã gửi register_user với userId:", user.id);
    });

    // Lắng nghe sự kiện thông báo mới từ server bắn xuống
    socket.on("new_notification", (newNoti) => {
      console.log("🔔 Nhận được notification mới:", newNoti);
      // Đẩy thông báo mới lên đầu danh sách mảng hiển thị
      setNotifications((prev) => [newNoti, ...prev]);

      // Hiển thị Banner Toast bằng Chakra UI v3
      toaster.create({
        title: newNoti.title,
        description: newNoti.message,
        type: "info",
        duration: 5000,
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket.io đã ngắt kết nối");
    });

    socket.on("connect_error", (error) => {
      console.error("⚠️ Socket.io connection error:", error);
    });

    // Ngắt kết nối khi component bị huỷ
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
          {/* TRÁI: Logo & Menu Desktop */}
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

          {/* PHẢI: Buttons, Dropdown Quản lý & Quả chuông Thông báo */}
          <HStack gap={4} position="relative">
            <SignedIn>
              <HStack gap={4} display={{ base: "none", md: "flex" }}>
                {/* DROPDOWN QUẢN LÝ TIN ĐÃ KHÔI PHỤC LẠI */}
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
                        <Menu.Item
                          value="create"
                          as={RouterLink}
                          to="/create-property"
                        >
                          Đăng tin mới
                        </Menu.Item>
                        <Menu.Item
                          value="manage"
                          as={RouterLink}
                          to="/manage-properties"
                        >
                          Tin của tôi
                        </Menu.Item>
                        <Menu.Item
                          value="favorites"
                          as={RouterLink}
                          to="/favorites"
                        >
                          Tin yêu thích
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>

                {/* ICON QUẢ CHUÔNG THÔNG BÁO VÀ DROPDOWN REAL-TIME */}
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

                  {/* DANH SÁCH DROPDOWN THÔNG BÁO */}
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
                      <Flex
                        justify="space-between"
                        align="center"
                        p={3}
                        bg="gray.50"
                        borderBottomWidth="1px"
                      >
                        <Text fontWeight="bold" fontSize="sm">
                          Thông báo cá nhân
                        </Text>
                        {unreadCount > 0 && (
                          <Text
                            fontSize="xs"
                            color="blue.600"
                            fontWeight="500"
                            cursor="pointer"
                            onClick={handleMarkAllAsRead}
                          >
                            Đọc tất cả
                          </Text>
                        )}
                      </Flex>

                      <Box maxH="320px" overflowY="auto">
                        {notifications.length === 0 ? (
                          <Text
                            p={4}
                            fontSize="sm"
                            color="gray.500"
                            textAlign="center"
                          >
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
                              <Text
                                fontWeight={noti.isRead ? "medium" : "bold"}
                                fontSize="sm"
                                color="gray.800"
                                noOfLines={1}
                              >
                                {noti.title}
                              </Text>
                              <Text
                                fontSize="xs"
                                color="gray.600"
                                mt={0.5}
                                noOfLines={2}
                              >
                                {noti.message}
                              </Text>
                              <Text fontSize="10px" color="gray.400" mt={1}>
                                {new Date(noti.createdAt).toLocaleString(
                                  "vi-VN",
                                )}
                              </Text>
                            </Box>
                          ))
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>
              </HStack>

              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <SignedOut>
              <HStack gap={3} display={{ base: "none", md: "flex" }}>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Đăng nhập
                  </Button>
                </SignInButton>
                <SignInButton mode="modal">
                  <Button
                    bg="red.600"
                    color="white"
                    size="sm"
                    _hover={{ bg: "red.700" }}
                  >
                    Đăng ký
                  </Button>
                </SignInButton>
              </HStack>
            </SignedOut>

            {/* Nút Mobile Menu Hamburgers */}
            <Box display={{ base: "block", md: "none" }}>
              <Drawer.Root>
                <Drawer.Trigger asChild>
                  <IconButton variant="ghost" aria-label="Open Menu">
                    <LuMenu size={24} />
                  </IconButton>
                </Drawer.Trigger>
                <Drawer.Positioner>
                  <Drawer.Content>
                    <Drawer.Body>
                      <Flex direction="column" gap={4} pt={8}>
                        {navLinks.map((link, index) => (
                          <Link
                            key={index}
                            as={RouterLink}
                            to={link.href}
                            fontSize="md"
                            fontWeight="500"
                            color="gray.700"
                            py={2}
                            borderBottom="1px solid"
                            borderColor="gray.50"
                          >
                            {link.label}
                          </Link>
                        ))}

                        <Box pt={4}>
                          <SignedIn>
                            <Flex direction="column" gap={3}>
                              <Button
                                as={RouterLink}
                                to="/create-property"
                                bg="red.600"
                                color="white"
                                w="full"
                                _hover={{ bg: "red.700" }}
                              >
                                Đăng tin miễn phí
                              </Button>
                              <HStack
                                justify="space-between"
                                p={2}
                                bg="gray.50"
                                rounded="md"
                              >
                                <Text fontWeight="600" fontSize="sm">
                                  Tài khoản
                                </Text>
                                <UserButton afterSignOutUrl="/" />
                              </HStack>
                            </Flex>
                          </SignedIn>

                          <SignedOut>
                            <SignInButton mode="modal">
                              <Button variant="outline" w="full">
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
