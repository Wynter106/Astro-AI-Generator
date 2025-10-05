import { useNavigate } from 'react-router-dom';
import { postAstrology } from '../api/astroClient';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useState, useEffect, ChangeEvent } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';

export const Home = () => {
  const navigate = useNavigate();

  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [region, setRegion] = useState('');
  const [regionUnknown, setRegionUnknown] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem("astro_result");
  }, []);


const handleConfirm = async () => {
  setLoading(true);
  
  const input = {
    year: parseInt(year),
    month: parseInt(month),
    day: parseInt(day),
    hour: timeUnknown ? null : parseInt(hour),
    minute: timeUnknown ? null : parseInt(minute),
    region: regionUnknown ? null : region,
  };

  // console.log("✅ confirm clicked");

  try {
    const response = await postAstrology(input, 'insight');
    localStorage.setItem('astro_result', JSON.stringify(response));
    navigate('/result/insight');
  } catch (error) {
    console.error('Fail to fetch API:', error);
  } finally {
    setLoading(false);
  }
};

  const selectStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    backgroundColor: 'white',
    fontSize: '16px',
  };

  const checkboxStyle = {
    accentColor: '#805AD5',
    marginLeft: '8px',
  };

  return (
    <Flex direction="column" align="center" p={8}>
      <Heading mb={6}> Astro</Heading>

      <Stack gap={6} align="start" w="100%" maxW="md">
        {/* DOB */}
        <Box w="100%">
          <Text fontWeight="bold" mb={1}>Date of Birth</Text>
          <HStack>
            <select 
              style={selectStyle}
              value={year} 
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setYear(e.target.value)}
            >
              <option value="">Year</option>
              {Array.from({ length: 100 }, (_, i) => 2025 - i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select 
              style={selectStyle}
              value={month} 
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setMonth(e.target.value)}
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select 
              style={selectStyle}
              value={day} 
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setDay(e.target.value)}
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </HStack>
        </Box>

        {/* Birth time */}
        <Box w="100%">
          <Text fontWeight="bold" mb={1}>Birth Time</Text>
          <HStack>
            <select 
              style={{
                ...selectStyle,
                backgroundColor: timeUnknown ? '#F7FAFC' : 'white',
                opacity: timeUnknown ? 0.4 : 1
              }}
              value={hour} 
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setHour(e.target.value)}
              disabled={timeUnknown}
            >
              <option value="">Hour</option>
              {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <select 
              style={{
                ...selectStyle,
                backgroundColor: timeUnknown ? '#F7FAFC' : 'white',
                opacity: timeUnknown ? 0.4 : 1
              }}
              value={minute} 
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setMinute(e.target.value)}
              disabled={timeUnknown}
            >
              <option value="">Minute</option>
              {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <HStack>
              <input 
                type="checkbox" 
                style={checkboxStyle}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTimeUnknown(e.target.checked)}
              />
              <Text>Unknown</Text>
            </HStack>
          </HStack>
        </Box>

        {/* Region */}
        <Box w="100%">
          <Text fontWeight="bold" mb={1}>Region</Text>
          <HStack>
            <PlacesAutocomplete
              value={region}
              onChange={setRegion}
              onSelect={setRegion}
              searchOptions={{ types: ['(cities)'] }}
              onError={(status) => {
              if (status !== 'ZERO_RESULTS') {
                console.error('Places API Error:', status);
              }
            }}
            >
              {(props: any) => {
                const {
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading,
                } = props;

                return (
                  <Box w="100%">
                    <Input
                      {...getInputProps({
                        placeholder: 'Enter region',
                        disabled: regionUnknown,
                      })}
                      opacity={regionUnknown ? 0.4 : 1}
                    />
                    {suggestions.length > 0 && (
                      <Box
                        bg="white"
                        mt={2}
                        borderRadius="md"
                        boxShadow="md"
                        border="1px solid #E2E8F0"
                        zIndex={99}
                        position="absolute"
                        w="100%"
                      >
                        {loading && <Text p={2}>Loading...</Text>}
                        {suggestions.map((suggestion: any) => {
                          const { key, ...rest } = getSuggestionItemProps(suggestion);
                          return (
                            <Box
                              key={suggestion.placeId}
                              {...rest}
                              p={2}
                              _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                            >
                              {suggestion.description}
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </Box>
                );
              }}
            </PlacesAutocomplete>
            <HStack>
              <input 
                type="checkbox" 
                style={checkboxStyle}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRegionUnknown(e.target.checked)}
              />
              <Text>Unknown</Text>
            </HStack>
          </HStack>
        </Box>

        {/* Confirm */}
        <Button w="100%" colorScheme="purple" onClick={handleConfirm}
        isLoading={loading} loadingText="Loading...">
          Confirm
        </Button>
      </Stack>
    </Flex>
  );
};