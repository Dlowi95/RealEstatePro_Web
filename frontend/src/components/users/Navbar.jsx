import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Image,
  Link,
  Text,
  Drawer,
  Menu,
  Portal
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { LuChevronDown, LuMenu } from "react-icons/lu";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton
} from "@clerk/clerk-react";

const navLinks = [
  { label: "Nhà đất bán", href: "/ban" },
  { label: "Nhà đất cho thuê", href: "/cho-thue" },
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
              <HStack gap={2} align="center">
                <Image src="/imgs/logo.png" alt="RealEstate Pro" w="150px" objectFit="contain" />
                
              </HStack>
            </Link>

            <HStack gap={5} hideBelow="lg">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  as={RouterLink}
                  to={link.href}
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
                  {/* Dropdown Menu thay thế cho nút Đăng tin cũ */}
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <Button variant="outline" colorPalette="red" size="sm" fontWeight="600">
                        Quản lý tin <LuChevronDown style={{ marginLeft: '5px' }} />
                      </Button>
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content>
                          <Menu.Item value="create" as="a" href="/create-property">
                            Đăng tin mới
                          </Menu.Item>
                          <Menu.Item value="manage" as="a" href="/manage-properties">
                            Tin của tôi
                          </Menu.Item>
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>

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
                            as={RouterLink}
                            to={link.href}
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