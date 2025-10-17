import { useReadLocalStorage } from "usehooks-ts"

import '../animista.css'

export default function DashboardPage() {

    const currentUser = useReadLocalStorage<{ user: '', password: '' }>('user');

    return (<>

        <div className="w-full h-screen items-center px-8 pt-14">

            <p className="slide-in-top-smaller text-6xl font-bold">Dashboard</p>

            {/* Container 1 */}

            <div className="w-full h-[70svh] flex flex-row items-center">

                <div className="h-3/4 aspect-square bg-foreground/10 rounded-lg outline-1 outline-foreground/25 flex flex-col p-8  justify-center">

                    <p className="text-md italic">Welcome Back,</p>
                    <span className="mb-auto text-2xl font-bold pulsate-bck">{currentUser ? currentUser.user : 'Name'}</span>

                    <p className="tracking-in-expand text-2xl font-bold" >0 <span className="text-lg font-normal">Passwords</span></p>
                    <p className="tracking-in-expand text-2xl font-bold" >0 <span className="text-lg font-normal">Issues</span></p>
                    <p className="tracking-in-expand text-2xl font-bold" >3 <span className="text-lg font-normal">Logins</span></p>

                    <div className="mt-auto w-full h-fit flex flex-row items-center justify-center gap-4">

                        <button className="w-full h-fit p-2 rounded-lg bg-foreground outline-1 outline-foreground/20 hover:bg-foreground/10 hover:text-green-400 duration-200 text-accent">New Password</button>
                        <button className="w-full h-fit p-2 rounded-lg bg-foreground outline-1 outline-foreground/20 hover:bg-foreground/10 hover:text-blue-400 duration-200 text-accent">Edit Passwords</button>


                    </div>

                </div>

            </div>

            {/*  */}

            {/* Container 2 */}

            <div className="w-full h-[50svh] flex items-center"></div>

            {/*  */}

        </div>

    </>)

}