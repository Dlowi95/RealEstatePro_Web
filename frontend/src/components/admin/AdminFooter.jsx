import { Flex, HStack, Text } from "@chakra-ui/react";
import { useColorMode } from "../../components/ui/color-mode";

export default function AdminFooter() {
  const { colorMode } = useColorMode();

  return (
    <Flex
      as="footer"
      mt="auto"
      py={4}
      px={6}
      borderTop="1px solid"
      borderColor={colorMode === "dark" ? "#2d3748" : "#e2e8f0"}
      bg="bg.panel"
      justify="space-between"
      align="center"
      color="fg.muted"
      fontSize="xs"
    >
      <Text>© 2026 RealEstatePro. All rights reserved.</Text>
      <HStack gap={4}>
        <Text>Made with ❤️ by RealEstatePro</Text>
        <Text color={colorMode === "dark" ? "#2d3748" : "#e2e8f0"}>|</Text>
        <Text>Hệ thống quản trị</Text>
      </HStack>
    </Flex>
  );
}
