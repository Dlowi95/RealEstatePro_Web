import { useEffect, useMemo, useState } from "react";
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
} from "@chakra-ui/react";

import { useAuthContext } from "../../context/AuthContext";
import { toaster } from "../../components/ui/toaster";
import { useColorMode } from "../../components/ui/color-mode";
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
} from "recharts";

const formatMoney = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString();
};

export default function AdminDashboard() {
  const { isAdmin, authAxios } = useAuthContext();
  const { colorMode } = useColorMode();

  const [stats, setStats] = useState({
    totalUsers: 0,
    adminCount: 0,
    userCount: 0,
  });
  const [areaStats, setAreaStats] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentProps, setCurrentProps] = useState([]);
  const [propsLoading, setPropsLoading] = useState(true);

  const [editingProp, setEditingProp] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    price: "",
    area: "",
    contactPhone: "",
  });
  const [isEditOpen, setIsEditOpen] = useState(false);

  const COLORS = ["#E65C00", "#FF944D"];

  const pieData = useMemo(
    () => [
      { name: "Admin", value: stats.adminCount },
      { name: "Người dùng", value: stats.userCount },
    ],
    [stats.adminCount, stats.userCount],
  );

  const fetchStatsAndArea = async (client) => {
    const [statsRes, areaRes] = await Promise.all([
      client.get("/api/admin/stats"),
      client.get("/api/admin/stats/area"),
    ]);
    setStats(statsRes.data);
    setAreaStats(areaRes.data.stats || []);
  };

  const fetchCurrentProps = async (client) => {
    const res = await client.get("/api/admin/properties/current");
    setCurrentProps(res.data.properties || []);
  };

  useEffect(() => {
    const run = async () => {
      if (!isAdmin) return;
      setLoading(true);
      setPropsLoading(true);
      try {
        const client = await authAxios();
        await Promise.all([
          fetchStatsAndArea(client),
          fetchCurrentProps(client),
        ]);
      } catch (err) {
        setError(err.message);
        toaster.create({ title: "Lỗi tải dữ liệu", type: "error" });
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
      title: prop.title || "",
      price: prop.price ?? "",
      area: prop.area ?? "",
      contactPhone: prop.contactPhone || "",
    });
    setIsEditOpen(true);
  };

  const refreshCurrentProps = async () => {
    const client2 = await authAxios();
    await fetchCurrentProps(client2);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tin này?")) return;
    try {
      const client = await authAxios();
      await client.delete(`/api/admin/properties/current/${id}`);
      toaster.create({ title: "Đã xóa tin", type: "success" });
      await refreshCurrentProps();
    } catch (err) {
      toaster.create({ title: "Lỗi khi xóa tin", type: "error" });
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
      toaster.create({ title: "Cập nhật thành công", type: "success" });
      setIsEditOpen(false);
      await refreshCurrentProps();
    } catch (err) {
      toaster.create({ title: "Lỗi cập nhật", type: "error" });
    }
  };

  if (loading) return <Spinner size="xl" mt={10} />;
  if (error) return <Text color="red.500">Lỗi: {error}</Text>;

  const chartTooltipContentStyle = {
    backgroundColor: colorMode === "dark" ? "#2d3748" : "#ffffff",
    borderColor: colorMode === "dark" ? "#4a5568" : "#e2e8f0",
    color: colorMode === "dark" ? "#ffffff" : "#000000",
  };

  return (
    <Box color="fg.default">
      <Flex align="center" justify="space-between" mb={6}>
        <Heading size="lg" color="fg.default">
          📌 Tổng quan
        </Heading>
      </Flex>

      <SimpleGrid gap={4} columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Box
          p={5}
          bg="bg.panel"
          borderRadius="lg"
          shadow="sm"
          borderColor="border.default"
          borderWidth="1px"
        >
          <Text fontSize="sm" color="fg.muted">
            Tổng người dùng
          </Text>
          <Heading size="2xl" color="fg.default">
            {stats.totalUsers}
          </Heading>
          <Text fontSize="sm" color="fg.muted">
            Admin: {stats.adminCount} | User: {stats.userCount}
          </Text>
        </Box>

        <Box
          p={5}
          bg="bg.panel"
          borderRadius="lg"
          shadow="sm"
          borderColor="border.default"
          borderWidth="1px"
        >
          <Text fontSize="sm" color="fg.muted">
            Tin đã duyệt
          </Text>
          <Heading size="2xl" color="green.500">
            {areaStats.reduce((s, i) => s + i.count, 0)}
          </Heading>
        </Box>

        <Box
          p={5}
          bg="bg.panel"
          borderRadius="lg"
          shadow="sm"
          borderColor="border.default"
          borderWidth="1px"
        >
          <Text fontSize="sm" color="fg.muted">
            Khu vực nhiều tin nhất
          </Text>
          <Heading size="md" mt={2} color="fg.default">
            {areaStats[0]?._id || "---"}
          </Heading>
          <Text fontSize="sm" color="fg.muted">
            {areaStats[0]?.count || 0} tin
          </Text>
        </Box>
      </SimpleGrid>

      <SimpleGrid gap={6} columns={{ base: 1, md: 2 }} spacing={6}>
        <Box
          bg="bg.panel"
          p={4}
          borderRadius="lg"
          shadow="sm"
          borderColor="border.default"
          borderWidth="1px"
        >
          <Heading size="md" mb={4} color="fg.default">
            📊 Số lượng tin theo tỉnh/thành
          </Heading>
          <BarChart width={450} height={300} data={areaStats}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={colorMode === "dark" ? "#4a5568" : "#e2e8f0"}
            />
            <XAxis
              dataKey="_id"
              stroke={colorMode === "dark" ? "#a0aec0" : "#4a5568"}
            />
            <YAxis stroke={colorMode === "dark" ? "#a0aec0" : "#4a5568"} />
            <Tooltip contentStyle={chartTooltipContentStyle} />
            <Legend />
            <Bar dataKey="count" fill="#E65C00" />
          </BarChart>
        </Box>

        <Box
          bg="bg.panel"
          p={4}
          borderRadius="lg"
          shadow="sm"
          borderColor="border.default"
          borderWidth="1px"
        >
          <Heading size="md" mb={4} color="fg.default">
            🥧 Tỉ lệ người dùng
          </Heading>
          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip contentStyle={chartTooltipContentStyle} />
          </PieChart>
        </Box>
      </SimpleGrid>

      <Box
        my={8}
        bg="bg.panel"
        p={4}
        borderRadius="lg"
        shadow="sm"
        borderColor="border.default"
        borderWidth="1px"
      >
        <Heading size="md" mb={4} color="fg.default">
          🏆 Top khu vực nhiều tin
        </Heading>
        <Table.Root variant="simple" size="sm">
          <Table.Header>
            <Table.Row borderColor="border.default">
              <Table.ColumnHeader padding="3" color="fg.muted">
                Khu vực
              </Table.ColumnHeader>
              <Table.ColumnHeader
                textAlign="right"
                padding="3"
                color="fg.muted"
              >
                Số lượng tin
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {areaStats.map((area) => (
              <Table.Row
                key={area._id}
                borderColor="border.default"
                _hover={{ bg: "bg.muted" }}
              >
                <Table.Cell padding="3">
                  <Badge colorPalette="orange" variant="solid">
                    {area._id}
                  </Badge>
                </Table.Cell>
                <Table.Cell textAlign="right" padding="3" color="fg.default">
                  {area.count}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
}
