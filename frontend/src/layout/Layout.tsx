import { Box, Flex, Heading, HStack, Text, Link as ChakraLink } from "@chakra-ui/react";
import { Outlet, Link } from "react-router-dom";
import { FaStar, FaSun } from "react-icons/fa";
import astroLogo from "../assets/astro-logo.png";

export const Layout = () => {
  return (
    <>
      <Box
        bg="purple.700"
        color="white"
        position="fixed"
        top="0"
        w="100%"
        zIndex="1000"
        height="56px"
        px={4}
        boxShadow="md"
      >
        <Flex justify="space-between" align="center" height="100%">
          <Link to="/" onClick={() => window.scrollTo(0, 0)}>
            <Flex align="center" _hover={{ opacity: 0.8, cursor: "pointer" }}>
              <Box as="img" src={astroLogo} alt="Astro Logo" boxSize="32px" mr={2} />
              <Heading size="md">Astro</Heading>
            </Flex>
          </Link>
          <Flex gap={4}>
            <ChakraLink as={Link} to="/result/insight">
            <HStack>
              <FaStar />
              <Text>Insight</Text>
            </HStack>
            </ChakraLink>
            <ChakraLink as={Link} to="/result/fortune">
            <HStack>
              <FaSun />
              <Text>Fortune</Text>
            </HStack>
            </ChakraLink>
          </Flex>
        </Flex>
      </Box>

      <Box pt="56px" p={4} position="relative" zIndex="1">
        <Outlet />
      </Box>
    </>
  );
};
