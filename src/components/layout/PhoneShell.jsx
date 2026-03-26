import { BottomNav } from "./BottomNav";

export function PhoneShell({
  children,
  showNav = false,
  activeTab,
  onNavigate,
}) {
  return (
    <div className="w-full max-w-full sm:max-w-[430px] mx-auto bg-white min-h-screen sm:min-h-[820px] sm:rounded-[32px] sm:border sm:border-black/5 sm:shadow-[0_18px_60px_rgba(15,61,62,0.12)] overflow-hidden flex flex-col">
      <div className="flex-1">{children}</div>

      {showNav ? (
        <BottomNav active={activeTab} onNavigate={onNavigate} />
      ) : null}
    </div>
  );
}