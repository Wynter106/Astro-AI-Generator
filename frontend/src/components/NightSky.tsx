import { useEffect, useState } from 'react';
import { getNightSky } from '../api/astroClient';
import { Box, Image } from '@chakra-ui/react';

export const NightSky = () => {
  const stored = localStorage.getItem('astro_result');
  if (!stored) return;
  const parsed = JSON.parse(stored);
  const image = parsed.image ? `data:image/png;base64,${parsed.image}` : '';

  if (!image) return null;

  return (

    <Box
      position="fixed"
      top={0}
      left={0}
      w="100%"
      h="100%"
      zIndex={-1}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      <Image w="100%" src={image}/>
      </Box>
  );
};
