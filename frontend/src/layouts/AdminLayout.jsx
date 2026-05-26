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

  const displayName = dbUser?.fullName || 'Admin';
  const shortName = displayName.split(' ')[0];

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh" bg="bg.muted" direction="column" gap={4}>
        <Spinner size="xl" colorPalette="red" borderWidth="4px" />
        <Text fontSize="md" fontWeight="medium" color="fg.muted">Loading admin dashboard...</Text>
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" bg="bg.muted">
      <AdminSidebar 
        displayName={displayName}
        shortName={shortName}
        dbUser={dbUser}
        handleLogout={handleLogout}
      />

      <Flex ml="260px" flex="1" direction="column" minH="100vh">
        <AdminHeader shortName={shortName} />

        <Box px={6} flex="1">
          <Outlet />
        </Box>

        <AdminFooter />
      </Flex>
    </Flex>
  );
}