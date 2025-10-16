import { VaultIcon, CoatHangerIcon, UserIcon } from "@phosphor-icons/react";

export default function Navbar() {

   return (
      <>

         <div className="p-8 w-[75svw] h-15 max-h-20 bg-foreground/2 outline-1 outline-foreground/10 rounded-full flex justify-center items-center text-foreground text-2xl gap-10">

            {/* LOGO */}

            <a className="font-extrabold mr-auto" href="#">FortiPass</a>

            {/*  */}

            {/* VAULT */}

            <a className="font-medium text-xl px-4 py-2 rounded-full hover:bg-foreground/10 duration-400 flex flex-row items-center justify-center gap-2 group" href="#">

               <VaultIcon weight="fill" size={32} />

               <div className="text-foreground/0 text-[0rem] group-hover:text-foreground/100 group-hover:text-xl duration-400">Vault</div>

            </a>

            {/*  */}

            {/* CUSTOMIZE */}

            <a className="font-medium text-xl px-4 py-2 rounded-full hover:bg-foreground/10 duration-400 flex flex-row items-center justify-center gap-2 group" href="#">

               <CoatHangerIcon weight="fill" size={32} />

               <div className="text-foreground/0 text-[0rem] group-hover:text-foreground/100 group-hover:text-xl duration-400">Customize</div>

            </a>

            {/*  */}

            {/* USER */}

            <a className="font-medium text-xl px-4 py-2 ml-auto rounded-full hover:bg-foreground/10 duration-400 flex flex-row items-center justify-center gap-2 group" href="#">

               <UserIcon size={32} />

               <div className="text-foreground/0 text-[0rem] group-hover:text-foreground/100 group-hover:text-xl duration-400">User</div>

            </a>

            {/*  */}

         </div>

      </>
   )

}
