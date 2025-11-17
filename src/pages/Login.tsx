import { useLocalStorage, useSessionStorage } from 'usehooks-ts';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { KeyholeIcon } from '@phosphor-icons/react';
import type { BaseSyntheticEvent } from 'react';

export default function LoginPage() {

    const [currentUser, setCurrentUser] = useLocalStorage('user', { user: '', password: 'INIT PASS' })
    const [totalLogins, setTotalLogins] = useLocalStorage('totalLogins', 0)

    const [attemptedUser, setAttemptedUser] = useSessionStorage('attempted-user', { "user": "", "password": "" })
    const [_loggedIn, setLoggedIn] = useSessionStorage('loggedIn', false)

    const navigate = useNavigate();

    const loginFormHandle = (e: BaseSyntheticEvent) => {

        e.preventDefault();

        const form = new FormData(e.target);
        const username = form.get('username-input') as string;
        const password = form.get('password-input') as string;

        setAttemptedUser({ 'user': username, 'password': password })

    }

    const handlePasswordCheck = (attemptedPassword: String) => {

        var minChars = 8;
        var minSpecialChars = 1;
        var minCapitals = 1;
        var minLowers = 1;
        var spacesAllowed = 0;

        var specialCharCount = 0;
        var capitalCount = 0;
        var lowerCount = 0;
        var spacesCount = 0;

        var characters = attemptedPassword.split("");
        var specialChars = "!@#$%^&*()_+-=[]{}|;':\",.<>/?`~";

        for (var i = 0; i < characters.length; i++) {

            var char = characters[i]

            if (char >= "A" && char <= "Z") { capitalCount++ }
            if (char >= "a" && char <= "z") { lowerCount++ }
            if (specialChars.includes(char)) { specialCharCount++ }
            if (char === " ") { spacesCount++ }

        }

        var lengthCheck = attemptedPassword.length >= minChars;
        var capitalCheck = capitalCount >= minCapitals;
        var lowerCheck = lowerCount >= minLowers;
        var specialCheck = specialCharCount >= minSpecialChars;
        var spaceCheck = spacesCount <= spacesAllowed;

        var allCheckPass = lengthCheck && capitalCheck && lowerCheck && specialCheck && spaceCheck;

        return { valid: allCheckPass, errors: { lengthCheck, capitalCheck, lowerCheck, specialCheck, spaceCheck } }

    }

    const forgotPassword = () => {

        setCurrentUser({ user: '', password: 'INIT PASS' })

        setTotalLogins(0)

    }

    const logIn = () => {

        setLoggedIn(true)
        navigate('/loggedin')

        setTotalLogins(totalLogins + 1)

    }

    const incorrectLogin = () => {

        window.location.reload();

    }

    useEffect(() => {

        if (currentUser.password === 'INIT PASS') {

            if (handlePasswordCheck(attemptedUser.password).valid) {

                setCurrentUser({ user: attemptedUser.user, password: attemptedUser.password })

            }

        }

        if (JSON.stringify(attemptedUser) === JSON.stringify(currentUser)) {
            logIn();
        } else { attemptedUser.user == "" ? console.log("No Data") : incorrectLogin(); }

    }, [attemptedUser])

    useEffect(() => {

        setAttemptedUser({ 'user': '', 'password': '' });

        setLoggedIn(false);

        setTotalLogins(totalLogins)

    }, [])

    return (<>

        {console.log(currentUser)}

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

                <button onClick={forgotPassword} type='button' className='underline italic text-sm'>

                    {currentUser.user === "" && currentUser.password === "INIT PASS" ? <></> : <>Forgot Password?</>}

                </button>

                <button type='submit' className='mt-auto w-2/3 h-10 hover:bg-foreground outline-1 hover:outline-accent-foreground rounded-lg text-xl hover:text-accent bg-accent/10 outline-foreground/10 text-foreground duration-200' >

                    {currentUser.user === "" && currentUser.password === "INIT PASS" ? <>Create Account</> : <>Login</>}

                </button>

            </form>

        </div>

        {/*  */}

    </>)

}