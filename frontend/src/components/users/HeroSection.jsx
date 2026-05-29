import React from "react";
import { Box, Image } from "@chakra-ui/react";
import heroImage from "../../../public/imgs/hero_img.jpg";

const HeroSection = () => {
  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="center"
      mt={{ base: "4", md: "6" }}
      marginBottom={{ base: "24px", md: "40px" }}
    >
      <Image
        src={heroImage}
        alt="Hero Section"
        width="100%"
        maxW="1200px"
        height={{ base: "180px", sm: "260px", md: "380px", lg: "500px" }}
        objectFit="cover"
        borderRadius="8px"
      />
    </Box>
  );
};

export default HeroSection;