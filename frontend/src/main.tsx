import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { DataStore, persistor } from "./redux/DataStore";
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <Provider store={DataStore}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
</Provider>
  // </StrictMode>,
)
