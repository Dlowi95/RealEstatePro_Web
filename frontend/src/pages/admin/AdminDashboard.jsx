import { useEffect, useMemo, useState } from 'react';
import { 
  Box,
  SimpleGrid,
  Text,
  Heading,
  Badge,
  Spinner,
  Table,
  Flex,
  HStack,
  Button,
  Avatar,
  Input,
  Stack,
} from '@chakra-ui/react';

import { useAuthContext } from '../../context/AuthContext';
import { toaster } from '../../components/ui/toaster';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const formatMoney = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return '0';
  return n.toLocaleString();
};

export default function AdminDashboard() {
  const { isAdmin, authAxios } = useAuthContext();

  const [stats, setStats] = useState({ totalUsers: 0, adminCount: 0, userCount: 0 });
  const [areaStats, setAreaStats] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // current approved properties
  const [currentProps, setCurrentProps] = useState([]);
  const [propsLoading, setPropsLoading] = useState(true);

  // edit dialog
  const [editingProp, setEditingProp] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    price: '',
    area: '',
    contactPhone: '',
  });
  const [isEditOpen, setIsEditOpen] = useState(false);

  const COLORS = ['#3182CE', '#63B3ED'];

  const pieData = useMemo(
    () => [
      { name: 'Admin', value: stats.adminCount },
      { name: 'Người dùng', value: stats.userCount },
    ],
    [stats.adminCount, stats.userCount]
  );

  const fetchStatsAndArea = async (client) => {
    const [statsRes, areaRes] = await Promise.all([
      client.get('/api/admin/stats'),
      client.get('/api/admin/stats/area'),
    ]);
    setStats(statsRes.data);
    setAreaStats(areaRes.data.stats || []);
  };

  const fetchCurrentProps = async (client) => {
    const res = await client.get('/api/admin/properties/current');
    setCurrentProps(res.data.properties || []);
  };

  useEffect(() => {
    const run = async () => {
      if (!isAdmin) return;
      setLoading(true);
      setPropsLoading(true);
      try {
        const client = await authAxios();
        await Promise.all([fetchStatsAndArea(client), fetchCurrentProps(client)]);
      } catch (err) {
        setError(err.message);
        toaster.create({ title: 'Lỗi tải dữ liệu', type: 'error' });
      } finally {
        setLoading(false);
        setPropsLoading(false);
      }
    };
    run();
  }, [isAdmin, authAxios]);

  const openEdit = (prop) => {
    setEditingProp(prop);
    setEditForm({
      title: prop.title || '',
      price: prop.price ?? '',
      area: prop.area ?? '',
      contactPhone: prop.contactPhone || '',
    });
    setIsEditOpen(true);
  };

  const refreshCurrentProps = async () => {
    const client2 = await authAxios();
    await fetchCurrentProps(client2);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa tin này?')) return;
    try {
      const client = await authAxios();
      await client.delete(`/api/admin/properties/current/${id}`);
      toaster.create({ title: 'Đã xóa tin', type: 'success' });
      await refreshCurrentProps();
    } catch (err) {
      toaster.create({ title: 'Lỗi khi xóa tin', type: 'error' });
    }
  };

  const handleEditSave = async () => {
    if (!editingProp) return;
    try {
      const client = await authAxios();
      await client.put(`/api/admin/properties/current/${editingProp._id}`, {
        title: editForm.title,
        price: editForm.price,
        area: editForm.area,
        contactPhone: editForm.contactPhone,
      });
      toaster.create({ title: 'Cập nhật thành công', type: 'success' });
      setIsEditOpen(false);
      await refreshCurrentProps();
    } catch (err) {
      toaster.create({ title: 'Lỗi cập nhật', type: 'error' });
    }
  };

  if (loading) return <Spinner size="xl" mt={10} />;
  if (error) return <Text color="red.500">Lỗi: {error}</Text>;

  return (
    <Box>
      <Flex align="center" justify="space-between" mb={6}>
        <Heading size="lg">📌 Tổng quan</Heading>
      </Flex>

      <SimpleGrid gap={4} columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Box p={5} bg="white" borderRadius="lg" shadow="sm">
          <Text fontSize="sm" color="gray.500">Tổng người dùng</Text>
          <Heading size="2xl">{stats.totalUsers}</Heading>
          <Text fontSize="sm">Admin: {stats.adminCount} | User: {stats.userCount}</Text>
        </Box>

        <Box p={5} bg="white" borderRadius="lg" shadow="sm">
          <Text fontSize="sm" color="gray.500">Tin đã duyệt</Text>
          <Heading size="2xl" color="green.500">{areaStats.reduce((s, i) => s + i.count, 0)}</Heading>
        </Box>

        <Box p={5} bg="white" borderRadius="lg" shadow="sm">
          <Text fontSize="sm" color="gray.500">Khu vực nhiều tin nhất</Text>
          <Heading size="md" mt={2}>{areaStats[0]?._id || '---'}</Heading>
          <Text fontSize="sm">{areaStats[0]?.count || 0} tin</Text>
        </Box>
      </SimpleGrid>

      <SimpleGrid gap={6} columns={{ base: 1, md: 2 }} spacing={6}>
        <Box bg="white" p={4} borderRadius="lg" shadow="sm">
          <Heading size="md" mb={4}>📊 Số lượng tin theo tỉnh/thành</Heading>
          <BarChart width={450} height={300} data={areaStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3182CE" />
          </BarChart>
        </Box>

        <Box bg="white" p={4} borderRadius="lg" shadow="sm">
          <Heading size="md" mb={4}>🥧 Tỉ lệ người dùng</Heading>
          <PieChart width={400} height={300}>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </Box>
      </SimpleGrid>

      <Box mt={8} bg="white" p={4} borderRadius="lg" shadow="sm">
        <Heading size="md" mb={4}>🏆 Top khu vực nhiều tin</Heading>
        <Table.Root variant="simple">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader padding="3">Khu vực</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right" padding="3">Số lượng tin</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {areaStats.map((area) => (
              <Table.Row key={area._id}>
                <Table.Cell padding="3">
                  <Badge colorScheme="blue">{area._id}</Badge>
                </Table.Cell>
                <Table.Cell textAlign="right" padding="3">{area.count}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      <Box mt={6} bg="white" p={4} borderRadius="lg" shadow="sm">
        <Heading size="md" mb={4}>📌 Các bài đăng đang công khai (approved)</Heading>

        {propsLoading ? (
          <Spinner mt={2} />
        ) : currentProps.length === 0 ? (
          <Text>Không có tin approved.</Text>
        ) : (
          <Table.Root variant="line" size="sm">
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader py={3} px={4}>Tiêu đề</Table.ColumnHeader>
                <Table.ColumnHeader py={3} px={4}>Loại</Table.ColumnHeader>
                <Table.ColumnHeader py={3} px={4} textAlign="right">Giá</Table.ColumnHeader>
                <Table.ColumnHeader py={3} px={4}>Diện tích</Table.ColumnHeader>
                <Table.ColumnHeader py={3} px={4}>Người đăng</Table.ColumnHeader>
                <Table.ColumnHeader py={3} px={4} textAlign="center">Hành động</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {currentProps.map((prop) => (
                <Table.Row
                  key={prop._id}
                  _hover={{ bg: 'gray.50' }}
                  transition="background 0.2s"
                >
                  <Table.Cell px={4} py={2} fontWeight="medium">{prop.title}</Table.Cell>
                  <Table.Cell px={4} py={2}>
                    <Badge colorScheme={prop.type === 'Buy' ? 'green' : 'blue'} variant="solid" borderRadius="full" px={2}>
                      {prop.type === 'Buy' ? 'Mua' : 'Thuê'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell px={4} py={2} textAlign="right">
                    {formatMoney(prop.price)} VNĐ
                  </Table.Cell>
                  <Table.Cell px={4} py={2}>{prop.area} m²</Table.Cell>
                  <Table.Cell px={4} py={2}>
                    <HStack gap={2}>
                      <Avatar.Root size="xs">
                        <Avatar.Fallback name={prop.user?.fullName || prop.user?.email || prop.userId || ''} />
                        <Avatar.Image src={prop.user?.avatar} />
                      </Avatar.Root>
                      <Text fontSize="sm" noOfLines={1} maxW="180px">
                        {prop.user?.fullName || prop.user?.email || prop.userId || 'Không rõ'}
                      </Text>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell px={4} py={2} textAlign="center">
                    <HStack gap={2} justify="center">
                      <Button size="xs" colorPalette="yellow" variant="solid" onClick={() => openEdit(prop)}>
                        Sửa
                      </Button>
                      <Button size="xs" colorPalette="red" variant="solid" onClick={() => handleDelete(prop._id)}>
                        Xóa
                      </Button>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Box>

      {isEditOpen && (
        <Box
          position="fixed"
          inset={0}
          bg="blackAlpha.600"
          zIndex={1400}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box
            bg="white"
            borderRadius="lg"
            width="100%"
            maxW="560px"
            boxShadow="lg"
            p={5}
          >
            <Heading size="md" mb={4}>Chỉnh sửa tin</Heading>

            <Stack gap={4}>
              <Box>
                <Text mb={1} fontWeight="medium">Tiêu đề</Text>
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </Box>

              <Box>
                <Text mb={1} fontWeight="medium">Giá (VNĐ)</Text>
                <Input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                />
              </Box>

              <Box>
                <Text mb={1} fontWeight="medium">Diện tích (m²)</Text>
                <Input
                  type="number"
                  value={editForm.area}
                  onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                />
              </Box>

              <Box>
                <Text mb={1} fontWeight="medium">SĐT liên hệ</Text>
                <Input
                  value={editForm.contactPhone}
                  onChange={(e) => setEditForm({ ...editForm, contactPhone: e.target.value })}
                />
              </Box>
            </Stack>

            <HStack justify="flex-end" mt={6} gap={3}>
              <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Hủy</Button>
              <Button colorScheme="blue" onClick={handleEditSave}>Lưu</Button>
            </HStack>
          </Box>
        </Box>
      )}

    </Box>
  );
}

