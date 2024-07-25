import { Header } from "src/components/Header";
import { Hero } from "src/components/Hero";

function App() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        <Hero />
      </main>
    </>
  );
}

export default App;
