import React, { useState } from "react";
import {
    Box,
    Button,
    Container,
    Heading,
    VStack,
    HStack,
    Input,
    Text,
    SimpleGrid,
    Field, // Dùng thay cho FormControl, FormLabel
    NativeSelect, // Dùng thay cho Select cũ trong v3
    Stack,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster"; // Chakra v3 sử dụng toaster thay cho useToast
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { RedirectToSignIn, SignedIn, SignedOut, SignIn, useUser } from "@clerk/clerk-react";
import Navbar from "@/components/users/Navbar";
import axios from "axios";

const CreatePropertyPage = () => {
    const { user } = useUser();

    const [images, setImages] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        type: "Buy",
        propertyType: "",
        price: "",
        area: "",
        province: "",
        district: "",
        address: "",
    });

    const [description, setDescription] = useState("");

    const removeImage = (urlToRemove) => {
        setImages(images.filter((url) => url !== urlToRemove))
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalData = {
            ...formData,
            description,
            images: images,
            userId: user?.id,
            location: {
                province: formData.province,
                district: formData.district,
                address: formData.address
            }
        };

        try {
            const response = await axios.post("http://localhost:5000/api/properties/create", finalData);

            if (response.data.success) {
                toaster.create({
                    title: "Thành công!",
                    description: "Tin đăng của bạn đang chờ duyệt.",
                    type: "success",
                });

                setFormData({
                    title: "",
                    type: "Buy",
                    propertyType: "",
                    price: "",
                    area: "",
                    province: "",
                    district: "",
                    address: "",
                });

                setDescription("");
                setImages([]);

                e.target.reset();
            }
        } catch (error) {
            console.error("Error creating property:", error);

            const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";

            toaster.create({
                title: "Lỗi",
                description: errorMessage,
                type: "error",
            })
        }

        console.log("Dữ liệu gửi lên Backend:", finalData);
    };

    const handleUpload = () => {
        window.cloudinary.openUploadWidget(
            {
                cloudName: "dz7vj9kzg",
                uploadPreset: "RealEstatePro",
                multiple: true,
                sources: ["local", "url", "camera"],
            },
            (error, result) => {
                if (!error && result && result.event === "success") {
                    // Thêm URL ảnh mới vào mảng images hiện tại
                    setImages((prev) => [...prev, result.info.secure_url]);
                }
            }
        )
    }

    return (
        <>
            <SignedIn>
                <Box bg="gray.50" minH="100vh">
                    <Navbar />

                    <Container maxW="container.md" py={10}>
                        <Box bg="white" p={8} rounded="lg" shadow="md">
                            <Heading size="md" mb={6} color="red.600">Đăng tin mới</Heading>

                            <form onSubmit={handleSubmit}>
                                <Stack gap={5} align="stretch">
                                    {/* Field.Root thay thế cho FormControl */}
                                    <Field.Root required>
                                        <Field.Label fontWeight="600">Tiêu đề</Field.Label>
                                        <Input
                                            name="title"
                                            placeholder="VD: Căn hộ Vinhomes 2PN view biển"
                                            variant="outline"
                                            onChange={handleChange}
                                        />
                                    </Field.Root>

                                    <SimpleGrid columns={2} gap={4}>
                                        <Field.Root required>
                                            <Field.Label fontWeight="600">Hình thức</Field.Label>
                                            <NativeSelect.Root>
                                                <NativeSelect.Field name="type" onChange={handleChange}>
                                                    <option value="Buy">Cần bán</option>
                                                    <option value="Rent">Cho thuê</option>
                                                </NativeSelect.Field>
                                            </NativeSelect.Root>
                                        </Field.Root>

                                        <Field.Root required>
                                            <Field.Label fontWeight="600">Loại bất động sản</Field.Label>
                                            <NativeSelect.Root>
                                                <NativeSelect.Field name="propertyType" onChange={handleChange}>
                                                    <option value="">Chọn loại</option>
                                                    <option value="Apartment">Căn hộ</option>
                                                    <option value="House">Nhà phố</option>
                                                    <option value="Land">Đất nền</option>
                                                </NativeSelect.Field>
                                            </NativeSelect.Root>
                                        </Field.Root>
                                    </SimpleGrid>

                                    <SimpleGrid columns={2} gap={4}>
                                        <Field.Root required>
                                            <Field.Label fontWeight="600">Giá (VNĐ)</Field.Label>
                                            <Input name="price" type="number" placeholder="Ví dụ: 2000000000" onChange={handleChange} />
                                        </Field.Root>
                                        <Field.Root required>
                                            <Field.Label fontWeight="600">Diện tích (m²)</Field.Label>
                                            <Input name="area" type="number" placeholder="Ví dụ: 70" onChange={handleChange} />
                                        </Field.Root>
                                    </SimpleGrid>

                                    <Box border="1px solid" borderColor="gray.100" p={4} rounded="md" bg="gray.50">
                                        <Text fontWeight="bold" mb={3} fontSize="sm">Địa chỉ bất động sản</Text>
                                        <SimpleGrid columns={2} gap={3} mb={3}>
                                            <Input name="province" placeholder="Tỉnh/Thành" bg="white" onChange={handleChange} />
                                            <Input name="district" placeholder="Quận/Huyện" bg="white" onChange={handleChange} />
                                        </SimpleGrid>
                                        <Input name="address" placeholder="Địa chỉ chi tiết" bg="white" onChange={handleChange} />
                                    </Box>

                                    <Field.Root>
                                        <Field.Label fontWeight="600">Hình ảnh bất động sản ({images.length})</Field.Label>

                                        {/* Nút bấm mở trình upload */}
                                        <Button variant="outline" colorPalette="blue" onClick={handleUpload} mb={4}>
                                            Tải ảnh lên
                                        </Button>

                                        {/* Hiển thị danh sách ảnh đã chọn để người dùng xem trước */}
                                        <SimpleGrid columns={4} gap={2}>
                                            {images.map((url, index) => (
                                                <Box key={index} position="relative" rounded="md" overflow="hidden" border="1px solid" borderColor="gray.200">
                                                    <img src={url} alt="property" style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                                                    <Button
                                                        size="xs"
                                                        colorPalette="red"
                                                        position="absolute"
                                                        top={0}
                                                        right={0}
                                                        onClick={() => removeImage(url)}
                                                    >
                                                        X
                                                    </Button>
                                                </Box>
                                            ))}
                                        </SimpleGrid>
                                    </Field.Root>

                                    <Field.Root required>
                                        <Field.Label fontWeight="600">Mô tả chi tiết</Field.Label>
                                        <Box w={"full"} bg="white" border="1px solid" borderColor="gray.200" rounded="md">
                                            <ReactQuill
                                                theme="snow"
                                                value={description}
                                                onChange={setDescription}
                                                style={{ height: '400px', marginBottom: '45px', width: '100%' }}
                                            />
                                        </Box>
                                    </Field.Root>

                                    <Button
                                        type="submit"
                                        bg="red.600"
                                        color="white"
                                        size="lg"
                                        w="full"
                                        _hover={{ bg: "red.700" }}
                                        mt={4}
                                    >
                                        Tiếp tục đăng tin
                                    </Button>
                                </Stack>
                            </form>
                        </Box>
                    </Container>
                </Box>
            </SignedIn>

            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
};

export default CreatePropertyPage;