import { useReadLocalStorage } from "usehooks-ts"

import '../animista.css'

import Pinpad from "@/components/custom/pinpad";
import PwnedPad from "@/components/custom/pwned";

export default function DashboardPage() {

   const currentUser = useReadLocalStorage<{ user: '', password: '' }>('user');
   const currentTotalLogins = useReadLocalStorage<number>('totalLogins');

   const currentDate = new Date();

   return (<>

      <div className="w-full h-screen items-center px-8 pt-14 overflow-x-hidden">

         <p className="slide-in-top-smaller text-6xl font-bold">Dashboard</p>

         {/* Container 1 */}

         <div className="w-full h-[70svh] flex flex-row items-center gap-8">

            <div className="h-3/4 bg-foreground/10 rounded-lg outline-1 outline-foreground/25 flex flex-col p-8  justify-center">

               <p className="text-md italic">Welcome Back,</p>
               <span className="mb-auto text-2xl font-bold pulsate-bck">{currentUser ? currentUser.user : 'Name'}</span>

               <p className="tracking-in-expand text-2xl font-bold" >0 <span className="text-lg font-normal">Passwords</span></p>
               <p className="tracking-in-expand text-2xl font-bold" >0 <span className="text-lg font-normal">Issues</span></p>
               <p className="tracking-in-expand text-2xl font-bold" >{currentTotalLogins} <span className="text-lg font-normal">Logins</span></p>

               <div className="mt-auto w-full h-fit flex flex-row items-center justify-center gap-2">

                  <button className="w-full h-fit p-2 px-8 rounded-lg bg-foreground outline-1 outline-foreground/20 hover:bg-foreground/10 hover:text-green-400 duration-200 text-accent">New</button>
                  <button className="w-full h-fit p-2 px-8 rounded-lg bg-foreground outline-1 outline-foreground/20 hover:bg-foreground/10 hover:text-blue-400 duration-200 text-accent">Edit</button>

               </div>

            </div>

            <div className="w-full h-3/4 bg-foreground/10 rounded-lg outline-1 outline-foreground/25 flex flex-row p-8 gap-4 items-center">

               <Pinpad />
               <PwnedPad />

               <p className="ml-auto self-start text-4xl text-right font-bold slide-in-top-smaller">

                  {currentDate.getMonth() + 1 <= 9 ? <>0{currentDate.getMonth() + 1}</> : <>{currentDate.getMonth() + 1}</>} / {currentDate.getDate() <= 9 ? <>0{currentDate.getDate()}</> : currentDate.getDate()} / {currentDate.getFullYear()}

               </p>

            </div>

         </div>

         {/*  */}

         {/* Container 2 */}

         <div className="w-full h-[50svh] flex items-center"></div>

         {/*  */}

      </div>

   </>)

}