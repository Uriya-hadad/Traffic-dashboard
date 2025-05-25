import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import Dashboard from "./pages/TrafficDashboard.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import SignInPage from "./pages/SignIn.tsx";
import {RequireAuth} from "./components";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<MainLayout/>}>
            <Route index element={<SignInPage/>}/>
            <Route path="dashboard" element={
                <RequireAuth>
                    <Dashboard/>
                </RequireAuth>
            }/>
        </Route>
    )
);

const App = () => {
    return <RouterProvider router={router}/>
};

export default App;
