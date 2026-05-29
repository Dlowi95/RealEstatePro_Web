import React from "react";
import { Box, Image } from "@chakra-ui/react";
import heroImage from "../../../public/imgs/hero_img.jpg";

const HeroSection = () => {
  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="center"
      marginBottom="40px"
    >
      <Image
        src={heroImage}
        alt="Hero Section"
        width="100%"
        height="500px"
        objectFit="cover"
        borderRadius="8px"
      />
    </Box>
  );
};

export default HeroSection;
