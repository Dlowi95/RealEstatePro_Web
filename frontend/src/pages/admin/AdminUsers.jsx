import { useState, useEffect, useCallback } from 'react';
import {
  Box, Heading, Badge, Button, Spinner, Table, Avatar,
  Stack, Dialog, Portal, Input, Field
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { toaster } from '../../components/ui/toaster';
import { FaLock, FaLockOpen, FaUserShield, FaEdit, FaTrash, FaUserEdit } from 'react-icons/fa';

export default function AdminUsers() {
  const { authAxios, isAdmin, user: currentUser } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho modal sửa
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);

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

  // Mở modal sửa, điền sẵn thông tin
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditName(user.fullName);
    setEditPhone(user.phoneNumber || '');
    setIsEditOpen(true);
  };

  // Lưu sửa
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
      fetchUsers(); // reload danh sách
    } catch (err) {
      console.error(err);
      toaster.create({ title: 'Lỗi cập nhật', description: err.response?.data?.message || err.message, type: 'error' });
    }
  };

  // Các hàm xử lý khác (khóa, lên admin, xóa) giữ nguyên
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

  if (loading) return <Spinner size="xl" mt={10} />;

  return (
    <Box>
      <Heading size="lg" mb={6}>👥 Quản lý người dùng</Heading>
      <Box overflowX="auto">
        <Table.Root variant="simple">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Avatar</Table.ColumnHeader>
              <Table.ColumnHeader>Họ tên</Table.ColumnHeader>
              <Table.ColumnHeader>Email</Table.ColumnHeader>
              <Table.ColumnHeader>Số điện thoại</Table.ColumnHeader>
              <Table.ColumnHeader>Vai trò</Table.ColumnHeader>
              <Table.ColumnHeader>Trạng thái</Table.ColumnHeader>
              <Table.ColumnHeader>Hành động</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map(user => {
              const isCurrentUser = currentUser?.email === user.email;
              const canEdit = !isCurrentUser;
              const canBlock = !isCurrentUser && user.role !== 'admin';
              const canPromote = !isCurrentUser && user.role !== 'admin';
              const canDelete = !isCurrentUser && user.role !== 'admin';

              return (
                <Table.Row key={user._id}>
                  <Table.Cell>
                    <Avatar.Root size="sm">
                      <Avatar.Fallback name={user.fullName} />
                      <Avatar.Image src={user.avatar} />
                    </Avatar.Root>
                  </Table.Cell>
                  <Table.Cell>{user.fullName}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.phoneNumber || '---'}</Table.Cell>
                  <Table.Cell>
                    <Badge colorScheme={user.role === 'admin' ? 'purple' : 'gray'}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge colorScheme={user.isBlocked ? 'red' : 'green'}>
                      {user.isBlocked ? 'Bị khóa' : 'Hoạt động'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Stack direction="row" gap={2}>
                      {canEdit ? (
                        <Button size="sm" leftIcon={<FaEdit />} colorScheme="blue" onClick={() => openEditModal(user)}>
                          Sửa
                        </Button>
                      ) : (
                        <Button size="sm" leftIcon={<FaUserEdit />} colorScheme="gray" as={Link} to="/admin/settings">
                          Sửa hồ sơ
                        </Button>
                      )}
                      {canBlock && (
                        <Button
                          size="sm"
                          leftIcon={user.isBlocked ? <FaLockOpen /> : <FaLock />}
                          colorScheme={user.isBlocked ? 'green' : 'red'}
                          onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                        >
                          {user.isBlocked ? 'Mở khóa' : 'Khóa'}
                        </Button>
                      )}
                      {canPromote && (
                        <Button
                          size="sm"
                          leftIcon={<FaUserShield />}
                          colorScheme="purple"
                          onClick={() => handlePromote(user._id)}
                        >
                          Lên Admin
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          size="sm"
                          leftIcon={<FaTrash />}
                          colorScheme="red"
                          onClick={() => handleDelete(user._id)}
                        >
                          Xóa
                        </Button>
                      )}
                    </Stack>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* Modal sửa thông tin */}
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
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Số điện thoại</Field.Label>
                    <Input
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                    />
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