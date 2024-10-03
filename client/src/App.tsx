import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import Loader from "./components/loader";

const Dashboard = lazy(() => import("./components/dashboard"));
const Reviews = lazy(() => import("./components/reviews"));

function App() {
  return (
    <BrowserRouter>
      <div className="">
        <Header />
        <div className="px-paddingX">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/:movieName/reviews" element={<Reviews />} />

              {/* <Route path="*" element={<Error />} /> */}
            </Routes>
          </Suspense>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
