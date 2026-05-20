import { useState, useEffect, useCallback } from 'react';
import {
  Box, Heading, Badge, Button, Spinner, Table, Avatar,
  Stack, Dialog, Portal, Input, Field, HStack, Card, Text,
  IconButton, Select
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { toaster } from '../../components/ui/toaster';
import { Tooltip } from '../../components/ui/tooltip';
import { FaLock, FaLockOpen, FaUserShield, FaEdit, FaTrash, FaUserEdit, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function AdminUsers() {
  const { authAxios, isAdmin, user: currentUser } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // số item mỗi trang

  const fetchUsers = useCallback(async () => {
    try {
      const client = await authAxios();
      const res = await client.get('/api/admin/users');
      setUsers(res.data.users);
    } catch (err) {
      toaster.create({ title: 'Lỗi tải dữ liệu', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [authAxios]);

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin, fetchUsers]);

  // Reset về trang 1 khi có dữ liệu mới (ví dụ sau khi thêm/xóa user)
  useEffect(() => {
    setCurrentPage(1);
  }, [users.length]);

  // Các hàm xử lý (giữ nguyên)
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditName(user.fullName);
    setEditPhone(user.phoneNumber || '');
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      const client = await authAxios();
      await client.put(`/api/admin/users/${editingUser._id}`, {
        fullName: editName,
        phoneNumber: editPhone
      });
      toaster.create({ title: 'Cập nhật thành công', type: 'success' });
      setIsEditOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toaster.create({ title: 'Lỗi cập nhật', description: err.response?.data?.message || err.message, type: 'error' });
    }
  };

  const handleToggleBlock = async (userId, currentStatus) => {
    try {
      const client = await authAxios();
      await client.put(`/api/admin/users/${userId}/block`);
      toaster.create({ title: currentStatus ? 'Đã mở khóa' : 'Đã khóa', type: 'success' });
      fetchUsers();
    } catch (err) {
      toaster.create({ title: 'Thao tác thất bại', type: 'error' });
    }
  };

  const handlePromote = async (userId) => {
    try {
      const client = await authAxios();
      await client.post('/api/admin/promote', { userId });
      toaster.create({ title: 'Đã nâng cấp lên Admin', type: 'success' });
      fetchUsers();
    } catch (err) {
      toaster.create({ title: 'Lỗi nâng cấp', type: 'error' });
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;
    try {
      const client = await authAxios();
      await client.delete(`/api/admin/users/${userId}`);
      toaster.create({ title: 'Đã xóa người dùng', type: 'success' });
      fetchUsers();
    } catch (err) {
      toaster.create({ title: 'Lỗi xóa', type: 'error' });
    }
  };

  // Phân trang
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  if (loading) return <Spinner size="xl" mt={10} />;

  return (
    <Box>
      <Heading size="lg" mb={6} display="flex" alignItems="center" gap={2}>
        <span>👥</span> Quản lý người dùng
      </Heading>

      <Card.Root variant="outline" overflowX="auto">
        <Table.Root variant="line" size="sm">
          <Table.Header>
            <Table.Row bg="gray.50">
              <Table.ColumnHeader py={3} px={4}>Avatar</Table.ColumnHeader>
              <Table.ColumnHeader py={3} px={4}>Họ tên</Table.ColumnHeader>
              <Table.ColumnHeader py={3} px={4}>Email</Table.ColumnHeader>
              <Table.ColumnHeader py={3} px={4}>Số điện thoại</Table.ColumnHeader>
              <Table.ColumnHeader py={3} px={4}>Vai trò</Table.ColumnHeader>
              <Table.ColumnHeader py={3} px={4}>Trạng thái</Table.ColumnHeader>
              <Table.ColumnHeader py={3} px={4} textAlign="center">Hành động</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {currentUsers.map((user) => {
              const isCurrentUser = currentUser?.email === user.email;
              const canEdit = !isCurrentUser;
              const canBlock = !isCurrentUser && user.role !== 'admin';
              const canPromote = !isCurrentUser && user.role !== 'admin';
              const canDelete = !isCurrentUser && user.role !== 'admin';

              return (
                <Table.Row key={user._id} _hover={{ bg: 'gray.50' }} transition="background 0.2s">
                  <Table.Cell px={4} py={2}>
                    <Avatar.Root size="sm">
                      <Avatar.Fallback name={user.fullName} />
                      <Avatar.Image src={user.avatar} />
                    </Avatar.Root>
                  </Table.Cell>
                  <Table.Cell px={4} py={2} fontWeight="medium">{user.fullName}</Table.Cell>
                  <Table.Cell px={4} py={2}>{user.email}</Table.Cell>
                  <Table.Cell px={4} py={2}>{user.phoneNumber || '—'}</Table.Cell>
                  <Table.Cell px={4} py={2}>
                    <Badge colorScheme={user.role === 'admin' ? 'purple' : 'gray'} variant="solid" borderRadius="full" px={2}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell px={4} py={2}>
                    <Badge
                      colorScheme={user.isBlocked ? 'red' : 'green'}
                      variant="subtle"
                      borderRadius="full"
                      px={3}
                      py={1}
                      display="inline-flex"
                      alignItems="center"
                      gap={2}
                    >
                      <Box w="8px" h="8px" borderRadius="full" bg={user.isBlocked ? 'red.500' : 'green.500'} />
                      {user.isBlocked ? 'Bị khóa' : 'Hoạt động'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell px={4} py={2}>
                    <HStack gap={2} flexWrap="wrap">
                      {canEdit ? (
                        <Tooltip content="Chỉnh sửa thông tin">
                          <Button size="xs" leftIcon={<FaEdit />} colorScheme="blue" variant="surface" onClick={() => openEditModal(user)}>
                            Sửa
                          </Button>
                        </Tooltip>
                      ) : (
                        <Tooltip content="Chỉnh sửa hồ sơ của bạn">
                          <Button size="xs" leftIcon={<FaUserEdit />} colorScheme="gray" variant="surface" as={Link} to="/admin/settings">
                            Sửa hồ sơ
                          </Button>
                        </Tooltip>
                      )}
                      {canBlock && (
                        <Tooltip content={user.isBlocked ? "Mở khóa người dùng" : "Khóa người dùng"}>
                          <Button
                            size="xs"
                            leftIcon={user.isBlocked ? <FaLockOpen /> : <FaLock />}
                            colorScheme={user.isBlocked ? 'green' : 'red'}
                            variant="surface"
                            onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                          >
                            {user.isBlocked ? 'Mở khóa' : 'Khóa'}
                          </Button>
                        </Tooltip>
                      )}
                      {canPromote && (
                        <Tooltip content="Nâng cấp lên quyền Admin">
                          <Button size="xs" leftIcon={<FaUserShield />} colorScheme="purple" variant="surface" onClick={() => handlePromote(user._id)}>
                            Lên Admin
                          </Button>
                        </Tooltip>
                      )}
                      {canDelete && (
                        <Tooltip content="Xóa vĩnh viễn người dùng">
                          <Button size="xs" leftIcon={<FaTrash />} colorScheme="red" variant="surface" onClick={() => handleDelete(user._id)}>
                            Xóa
                          </Button>
                        </Tooltip>
                      )}
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Card.Root>

      {/* Phân trang */}
      {users.length > itemsPerPage && (
        <HStack justify="space-between" mt={6} wrap="wrap" gap={4}>
          <HStack gap={2}>
            <HStack gap={2}>
              <Text fontSize="sm">Hiển thị</Text>
              <HStack gap={1}>
                {[5, 10, 20].map((num) => (
                  <Button
                    key={num}
                    size="xs"
                    variant={itemsPerPage === num ? 'solid' : 'outline'}
                    colorScheme={itemsPerPage === num ? 'blue' : 'gray'}
                    onClick={() => {
                      setItemsPerPage(num);
                      setCurrentPage(1);
                    }}
                  >
                    {num}
                  </Button>
                ))}
              </HStack>
              <Text fontSize="sm">mỗi trang</Text>
            </HStack>
          </HStack>

          <HStack gap={2}>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<FaChevronLeft />}
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            <HStack gap={1}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  size="sm"
                  variant={currentPage === page ? 'solid' : 'ghost'}
                  colorScheme={currentPage === page ? 'blue' : 'gray'}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </Button>
              ))}
            </HStack>
            <Button
              size="sm"
              variant="ghost"
              rightIcon={<FaChevronRight />}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </HStack>
        </HStack>
      )}
      {/* Modal chỉnh sửa giữ nguyên */}
      <Dialog.Root open={isEditOpen} onOpenChange={(e) => setIsEditOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>Chỉnh sửa người dùng</Dialog.Header>
              <Dialog.Body>
                <Stack spacing={4}>
                  <Field.Root>
                    <Field.Label>Họ và tên</Field.Label>
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Số điện thoại</Field.Label>
                    <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="+84" />
                  </Field.Root>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Hủy</Button>
                <Button colorScheme="blue" onClick={handleSaveEdit}>Lưu</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}