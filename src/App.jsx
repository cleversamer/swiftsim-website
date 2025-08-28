import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "pages/Home";
import { ROUTES } from "client";

const App = () => {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontFamily: "Cairo, sans-serif",
            fontSize: "14px",
          },
        }}
      />

      <Routes>
        <Route path={ROUTES.CLIENT.HOME} element={<Home />} />
        <Route
          path="/"
          element={<Navigate to={ROUTES.CLIENT.HOME} replace />}
        />
        <Route
          path="*"
          element={<Navigate to={ROUTES.CLIENT.HOME} replace />}
        />
      </Routes>
    </>
  );
};

export default App;
