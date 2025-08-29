import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "pages/HomePage";
import RefreshPage from "pages/RefreshPage";
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
        <Route path={ROUTES.CLIENT.REFRESH} element={<RefreshPage />} />
        <Route path={ROUTES.CLIENT.HOME} element={<HomePage />} />
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
