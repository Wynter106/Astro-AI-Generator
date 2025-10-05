import {
  Box,
  Image,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  Button,
  VStack,
  HStack,
  Icon
} from "@chakra-ui/react";
import { WarningIcon } from '@chakra-ui/icons';
import { useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaUserFriends } from "react-icons/fa";
import { NightSky } from "../components/NightSky";

export const InsightResult = () => {
  const raw = localStorage.getItem("astro_result");
  const data = raw ? JSON.parse(raw) : null;

  const insight = data?.insight;
  const image = data?.image;
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/result/fortune");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (!insight || !image) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50" px={4}>
        <Box
          bg="white"
          p={8}
          borderRadius="xl"
          boxShadow="lg"
          textAlign="center"
          maxW="md"
          w="100%"
        >
          <VStack spacing={4}>
            <Icon as={WarningIcon} w={10} h={10} color="orange.400" />
            <Text fontSize="2xl" fontWeight="bold" color="gray.700">
              No Data Found
            </Text>
            <Text fontSize="md" color="gray.500">
              Please enter your birth data to view your astrology insight.
            </Text>
            <Button colorScheme="purple" size="md" onClick={handleGoHome}>
              Go to Home
            </Button>
          </VStack>
        </Box>
      </Box>
    );
  }


  return (
    <Box position="relative" zIndex={0} minHeight="100vh" px={6} py={8}>
      <NightSky />

    <Box pt="80px" px={4} textAlign="center" minH="100vh">
      {insight ? (
        <VStack spacing={6}>
          <Heading size="lg" color="purple.300">
            {insight.sign}
          </Heading>
          
          <Text color="gray.100" fontSize="md" maxW="600px" mx="auto">
            {insight.paragraph}
          </Text>

          <Box color="white" textAlign="left" w="100%" maxW="lg" mx="auto">
            <Heading size="md" mb={2}>
              <HStack>
                <FaStar color="white" />
                <Text color="gray.100">Strengths</Text>
              </HStack>
            </Heading>
            <UnorderedList>
              {insight.strengths.map((s: string, i: number) => (
                <ListItem key={i}>{s}</ListItem>
              ))}
            </UnorderedList>

            <Heading size="md" mt={4} mb={2}>
              <HStack>
                <FaHeart color="gray.100" />
                <Text color="gray.100">Weakness</Text>
              </HStack>
            </Heading>
            <UnorderedList>
              {insight.weaknesses.map((w: string, i: number) => (
                <ListItem key={i}>{w}</ListItem>
              ))}
            </UnorderedList>

            <Heading size="md" mt={4} mb={2}>
              <HStack>
                <FaUserFriends color="gray.100" />
                <Text color="gray.100">Compatible Signs</Text>
              </HStack>
            </Heading>
            <UnorderedList>
              {insight.compatibleSigns.map((c: any, i: number) => (
                <ListItem key={i}>{`${c.sign} — ${c.reason}`}</ListItem>
              ))}
            </UnorderedList>
          </Box>

          <Button colorScheme="purple" onClick={handleNext}>
            See Your Fortune
          </Button>
        </VStack>
      ) : (
        <Text>No data found. Please go back and try again.</Text>
      )}
    </Box>
  </Box>
  );
};
