import React, { useState, useEffect } from "react";
import { Box, Image, Flex, Text, Heading, VStack } from "@chakra-ui/react";

const BANNER_IMAGES = [
  "/imgs/hero_img.jpg",
  "/imgs/hero_img2.jpg",
  "/imgs/hero_img3.jpg",
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === BANNER_IMAGES.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const handleDragStart = (clientX) => {
    setDragStart(clientX);
  };

  const handleDragEnd = (clientX) => {
    if (!dragStart) return;

    const diff = dragStart - clientX;

    if (diff > 50) {
      setCurrentIndex((prev) =>
        prev === BANNER_IMAGES.length - 1 ? 0 : prev + 1
      );
    } else if (diff < -50) {
      setCurrentIndex((prev) =>
        prev === 0 ? BANNER_IMAGES.length - 1 : prev - 1
      );
    }

    setDragStart(0);
  };

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      mt={{ base: "3", md: "6" }}
      marginBottom={{ base: "16px", md: "32px" }}
      position="relative"
      px={{ base: "4", md: "0" }}
    >
      <Box
        width="100%"
        maxW="1200px"
        height={{ base: "200px", sm: "280px", md: "420px", lg: "520px" }}
        borderRadius="xl"
        overflow="hidden"
        position="relative"
        boxShadow="xl"
        bg="gray.950"
      >
        <Flex
          width={`${BANNER_IMAGES.length * 100}%`}
          height="100%"
          transform={`translateX(-${
            (currentIndex * 100) / BANNER_IMAGES.length
          }%)`}
          transition="transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
          onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
          onMouseDown={(e) => handleDragStart(e.clientX)}
          onMouseUp={(e) => handleDragEnd(e.clientX)}
          cursor="grab"
          _active={{ cursor: "grabbing" }}
        >
          {BANNER_IMAGES.map((src, index) => (
            <Box
              key={index}
              width={`${100 / BANNER_IMAGES.length}%`}
              height="100%"
              position="relative"
              flexShrink={0}
            >
              <Image
                src={src}
                alt={`RealEstatePro Banner ${index + 1}`}
                width="100%"
                height="100%"
                objectFit="cover"
                draggable="false"
                filter={index === 0 ? "brightness(0.55)" : "brightness(0.7)"}
              />

              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bgGradient={
                  index === 0
                    ? {
                        base: "linear(to-b, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)",
                        md: "linear(to-r, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                      }
                    : {
                        base: "linear(to-b, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 100%)",
                        md: "linear(to-r, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
                      }
                }
                display="flex"
                alignItems="center"
                px={{ base: "6", sm: "12", md: "16" }}
              >
                {index === 0 && (
                  <>
                    <VStack
                      align="flex-start"
                      gap={{ base: 1, md: 2 }}
                      maxW={{ base: "90%", sm: "85%", md: "60%" }}
                    >
                      <Flex
                        align={{ base: "flex-start", sm: "baseline" }}
                        direction={{ base: "column", sm: "row" }}
                        gap={{ base: 1, sm: 2 }}
                      >
                        <Text
                          fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                          fontWeight="black"
                          letterSpacing="wider"
                          color="white"
                          textTransform="uppercase"
                          textShadow="0 2px 4px rgba(0,0,0,0.8)"
                        >
                          Chào mừng
                        </Text>

                        <Text
                          fontSize={{ base: "11px", sm: "xs", md: "sm" }}
                          fontWeight="bold"
                          letterSpacing="widest"
                          color="gray.300"
                          textTransform="uppercase"
                          textShadow="0 2px 4px rgba(0,0,0,0.8)"
                        >
                          bạn đến với
                        </Text>
                      </Flex>

                      <Heading
                        fontSize={{
                          base: "2xl",
                          sm: "4xl",
                          md: "5xl",
                          lg: "6xl",
                        }}
                        fontWeight="900"
                        color="#FF6B00"
                        lineHeight="1.1"
                        textShadow="0 4px 12px rgba(0,0,0,0.9)"
                      >
                        RealEstatePro
                      </Heading>

                      <Text
                        fontSize={{
                          base: "12px",
                          sm: "sm",
                          md: "md",
                          lg: "lg",
                        }}
                        color="whiteAlpha.900"
                        fontWeight="500"
                        lineHeight="1.5"
                        textShadow="0 1px 3px rgba(0,0,0,0.9)"
                        noOfLines={{ base: 2, sm: 3, md: undefined }}
                      >
                        Nơi lý tưởng để tìm kiếm, mua bán và cho thuê nhà đất.
                        Giúp bạn dễ dàng sở hữu những không gian sống ưng ý nhất
                        theo sở thích của mình.
                      </Text>
                    </VStack>

                    <Text
                      position="absolute"
                      bottom={{ base: "2", md: "4" }}
                      right={{ base: "4", md: "6" }}
                      fontSize={{ base: "6px", sm: "9px", md: "xs" }}
                      color="whiteAlpha.600"
                      maxW={{ base: "150px", sm: "260px", md: "400px" }}
                      textAlign="right"
                      textShadow="0 1px 2px rgba(0,0,0,0.9)"
                      pointerEvents="none"
                      lineHeight="1.3"
                    >
                      <strong>Lưu ý:</strong> Hệ thống RealEstatePro hiện đang vận hành trong môi trường thử nghiệm nhằm mục đích phục vụ học tập và nghiên cứu phát triển. Mọi thông tin và dữ liệu trên trang web này chỉ mang tính chất minh họa.
                    </Text>
                  </>
                )}
              </Box>
            </Box>
          ))}
        </Flex>

        <Flex
          position="absolute"
          bottom="3"
          left="50%"
          transform="translateX(-50%)"
          gap="2"
          zIndex="10"
        >
          {BANNER_IMAGES.map((_, index) => (
            <Box
              key={index}
              width={{ base: "5px", md: "8px" }}
              height={{ base: "5px", md: "8px" }}
              borderRadius="full"
              bg={currentIndex === index ? "#FF6B00" : "whiteAlpha.600"}
              cursor="pointer"
              transition="all 0.3s ease"
              onClick={() => setCurrentIndex(index)}
              _hover={{ bg: "#FF6B00" }}
            />
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default HeroSection;