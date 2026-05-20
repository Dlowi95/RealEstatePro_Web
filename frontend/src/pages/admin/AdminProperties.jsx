import { useState, useEffect } from "react";
import { Box, Heading, Badge, Button, Spinner, Table, Avatar } from "@chakra-ui/react";
import { useAuthContext } from "../../context/AuthContext";
import { toaster } from "../../components/ui/toaster";
import { FaCheck, FaEyeSlash } from "react-icons/fa";

export default function AdminProperties() {
  const { authAxios, isAdmin } = useAuthContext();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingProps = async () => {
    try {
      const client = await authAxios();
      const res = await client.get("/api/admin/properties/pending");
      setProperties(res.data.properties);
    } catch (err) {
      toaster.create({ title: "Lỗi tải dữ liệu", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchPendingProps();
  }, [isAdmin]);

  const handleApprove = async (id) => {
    try {
      const client = await authAxios();
      await client.put(`/api/admin/properties/${id}/approve`);
      toaster.create({ title: "Đã duyệt tin", type: "success" });
      fetchPendingProps();
    } catch (err) {
      toaster.create({ title: "Lỗi duyệt tin", type: "error" });
    }
  };

  const handleToggleHide = async (id) => {
    try {
      const client = await authAxios();
      await client.put(`/api/admin/properties/${id}/toggle-hide`);
      toaster.create({ title: "Đã ẩn/hiện tin", type: "success" });
      fetchPendingProps();
    } catch (err) {
      toaster.create({ title: "Lỗi cập nhật", type: "error" });
    }
  };

  if (loading) return <Spinner size="xl" mt={10} />;

  return (
    <Box>
      <Heading size="lg" mb={6}>
        ⏳ Duyệt tin đăng ({properties.length})
      </Heading>
      {properties.length === 0 ? (
        <Box p={4} bg="green.50" borderRadius="md">
          Không có tin chờ duyệt.
        </Box>
      ) : (
        <Box overflowX="auto">
          <Table.Root variant="simple">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Tiêu đề</Table.ColumnHeader>
                <Table.ColumnHeader>Loại</Table.ColumnHeader>
                <Table.ColumnHeader>Giá</Table.ColumnHeader>
                <Table.ColumnHeader>Diện tích</Table.ColumnHeader>
                <Table.ColumnHeader>Người đăng</Table.ColumnHeader>
                <Table.ColumnHeader>Hành động</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {properties.map((prop) => (
                <Table.Row key={prop._id}>
                  <Table.Cell fontWeight="bold">{prop.title}</Table.Cell>
                  <Table.Cell>
                    <Badge colorScheme={prop.type === "Buy" ? "green" : "blue"}>
                      {prop.type === "Buy" ? "Mua" : "Thuê"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{prop.price.toLocaleString()} VNĐ</Table.Cell>
                  <Table.Cell>{prop.area} m²</Table.Cell>
                  <Table.Cell>
                    <Avatar.Root size="xs">
                      <Avatar.Fallback name={prop.userId?.fullName} />
                      <Avatar.Image src="url-anh-neu-co" />
                    </Avatar.Root>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      size="sm"
                      colorPalette="green"
                      onClick={() => handleApprove(prop._id)}
                      mr={2}
                    >
                      <FaCheck /> Duyệt
                    </Button>
                    <Button
                      size="sm"
                      colorPalette="red"
                      onClick={() => handleToggleHide(prop._id)}
                    >
                      <FaEyeSlash /> Ẩn
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Box>
  );
}
