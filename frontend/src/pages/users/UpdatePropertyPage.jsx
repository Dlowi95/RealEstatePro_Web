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
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
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
    contactPhone: "",
  });

  const provinces = vnAddressData.map((province) => ({
    code: province.Code,
    name: province.Name,
  }));

  const wards = formData.province
    ? vnAddressData.find((province) => province.Name === formData.province)
        ?.Wards || []
    : [];

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/properties/${id}`,
        );
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
        `http://localhost:5000/api/properties/update/${id}`,
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
        <Spinner color="#E65C00" />
      </Center>
    );
  }

  return (
    <SignedIn>
      <Box bg={{ base: "gray.50", _dark: "gray.950" }} minH="100vh">
        <Container maxW="container.md" py={10}>
          <Box
            bg={{ base: "white", _dark: "gray.900" }}
            p={8}
            rounded="lg"
            shadow="md"
            borderWidth="1px"
            borderColor={{ base: "gray.100", _dark: "whiteAlpha.200" }}
          >
            <Heading size="md" mb={6} color="#E65C00">
              Chỉnh sửa tin đăng
            </Heading>
            <form onSubmit={handleSubmit}>
              <Stack gap={5}>
                <Field.Root required>
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
                    borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
                  />
                </Field.Root>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
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
                      borderColor={{
                        base: "gray.200",
                        _dark: "whiteAlpha.200",
                      }}
                    />
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
                      borderColor={{
                        base: "gray.200",
                        _dark: "whiteAlpha.200",
                      }}
                    />
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
                      borderColor={{
                        base: "gray.200",
                        _dark: "whiteAlpha.200",
                      }}
                    />
                  </Field.Root>
                </SimpleGrid>

                <Box
                  border="1px solid"
                  borderColor={{ base: "gray.100", _dark: "whiteAlpha.200" }}
                  p={4}
                  rounded="md"
                  bg={{ base: "gray.50", _dark: "gray.950" }}
                >
                  <Text
                    fontWeight="bold"
                    mb={3}
                    fontSize="sm"
                    color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
                  >
                    Địa chỉ
                  </Text>
                  <SimpleGrid columns={2} gap={3} mb={3}>
                    <Field.Root required>
                      <Field.Label
                        fontWeight="600"
                        color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
                      >
                        Tỉnh/Thành
                      </Field.Label>
                      <NativeSelect.Root>
                        <NativeSelect.Field
                          name="province"
                          value={formData.province}
                          onChange={handleChange}
                          bg={{ base: "white", _dark: "gray.800" }}
                          color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
                          borderColor={{
                            base: "gray.200",
                            _dark: "whiteAlpha.200",
                          }}
                        >
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
                      <Field.Label
                        fontWeight="600"
                        color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
                      >
                        Xã/Phường
                      </Field.Label>
                      <NativeSelect.Root>
                        <NativeSelect.Field
                          name="ward"
                          value={formData.ward}
                          onChange={handleChange}
                          disabled={!formData.province}
                          bg={{ base: "white", _dark: "gray.800" }}
                          color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
                          borderColor={{
                            base: "gray.200",
                            _dark: "whiteAlpha.200",
                          }}
                        >
                          <option value="">
                            {formData.province
                              ? "Chọn xã/phường"
                              : "Chọn tỉnh trước"}
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
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    bg={{ base: "white", _dark: "gray.800" }}
                    color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
                    borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
                  />
                </Box>

                <Field.Root>
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
                  >
                    Thêm ảnh
                  </Button>
                  <SimpleGrid columns={4} gap={2}>
                    {images.map((url, index) => (
                      <Box
                        key={index}
                        position="relative"
                        rounded="md"
                        overflow="hidden"
                        border="1px solid"
                        borderColor={{
                          base: "gray.200",
                          _dark: "whiteAlpha.200",
                        }}
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

                <Field.Root required>
                  <Field.Label
                    fontWeight="600"
                    color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
                  >
                    Mô tả
                  </Field.Label>
                  <Box
                    bg={{ base: "white", _dark: "gray.800" }}
                    border="1px solid"
                    borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
                    rounded="md"
                    width="full"
                  >
                    <ReactQuill
                      theme="snow"
                      value={description}
                      onChange={setDescription}
                      style={{ height: "300px", marginBottom: "45px" }}
                    />
                  </Box>
                </Field.Root>

                <Button
                  type="submit"
                  bg="#E65C00"
                  color="white"
                  size="lg"
                  w="full"
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
