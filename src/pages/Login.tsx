import { useLocalStorage, useSessionStorage } from 'usehooks-ts';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { KeyholeIcon } from '@phosphor-icons/react';
import type { BaseSyntheticEvent } from 'react';

export default function LoginPage() {

    const [currentUser, setCurrentUser] = useLocalStorage('user', { "user": "", "password": "" })
    const [attemptedUser, setAttemptedUser] = useSessionStorage('attempted-user', { "user": "", "password": "" })
    const [loggedIn, setLoggedIn] = useSessionStorage('loggedIn', false)

    const navigate = useNavigate();

    const loginFormHandle = (e: BaseSyntheticEvent) => {

        e.preventDefault();

        const form = new FormData(e.target);
        const username = form.get('username-input') as string;
        const password = form.get('password-input') as string;

        setAttemptedUser({ 'user': username, 'password': password })

    }

    const logIn = () => {

        setLoggedIn(true)
        navigate('/loggedin')

    }

    const incorrectLogin = () => {

        window.location.reload();

    }

    useEffect(() => {

        if (JSON.stringify(attemptedUser) === JSON.stringify(currentUser)) {
            logIn();
        } else { attemptedUser.user == "" ? console.log("No Data") : incorrectLogin(); }

    }, [attemptedUser])

    useEffect(() => { setLoggedIn(false); setAttemptedUser({ 'user': '', 'password': '' }) }, [])

    return (<>

        {/* CONTAINER */}

        <div className="w-screen h-screen p-10 flex flex-col items-center justify-center">

            {/* Login Form */}

            <form method="post" onSubmit={loginFormHandle} className="px-10 pt-10 py-6 w-[30svw] aspect-square bg-foreground/2 outline-1 outline-foreground/10 rounded-lg flex flex-col gap-8 items-center">

                <div className="w-full h-fit flex flex-row items-center justify-center gap-1">

                    <KeyholeIcon weight='fill' size={50} />

                    <p className='font-bold text-[3rem]'>FortiPass</p>

                </div>

                <div className="w-full h-fit flex flex-col gap-1">

                    <p className="text-sm text-foreground/10" >Username</p>
                    <input name='username-input' className="w-full h-10 bg-accent/10 outline-1 outline-foreground/10 rounded-lg px-4"></input>

                </div>

                <div className="w-full h-fit flex flex-col gap-1">

                    <p className="text-sm text-foreground/10" >Password</p>
                    <input name='password-input' type='password' className="w-full h-10 bg-accent/10 outline-1 outline-foreground/10 rounded-lg px-4"></input>

                </div>

                <button type='button' className='underline italic text-sm'>Forgot Password?</button>

                <button type='submit' className='mt-auto w-2/3 h-10 hover:bg-foreground outline-1 hover:outline-accent-foreground rounded-lg text-xl hover:text-accent bg-accent/10 outline-foreground/10 text-foreground duration-200' >Login</button>

            </form>

        </div>

        {/*  */}

    </>)

}