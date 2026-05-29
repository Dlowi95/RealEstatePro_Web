import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Heading,
  Badge,
  Button,
  Spinner,
  Table,
  Avatar,
  Stack,
  Dialog,
  Portal,
  Input,
  Field,
  HStack,
  Card,
  Text,
  IconButton,
  Select,
  InputElement,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { toaster } from "../../components/ui/toaster";
import { Tooltip } from "../../components/ui/tooltip";
import {
  FaLock,
  FaLockOpen,
  FaUserShield,
  FaEdit,
  FaTrash,
  FaUserEdit,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
} from "react-icons/fa";

export default function AdminUsers() {
  const { authAxios, isAdmin, user: currentUser } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchUsers = useCallback(async () => {
    try {
      const client = await authAxios();
      const res = await client.get("/api/admin/users");
      setUsers(res.data.users);
    } catch (err) {
      toaster.create({ title: "Lỗi tải dữ liệu", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [authAxios]);

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin, fetchUsers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [users.length, searchQuery]);

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditName(user.fullName);
    setEditPhone(user.phoneNumber || "");
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      const client = await authAxios();
      await client.put(`/api/admin/users/${editingUser._id}`, {
        fullName: editName,
        phoneNumber: editPhone,
      });
      toaster.create({ title: "Cập nhật thành công", type: "success" });
      setIsEditOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toaster.create({
        title: "Lỗi cập nhật",
        description: err.response?.data?.message || err.message,
        type: "error",
      });
    }
  };

  const handleToggleBlock = async (userId, currentStatus) => {
    try {
      const client = await authAxios();
      await client.put(`/api/admin/users/${userId}/block`);
      toaster.create({
        title: currentStatus ? "Đã mở khóa" : "Đã khóa",
        type: "success",
      });
      fetchUsers();
    } catch (err) {
      toaster.create({ title: "Thao tác thất bại", type: "error" });
    }
  };

  const handlePromote = async (userId) => {
    try {
      const client = await authAxios();
      await client.post("/api/admin/promote", { userId });
      toaster.create({ title: "Đã nâng cấp lên Admin", type: "success" });
      fetchUsers();
    } catch (err) {
      toaster.create({ title: "Lỗi nâng cấp", type: "error" });
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      const client = await authAxios();
      await client.delete(`/api/admin/users/${userId}`);
      toaster.create({ title: "Đã xóa người dùng", type: "success" });
      fetchUsers();
    } catch (err) {
      toaster.create({ title: "Lỗi xóa", type: "error" });
    }
  };

  const filteredUsers = users.filter((user) =>
    user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  if (loading) return <Spinner size="xl" mt={10} />;

  return (
    <Box color="fg.default">
      <Heading
        size="lg"
        mb={6}
        display="flex"
        alignItems="center"
        gap={2}
        color="fg.default"
      >
        <span>👥</span> Quản lý người dùng
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
          placeholder="Tìm kiếm theo họ tên..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          bg="bg.muted"
          color="fg.default"
          borderColor="border.default"
          pl="10"
        />
      </Box>

      <Card.Root
        variant="outline"
        overflowX="auto"
        bg="bg.panel"
        borderColor="border.default"
      >
        <Table.Root variant="line" size="sm">
          <Table.Header>
            <Table.Row bg="bg.muted" borderColor="border.default">
              <Table.ColumnHeader py={3} px={4} color="fg.muted">
                Avatar
              </Table.ColumnHeader>
              <Table.ColumnHeader py={3} px={4} color="fg.muted">
                Họ tên
              </Table.ColumnHeader>
              <Table.ColumnHeader py={3} px={4} color="fg.muted">
                Email
              </Table.ColumnHeader>
              <Table.ColumnHeader py={3} px={4} color="fg.muted">
                Số điện thoại
              </Table.ColumnHeader>
              <Table.ColumnHeader py={3} px={4} color="fg.muted">
                Vai trò
              </Table.ColumnHeader>
              <Table.ColumnHeader py={3} px={4} color="fg.muted">
                Trạng thái
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
            {currentUsers.map((user) => {
              const isCurrentUser = currentUser?.email === user.email;
              const canEdit = !isCurrentUser;
              const canBlock = !isCurrentUser && user.role !== "admin";
              const canPromote = !isCurrentUser && user.role !== "admin";
              const canDelete = !isCurrentUser && user.role !== "admin";

              return (
                <Table.Row
                  key={user._id}
                  _hover={{ bg: "bg.muted" }}
                  borderColor="border.default"
                  transition="background 0.2s"
                >
                  <Table.Cell px={4} py={2}>
                    <Avatar.Root size="sm">
                      <Avatar.Fallback name={user.fullName} />
                      <Avatar.Image src={user.avatar} />
                    </Avatar.Root>
                  </Table.Cell>
                  <Table.Cell
                    px={4}
                    py={2}
                    fontWeight="medium"
                    color="fg.default"
                  >
                    {user.fullName}
                  </Table.Cell>
                  <Table.Cell px={4} py={2} color="fg.default">
                    {user.email}
                  </Table.Cell>
                  <Table.Cell px={4} py={2} color="fg.default">
                    {user.phoneNumber || "—"}
                  </Table.Cell>
                  <Table.Cell px={4} py={2}>
                    <Badge
                      colorPalette={user.role === "admin" ? "purple" : "gray"}
                      variant="solid"
                      borderRadius="full"
                      px={2}
                    >
                      {user.role === "admin" ? "Admin" : "User"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell px={4} py={2}>
                    <Badge
                      colorPalette={user.isBlocked ? "red" : "green"}
                      variant="subtle"
                      borderRadius="full"
                      px={3}
                      py={1}
                      display="inline-flex"
                      alignItems="center"
                      gap={2}
                    >
                      <Box
                        w="8px"
                        h="8px"
                        borderRadius="full"
                        bg={user.isBlocked ? "red.500" : "green.500"}
                      />
                      {user.isBlocked ? "Bị khóa" : "Hoạt động"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell px={4} py={2}>
                    <HStack gap={2} flexWrap="wrap">
                      {canEdit ? (
                        <Tooltip content="Chỉnh sửa thông tin">
                          <Button
                            size="xs"
                            colorPalette="blue"
                            variant="solid"
                            onClick={() => openEditModal(user)}
                          >
                            <FaEdit /> Sửa
                          </Button>
                        </Tooltip>
                      ) : (
                        <Tooltip content="Chỉnh sửa hồ sơ của bạn">
                          <Button
                            size="xs"
                            colorPalette="gray"
                            variant="solid"
                            as={Link}
                            to="/admin/settings"
                          >
                            <FaUserEdit /> Sửa hồ sơ
                          </Button>
                        </Tooltip>
                      )}
                      {canBlock && (
                        <Tooltip
                          content={
                            user.isBlocked
                              ? "Mở khóa người dùng"
                              : "Khóa người dùng"
                          }
                        >
                          <Button
                            size="xs"
                            colorPalette={user.isBlocked ? "green" : "red"}
                            variant="solid"
                            onClick={() =>
                              handleToggleBlock(user._id, user.isBlocked)
                            }
                          >
                            {user.isBlocked ? <FaLockOpen /> : <FaLock />}{" "}
                            {user.isBlocked ? "Mở khóa" : "Khóa"}
                          </Button>
                        </Tooltip>
                      )}
                      {canPromote && (
                        <Tooltip content="Nâng cấp lên quyền Admin">
                          <Button
                            size="xs"
                            colorPalette="purple"
                            variant="solid"
                            onClick={() => handlePromote(user._id)}
                          >
                            <FaUserShield /> Lên Admin
                          </Button>
                        </Tooltip>
                      )}
                      {canDelete && (
                        <Tooltip content="Xóa vĩnh viễn người dùng">
                          <Button
                            size="xs"
                            colorPalette="red"
                            variant="solid"
                            onClick={() => handleDelete(user._id)}
                          >
                            <FaTrash /> Xóa
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

      {filteredUsers.length > itemsPerPage && (
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

      <Dialog.Root
        open={isEditOpen}
        onOpenChange={(e) => setIsEditOpen(e.open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content
              bg="bg.panel"
              borderColor="border.default"
              color="fg.default"
            >
              <Dialog.Header color="fg.default">
                Chỉnh sửa người dùng
              </Dialog.Header>
              <Dialog.Body color="fg.default">
                <Stack gap={4}>
                  <Field.Root>
                    <Field.Label color="fg.default">Họ và tên</Field.Label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      bg="bg.muted"
                      color="fg.default"
                      borderColor="border.default"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label color="fg.default">Số điện thoại</Field.Label>
                    <Input
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+84"
                      bg="bg.muted"
                      color="fg.default"
                      borderColor="border.default"
                    />
                  </Field.Root>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  variant="ghost"
                  onClick={() => setIsEditOpen(false)}
                  color="fg.default"
                >
                  Hủy
                </Button>
                <Button colorPalette="blue" onClick={handleSaveEdit}>
                  Lưu
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}
