import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Router from './routes';
import "./index.css";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store/store';
import { AllCommunityModule, ModuleRegistry, } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

function App() {

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <ToastContainer />
            <Router />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </>
  )
}

export default App
