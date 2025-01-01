import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Router from './routes';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from '@tanstack/react-query';
import "./index.css";


function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ToastContainer />
          <Router />
        </BrowserRouter>
      </QueryClientProvider>
    </>
  )
}

export default App
