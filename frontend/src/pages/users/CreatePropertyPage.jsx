import React, { useState } from "react";
import { Box, Button, Container, Heading, Input, Text, SimpleGrid, Field, NativeSelect, Stack } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import axios from "axios";
import vnAddressData from "../../../utils/full_json_generated_data_vn_units.json";

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
    ward: "",
    address: "",
    contactPhone: "",
  });
  const [description, setDescription] = useState("");

  const provinces = vnAddressData.map((province) => ({
    code: province.Code,
    name: province.Name,
  }));

  const wards = formData.province ? vnAddressData.find((province) => province.Name === formData.province)?.Wards || [] : [];

  const removeImage = (urlToRemove) => {
    setImages(images.filter((url) => url !== urlToRemove));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "province" ? { ward: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = {
      ...formData,
      description,
      images,
      userId: user?.id,
      location: {
        province: formData.province,
        ward: formData.ward,
        address: formData.address,
      },
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
          ward: "",
          address: "",
          contactPhone: "",
        });
        setDescription("");
        setImages([]);
        e.target.reset();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
      toaster.create({
        title: "Lỗi",
        description: errorMessage,
        type: "error",
      });
    }
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
          setImages((prev) => [...prev, result.info.secure_url]);
        }
      },
    );
  };

  return (
    <SignedIn>
      <Box bg={{ base: "gray.50", _dark: "gray.950" }} minH="100vh">
        <Container maxW="container.md" py={10}>
          <Box bg={{ base: "white", _dark: "gray.900" }} p={8} rounded="lg" shadow="md" borderWidth="1px" borderColor={{ base: "gray.100", _dark: "whiteAlpha.200" }}>
            <Heading size="md" mb={6} color="#E65C00">
              Đăng tin mới
            </Heading>

            <form onSubmit={handleSubmit}>
              <Stack gap={5} align="stretch">
                <Field.Root required>
                  <Field.Label fontWeight="600" color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>Tiêu đề</Field.Label>
                  <Input
                    name="title"
                    placeholder="VD: Căn hộ Vinhomes 2PN view biển"
                    bg={{ base: "white", _dark: "gray.800" }}
                    color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
                    borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
                    onChange={handleChange}
                  />
                </Field.Root>

                <SimpleGrid columns={2} gap={4}>
                  <Field.Root required>
                    <Field.Label fontWeight="600" color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>Hình thức</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field name="type" onChange={handleChange} bg={{ base: "white", _dark: "gray.800" }} color={{ base: "gray.800", _dark: "whiteAlpha.900" }} borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}>
                        <option value="Buy">Cần bán</option>
                        <option value="Rent">Cho thuê</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontWeight="600" color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>Loại bất động sản</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field name="propertyType" onChange={handleChange} bg={{ base: "white", _dark: "gray.800" }} color={{ base: "gray.800", _dark: "whiteAlpha.900" }} borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}>
                        <option value="">Chọn loại</option>
                        <option value="Apartment">Căn hộ</option>
                        <option value="House">Nhà phố</option>
                        <option value="Land">Đất nền</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Field.Root>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
                  <Field.Root required>
                    <Field.Label fontWeight="600" color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>Giá (VNĐ)</Field.Label>
                    <Input name="price" type="number" placeholder="VD: 2000000000" value={formData.price} onChange={handleChange} bg={{ base: "white", _dark: "gray.800" }} color={{ base: "gray.800", _dark: "whiteAlpha.900" }} borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }} />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontWeight="600" color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>Diện tích (m2)</Field.Label>
                    <Input name="area" type="number" placeholder="VD: 68" value={formData.area} onChange={handleChange} bg={{ base: "white", _dark: "gray.800" }} color={{ base: "gray.800", _dark: "whiteAlpha.900" }} borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }} />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label fontWeight="600" color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>Số ĐT liên hệ</Field.Label>
                    <Input name="contactPhone" type="tel" placeholder="VD: 0912345678" value={formData.contactPhone} onChange={handleChange} bg={{ base: "white", _dark: "gray.800" }} color={{ base: "gray.800", _dark: "whiteAlpha.900" }} borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }} />
                  </Field.Root>
                </SimpleGrid>

                <Box border="1px solid" borderColor={{ base: "gray.100", _dark: "whiteAlpha.200" }} p={4} rounded="md" bg={{ base: "gray.50", _dark: "gray.950" }}>
                  <Text fontWeight="bold" mb={3} fontSize="sm" color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>
                    Địa chỉ bất động sản
                  </Text>
                  <SimpleGrid columns={2} gap={3} mb={3}>
                    <Field.Root required>
                      <Field.Label fontWeight="600" color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>Tỉnh/Thành</Field.Label>
                      <NativeSelect.Root>
                        <NativeSelect.Field name="province" value={formData.province} onChange={handleChange} bg={{ base: "white", _dark: "gray.800" }} color={{ base: "gray.800", _dark: "whiteAlpha.900" }} borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}>
                          <option value="">Chọn tỉnh/thành</option>
                          {provinces.map((province) => (
                            <option key={province.code} value={province.name}>{province.name}</option>
                          ))}
                        </NativeSelect.Field>
                      </NativeSelect.Root>
                    </Field.Root>

                    <Field.Root required>
                      <Field.Label fontWeight="600" color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>Xã/Phường</Field.Label>
                      <NativeSelect.Root>
                        <NativeSelect.Field name="ward" value={formData.ward} onChange={handleChange} disabled={!formData.province} bg={{ base: "white", _dark: "gray.800" }} color={{ base: "gray.800", _dark: "whiteAlpha.900" }} borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}>
                          <option value="">{formData.province ? "Chọn xã/phường" : "Chọn tỉnh trước"}</option>
                          {wards.map((ward) => (
                            <option key={ward.Code} value={ward.Name}>{ward.Name}</option>
                          ))}
                        </NativeSelect.Field>
                      </NativeSelect.Root>
                    </Field.Root>
                  </SimpleGrid>
                  <Input name="address" placeholder="Địa chỉ chi tiết" bg={{ base: "white", _dark: "gray.800" }} color={{ base: "gray.800", _dark: "whiteAlpha.900" }} borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }} value={formData.address} onChange={handleChange} />
                </Box>

                <Field.Root>
                  <Field.Label fontWeight="600" color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>Hình ảnh bất động sản ({images.length})</Field.Label>
                  <Button variant="outline" colorPalette="orange" onClick={handleUpload} mb={4}>
                    Tải ảnh lên
                  </Button>
                  <SimpleGrid columns={4} gap={2}>
                    {images.map((url, index) => (
                      <Box key={index} position="relative" rounded="md" overflow="hidden" border="1px solid" borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}>
                        <img src={url} alt="property" style={{ width: "100%", height: "80px", objectFit: "cover" }} />
                        <Button size="xs" colorPalette="red" position="absolute" top={0} right={0} onClick={() => removeImage(url)}>
                          X
                        </Button>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Field.Root>

                <Field.Root required>
                  <Field.Label fontWeight="600" color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>Mô tả chi tiết</Field.Label>
                  <Box bg={{ base: "white", _dark: "gray.800" }} border="1px solid" borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }} rounded="md" w="full">
                    <ReactQuill theme="snow" value={description} onChange={setDescription} style={{ height: "400px", marginBottom: "45px", width: "100%" }} />
                  </Box>
                </Field.Root>

                <Button type="submit" bg="#E65C00" color="white" size="lg" w="full" _hover={{ bg: "#CC5200" }} mt={4}>
                  Tiếp tục đăng tin
                </Button>
              </Stack>
            </form>
          </Box>
        </Container>
      </Box>
    </SignedIn>
  );
};

export default CreatePropertyPage;
