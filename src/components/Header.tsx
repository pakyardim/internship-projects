import { AnimatedLogo } from "src/components/ui/AnimatedLogo";
import pokemonLogo from "src/assets/pokemon-logo.png";

export function Header() {
  return (
    <header className="bg-tertiary flex justify-between items-center border-b-2 border-tertiaryDark px-10 border-collapse bg-secondary">
      <AnimatedLogo />
      <nav>
        <ul className="flex w-full h-20">
          <li className="cursor-pointer text-dark font-secondary h-full flex items-center justify-center px-8">
            Home
          </li>
          <li className="cursor-pointer text-dark font-secondary h-full flex items-center justify-center px-8">
            Pokédex
          </li>
          <li className="cursor-pointer text-dark font-secondary h-full flex items-center justify-center px-8">
            About Us
          </li>
          <li className="cursor-pointer text-dark font-secondary h-full flex items-center justify-center px-8">
            Contact
          </li>
        </ul>
      </nav>
      <img src={pokemonLogo} className="w-12 h-12" alt="pokemon logo" />
    </header>
  );
}
