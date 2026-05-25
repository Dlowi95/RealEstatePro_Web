import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useAuthContext } from '../context/AuthContext';
import { useEffect } from 'react';

import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminFooter from '@/components/admin/AdminFooter';

export default function AdminLayout() {
  const { signOut } = useAuth();
  const { user: dbUser, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!dbUser || dbUser.role !== 'admin') {
        navigate('/');
      }
    }
  }, [dbUser, loading, navigate]);

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

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh" bg="gray.50/50" direction="column" gap={4}>
        <Spinner size="xl" color="red.500" borderWidth="4px" trackColor="gray.100" />
        <Text fontSize="md" fontWeight="medium" color="gray.500">Loading admin dashboard...</Text>
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" bg="gray.50/50">
      <AdminSidebar 
        displayName={displayName}
        shortName={shortName}
        dbUser={dbUser}
        handleLogout={handleLogout}
        activeBg={activeBg}
        activeColor={activeColor}
        normalColor={normalColor}
        hoverBg={hoverBg}
        borderColor={borderColor}
        sidebarBg={sidebarBg}
      />

      <Flex ml="260px" flex="1" direction="column" minH="100vh">
        <AdminHeader shortName={shortName} borderColor={borderColor} />

        <Box px={6} flex="1">
          <Outlet />
        </Box>

        <AdminFooter />
      </Flex>
    </Flex>
  );
}