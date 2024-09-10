import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from "../components/Layout";
import { ChakraProvider } from '@chakra-ui/react';
import Home from "../components/Home";

const App: FC = () => {
  return(
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout/>}>
            <Route path='/' element={<Home/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  )
};

export default App;
