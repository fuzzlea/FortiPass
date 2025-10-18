import '../../animista.css';

export default function Pinpad() {

    return (<>

        <div className="slide-in-blurred-left w-1/3 outline-1 outline-foreground/20 aspect-square bg-foreground/5 rounded-lg flex flex-col p-6 gap-2">

            <p className="text-4xl font-bold self-center mb-6">Pin</p>

            <div className="flex w-full h-fit flex-row items-center pr-2" >
                <p className="italic text-md">Current Pin:</p>
                <p className="text-xl font-bold ml-auto tracking-in-expand">0000</p>
            </div>

            <div className="flex w-full h-fit flex-row items-center" >
                <p className="italic text-md">New Pin:</p>
                <input type="password" placeholder="0000" className="tracking-in-expand w-3/5 h-8 bg-accent rounded-lg text-xl font-bold ml-auto text-end px-2 py-1"></input>
            </div>

            <button className="w-full h-10 bg-foreground text-accent outline-1 outline-foreground/20 rounded-lg mt-auto hover:bg-foreground/5 hover:text-green-400 duration-200">Confirm</button>

        </div>

    </>)

}