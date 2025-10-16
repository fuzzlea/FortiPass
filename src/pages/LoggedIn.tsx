import { useEffect } from "react";
import { useSessionStorage } from "usehooks-ts";
import { useNavigate } from 'react-router-dom';

import Navbar from "@/components/custom/navbar"

export default function LoggedInPage() {

    const [loggedIn] = useSessionStorage('loggedIn', undefined);
    const navigate = useNavigate();

    useEffect(() => {

        loggedIn ? console.log('logged in') : navigate('/login')

    }, [])

    return (

        <>

            <div className="flex flex-col w-screen h-screen items-center p-4">

                <Navbar />

            </div>

        </>

    )

}