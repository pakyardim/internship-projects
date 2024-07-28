interface Props {
  handleClick: () => void;
}

export function AnimatedLogo({ handleClick }: Props) {
  return (
    <div
      onClick={handleClick}
      className="uppercase cursor-pointer flex items-center text-primary font-primary font-bold sm:text-2xl lg:text-3xl"
    >
      <span>Contact</span>
      <div className="text-wrap overflow-hidden text-center h-6 sm:h-8 lg:h-9">
        <div className="sm:text-2xl lg:text-3xl text text-darkBackground dark:text-light relative">
          <span className="block">form</span>
          <span className="block">info</span>
          <span className="block">page</span>
        </div>
      </div>
      <span>Hub</span>
    </div>
  );
}
