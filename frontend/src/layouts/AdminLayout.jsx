import { Box, Flex, VStack, HStack, Text, Icon, Link as ChakraLink, Image, Menu, Portal, Avatar } from '@chakra-ui/react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaHome, FaChartLine, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@clerk/clerk-react';
import { useAuthContext } from '../context/AuthContext'; // 👈 thêm import

const navItems = [
  { name: 'Tổng quan', path: '/admin', icon: FaTachometerAlt },
  { name: 'Quản lý người dùng', path: '/admin/users', icon: FaUsers },
  { name: 'Quản lý tin đăng', path: '/admin/properties', icon: FaHome },
  { name: 'Thống kê', path: '/admin/stats', icon: FaChartLine },
];

export default function AdminLayout() {
  const { signOut } = useAuth();
  const { user: dbUser } = useAuthContext(); // 👈 lấy user từ MongoDB (đã sync)
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
  };

  const sidebarBg = 'white';
  const borderColor = '#e2e8f0';
  const activeBg = '#fed7d7';
  const activeColor = '#e53e3e';
  const normalColor = '#4a5568';
  const hoverBg = '#f7fafc';

  const displayName = dbUser?.fullName || 'Admin';
  const shortName = displayName.split(' ')[0];

  return (
    <Flex minH="100vh">
      {/* Sidebar - giữ nguyên */}
      <Box
        w="260px"
        bg={sidebarBg}
        borderRight="1px solid"
        borderColor={borderColor}
        px={4}
        py={6}
        position="fixed"
        h="full"
        overflowY="auto"
        display="flex"
        flexDirection="column"
      >
        <Box mb={6} textAlign="center">
          <Link to="/">
            <Image
              src="/imgs/logo.png"
              alt="RealEstate Pro"
              h="50px"
              objectFit="contain"
              mx="auto"
              fallbackSrc="https://via.placeholder.com/150x50?text=RealEstatePro"
            />
          </Link>
        </Box>
        <Box borderBottom="1px solid" borderColor="gray.200" mb={4} />

        <VStack align="stretch" spacing={1} flex="1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ChakraLink
                as={Link}
                to={item.path}
                key={item.path}
                _hover={{ textDecoration: 'none' }}
              >
                <HStack
                  p={3}
                  borderRadius="md"
                  bg={isActive ? activeBg : 'transparent'}
                  color={isActive ? activeColor : normalColor}
                  _hover={{ bg: hoverBg }}
                  transition="all 0.2s"
                >
                  <Icon as={item.icon} fontSize="lg" />
                  <Text fontWeight={isActive ? 'semibold' : 'medium'}>{item.name}</Text>
                </HStack>
              </ChakraLink>
            );
          })}
        </VStack>

        <Box mt="auto" pt={3} borderTop="1px solid" borderColor="gray.200">
          <Menu.Root>
            <Menu.Trigger asChild>
              <HStack spacing={2} p={1.5} borderRadius="md" cursor="pointer" _hover={{ bg: hoverBg }} transition="all 0.2s">
                <Avatar.Root size="xs">
                  <Avatar.Fallback name={displayName} />
                  <Avatar.Image src={dbUser?.avatar} />
                </Avatar.Root>
                <Text fontSize="xs" fontWeight="medium" noOfLines={1} maxW="140px">
                  {shortName}
                </Text>
                <Icon as={FaCog} fontSize="xs" color="gray.400" ml="auto" />
              </HStack>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="settings" onClick={() => navigate('/admin/settings')}>
                    <HStack><Icon as={FaCog} /><Text>Cài đặt</Text></HStack>
                  </Menu.Item>
                  <Menu.Item value="logout" onClick={handleLogout} color="red.500">
                    <HStack><Icon as={FaSignOutAlt} /><Text>Đăng xuất</Text></HStack>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Box>
      </Box>

      <Box ml="260px" flex="1" bg="gray.50" minH="100vh">
        <Box bg="white" px={6} py={3} borderBottom="1px solid" borderColor={borderColor} mb={4}>
          <Flex justify="space-between" align="center">
            <Text fontSize="lg" fontWeight="semibold">
              Chào mừng, {shortName}!
            </Text>
            <Text fontSize="lg" textTransform="uppercase" fontWeight="700">Admin Panel</Text>
          </Flex>
        </Box>
        <Box px={6}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}