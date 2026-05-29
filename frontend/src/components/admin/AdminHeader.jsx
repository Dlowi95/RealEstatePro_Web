import { Box, Flex, Text } from "@chakra-ui/react";
import { useColorMode } from "../../components/ui/color-mode";

export default function AdminHeader({ shortName }) {
  const { colorMode } = useColorMode();

  return (
    <Box
      bg="bg.panel"
      px={6}
      py={3}
      borderBottom="1px solid"
      borderColor={colorMode === "dark" ? "#2d3748" : "#e2e8f0"}
      mb={4}
    >
      <Flex justify="space-between" align="center">
        <Text fontSize="lg" fontWeight="semibold" color="fg.default">
          Chào mừng, {shortName}!
        </Text>
        <Text
          fontSize="lg"
          textTransform="uppercase"
          fontWeight="700"
          color="fg.default"
        >
          Admin Panel
        </Text>
      </Flex>
    </Box>
  );
}
