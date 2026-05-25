import { Flex, HStack, Text } from '@chakra-ui/react';

export default function AdminFooter() {
  return (
    <Flex 
      as="footer" 
      mt="auto" 
      py={4} 
      px={6} 
      borderTop="1px solid" 
      borderColor="#e2e8f0" 
      bg="white" 
      justify="space-between" 
      align="center"
      color="gray.500"
      fontSize="xs"
    >
      <Text>© 2026 RealEstatePro. All rights reserved.</Text>
      <HStack gap={4}>
        <Text>Made with ❤️ by RealEstatePro</Text>
        <Text color="gray.300">|</Text>
        <Text>Hệ thống quản trị</Text>
      </HStack>
    </Flex>
  );
}