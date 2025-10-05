import {
  Box,
  Heading,
  Text,
  VStack,
  Icon,
  Button,
} from "@chakra-ui/react";
import {
  FaSun,
  FaGem,
  FaHeart,
  FaMoneyBillWave,
  FaHeartbeat,
} from "react-icons/fa";
import { WarningIcon } from '@chakra-ui/icons';
import { NightSky } from "../components/NightSky";
import { useNavigate } from 'react-router-dom';


export const FortuneResult = () => {
  const raw = localStorage.getItem("astro_result");
  const data = raw ? JSON.parse(raw) : null;
  const fortune = data?.fortune;
  const navigate = useNavigate();

  if (!fortune) {
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
              Please enter your birth data to view your fortune.
            </Text>
            <Button colorScheme="purple" size="md" onClick={() => navigate("/")}>
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

      <VStack spacing={5} maxW="lg" mx="auto">
      <Heading size="lg" color="purple.300">Daily Fortune</Heading>
      <Text color="gray.100"><Icon as={FaSun} mr={2} />{fortune.dailyParagraph}</Text>
      <Text color="gray.100"><Icon as={FaGem} mr={2} />Lucky Item: {fortune.luckyItem}</Text>
      <Text color="gray.100"><Icon as={FaHeart} mr={2} />Love: {fortune.love}</Text>
      <Text color="gray.100"><Icon as={FaMoneyBillWave} mr={2} />Money: {fortune.money}</Text>
      <Text color="gray.100"><Icon as={FaHeartbeat} mr={2} />Health: {fortune.health}</Text>

      <Button colorScheme="purple" onClick={() => navigate('/result/insight')}>
        Back to Insight
      </Button>
    </VStack>

    </Box>
  );
};
