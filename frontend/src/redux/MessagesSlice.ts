import { createSlice } from "@reduxjs/toolkit";
import { CreateDataSlice } from "../framework@labs/redux/DataManager";
import { MessageModel } from "../models/MessageModel";

export const MessagesSlice = createSlice(
    CreateDataSlice<MessageModel>("messagesSlice")
  );