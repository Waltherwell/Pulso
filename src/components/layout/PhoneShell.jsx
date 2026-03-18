import { BottomNav } from "./BottomNav";

export function PhoneShell({
  children,
  showNav = false,
  activeTab,
  onNavigate,
}) {
  return (
    <div className="w-full max-w-sm mx-auto rounded-[30px] bg-white shadow-xl overflow-hidden border border-black/5 flex flex-col min-h-[820px]">
      <div className="flex-1">{children}</div>
      {showNav ? (
        <BottomNav active={activeTab} onNavigate={onNavigate} />
      ) : null}
    </div>
  );
}