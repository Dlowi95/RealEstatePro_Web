import { 
  Box, 
  Button, 
  Container, 
  Flex, 
  HStack, 
  IconButton, 
  Link, 
  Text,
  Drawer
} from "@chakra-ui/react";
import { LuMenu } from "react-icons/lu";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton
} from "@clerk/clerk-react";

const navLinks = [
  { label: "Nhà đất bán", href: "#" },
  { label: "Nhà đất cho thuê", href: "#" },
  { label: "Dự án", href: "#" },
];

const Navbar = () => {
  return (
    <Box 
      as="nav" 
      bg="#fff" 
      borderBottom="1px solid" 
      borderColor="gray.100" 
      py={3} 
      position="sticky" 
      top="0" 
      zIndex="1000"
    >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          
          {/* TRÁI: Logo & Menu Desktop */}
          <HStack gap={8}>
            <Link href="/" _hover={{ textDecoration: "none" }}>
              <HStack gap={1} fontWeight="bold" fontSize="xl">
                <Text color="red.600">🏠</Text>
                <Text color="black">RealEstate</Text>
                <Text color="red.600">Pro</Text>
              </HStack>
            </Link>

            <HStack gap={5} hideBelow="lg">
              {navLinks.map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  fontSize="sm" 
                  fontWeight="600" 
                  color="gray.700"
                  _hover={{ color: "red.600", textDecoration: "none" }}
                >
                  {link.label}
                </Link>
              ))}
            </HStack>
          </HStack>

          {/* PHẢI: Actions & Authentication */}
          <HStack gap={4}>
            {/* Desktop Actions */}
            <HStack gap={4} hideBelow="lg">
              {/* TRƯỜNG HỢP CHƯA ĐĂNG NHẬP */}
              <SignedOut>
                <HStack gap={2} fontSize="sm" fontWeight="600">
                  <SignInButton mode="modal">
                    <Text cursor="pointer" _hover={{ color: "red.600" }}>Đăng nhập</Text>
                  </SignInButton>
                  <Text color="gray.300">|</Text>
                  <SignUpButton mode="modal">
                    <Text cursor="pointer" _hover={{ color: "red.600" }}>Đăng ký</Text>
                  </SignUpButton>
                </HStack>
              </SignedOut>

              {/* TRƯỜNG HỢP ĐÃ ĐĂNG NHẬP */}
              <SignedIn>
                <HStack gap={4}>
                  <Button bg="red.600" color="white" _hover={{ bg: "red.700" }} fontSize="sm" fontWeight="600" as="a" href="/create-property">
                    Đăng tin
                  </Button>
                  <UserButton afterSignOutUrl="/" />
                </HStack>
              </SignedIn>
            </HStack>

            {/* Mobile Menu (Drawer) */}
            <Box hideFrom="lg">
              <Drawer.Root placement="start">
                <Drawer.Backdrop />
                <Drawer.Trigger asChild>
                  <IconButton variant="ghost" aria-label="Mở Menu">
                    <LuMenu size={24} />
                  </IconButton>
                </Drawer.Trigger>
                <Drawer.Positioner>
                  <Drawer.Content>
                    <Drawer.CloseTrigger />
                    <Drawer.Header>
                      <Drawer.Title fontSize="xl" fontWeight="bold">RealEstatePro</Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body>
                      <Flex direction="column" gap={4}>
                        {navLinks.map((link) => (
                          <Link 
                            key={link.label} 
                            href={link.href} 
                            fontWeight="600" 
                            fontSize="md"
                            py={2} 
                            borderBottom="1px solid" 
                            borderColor="gray.50"
                          >
                            {link.label}
                          </Link>
                        ))}
                        
                        <Box pt={4}>
                          <SignedIn>
                            <Flex direction="column" gap={3}>
                              <Button bg="red.600" color="white" w="full" _hover={{ bg: "red.700" }}>
                                Đăng tin miễn phí
                              </Button>
                              <HStack justify="space-between" p={2} bg="gray.50" rounded="md">
                                <Text fontWeight="600" fontSize="sm">Tài khoản</Text>
                                <UserButton afterSignOutUrl="/" />
                              </HStack>
                            </Flex>
                          </SignedIn>
                          
                          <SignedOut>
                            <SignInButton mode="modal">
                              <Button variant="outline" w="full">Đăng nhập / Đăng ký</Button>
                            </SignInButton>
                          </SignedOut>
                        </Box>
                      </Flex>
                    </Drawer.Body>
                  </Drawer.Content>
                </Drawer.Positioner>
              </Drawer.Root>
            </Box>
          </HStack>

        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;