import heroImg from "src/assets/hero.png";

export function Hero() {
  const text = "Get ready to dive into the world of Pokémon.";
  const textArray = text.split(/(?!$)/u);

  return (
    <section className="text-darker flex gap-8 p-20 border-b-2 border-tertiaryDark items-center bg-tertiary">
      <div className="flex font-secondary flex-col gap-8 w-1/2 justify-center">
        <h1 className="hero-text text-6xl w-[90%]">
          {textArray.map((char, index) => (
            <span
              key={index}
              className="inline-block"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
        <p className="animated-text font-secondary">
          This website is a community-driven project that aims to help you find
          the Pokémon you are looking for. You can search for a Pokémon by its
          name or its number.
        </p>
        <div className="flex gap-4">
          <button className="hover:scale-105 btn bg-secondary text-white px-8 py-4 font-bold border border-black">
            Search Pokémons
          </button>
          <button className="hover:scale-105 btn bg-white text-secondary px-8 py-4 font-bold border border-black">
            Contact Us
          </button>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <img src={heroImg} alt="ash and pikachu" className="w-full h-full" />
      </div>
    </section>
  );
}
