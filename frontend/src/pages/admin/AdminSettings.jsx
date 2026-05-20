import { useState, useEffect } from 'react';
import { Box, Heading, VStack, HStack, Text, Avatar, Button, SimpleGrid, Card, Input, Stack } from '@chakra-ui/react';
import { useAuthContext } from '../../context/AuthContext';
import { toaster } from '../../components/ui/toaster';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AdminSettings() {
  const { authAxios, user: currentUser, fetchCurrentUser } = useAuthContext();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setPhoneNumber(currentUser.phoneNumber || '');
    }
  }, [currentUser]);

  const handleUpdate = async () => {
    if (!currentUser?._id) return;
    setLoading(true);
    try {
      const client = await authAxios();
      await client.put(`/api/admin/users/${currentUser._id}`, {
        fullName,
        phoneNumber
      });
      toaster.create({ title: 'Cập nhật thành công!', type: 'success' });
      if (fetchCurrentUser) await fetchCurrentUser();
      else setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      toaster.create({ title: 'Lỗi cập nhật', description: err.response?.data?.message || err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>⚙️ Cài đặt tài khoản</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} gap={6}>
        <Card.Root>
          <Card.Header>
            <Heading size="md">Thông tin cá nhân</Heading>
          </Card.Header>
          <Card.Body>
            <VStack align="stretch" spacing={4}>
              <HStack spacing={4}>
                <Avatar.Root size="lg">
                  <Avatar.Fallback name={currentUser?.fullName || 'Admin'} />
                  <Avatar.Image src={currentUser?.avatar} />
                </Avatar.Root>
                <Box>
                  <Text fontWeight="bold" fontSize="lg">{currentUser?.fullName}</Text>
                  <Text color="gray.500">{currentUser?.email}</Text>
                </Box>
              </HStack>
              <Stack spacing={3}>
                <Input
                  placeholder="Họ và tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                  placeholder="Số điện thoại"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Stack>
              <Button leftIcon={<FaSave />} colorScheme="blue" onClick={handleUpdate} loading={loading}>
                Cập nhật thông tin
              </Button>
            </VStack>
          </Card.Body>
        </Card.Root>
        <Card.Root>
          <Card.Header>
            <Heading size="md">Hành động</Heading>
          </Card.Header>
          <Card.Body>
            <VStack align="stretch" spacing={4}>
              <Button leftIcon={<FaArrowLeft />} variant="ghost" onClick={() => navigate('/admin')}>
                Quay lại Dashboard
              </Button>
            </VStack>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>
    </Box>
  );
}