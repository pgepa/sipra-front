import { Separator } from "@/components/ui/separator";
import { AccountMenu } from '@/components/AccountMenu';
import logo from '@/assets/LogoSIDA.svg'
export function Header() {



    return (
        <div className={`border-b`}>
            <div className="flex h-16 items-center gap-6 justify-start px-6 bg-gradient-to-r from-indigo-500 shadow-xl">
                <div className="flex items-center gap-3 text-white">
                <img className="w-28 text-white" src={logo} alt="Logo" />
                    <Separator orientation="vertical" className="h-6 hidden lg:block" />
                </div>

                <div className='ml-auto flex items-center gap-2'>
                    <AccountMenu />
                </div>

            </div>
        </div>
    );
}
