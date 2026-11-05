import Navbar from "./components/navbar";
import Footer from "./components/footer";
import AppRoutes from "./routes/approutes";


function App() {
  return (
    <>
      <Navbar />
      <AppRoutes />
      <Footer />
    </>
  );
}

export default App;