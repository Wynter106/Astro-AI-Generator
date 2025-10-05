import { Box, Text } from '@chakra-ui/react';

export const Result = () => {
  const result = localStorage.getItem('astro_result');

  return (
    <Box p={8}>
      <Text whiteSpace="pre-wrap" fontSize="lg">
        {result || 'No result found.'}
      </Text>
    </Box>
  );
};