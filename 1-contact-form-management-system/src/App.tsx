import { useState } from "react";
import { Header } from "src/components/Header";
import { Footer } from "src/components/Footer";

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="container mx-auto flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-1">
        <div className="container mx-auto card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
