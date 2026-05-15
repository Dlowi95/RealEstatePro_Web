import React, { useEffect, useState } from "react";
import { Box, Container, Heading, SimpleGrid, Text, Badge, Stack, Button, HStack } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import Navbar from "@/components/users/Navbar";

const ManagePropertiesPage = () => {
    const { user } = useUser();
    const [myProperties, setMyProperties] = useState([]);

    useEffect(() => {
        const fetchMyProperties = async () => {
            if (user?.id) {
                try {
                    const res = await axios.get(`http://localhost:5000/api/properties/user/${user.id}`);
                    setMyProperties(res.data.data);
                } catch (err) { console.error(err); }
            }
        };
        fetchMyProperties();
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case "approved": return "green";
            case "pending": return "orange";
            case "rejected": return "red";
            default: return "gray";
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài đăng này?")) {
            try {
                const res = await axios.delete(`http://localhost:5000/api/properties/delete/${id}`);
                if (res.data.success) {
                    // Cập nhật lại danh sách hiển thị sau khi xóa thành công
                    setMyProperties(myProperties.filter(p => p._id !== id));
                    toaster.create({ title: "Đã xóa bài đăng", type: "success" });
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <Box bg="gray.50" minH="100vh">
            <Navbar />
            <Container maxW="container.lg" py={10}>
                <Heading size="lg" mb={6}>Quản lý tin đăng của tôi</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                    {myProperties.map((prop) => (
                        <Box key={prop._id} p={5} bg="white" shadow="sm" rounded="lg" border="1px solid" borderColor="gray.100">
                            <Stack gap={3}>
                                <Box flex="1">
                                    <Badge colorPalette={getStatusColor(prop.status)} mb={2}>
                                        {prop.status === 'approved' ? 'Đã duyệt' : 'Đang chờ duyệt'}
                                    </Badge>
                                    <Heading size="sm" noOfLines={1}>{prop.title}</Heading>
                                    <Text fontSize="xs" color="gray.500" mt={1}>{prop.location.address}</Text>
                                </Box>
                                <Text fontWeight="bold" color="red.600">
                                    {new Intl.NumberFormat('vi-VN').format(prop.price)} VNĐ
                                </Text>
                            </Stack>

                            <HStack gap={2} mt={4}>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    as="a"
                                    href={`/edit-property/${prop._id}`}
                                >
                                    Sửa tin
                                </Button>
                                <Button
                                    size="sm"
                                    colorPalette="red"
                                    onClick={() => handleDelete(prop._id)}
                                >
                                    Xóa
                                </Button>
                            </HStack>
                        </Box>
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
};

export default ManagePropertiesPage;