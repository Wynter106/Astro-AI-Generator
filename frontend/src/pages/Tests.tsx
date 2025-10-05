import { Box, Button, Heading, Input, VStack } from "@chakra-ui/react"
import { useDispatch } from "react-redux";
import { MessageModel } from "../models/MessageModel";
import { useFetchList } from "../hooks/useFetchList";
import { MessagesSlice } from "../redux/MessagesSlice";
import { PreparePostThunkResponse } from "../framework@labs/redux/DataManager";
import { useState } from "react";

export const Tests = () => {
    const dispatch = useDispatch();
    const messages = useFetchList<MessageModel>("http://localhost:5000", MessagesSlice);
    const [message, setMessage] = useState<string|undefined>();



    const onButtonClick = () => {
        if (!message) return;
        
        const postThunk = PreparePostThunkResponse("http://localhost:5000/post", { "message": message  } , MessagesSlice.actions.add);
        dispatch(postThunk);
    }

    return <>
        <VStack mt="5rem">
            <Heading>Send Message</Heading>
            <Input w="40rem" placeholder="Type your message here" onChange={(e => setMessage(e.target.value))} />
            <Button onClick={onButtonClick}>Post Message</Button>
            <Box pt="5rem">
                <Heading size="lg">Messages</Heading>
                <ul>
                    {messages && messages.map((message: MessageModel, index: number) => (
                        <li key={index}>{message.message}</li>
                    ))}
                </ul>
            </Box>
        </VStack>
        
    </>
}