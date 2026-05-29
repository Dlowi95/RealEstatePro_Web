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
  Badge,
  Menu,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  LuMenu,
  LuBell,
  LuChevronDown,
  LuChevronUp,
  LuBellOff,
  LuSun,
  LuMoon,
  LuX,
} from "react-icons/lu";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { useColorMode } from "@/components/ui/color-mode";
import { io } from "socket.io-client";
import axios from "axios";
import { toaster } from "@/components/ui/toaster";

const navLinks = [
  { label: "Nhà đất bán", href: "/sell" },
  { label: "Nhà đất cho thuê", href: "/rent" },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Navbar = () => {
  const { user } = useUser();
  const { colorMode, toggleColorMode } = useColorMode();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (!user) return;

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
      bg={{ base: "#fff", _dark: "gray.900" }}
      borderBottom="1px solid"
      borderColor={{ base: "gray.100", _dark: "whiteAlpha.200" }}
      py="4"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="5000"
    >
      <Container maxW="1200px" px={{ base: "4", md: "6" }}>
        <Flex justify="space-between" align="center" w="100%">
          
          <HStack gap="10" align="center">
            <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
              <Image
                src="/imgs/logo.png"
                alt="RealEstate Pro"
                w="150px"
                objectFit="contain"
                style={{
                  filter: colorMode === "dark" ? "invert(1) brightness(1.2)" : "none",
                  transition: "filter 0.2s ease",
                }}
              />
            </Link>

            <HStack gap="6" display={{ base: "none", md: "flex" }}>
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  as={RouterLink}
                  to={link.href}
                  fontSize="sm"
                  fontWeight="semibold"
                  color={{ base: "gray.700", _dark: "white" }}
                  _hover={{ color: "#E65C00", textDecoration: "none" }}
                >
                  {link.label}
                </Link>
              ))}
            </HStack>
          </HStack>

          <HStack gap="4" display={{ base: "none", md: "flex" }} align="center">
            <IconButton
              variant="ghost"
              aria-label="Toggle Theme"
              onClick={toggleColorMode}
              borderRadius="full"
              color={{ base: "gray.700", _dark: "yellow.400" }}
            >
              {colorMode === "light" ? <LuMoon size={20} /> : <LuSun size={20} />}
            </IconButton>

            <SignedIn>
              <Menu.Root positioning={{ placement: "bottom-start", gutter: 4 }}>
                <Menu.Trigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    px={2}
                    color={{ base: "gray.700", _dark: "white" }}
                    _hover={{ color: "#E65C00" }}
                  >
                    Quản lý tin
                    <LuChevronDown size={14} style={{ marginLeft: "4px" }} />
                  </Button>
                </Menu.Trigger>
                <Menu.Positioner zIndex="5100">
                  <Menu.Content bg={{ base: "white", _dark: "gray.900" }} borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}>
                    <Menu.Item value="create" as={RouterLink} to="/create-property">Đăng tin mới</Menu.Item>
                    <Menu.Item value="manage" as={RouterLink} to="/manage-properties">Tin của tôi</Menu.Item>
                    <Menu.Item value="favorites" as={RouterLink} to="/favorites">Tin yêu thích</Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Menu.Root>

              <Box position="relative" display="flex" align="center">
                <IconButton
                  variant="ghost"
                  aria-label="Notifications"
                  onClick={() => setShowDropdown(!showDropdown)}
                  borderRadius="full"
                  color={{ base: "gray.700", _dark: "gray.100" }}
                >
                  <LuBell size={22} />
                  {unreadCount > 0 && (
                    <Badge position="absolute" top="-2px" right="-2px" bg="#E65C00" color="white" fontSize="10px" borderRadius="full" px={1.5}>
                      {unreadCount}
                    </Badge>
                  )}
                </IconButton>

                {showDropdown && (
                  <Box
                    position="absolute"
                    top="45px"
                    right="0"
                    bg={{ base: "white", _dark: "gray.900" }}
                    w="340px"
                    boxShadow="xl"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
                    overflow="hidden"
                    zIndex="5100"
                  >
                    <Flex justify="space-between" align="center" p={3} bg={{ base: "gray.50", _dark: "gray.800" }} borderBottomWidth="1px">
                      <Text fontWeight="bold" fontSize="sm" color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>Thông báo cá nhân</Text>
                      {unreadCount > 0 && <Text fontSize="xs" color="#E65C00" fontWeight="500" cursor="pointer" onClick={handleMarkAllAsRead}>Đọc tất cả</Text>}
                    </Flex>
                    <Box maxH="320px" overflowY="auto">
                      {notifications.length === 0 ? (
                        <Text p={4} fontSize="sm" color={{ base: "gray.500", _dark: "gray.300" }} textAlign="center">Bạn chưa có thông báo nào.</Text>
                      ) : (
                        notifications.map((noti) => (
                          <Box key={noti._id} p={3} borderBottomWidth="1px" borderColor={{ base: "gray.100", _dark: "whiteAlpha.200" }} bg={noti.isRead ? "transparent" : { base: "orange.50", _dark: "orange.950" }} _hover={{ bg: { base: "gray.50", _dark: "gray.800" } }} as={RouterLink} to={`/properties/${noti.propertyId}`} onClick={() => setShowDropdown(false)} display="block">
                            <Text fontWeight={noti.isRead ? "medium" : "bold"} fontSize="sm" color={{ base: "gray.800", _dark: "gray.100" }} noOfLines={1}>{noti.title}</Text>
                            <Text fontSize="xs" color={{ base: "gray.600", _dark: "gray.300" }} mt={0.5} noOfLines={2}>{noti.message}</Text>
                            <Text fontSize="9px" color={{ base: "gray.400", _dark: "gray.500" }} mt={1}>{new Date(noti.createdAt).toLocaleString("vi-VN")}</Text>
                          </Box>
                        ))
                      )}
                    </Box>
                  </Box>
                )}
              </Box>

              <Flex align="center" justify="center" h="40px">
                <UserButton afterSignOutUrl="/" />
              </Flex>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" color={{ base: "gray.700", _dark: "gray.100" }}>Đăng nhập</Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button bg="#E65C00" color="white" size="sm" _hover={{ bg: "#CC5200" }} borderRadius="xl" fontWeight="semibold">Đăng ký</Button>
              </SignInButton>
            </SignedOut>
          </HStack>

          <HStack gap="3" display={{ base: "flex", md: "none" }} align="center">
            <IconButton
              variant="ghost"
              aria-label="Toggle Theme"
              onClick={toggleColorMode}
              size="sm"
              borderRadius="full"
              color={{ base: "gray.600", _dark: "yellow.400" }}
            >
              {colorMode === "light" ? <LuMoon size={18} /> : <LuSun size={18} />}
            </IconButton>

            <SignedIn>
              <Box position="relative" display="flex" align="center">
                <IconButton
                  variant="ghost"
                  aria-label="Notifications"
                  onClick={() => setShowMobileDropdown(!showMobileDropdown)}
                  borderRadius="full"
                  size="sm"
                  color={{ base: "gray.700", _dark: "gray.100" }}
                >
                  <LuBell size={20} />
                  {unreadCount > 0 && (
                    <Badge position="absolute" top="-2px" right="-2px" bg="#E65C00" color="white" fontSize="9px" borderRadius="full" px={1}>
                      {unreadCount}
                    </Badge>
                  )}
                </IconButton>

                {showMobileDropdown && (
                  <Box
                    position="absolute"
                    top="40px"
                    right="-40px"
                    bg={{ base: "white", _dark: "gray.900" }}
                    w="280px"
                    boxShadow="xl"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
                    overflow="hidden"
                    zIndex="6500"
                  >
                    <Flex justify="space-between" align="center" p={3} bg={{ base: "gray.50", _dark: "gray.800" }} borderBottomWidth="1px">
                      <Text fontWeight="bold" fontSize="xs" color={{ base: "gray.800", _dark: "whiteAlpha.900" }}>Thông báo</Text>
                      {unreadCount > 0 && <Text fontSize="10px" color="#E65C00" fontWeight="500" cursor="pointer" onClick={handleMarkAllAsRead}>Đọc tất cả</Text>}
                    </Flex>
                    <Box maxH="240px" overflowY="auto">
                      {notifications.length === 0 ? (
                        <Text p={3} fontSize="xs" color={{ base: "gray.500", _dark: "gray.300" }} textAlign="center">Không có thông báo.</Text>
                      ) : (
                        notifications.map((noti) => (
                          <Box key={noti._id} p={2.5} borderBottomWidth="1px" borderColor={{ base: "gray.100", _dark: "whiteAlpha.200" }} bg={noti.isRead ? "transparent" : { base: "orange.50", _dark: "orange.950" }} _hover={{ bg: { base: "gray.50", _dark: "gray.800" } }} as={RouterLink} to={`/properties/${noti.propertyId}`} onClick={() => setShowMobileDropdown(false)} display="block">
                            <Text fontWeight={noti.isRead ? "medium" : "bold"} fontSize="xs" color={{ base: "gray.800", _dark: "gray.100" }} noOfLines={1}>{noti.title}</Text>
                            <Text fontSize="11px" color={{ base: "gray.600", _dark: "gray.300" }} mt={0.5} noOfLines={2}>{noti.message}</Text>
                          </Box>
                        ))
                      )}
                    </Box>
                  </Box>
                )}
              </Box>

              <Flex align="center" justify="center" h="32px" w="32px">
                <UserButton afterSignOutUrl="/" />
              </Flex>
            </SignedIn>

            <IconButton
              variant="ghost"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Open Menu"
              size="sm"
              color={{ base: "gray.700", _dark: "gray.100" }}
            >
              {isMobileOpen ? <LuX size={22} /> : <LuMenu size={22} />}
            </IconButton>
          </HStack>
        </Flex>
      </Container>

      {isMobileOpen && (
        <>
          <Box
            position="fixed"
            top="0"
            left="0"
            w="100vw"
            h="100vh"
            bg="blackAlpha.600"
            zIndex="5999"
            onClick={() => setIsMobileOpen(false)}
            style={{
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              animation: "navFadeIn 0.2s ease-out forwards"
            }}
          />

          <Box
            position="fixed"
            top="0"
            right="0"
            w={{ base: "260px", sm: "300px" }}
            h="100vh"
            bg={{ base: "white", _dark: "gray.950" }}
            boxShadow="2xl"
            borderLeft="1px solid"
            borderColor={{ base: "gray.100", _dark: "whiteAlpha.200" }}
            p="6"
            zIndex="6000"
            overflowY="auto"
            style={{ animation: "navSlideIn 0.2s ease-out forwards" }}
          >
            <VStack align="stretch" gap="5" w="100%">
              <Flex 
                justify="space-between" 
                align="center" 
                pb="3" 
                borderBottom="1px solid" 
                borderColor={{ base: "gray.100", _dark: "whiteAlpha.100" }}
                mb="2"
              >
                <Text fontWeight="bold" fontSize="md" color={{ base: "gray.800", _dark: "white" }}>
                  Danh mục 
                </Text>
                <IconButton
                  variant="ghost"
                  onClick={() => setIsMobileOpen(false)}
                  aria-label="Close Menu"
                  size="sm"
                  color={{ base: "gray.700", _dark: "gray.100" }}
                >
                  <LuX size={22} />
                </IconButton>
              </Flex>

              {navLinks.map((link, index) => (
                <Link key={index} as={RouterLink} to={link.href} fontSize="md" fontWeight="semibold" color={{ base: "gray.800", _dark: "gray.100" }} py={2} borderBottom="1px solid" borderColor={{ base: "gray.50", _dark: "whiteAlpha.100" }} onClick={() => setIsMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}

              <SignedIn>
                <Box w="100%">
                  <Flex justify="space-between" align="center" py="2" cursor="pointer" onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)} color={{ base: "gray.800", _dark: "white" }}>
                    <Text fontWeight="semibold">Quản lý tin đăng</Text>
                    {isAdminMenuOpen ? <LuChevronUp size={18} /> : <LuChevronDown size={18} />}
                  </Flex>

                  {isAdminMenuOpen && (
                    <VStack align="stretch" pl="4" mt="2" gap="3" borderLeft="2px solid #E65C00">
                      <Link as={RouterLink} to="/create-property" onClick={() => setIsMobileOpen(false)}>
                        <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }} _hover={{ color: "#E65C00" }}>Đăng tin mới</Text>
                      </Link>
                      <Link as={RouterLink} to="/manage-properties" onClick={() => setIsMobileOpen(false)}>
                        <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }} _hover={{ color: "#E65C00" }}>Tin của tôi</Text>
                      </Link>
                      <Link as={RouterLink} to="/favorites" onClick={() => setIsMobileOpen(false)}>
                        <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }} _hover={{ color: "#E65C00" }}>Tin yêu thích</Text>
                      </Link>
                    </VStack>
                  )}
                </Box>
              </SignedIn>

              <SignedOut>
                <Box pt={2}>
                  <SignInButton mode="modal">
                    <Button bg="#E65C00" color="white" w="100%" size="md" _hover={{ bg: "#CC5200" }} borderRadius="xl">Đăng nhập / Đăng ký</Button>
                  </SignInButton>
                </Box>
              </SignedOut>
            </VStack>
          </Box>
        </>
      )}
      <style>{`
        @keyframes navFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes navSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </Box>
  );
};

export default Navbar;