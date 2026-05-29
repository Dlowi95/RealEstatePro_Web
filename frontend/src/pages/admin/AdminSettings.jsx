import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Avatar,
  Button,
  SimpleGrid,
  Card,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useAuthContext } from "../../context/AuthContext";
import { toaster } from "../../components/ui/toaster";
import { FaSave, FaArrowLeft, FaSun, FaMoon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "../../components/ui/color-mode";

export default function AdminSettings() {
  const { authAxios, user: currentUser, fetchCurrentUser } = useAuthContext();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || "");
      setPhoneNumber(currentUser.phoneNumber || "");
    }
  }, [currentUser]);

  const handleUpdate = async () => {
    if (!currentUser?._id) return;
    setLoading(true);
    try {
      const client = await authAxios();
      await client.put(`/api/admin/users/${currentUser._id}`, {
        fullName,
        phoneNumber,
      });
      toaster.create({ title: "Cập nhật thành công!", type: "success" });
      if (fetchCurrentUser) await fetchCurrentUser();
      else setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      toaster.create({
        title: "Lỗi cập nhật",
        description: err.response?.data?.message || err.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box color="fg.default">
      <Heading size="lg" mb={6} color="fg.default">
        ⚙️ Cài đặt tài khoản
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} gap={6}>
        <Card.Root bg="bg.panel" borderColor="border.default">
          <Card.Header>
            <Heading size="md" color="fg.default">
              Thông tin cá nhân
            </Heading>
          </Card.Header>
          <Card.Body>
            <VStack align="stretch" spacing={4}>
              <HStack spacing={4}>
                <Avatar.Root size="lg">
                  <Avatar.Fallback name={currentUser?.fullName || "Admin"} />
                  <Avatar.Image src={currentUser?.avatar} />
                </Avatar.Root>
                <Box>
                  <Text fontWeight="bold" fontSize="lg" color="fg.default">
                    {currentUser?.fullName}
                  </Text>
                  <Text color="fg.muted">{currentUser?.email}</Text>
                </Box>
              </HStack>
              <Stack spacing={3}>
                <Input
                  placeholder="Họ và tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  bg="bg.muted"
                  color="fg.default"
                  borderColor="border.default"
                />
                <Input
                  placeholder="Số điện thoại"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  bg="bg.muted"
                  color="fg.default"
                  borderColor="border.default"
                />
              </Stack>
              <Button
                colorPalette="blue"
                onClick={handleUpdate}
                loading={loading}
              >
                <FaSave style={{ marginRight: "8px" }} />
                Cập nhật thông tin
              </Button>
            </VStack>
          </Card.Body>
        </Card.Root>

        <Card.Root bg="bg.panel" borderColor="border.default">
          <Card.Header>
            <Heading size="md" color="fg.default">
              Hành động
            </Heading>
          </Card.Header>
          <Card.Body>
            <VStack align="stretch" spacing={4}>
              <Button
                colorPalette={colorMode === "dark" ? "orange" : "purple"}
                variant="solid"
                onClick={toggleColorMode}
              >
                {colorMode === "dark" ? (
                  <FaSun style={{ marginRight: "8px" }} />
                ) : (
                  <FaMoon style={{ marginRight: "8px" }} />
                )}
                {colorMode === "dark"
                  ? "Chuyển sang Chế độ sáng"
                  : "Chuyển sang Chế độ tối"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                color="fg.default"
                _hover={{ bg: "bg.muted" }}
              >
                <FaArrowLeft style={{ marginRight: "8px" }} />
                Về trang chủ
              </Button>
            </VStack>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>
    </Box>
  );
}
