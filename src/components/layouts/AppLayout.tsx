import { PhoneMockup } from "@/components/PhoneMockup";
import { NavigationMenu } from "@/components/NavigationMenu";
import { BackgroundGradient } from "../BackgroundGradient";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="md:hidden h-full relative">
        <BackgroundGradient />
        {children}
      </div>

      <div className="hidden md:block">
        <PhoneMockup>
          <BackgroundGradient />
          {children}
        </PhoneMockup>
      </div>
      <NavigationMenu />
    </>
  );
}
