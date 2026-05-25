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

      <Box my={8} bg="white" p={4} borderRadius="lg" shadow="sm">
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


    </Box>
  );
}

