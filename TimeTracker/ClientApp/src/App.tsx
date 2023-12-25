import {AppRoutes} from "./pages";
import {BrowserRouter} from "react-router-dom";
import AuthMiddleware from "@utils/auth/AuthMiddleware.tsx";


function App() {


    return (
        <BrowserRouter basename="/">
            <AuthMiddleware>
                <AppRoutes/>
            </AuthMiddleware>
        </BrowserRouter>
    )
}

export default App
