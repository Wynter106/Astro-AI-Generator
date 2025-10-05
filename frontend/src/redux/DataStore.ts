import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { MessagesSlice } from "./MessagesSlice";


// Persist configuration for the persisted reducers
const rootPersistConfig = {
    key: "storage",
    storage,
  };
  
  const persistedReducer = combineReducers({
    messagesSlice: MessagesSlice.reducer,
  });
  
  const nonPersistedReducer = combineReducers({
    
  });
  
  const rootReducer = combineReducers({
    persisted: persistReducer(rootPersistConfig, persistedReducer),
    //nonPersisted: nonPersistedReducer,
  });
  
  export const DataStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });

  
  export const persistor = persistStore(DataStore);
  
  export type RootState = ReturnType<typeof rootReducer>;
  export type AppDispatch = typeof DataStore.dispatch;