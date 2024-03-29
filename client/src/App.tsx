import { BrowserRouter, Route, Routes } from "react-router-dom";
import Room from "./pages/Room";
import Home from "./pages/Home";
import { SocketProvider } from "./provider/Socket";

const App = () => {
  return (
    <BrowserRouter>
      <SocketProvider>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="/room/:roomId" element={<Room />} />
          </Route>
        </Routes>
      </SocketProvider>
    </BrowserRouter>
  );
};
export default App;
