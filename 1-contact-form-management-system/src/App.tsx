import { useEffect } from "react";

import { AppRoutes } from "src/routes/AppRoutes";
import { useAuthContext } from "src/contexts/authContext";

function App() {
  const {
    values: { loading },
    functions: { autoLogin },
  } = useAuthContext();

  useEffect(() => {
    const tryToLogin = async () => {
      await autoLogin();
    };

    tryToLogin();
  }, []);

  return loading ? null : <AppRoutes />;
}

export default App;
