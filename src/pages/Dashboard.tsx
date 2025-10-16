import { useReadLocalStorage } from "usehooks-ts"

export default function DashboardPage() {

    const currentUser = useReadLocalStorage('user');

    return (<>

        <div className="w-full h-screen items-center px-8 pt-8">

            <p className="text-6xl font-bold">Dashboard</p>

            {/* Container 1 */}

            <div className="w-full h-[70svh] flex flex-row items-center">

                <div className="h-3/4 aspect-square bg-foreground/10 rounded-lg outline-1 outline-foreground/25 flex flex-col p-8">

                    <p className="text-2xl">Hey,<br /><span className="italic font-bold">{currentUser?.user}</span></p>

                </div>

            </div>

            {/*  */}

            {/* Container 2 */}

            <div className="w-full h-[50svh] flex items-center"></div>

            {/*  */}

        </div>

    </>)

}