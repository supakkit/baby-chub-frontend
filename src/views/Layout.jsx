import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";


export function Layout() {
    return (
        <>
            <Nav />
            <div>
                <Outlet />
            </div>
        </>
    );
}

