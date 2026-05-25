import { useState, useEffect, useCallback } from 'react';
import {
  Box, Heading, Badge, Button, Spinner, Table, Avatar,
  HStack, Card, Text, Dialog, Portal, Stack, Input, Field,
  Tabs
} from '@chakra-ui/react';
import { useAuthContext } from '../../context/AuthContext';
import { toaster } from '../../components/ui/toaster';
import { Tooltip } from '../../components/ui/tooltip';
import { FaCheck, FaEyeSlash, FaEye, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function AdminProperties() {
  const { authAxios, isAdmin } = useAuthContext();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('pending');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [viewingProperty, setViewingProperty] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [editingProperty, setEditingProperty] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', price: '', area: '', contactPhone: '' });
  const [isEditOpen, setIsEditOpen] = useState(false);

  const tabConfig = {
    pending: {
      label: 'Chờ duyệt',
      endpoint: '/api/admin/properties/pending',
    },
    hidden: {
      label: 'Tin ẩn',
      endpoint: '/api/admin/properties/hidden',
    },
    all: {
      label: 'Tất cả tin',
      endpoint: '/api/admin/properties/all',
    },
  };

  const fetchProperties = useCallback(async (tabKey) => {
    try {
      setLoading(true);
      const client = await authAxios();
      const res = await client.get(tabConfig[tabKey].endpoint);
      setProperties(res.data.properties || res.data.data || []);
    } catch (err) {
      toaster.create({ title: 'Lỗi tải dữ liệu', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [authAxios]);

  useEffect(() => {
    if (isAdmin) fetchProperties(selectedTab);
  }, [isAdmin, selectedTab, fetchProperties]);

  useEffect(() => {
    setCurrentPage(1);
  }, [properties.length]);

  const getPropertyUser = (prop) => {
    const user = prop.user || prop.userId;
    return typeof user === 'object' ? user : null;
  };

  const getDisplayName = (prop) => {
    const user = getPropertyUser(prop);
    if (user) return user.fullName || user.email || user._id || 'Không rõ';
    if (prop.userId && typeof prop.userId === 'string') return prop.userId;
    return 'Không rõ';
  };

  const getUserAvatarSrc = (prop) => {
    const user = getPropertyUser(prop);
    return user?.avatar;
  };

  const handleApprove = async (id) => {
    try {
      const client = await authAxios();
      await client.put(`/api/admin/properties/${id}/approve`);
      toaster.create({ title: 'Đã duyệt tin', type: 'success' });
      fetchProperties(selectedTab);
    } catch (err) {
      toaster.create({ title: 'Lỗi duyệt tin', type: 'error' });
    }
  };

  const handleToggleHide = async (id) => {
    try {
      const client = await authAxios();
      await client.put(`/api/admin/properties/${id}/toggle-hide`);
      toaster.create({ title: 'Đã ẩn/hiện tin', type: 'success' });
      fetchProperties(selectedTab);
    } catch (err) {
      toaster.create({ title: 'Lỗi cập nhật', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa tin này?')) return;
    try {
      const client = await authAxios();
      await client.delete(`/api/properties/delete/${id}`);
      toaster.create({ title: 'Đã xóa tin', type: 'success' });
      fetchProperties(selectedTab);
    } catch (err) {
      toaster.create({ title: 'Lỗi xóa tin', type: 'error' });
    }
  };

  const handleEdit = async () => {
    if (!editingProperty) return;
    try {
      const client = await authAxios();
      await client.put(`/api/properties/update/${editingProperty._id}`, {
        title: editForm.title,
        price: editForm.price,
        area: editForm.area,
        contactPhone: editForm.contactPhone,
      });
      toaster.create({ title: 'Cập nhật thành công', type: 'success' });
      setIsEditOpen(false);
      fetchProperties(selectedTab);
    } catch (err) {
      toaster.create({ title: 'Lỗi cập nhật', type: 'error' });
    }
  };

  const totalPages = Math.ceil(properties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = properties.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  if (loading) return <Spinner size="xl" mt={10} />;

  const tabItems = [
    { key: 'pending', label: 'Chờ duyệt' },
    { key: 'hidden', label: 'Tin ẩn' },
    { key: 'all', label: 'Tất cả tin' },
  ];

  return (
    <Box>
      <Heading size="lg" mb={4}>Quản lý tin đăng</Heading>
      
      {/* CẬP NHẬT: Sử dụng Tabs chuẩn v3 */}
      <Tabs.Root
        value={selectedTab}
        onValueChange={(e) => setSelectedTab(e.value)}
        colorPalette="blue"
        mb={4}
      >
        <Tabs.List>
          {tabItems.map((item) => (
            <Tabs.Trigger key={item.key} value={item.key}>
              {item.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>

      <Box mb={4}>
        <Text fontSize="md" fontWeight="semibold">
          {tabConfig[selectedTab].label} ({properties.length})
        </Text>
      </Box>

      {properties.length === 0 ? (
        <Box p={4} bg="green.50" borderRadius="md" color="green.800">
          Không có bài đăng trong mục này.
        </Box>
      ) : (
        <Card.Root variant="outline" overflowX="auto">
          <Table.Root variant="line" size="sm">
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader py={3} px={4}>Tiêu đề</Table.ColumnHeader>
                <Table.ColumnHeader py={3} px={4}>Loại</Table.ColumnHeader>
                <Table.ColumnHeader py={3} px={4}>Giá</Table.ColumnHeader>
                <Table.ColumnHeader py={3} px={4}>Diện tích</Table.ColumnHeader>
                <Table.ColumnHeader py={3} px={4}>Người đăng</Table.ColumnHeader>
                <Table.ColumnHeader py={3} px={4} textAlign="center">Hành động</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {currentProperties.map((prop) => (
                <Table.Row key={prop._id} _hover={{ bg: 'gray.50' }} transition="background 0.2s">
                  <Table.Cell px={4} py={2} fontWeight="medium">{prop.title}</Table.Cell>
                  <Table.Cell px={4} py={2}>
                    <Badge colorPalette={prop.type === 'Buy' ? 'green' : 'blue'} variant="solid" borderRadius="full" px={2}>
                      {prop.type === 'Buy' ? 'Mua' : 'Thuê'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell px={4} py={2}>{prop.price.toLocaleString()} VNĐ</Table.Cell>
                  <Table.Cell px={4} py={2}>{prop.area} m²</Table.Cell>
                  <Table.Cell px={4} py={2}>
                    <HStack gap={2}>
                      <Avatar.Root size="xs">
                        <Avatar.Fallback name={getDisplayName(prop)} />
                        <Avatar.Image src={getUserAvatarSrc(prop)} />
                      </Avatar.Root>
                      <Text fontSize="sm" noOfLines={1} maxW="180px">{getDisplayName(prop)}</Text>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell px={4} py={2}>
                    <HStack gap={2} flexWrap="wrap">
                      {prop.status === 'pending' && (
                        <Tooltip content="Duyệt tin">
                          <Button size="xs" colorPalette="green" variant="solid" onClick={() => handleApprove(prop._id)}>
                            <FaCheck /> Duyệt
                          </Button>
                        </Tooltip>
                      )}

                      <Tooltip content={prop.status === 'hidden' ? 'Hiện tin' : 'Ẩn tin'}>
                        <Button size="xs" colorPalette="orange" variant="solid" onClick={() => handleToggleHide(prop._id)}>
                          {prop.status === 'hidden' ? <FaEye /> : <FaEyeSlash />} {prop.status === 'hidden' ? 'Hiện' : 'Ẩn'}
                        </Button>
                      </Tooltip>
                      
                      <Tooltip content="Xem chi tiết">
                        <Button size="xs" colorPalette="blue" variant="solid" onClick={() => { setViewingProperty(prop); setIsViewOpen(true); }}>
                          <FaEye /> Xem
                        </Button>
                      </Tooltip>
                      
                      <Tooltip content="Chỉnh sửa">
                        <Button size="xs" colorPalette="yellow" variant="solid" onClick={() => { setEditingProperty(prop); setEditForm({ title: prop.title, price: prop.price, area: prop.area, contactPhone: prop.contactPhone || '' }); setIsEditOpen(true); }}>
                          <FaEdit /> Sửa
                        </Button>
                      </Tooltip>
                      
                      <Tooltip content="Xóa tin">
                        <Button size="xs" colorPalette="red" variant="solid" onClick={() => handleDelete(prop._id)}>
                          <FaTrash /> Xóa
                        </Button>
                      </Tooltip>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card.Root>
      )}

      {properties.length > itemsPerPage && (
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
                    colorPalette={itemsPerPage === num ? 'blue' : 'gray'}
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
            {/* CẬP NHẬT: Sửa đổi cách đặt Icon và đổi colorScheme thành colorPalette */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft /> Trước
            </Button>
            <HStack gap={1}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  size="sm"
                  variant={currentPage === page ? 'solid' : 'ghost'}
                  colorPalette={currentPage === page ? 'blue' : 'gray'}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </Button>
              ))}
            </HStack>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau <FaChevronRight />
            </Button>
          </HStack>
        </HStack>
      )}

      {/* Cấu trúc Dialog bên dưới đã chuẩn v3 sẵn nên giữ nguyên */}
      <Dialog.Root open={isViewOpen} onOpenChange={(e) => setIsViewOpen(e.open)} size="lg">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>Chi tiết tin đăng</Dialog.Header>
              <Dialog.Body>
                {viewingProperty && (
                  <Stack gap={3}>
                    <Text dangerouslySetInnerHTML={{ __html: `<strong>Tiêu đề:</strong> ${viewingProperty.title}` }} />
                    <Text dangerouslySetInnerHTML={{ __html: `<strong>Mô tả:</strong> ${viewingProperty.description}` }} />
                    <Text dangerouslySetInnerHTML={{ __html: `<strong>Loại giao dịch:</strong> ${viewingProperty.type === 'Buy' ? 'Mua' : 'Thuê'}` }} />
                    <Text dangerouslySetInnerHTML={{ __html: `<strong>Loại bất động sản:</strong> ${viewingProperty.propertyType}` }} />
                    <Text dangerouslySetInnerHTML={{ __html: `<strong>Giá:</strong> ${viewingProperty.price.toLocaleString()} VNĐ` }} />
                    <Text dangerouslySetInnerHTML={{ __html: `<strong>Diện tích:</strong> ${viewingProperty.area} m²` }} />
                    <Text dangerouslySetInnerHTML={{ __html: `<strong>Địa chỉ:</strong> ${viewingProperty.location?.address}, ${viewingProperty.location?.ward}, ${viewingProperty.location?.province}` }} />
                    <Text dangerouslySetInnerHTML={{ __html: `<strong>Số điện thoại liên hệ:</strong> ${viewingProperty.contactPhone}` }} />
                    <Text dangerouslySetInnerHTML={{ __html: `<strong>Người đăng:</strong> ${getDisplayName(viewingProperty)}` }} />
                    <Text dangerouslySetInnerHTML={{ __html: `<strong>Trạng thái:</strong> ${viewingProperty.status}` }} />
                    {viewingProperty.images?.length > 0 && (
                      <Box>
                        <strong>Hình ảnh:</strong>
                        <HStack gap={2} mt={2} flexWrap="wrap">
                          {viewingProperty.images.map((img, idx) => (
                            <img key={idx} src={img} alt={`Ảnh ${idx + 1}`} style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                          ))}
                        </HStack>
                      </Box>
                    )}
                  </Stack>
                )}
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="ghost" onClick={() => setIsViewOpen(false)}>Đóng</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Dialog.Root open={isEditOpen} onOpenChange={(e) => setIsEditOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>Chỉnh sửa tin đăng</Dialog.Header>
              <Dialog.Body>
                <Stack gap={4}>
                  <Field.Root>
                    <Field.Label>Tiêu đề</Field.Label>
                    <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Giá (VNĐ)</Field.Label>
                    <Input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Diện tích (m²)</Field.Label>
                    <Input type="number" value={editForm.area} onChange={(e) => setEditForm({ ...editForm, area: e.target.value })} />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Số điện thoại liên hệ</Field.Label>
                    <Input value={editForm.contactPhone} onChange={(e) => setEditForm({ ...editForm, contactPhone: e.target.value })} />
                  </Field.Root>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Hủy</Button>
                <Button colorPalette="blue" onClick={handleEdit}>Lưu</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}