import { PhoneMockup } from "@/components/PhoneMockup";
import { NavigationMenu } from "@/components/NavigationMenu";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="md:hidden w-full">
        <div className="relative w-full min-h-[852px] overflow-auto bg-neutral-50">
          {children}
        </div>
      </div>

      <div className="hidden md:block">
        <PhoneMockup>
          <div className="relative w-full min-h-[852px] overflow-auto bg-neutral-50">
            {children}
          </div>
        </PhoneMockup>
      </div>
      <NavigationMenu />
    </>
  );
}
