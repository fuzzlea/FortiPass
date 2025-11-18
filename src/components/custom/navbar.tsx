import { VaultIcon, CoatHangerIcon, SignOutIcon } from "@phosphor-icons/react";
import { useEffect } from "react";
import { useSessionStorage } from "usehooks-ts";

import '../../animista.css';

export default function Navbar() {

   const [_currentPage, setCurrentPage] = useSessionStorage('currentPage', String);
   const [loggedIn, setLoggedIn] = useSessionStorage('loggedIn', true);

   useEffect(() => { setCurrentPage('dashboard') }, [])

   return (
      <>

         <div className="slide-in-top p-8 w-[75svw] h-15 max-h-20 bg-foreground/2 outline-1 outline-foreground/10 rounded-full flex justify-center items-center text-foreground text-2xl gap-10">

            {/* LOGO */}

            <a className="font-extrabold mr-auto" href="/">FortiPass</a>

            {/*  */}

            {/* VAULT */}

            <button onClick={() => { setCurrentPage('vault') }} className="font-medium text-xl px-4 py-2 rounded-full hover:bg-foreground/10 duration-400 flex flex-row items-center justify-center gap-2 group">

               <VaultIcon weight="fill" size={32} />

               <div className="text-foreground/0 text-[0rem] group-hover:text-foreground/100 group-hover:text-xl duration-400">Vault</div>

            </button>

            {/*  */}

            {/* CUSTOMIZE */}

            <button onClick={() => { setCurrentPage('customization') }} className="font-medium text-xl px-4 py-2 rounded-full hover:bg-foreground/10 duration-400 flex flex-row items-center justify-center gap-2 group">

               <CoatHangerIcon weight="fill" size={32} />

               <div className="text-foreground/0 text-[0rem] group-hover:text-foreground/100 group-hover:text-xl duration-400">Customize</div>

            </button>

            {/*  */}

            {/* SIGN OUT */}

            <a href="/login" onClick={() => { setLoggedIn(false); }} className="font-medium text-xl px-4 py-2 ml-auto rounded-full hover:bg-foreground/10 duration-400 flex flex-row items-center justify-center gap-2 group">

               <SignOutIcon size={32} />

               <div className="text-foreground/0 text-[0rem] group-hover:text-foreground/100 group-hover:text-xl duration-400">Logout</div>

            </a>

            {/*  */}

         </div>

      </>
   )

}
