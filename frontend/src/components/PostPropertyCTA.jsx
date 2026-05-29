import React from "react";
import { Button, Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { FiPlusCircle } from "react-icons/fi";

const pulseRing = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(230, 92, 0, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(230, 92, 0, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(230, 92, 0, 0); }
`;

export default function PostPropertyCTA() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { openSignIn } = useClerk();

  const handlePostClick = () => {
    if (!userId) {
      openSignIn();
    } else {
      navigate("/create-property");
    }
  };

  return (
    <Box display="flex" justifyContent="center" my={8} w="100%">
      <Box position="relative">
        <Button
          size="xl"
          bg="#E65C00"
          color="white"
          px={10}
          py={7}
          fontSize="xl"
          fontWeight="900"
          textTransform="uppercase"
          borderRadius="full"
          _hover={{ bg: "#CC5200", transform: "translateY(-2px)" }}
          transition="all 0.2s"
          animation={`${pulseRing} 2s infinite`}
          onClick={handlePostClick}
          boxShadow="lg"
        >
          <FiPlusCircle style={{ marginRight: "10px", fontSize: "26px" }} />
          Đăng tin nhà đất ngay
        </Button>
      </Box>
    </Box>
  );
}