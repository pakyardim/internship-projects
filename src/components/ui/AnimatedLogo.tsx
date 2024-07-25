export function AnimatedLogo() {
  return (
    <div className="cursor-pointer text-slide flex items-center text-primary font-primary font-bold text-3xl">
      <span>Poké</span>
      <div className="text-wrap">
        <div className="text text-secondary relative mr-1">
          <span className="block">mon</span>
          <span className="block">dex</span>
          <span className="block">ball</span>
        </div>
      </div>
      <span>Corpus</span>
    </div>
  );
}
