import { Separator } from "@/components/ui/separator";

import { SiAwssecretsmanager } from "react-icons/si";

export function Header() {

 

  return (
    <div className={`border-b`}>
      <div className="flex h-16 items-center gap-6 justify-start px-6 bg-gradient-to-r from-indigo-500 shadow-xl">
        <div className="flex items-center gap-3 text-white">
          <SiAwssecretsmanager className="h-6 w-6" />
          <span className="font-semibold ">SIPRA</span>
          <Separator orientation="vertical" className="h-6 hidden lg:block" />
        </div>

      </div>
    </div>
  );
}
