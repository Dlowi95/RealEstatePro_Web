import { Box, Flex, Text } from '@chakra-ui/react';

export default function AdminHeader({ shortName, borderColor }) {
  return (
    <Box bg="white" px={6} py={3} borderBottom="1px solid" borderColor={borderColor} mb={4}>
      <Flex justify="space-between" align="center">
        <Text fontSize="lg" fontWeight="semibold">
          Chào mừng, {shortName}!
        </Text>
        <Text fontSize="lg" textTransform="uppercase" fontWeight="700">Admin Panel</Text>
      </Flex>
    </Box>
  );
}