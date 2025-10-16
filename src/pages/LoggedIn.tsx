import { useEffect } from "react";
import { useSessionStorage } from "usehooks-ts";
import { useNavigate } from 'react-router-dom';

import Navbar from "@/components/custom/navbar"

import DashboardPage from "./Dashboard";
import VaultPage from "./Vault";
import CustomizationPage from "./Customization";

export default function LoggedInPage() {

    const [loggedIn] = useSessionStorage('loggedIn', undefined);

    const [currentPage] = useSessionStorage('currentPage', 'dashboard')

    const navigate = useNavigate();

    const customPageReturn = () => {

        switch (currentPage) {

            case "dashboard":
                return <DashboardPage />
                break;
            case "vault":
                return <VaultPage />
                break;
            case "customization":
                return <CustomizationPage />
                break

        }

    }

    useEffect(() => {

        loggedIn ? console.log('logged in') : navigate('/login')

    }, [])

    return (

        <>

            <div className="flex flex-col w-screen h-screen items-center p-4">

                <Navbar />

                {customPageReturn()}

            </div>

        </>

    )

}