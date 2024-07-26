export function AnimatedLogo() {
  return (
    <div className="uppercase cursor-pointer text-slide flex items-center text-primary font-primary font-bold text-3xl">
      <span>Contact</span>
      <div className="text-wrap">
        <div className="text-3xl text text-darkBackground dark:text-light relative">
          <span className="block">form</span>
          <span className="block">info</span>
          <span className="block">page</span>
        </div>
      </div>
      <span>Hub</span>
    </div>
  );
}
