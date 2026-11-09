
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import AppRoutes from "./routes/approutes";
import Toast from "./components/toast";

function App() {
  return (
    <>
      <Toast />

      <Navbar />
      <AppRoutes />
      <Footer />
    </>
  );
}

export default App;
