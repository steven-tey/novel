export function TailwindIndicator() {
  if (process.env.NODE_ENV === "production") return null;
  
  return (
    <div
      className="fixed bottom-5 left-5 z-50 flex items-center justify-center rounded-full border-2 border-border/50 bg-muted/50 px-3 py-1 font-mono text-xs shadow backdrop-blur">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  )
}
