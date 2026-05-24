import { Toaster } from 'react-hot-toast';
import Home from "./pages/Home";

function App() {
  return (
    <div className="min-h-screen bg-[#141315] checkerboard-bg text-white">
      <Home />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
