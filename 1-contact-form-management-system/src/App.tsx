import { Header } from "src/components/Header";
import { Footer } from "src/components/Footer";
import { Contact } from "src/components/Contact";

function App() {
  return (
    <div className="lg:container mx-auto flex flex-col min-h-screen">
      <Header />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
