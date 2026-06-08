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
  Center,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useUser,
  SignedIn,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import vnAddressData from "../../../utils/full_json_generated_data_vn_units.json";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const EditPropertyPage = () => {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    type: "Buy",
    propertyType: "",
    price: "",
    area: "",
    province: "",
    ward: "",
    address: "",
    contactPhone: "",
  });

  const provinces = vnAddressData.map((province) => ({
    code: province.Code,
    name: province.Name,
  }));

  const wards = formData.province
    ? vnAddressData.find((province) => province.Name === formData.province)?.Wards || []
    : [];

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/properties/${id}`);
        const data = response.data.data;

        if (data.userId !== user?.id) {
          toaster.create({
            title: "Lỗi",
            description: "Bạn không có quyền sửa bài này",
            type: "error",
          });
          navigate("/manage-properties");
          return;
        }

        setFormData({
          title: data.title,
          type: data.type,
          propertyType: data.propertyType,
          price: data.price,
          area: data.area,
          province: data.location?.province || "",
          ward: data.location?.ward || "",
          address: data.location?.address || "",
          contactPhone: data.contactPhone || "",
        });
        setDescription(data.description);
        setImages(data.images || []);
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
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Tiêu đề không được để trống";
    if (!formData.propertyType) newErrors.propertyType = "Vui lòng chọn loại bất động sản";
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = "Giá phải lớn hơn 0";
    if (!formData.area || Number(formData.area) <= 0) newErrors.area = "Diện tích phải lớn hơn 0";
    if (!formData.contactPhone.trim()) newErrors.contactPhone = "Số điện thoại không được để trống";
    if (!formData.province) newErrors.province = "Vui lòng chọn tỉnh/thành";
    if (!formData.ward) newErrors.ward = "Vui lòng chọn xã/phường";
    if (!formData.address.trim()) newErrors.address = "Địa chỉ không được để trống";
    if (!description || !description.trim() || description === "<p><br></p>") newErrors.description = "Mô tả không được để trống";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const removeImage = (urlToRemove) => {
    setImages((current) => current.filter((url) => url !== urlToRemove));
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
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updatedData = {
      ...formData,
      description,
      images,
      location: {
        province: formData.province,
        ward: formData.ward,
        address: formData.address,
      },
    };

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/properties/update/${id}`,
        updatedData,
      );

      if (response.data.success) {
        toaster.create({
          title: "Cập nhật thành công",
          description: "Tin của bạn đang chờ duyệt lại.",
          type: "success",
        });
        navigate("/manage-properties");
      }
    } catch (error) {
      toaster.create({
        title: "Lỗi",
        description: "Không thể cập nhật",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner color="#E65C00" size="xl" />
      </Center>
    );
  }

  return (
    <SignedIn>
      <Box bg={{ base: "gray.50", _dark: "gray.950" }} minH="100vh" w="100%">
        <Container maxW="800px" py={{ base: "4", md: "10" }} px={{ base: "2", sm: "4" }}>
          <Box
            bg={{ base: "white", _dark: "gray.900" }}
            p={{ base: "4", md: "8" }}
            rounded="lg"
            shadow="md"
            borderWidth="1px"
            borderColor={{ base: "gray.100", _dark: "whiteAlpha.200" }}
            w="100%"
          >
            <Heading size="md" mb={6} color="#E65C00">
              Chỉnh sửa tin đăng
            </Heading>
            <form onSubmit={handleSubmit} noValidate>
              <Stack gap={5} w="100%" align="stretch">
                <Field.Root required w="100%">
                  <Field.Label
                    fontWeight="600"
                    color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
                  >
                    Tiêu đề
                  </Field.Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    bg={{ base: "white", _dark: "gray.800" }}
                    color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
                    borderColor={errors.title ? "red.500" : { base: "gray.200", _dark: "whiteAlpha.200" }}
                  />
                  {errors.title && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.title}
                    </Text>
                  )}
                </Field.Root>

                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} w="100%">
                  <Field.Root required>
                    <Field.Label fontWeight="600" color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>
                      Hình thức
                    </Field.Label>
                    <NativeSelect.Root w="100%">
                      <NativeSelect.Field
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        bg={{ base: "white", _dark: "gray.800" }}
                        color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
                        borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
                      >
                        <option value="Buy">Cần bán</option>
                        <option value="Rent">Cho thuê</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Field.Root>
                  <Field.Root required>
                    <Field.Label fontWeight="600" color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>
                      Loại bất động sản
                    </Field.Label>
                    <NativeSelect.Root w="100%">
                      <NativeSelect.Field
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        bg={{ base: "white", _dark: "gray.800" }}
                        color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
                        borderColor={errors.propertyType ? "red.500" : { base: "gray.200", _dark: "whiteAlpha.200" }}
                      >
                        <option value="">Chọn loại</option>
                        <option value="Apartment">Căn hộ</option>
                        <option value="House">Nhà phố</option>
                        <option value="Land">Đất nền</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                    {errors.propertyType && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.propertyType}
                      </Text>
                    )}
                  </Field.Root>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, sm: 3 }} gap={4} w="100%">
                  <Field.Root required>
                    <Field.Label
                      fontWeight="600"
                      color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
                    >
                      Giá (VNĐ)
                    </Field.Label>
                    <Input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      bg={{ base: "white", _dark: "gray.800" }}
                      color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
                      borderColor={errors.price ? "red.500" : { base: "gray.200", _dark: "whiteAlpha.200" }}
                    />
                    {errors.price && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.price}
                      </Text>
                    )}
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label
                      fontWeight="600"
                      color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
                    >
                      Diện tích (m2)
                    </Field.Label>
                    <Input
                      name="area"
                      type="number"
                      value={formData.area}
                      onChange={handleChange}
                      bg={{ base: "white", _dark: "gray.800" }}
                      color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
                      borderColor={errors.area ? "red.500" : { base: "gray.200", _dark: "whiteAlpha.200" }}
                    />
                    {errors.area && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.area}
                      </Text>
                    )}
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label
                      fontWeight="600"
                      color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
                    >
                      Số ĐT liên hệ
                    </Field.Label>
                    <Input
                      name="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      bg={{ base: "white", _dark: "gray.800" }}
                      color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
                      borderColor={errors.contactPhone ? "red.500" : { base: "gray.200", _dark: "whiteAlpha.200" }}
                    />
                    {errors.contactPhone && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.contactPhone}
                      </Text>
                    )}
                  </Field.Root>
                </SimpleGrid>

                <Box
                  border="1px solid"
                  borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
                  p={4}
                  rounded="md"
                  bg={{ base: "gray.50", _dark: "gray.950" }}
                  w="100%"
                >
                  <Text
                    fontWeight="bold"
                    mb={3}
                    fontSize="sm"
                    color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
                  >
                    Địa chỉ
                  </Text>
                  <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3} mb={3} w="100%">
                    <Field.Root required>
                      <Field.Label
                        fontWeight="600"
                        color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
                      >
                        Tỉnh/Thành
                      </Field.Label>
                      <NativeSelect.Root w="100%">
                        <NativeSelect.Field
                          name="province"
                          value={formData.province}
                          onChange={handleChange}
                          bg={{ base: "white", _dark: "gray.800" }}
                          color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
                          borderColor={errors.province ? "red.500" : { base: "gray.200", _dark: "whiteAlpha.200" }}
                        >
                          <option value="">Chọn tỉnh/thành</option>
                          {provinces.map((province) => (
                            <option key={province.code} value={province.name}>
                              {province.name}
                            </option>
                          ))}
                        </NativeSelect.Field>
                      </NativeSelect.Root>
                      {errors.province && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.province}
                        </Text>
                      )}
                    </Field.Root>

                    <Field.Root required>
                      <Field.Label
                        fontWeight="600"
                        color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
                      >
                        Xã/Phường
                      </Field.Label>
                      <NativeSelect.Root w="100%">
                        <NativeSelect.Field
                          name="ward"
                          value={formData.ward}
                          onChange={handleChange}
                          disabled={!formData.province}
                          bg={{ base: "white", _dark: "gray.800" }}
                          color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
                          borderColor={errors.ward ? "red.500" : { base: "gray.200", _dark: "whiteAlpha.200" }}
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
                      {errors.ward && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.ward}
                        </Text>
                      )}
                    </Field.Root>
                  </SimpleGrid>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    bg={{ base: "white", _dark: "gray.800" }}
                    color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
                    borderColor={errors.address ? "red.500" : { base: "gray.200", _dark: "whiteAlpha.200" }}
                    placeholder="Địa chỉ chi tiết"
                  />
                  {errors.address && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.address}
                    </Text>
                  )}
                </Box>

                <Field.Root w="100%">
                  <Field.Label
                    fontWeight="600"
                    color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
                  >
                    Hình ảnh ({images.length})
                  </Field.Label>
                  <Button
                    variant="outline"
                    colorPalette="orange"
                    onClick={handleUpload}
                    mb={4}
                    size="sm"
                    w={{ base: "100%", sm: "auto" }}
                  >
                    Thêm ảnh
                  </Button>
                  <SimpleGrid columns={{ base: 2, sm: 4 }} gap={2} w="100%">
                    {images.map((url, index) => (
                      <Box
                        key={index}
                        position="relative"
                        rounded="md"
                        overflow="hidden"
                        border="1px solid"
                        borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
                      >
                        <img
                          src={url}
                          alt="prop"
                          style={{
                            width: "100%",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
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

                <Field.Root required w="100%">
                  <Field.Label
                    fontWeight="600"
                    color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
                  >
                    Mô tả
                  </Field.Label>
                  <Box
                    bg={{ base: "white", _dark: "gray.800" }}
                    border="1px solid"
                    borderColor={errors.description ? "red.500" : { base: "gray.200", _dark: "whiteAlpha.200" }}
                    rounded="md"
                    width="100%"
                    overflow="hidden"
                  >
                    <ReactQuill
                      theme="snow"
                      value={description}
                      onChange={(value) => {
                        setDescription(value);
                        setErrors((prev) => ({ ...prev, description: undefined }));
                      }}
                      style={{ height: "300px", marginBottom: "45px", width: "100%" }}
                    />
                  </Box>
                  {errors.description && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.description}
                    </Text>
                  )}
                </Field.Root>

                <Button
                  type="submit"
                  bg="#E65C00"
                  color="white"
                  size="lg"
                  w="100%"
                  _hover={{ bg: "#CC5200" }}
                  mt={4}
                >
                  Lưu thay đổi
                </Button>
              </Stack>
            </form>
          </Box>
        </Container>
      </Box>
    </SignedIn>
  );
};

export default EditPropertyPage;