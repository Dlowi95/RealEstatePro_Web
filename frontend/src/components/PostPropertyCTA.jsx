import React from "react";
import { Button, Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { FiPlusCircle } from "react-icons/fi";

const pulseRing = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(230, 92, 0, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(230, 92, 0, 0); } /* Thu nhỏ vòng sáng lại một chút */
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
    <Box display="flex" justifyContent="center" my={{ base: 5, md: 8 }} w="100%">
      <Box position="relative">
        <Button
          bg="#E65C00"
          color="white"
          size={{ base: "md", md: "lg", lg: "xl" }} 
          px={{ base: 6, md: 10 }}
          py={{ base: 6, md: 7 }}
          fontSize={{ base: "sm", sm: "md", md: "xl" }} 
          fontWeight="900"
          textTransform="uppercase"
          borderRadius="full"
          _hover={{ bg: "#CC5200", transform: "translateY(-2px)" }}
          transition="all 0.2s"
          animation={`${pulseRing} 2s infinite`}
          onClick={handlePostClick}
          boxShadow="lg"
        >
          <FiPlusCircle 
            style={{ 
              marginRight: "8px", 
              fontSize: "1.2em" 
            }} 
          />
          Đăng tin nhà đất ngay
        </Button>
      </Box>
    </Box>
  );
}