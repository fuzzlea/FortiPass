import '../../animista.css';

export default function PwnedPad() {

    return (<>

        <div className="slide-in-blurred-right w-1/3 outline-1 outline-foreground/20 aspect-square bg-foreground/5 rounded-lg flex flex-col p-6 gap-6">

            <p className="text-4xl font-bold self-center">Pwned</p>

            <div className="flex w-full h-fit flex-col items-center gap-2" >
                <p className="italic text-md">Check Email:</p>
                <input type="email" placeholder="someone@example.com" className="tracking-in-expand w-full h-8 bg-accent rounded-lg text-md text-center px-2 py-1"></input>
            </div>

            <button className="w-full h-10 bg-foreground text-accent outline-1 outline-foreground/20 rounded-lg hover:bg-foreground/5 hover:text-red-400 duration-200">Check</button>

            <div className="flex w-full h-fit flex-col items-center gap-2 mt-auto" >
                <p className="italic text-md">Status:</p>
                <p className="tracking-in-expand w-full text-md text-center px-2 py-1"></p>
            </div>

        </div>

    </>)

}