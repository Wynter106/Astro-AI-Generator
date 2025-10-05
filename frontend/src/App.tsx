import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { Home } from "./pages/Home";
import { InsightResult } from "./pages/InsightResult";
import { FortuneResult } from "./pages/FortuneResult";

export const App = () => (
  <ChakraProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="result/insight" element={<InsightResult />} />
          <Route path="result/fortune" element={<FortuneResult />} />
        </Route>
      </Routes>
    </Router>
  </ChakraProvider>
);
