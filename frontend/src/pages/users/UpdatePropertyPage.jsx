import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    Heading,
    Input,
    Text,
    SimpleGrid,
    Field,
    NativeSelect,
    Stack,
    Spinner,
    Center
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Navbar from "@/components/users/Navbar";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import vnAddressData from "../../../utils/full_json_generated_data_vn_units.json";
const EditPropertyPage = () => {
    const { id } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        type: "Buy",
        propertyType: "",
        price: "",
        area: "",
        province: "",

        ward: "",
        address: "",
    });

    const provinces = vnAddressData.map((province) => ({
        code: province.Code,
        name: province.Name,
    }));

    const wards = formData.province
        ? vnAddressData.find((province) => province.Name === formData.province)?.Wards || []
        : [];
    // 1. Lấy dữ liệu cũ của bài đăng
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/properties/${id}`);
                const data = response.data.data;
                // Kiểm tra quyền sở hữu (Security Check)
                if (data.userId !== user?.id) {
                    toaster.create({ title: "Lỗi", description: "Bạn không có quyền sửa bài này", type: "error" });
                    navigate("/manage-properties");
                    return;
                }
                setFormData({
                    title: data.title,
                    type: data.type,
                    propertyType: data.propertyType,
                    price: data.price,
                    area: data.area,
                    province: data.location.province,
                    ward: data.location.district,
                    address: data.location.address,
                });
                setDescription(data.description);
                setImages(data.images);
                setLoading(false);
            } catch (error) {
                console.error("Fetch error:", error);
                setLoading(false);
            }
        };
        if (user) fetchProperty();
    }, [id, user, navigate]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "province" ? { ward: "" } : {}),
        }));
    };
    const removeImage = (urlToRemove) => {
        setImages(images.filter((url) => url !== urlToRemove));
    };
    const handleUpload = () => {
        window.cloudinary.openUploadWidget(
            {

                cloudName: "dz7vj9kzg",
                uploadPreset: "RealEstatePro",
                multiple: true,
            },
            (error, result) => {
                if (!error && result && result.event === "success") {
                    setImages((prev) => [...prev, result.info.secure_url]);
                }
            }
        );
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = {
            ...formData,
            description,
            images,
            location: {
                province: formData.province,
                ward: formData.ward,
                address: formData.address
            }
        };
        try {
            const response = await axios.put(`http://localhost:5000/api/properties/update/${id}`, updatedData);
            if (response.data.success) {
                toaster.create({
                    title: "Cập nhật thành công",
                    description: "Tin của bạn đang chờ duyệt lại.",
                    type: "success",
                });
                navigate("/manage-properties");
            }
        } catch (error) {
            toaster.create({ title: "Lỗi", description: "Không thể cập nhật", type: "error" });
        }
    };
    if (loading) return <Center h="100vh"><Spinner color="red.500" /></Center>;
    return (
        <Box bg="gray.50" minH="100vh">
            <SignedIn>
                <Container maxW="container.md" py={10}>
                    <Box bg="white" p={8} rounded="lg" shadow="md">
                        <Heading size="md" mb={6} color="red.600">Chỉnh sửa tin đăng</Heading>
                        <form onSubmit={handleSubmit}>
                            <Stack gap={5}>
                                <Field.Root required>

                                    <Field.Label fontWeight="600">Tiêu đề</Field.Label>
                                    <Input name="title" value={formData.title} onChange={handleChange} />
                                </Field.Root>
                                <SimpleGrid columns={2} gap={4}>
                                    <Field.Root required>
                                        <Field.Label fontWeight="600">Giá (VNĐ)</Field.Label>
                                        <Input name="price" type="number" value={formData.price} onChange={handleChange} />
                                    </Field.Root>
                                    <Field.Root required>
                                        <Field.Label fontWeight="600">Diện tích (m2)</Field.Label>
                                        <Input name="area" type="number" value={formData.area} onChange={handleChange} />
                                    </Field.Root>
                                </SimpleGrid>
                                <Box border="1px solid" borderColor="gray.100" p={4} rounded="md">
                                    <Text fontWeight="bold" mb={3} fontSize="sm">Địa chỉ</Text>
                                    <SimpleGrid columns={2} gap={3} mb={3}>
                                        <Field.Root required>
                                            <Field.Label fontWeight="600">Tỉnh/Thành</Field.Label>
                                            <NativeSelect.Root>
                                                <NativeSelect.Field name="province" value={formData.province} onChange={handleChange}>
                                                    <option value="">Chọn tỉnh/thành</option>
                                                    {provinces.map((province) => (
                                                        <option key={province.code} value={province.name}>
                                                            {province.name}
                                                        </option>
                                                    ))}
                                                </NativeSelect.Field>
                                            </NativeSelect.Root>
                                        </Field.Root>
                                        <Field.Root required>
                                            <Field.Label fontWeight="600">Xã/Phường</Field.Label>
                                            <NativeSelect.Root>
                                                <NativeSelect.Field
                                                    name="ward"
                                                    value={formData.ward}
                                                    onChange={handleChange}
                                                    disabled={!formData.province}
                                                >
                                                    <option value="">
                                                        {formData.province ? "Chọn xã/phường" : "Chọn tỉnh trước"}
                                                    </option>
                                                    {wards.map((ward) => (
                                                        <option key={ward.Code} value={ward.Name}>
                                                            {ward.Name}
                                                        </option>
                                                    ))}
                                                </NativeSelect.Field>
                                            </NativeSelect.Root>
                                        </Field.Root>
                                    </SimpleGrid>
                                    <Input name="address" value={formData.address} onChange={handleChange} />
                                </Box>
                                <Field.Root>
                                    <Field.Label fontWeight="600">Hình ảnh ({images.length})</Field.Label>
                                    <Button variant="outline" onClick={handleUpload} mb={4}>Thêm ảnh</Button>
                                    <SimpleGrid columns={4} gap={2}>
                                        {images.map((url, index) => (
                                            <Box key={index} position="relative" rounded="md" overflow="hidden">
                                                <img src={url} alt="prop" style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                                                <Button size="xs" colorPalette="red" position="absolute" top={0} right={0} onClick={() => removeImage(url)}>X</Button>
                                            </Box>
                                        ))}
                                    </SimpleGrid>
                                </Field.Root>
                                <Field.Root required>
                                    <Field.Label fontWeight="600">Mô tả</Field.Label>
                                    <Box bg="white" border="1px solid" borderColor="gray.200" rounded="md" width={"full"}>
                                        <ReactQuill theme="snow" value={description} onChange={setDescription} style={{ height: '300px', marginBottom: '45px' }} />
                                    </Box>
                                </Field.Root>
                                <Button type="submit" bg="red.600" color="white" size="lg" w="full" mt={4}>Lưu thay đổi</Button>
                            </Stack>
                        </form>
                    </Box>
                </Container>
            </SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
        </Box>

    );
};
export default EditPropertyPage;