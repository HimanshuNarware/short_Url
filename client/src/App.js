import { Toaster } from 'react-hot-toast';
import Footer from "./pages/Footer";
import Home from "./pages/Home";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Home />
        <Footer />
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
