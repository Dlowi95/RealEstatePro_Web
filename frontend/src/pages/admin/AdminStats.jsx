import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Stack,
  Text,
  Input,
  HStack,
  Button,
  Table,
  Badge,
  Spinner,
  Avatar,
  InputElement,
} from "@chakra-ui/react";
import { useAuthContext } from "../../context/AuthContext";
import { toaster } from "../../components/ui/toaster";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const formatMoney = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString();
};

export default function AdminStats() {
  const { isAdmin, authAxios } = useAuthContext();
  const [currentProps, setCurrentProps] = useState([]);
  const [propsLoading, setPropsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [editingProp, setEditingProp] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    price: "",
    area: "",
    contactPhone: "",
  });

  const fetchCurrentProps = async (client) => {
    const res = await client.get("/api/admin/properties/current");
    setCurrentProps(res.data.properties || []);
  };

  useEffect(() => {
    const run = async () => {
      if (!isAdmin) return;
      setPropsLoading(true);
      try {
        const client = await authAxios();
        await fetchCurrentProps(client);
      } catch (err) {
        toaster.create({ title: "Lỗi tải dữ liệu tin đăng", type: "error" });
      } finally {
        setPropsLoading(false);
      }
    };
    run();
  }, [isAdmin, authAxios]);

  useEffect(() => {
    setCurrentPage(1);
  }, [currentProps.length, searchQuery, itemsPerPage]);

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
    const client = await authAxios();
    await fetchCurrentProps(client);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tin này?")) return;
    try {
      const client = await authAxios();
      await client.delete(`/api/admin/properties/current/${id}`);
      toaster.create({ title: "Đã xóa tin thành công", type: "success" });
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
      toaster.create({ title: "Lỗi cập nhật tin đăng", type: "error" });
    }
  };

  const filteredProps = currentProps.filter((prop) =>
    prop.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredProps.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProps = filteredProps.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  return (
    <>
      <Box
        mt={6}
        bg="bg.panel"
        p={4}
        borderRadius="lg"
        shadow="sm"
        my={6}
        color="fg.default"
        borderWidth="1px"
        borderColor="border.default"
      >
        <Heading size="md" mb={4} color="fg.default">
          📌 Các bài đăng đang công khai (approved)
        </Heading>

        <Box mb={4} maxW="400px" position="relative">
          <InputElement
            pointerEvents="none"
            position="absolute"
            top="50%"
            left="3"
            transform="translateY(-50%)"
            zIndex={1}
          >
            <FaSearch color="gray.400" />
          </InputElement>
          <Input
            placeholder="Tìm kiếm theo tiêu đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg="bg.muted"
            color="fg.default"
            borderColor="border.default"
            pl="10"
          />
        </Box>

        {propsLoading ? (
          <Spinner mt={2} />
        ) : filteredProps.length === 0 ? (
          <Text color="fg.muted">Không tìm thấy tin approved nào phù hợp.</Text>
        ) : (
          <>
            <Table.Root variant="line" size="sm">
              <Table.Header>
                <Table.Row bg="bg.muted" borderColor="border.default">
                  <Table.ColumnHeader py={3} px={4} color="fg.muted">
                    Tiêu đề
                  </Table.ColumnHeader>
                  <Table.ColumnHeader py={3} px={4} color="fg.muted">
                    Loại
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    py={3}
                    px={4}
                    textAlign="right"
                    color="fg.muted"
                  >
                    Giá
                  </Table.ColumnHeader>
                  <Table.ColumnHeader py={3} px={4} color="fg.muted">
                    Diện tích
                  </Table.ColumnHeader>
                  <Table.ColumnHeader py={3} px={4} color="fg.muted">
                    Người đăng
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    py={3}
                    px={4}
                    textAlign="center"
                    color="fg.muted"
                  >
                    Hành động
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {paginatedProps.map((prop) => (
                  <Table.Row
                    key={prop._id}
                    _hover={{ bg: "bg.muted" }}
                    borderColor="border.default"
                    transition="background 0.2s"
                  >
                    <Table.Cell
                      px={4}
                      py={2}
                      fontWeight="medium"
                      color="fg.default"
                    >
                      {prop.title}
                    </Table.Cell>
                    <Table.Cell px={4} py={2}>
                      <Badge
                        colorPalette={prop.type === "Buy" ? "green" : "blue"}
                        variant="solid"
                        borderRadius="full"
                        px={2}
                      >
                        {prop.type === "Buy" ? "Mua" : "Thuê"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell
                      px={4}
                      py={2}
                      textAlign="right"
                      color="fg.default"
                    >
                      {formatMoney(prop.price)} VNĐ
                    </Table.Cell>
                    <Table.Cell px={4} py={2} color="fg.default">
                      {prop.area} m²
                    </Table.Cell>
                    <Table.Cell px={4} py={2}>
                      <HStack gap={2}>
                        <Avatar.Root size="xs">
                          <Avatar.Fallback
                            name={
                              prop.user?.fullName ||
                              prop.user?.email ||
                              prop.userId ||
                              ""
                            }
                          />
                          <Avatar.Image src={prop.user?.avatar} />
                        </Avatar.Root>
                        <Text
                          fontSize="sm"
                          noOfLines={1}
                          maxW="180px"
                          color="fg.default"
                        >
                          {prop.user?.fullName ||
                            prop.user?.email ||
                            prop.userId ||
                            "Không rõ"}
                        </Text>
                      </HStack>
                    </Table.Cell>
                    <Table.Cell px={4} py={2} textAlign="center">
                      <HStack gap={2} justify="center">
                        <Button
                          size="xs"
                          colorPalette="yellow"
                          variant="solid"
                          onClick={() => openEdit(prop)}
                        >
                          Sửa
                        </Button>
                        <Button
                          size="xs"
                          colorPalette="red"
                          variant="solid"
                          onClick={() => handleDelete(prop._id)}
                        >
                          Xóa
                        </Button>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>

            {filteredProps.length > itemsPerPage && (
              <HStack justify="space-between" my={6} wrap="wrap" gap={4}>
                <HStack gap={2}>
                  <HStack gap={2}>
                    <Text fontSize="sm" color="fg.muted">
                      Hiển thị
                    </Text>
                    <HStack gap={1}>
                      {[5, 10, 20].map((num) => (
                        <Button
                          key={num}
                          size="xs"
                          variant={itemsPerPage === num ? "solid" : "outline"}
                          colorPalette={itemsPerPage === num ? "blue" : "gray"}
                          onClick={() => {
                            setItemsPerPage(num);
                            setCurrentPage(1);
                          }}
                        >
                          {num}
                        </Button>
                      ))}
                    </HStack>
                    <Text fontSize="sm" color="fg.muted">
                      mỗi trang
                    </Text>
                  </HStack>
                </HStack>

                <HStack gap={2}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    color="fg.default"
                  >
                    <FaChevronLeft style={{ marginRight: "4px" }} /> Trước
                  </Button>
                  <HStack gap={1}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          size="sm"
                          variant={currentPage === page ? "solid" : "ghost"}
                          colorPalette={currentPage === page ? "blue" : "gray"}
                          onClick={() => goToPage(page)}
                        >
                          {page}
                        </Button>
                      ),
                    )}
                  </HStack>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    color="fg.default"
                  >
                    Sau <FaChevronRight style={{ marginLeft: "4px" }} />
                  </Button>
                </HStack>
              </HStack>
            )}
          </>
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
            bg="bg.panel"
            borderColor="border.default"
            borderWidth="1px"
            borderRadius="lg"
            width="100%"
            maxW="560px"
            boxShadow="lg"
            p={5}
            color="fg.default"
          >
            <Heading size="md" mb={4} color="fg.default">
              Chỉnh sửa tin
            </Heading>

            <Stack gap={4}>
              <Box>
                <Text mb={1} fontWeight="medium" color="fg.default">
                  Tiêu đề
                </Text>
                <Input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  bg="bg.muted"
                  color="fg.default"
                  borderColor="border.default"
                />
              </Box>

              <Box>
                <Text mb={1} fontWeight="medium" color="fg.default">
                  Giá (VNĐ)
                </Text>
                <Input
                  type="number"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                  bg="bg.muted"
                  color="fg.default"
                  borderColor="border.default"
                />
              </Box>

              <Box>
                <Text mb={1} fontWeight="medium" color="fg.default">
                  Diện tích (m²)
                </Text>
                <Input
                  type="number"
                  value={editForm.area}
                  onChange={(e) =>
                    setEditForm({ ...editForm, area: e.target.value })
                  }
                  bg="bg.muted"
                  color="fg.default"
                  borderColor="border.default"
                />
              </Box>

              <Box>
                <Text mb={1} fontWeight="medium" color="fg.default">
                  SĐT liên hệ
                </Text>
                <Input
                  value={editForm.contactPhone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, contactPhone: e.target.value })
                  }
                  bg="bg.muted"
                  color="fg.default"
                  borderColor="border.default"
                />
              </Box>
            </Stack>

            <HStack justify="flex-end" mt={6} gap={3}>
              <Button
                variant="ghost"
                onClick={() => setIsEditOpen(false)}
                color="fg.default"
              >
                Hủy
              </Button>
              <Button colorPalette="blue" onClick={handleEditSave}>
                Lưu
              </Button>
            </HStack>
          </Box>
        </Box>
      )}
    </>
  );
}
