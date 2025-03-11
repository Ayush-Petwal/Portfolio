"use client";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useRef, useId, useEffect } from "react";

interface SlideData {
  title: string;
  button: string;
  src: string;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);

  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const { src, button, title } = slide;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[70vmin] h-[70vmin] mx-[4vmin] z-10 "
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? "scale(0.98) rotateX(8deg)"
              : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-[1%] overflow-hidden transition-all duration-150 ease-out"
          style={{
            transform:
              current === index
                ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
                : "none",
          }}
        >
          <img
            className="absolute inset-0 w-[120%] h-[120%] object-cover opacity-100 transition-opacity duration-600 ease-in-out"
            style={{
              opacity: current === index ? 1 : 0.5,
            }}
            alt={title}
            src={src}
            onLoad={imageLoaded}
            loading="eager"
            decoding="sync"
          />
          {current === index && (
            <div className="absolute inset-0 bg-black/30 transition-all duration-1000" />
          )}
        </div>

        <article
          className={`relative p-[4vmin] transition-opacity duration-1000 ease-in-out ${
            current === index ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <h2 className="text-lg md:text-2xl lg:text-4xl font-semibold  relative">
            {title}
          </h2>
          <div className="flex justify-center">
            <button className="mt-6  px-4 py-2 w-fit mx-auto sm:text-sm text-black bg-white h-12 border border-transparent text-xs flex justify-center items-center rounded-2xl hover:shadow-lg transition duration-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              {button}
            </button>
          </div>
        </article>
      </li>
    </div>
  );
};

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({
  type,
  title,
  handleClick,
}: CarouselControlProps) => {
  return (
    <button
      className={`w-10 h-10 flex items-center mx-2 justify-center bg-neutral-200 dark:bg-neutral-800 border-3 border-transparent rounded-full focus:border-[#6D64F7] focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200" />
    </button>
  );
};

interface CarouselProps {
  slides: SlideData[];
}

export function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const handlePreviousClick = () => {
    setDirection("left");
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
  };

  const handleNextClick = () => {
    setDirection("right");
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setDirection(index > current ? "right" : "left");
      setCurrent(index);
    }
  };

  const id = useId();

  return (
    <div
      className="relative w-[70vmin] h-[70vmin] mx-auto"
      aria-labelledby={`carousel-heading-${id}`}
    >
      <ul
        className={`absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out ${
          direction === "right" ? "slide-right" : "slide-left"
        }`}
        style={{
          transform: `translateX(-${current * (100 / slides.length)}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <Slide
            key={index}
            slide={slide}
            index={index}
            current={current}
            handleSlideClick={handleSlideClick}
          />
        ))}
      </ul>

      <div className="absolute flex justify-center w-full top-[calc(100%+1rem)]">
        <CarouselControl
          type="previous"
          title="Go to previous slide"
          handleClick={handlePreviousClick}
        />

        <CarouselControl
          type="next"
          title="Go to next slide"
          handleClick={handleNextClick}
        />
      </div>
    </div>
  );
}

// SkillCarousel component
interface SkillItem {
  id: number;
  title: string;
  img: string;
}

interface SkillSlideProps {
  skill: SkillItem;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const SkillSlide = ({
  skill,
  index,
  current,
  handleSlideClick,
}: SkillSlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);

  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const { img, title } = skill;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d] pt-6">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center opacity-100 transition-all duration-500 ease-out w-[25vmin] h-[25vmin] mx-[2vmin] z-10"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? "scale(0.85) rotateX(8deg)"
              : "scale(1.1) rotateX(0deg)",
          transition: "transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)",
          transformOrigin: "bottom",
          zIndex: current === index ? 10 : 0,
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-black-300 rounded-xl overflow-hidden transition-all duration-300 ease-out flex flex-col items-center justify-center p-3"
          style={{
            transform:
              current === index
                ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
                : "none",
            boxShadow:
              current === index
                ? "0 15px 30px rgba(0,0,0,0.3), 0 0 15px rgba(128, 90, 213, 0.3)"
                : "0 5px 15px rgba(0,0,0,0.1)",
          }}
        >
          <div className="w-full h-2/3 relative flex items-center justify-center">
            <img
              className="w-full h-full object-contain transition-all duration-600 ease-in-out p-2"
              style={{
                opacity: current === index ? 1 : 0.6,
                filter: `brightness(${current === index ? 1.2 : 1})`,
                transform: current === index ? "scale(1.1)" : "scale(1)",
              }}
              alt={title}
              src={img}
              onLoad={imageLoaded}
              loading="eager"
              decoding="sync"
            />
          </div>
          <h3 className="text-sm md:text-base font-medium mt-1 text-white">
            {title}
          </h3>
        </div>
      </li>
    </div>
  );
};

interface SkillCarouselProps {
  skills: SkillItem[];
}

export function SkillCarousel({ skills }: SkillCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const handlePreviousClick = () => {
    setDirection("left");
    const previous = current - 1;
    setCurrent(previous < 0 ? skills.length - 1 : previous);
  };

  const handleNextClick = () => {
    setDirection("right");
    const next = current + 1;
    setCurrent(next === skills.length ? 0 : next);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setDirection(index > current ? "right" : "left");
      setCurrent(index);
    }
  };

  const id = useId();

  // Calculate how many items to show based on screen width
  const [itemsToShow, setItemsToShow] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(3);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(5);
      } else {
        setItemsToShow(7);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Updated getVisibleSkills function for better cycling
  const getVisibleSkills = () => {
    const halfVisible = Math.floor(itemsToShow / 2);
    const skillsCount = skills.length;

    // Create an effective index that can be negative
    let effectiveStart = current - halfVisible;

    // Create a virtual array that we'll populate with correctly indexed skills
    const visibleItems = [];

    // Add the correct number of items with proper cycling
    for (let i = 0; i < itemsToShow; i++) {
      // Calculate the wrapped index
      let index = effectiveStart + i;
      // Properly handle negative indices by adding skillsCount until positive
      while (index < 0) index += skillsCount;
      // Apply modulo for positive indices
      index = index % skillsCount;

      // Add the skill at the calculated index
      visibleItems.push({
        ...skills[index],
        originalIndex: index,
      });
    }

    return visibleItems;
  };

  const visibleSkills = getVisibleSkills();

  return (
    <div
      className="relative w-full max-w-5xl mx-auto py-16"
      aria-labelledby={`skill-carousel-heading-${id}`}
    >
      <div className="overflow-hidden mx-auto">
        <ul
          className={`flex justify-center items-center transition-all duration-700 ease-out px-4 ${
            direction === "right" ? "slide-right" : "slide-left"
          }`}
        >
          {visibleSkills.map((skill, index) => {
            const isCurrent = skill.originalIndex === current % skills.length;
            return (
              <SkillSlide
                key={`${skill.id}-${index}`}
                skill={skill}
                index={skill.originalIndex}
                current={isCurrent ? current : -1}
                handleSlideClick={handleSlideClick}
              />
            );
          })}
        </ul>
      </div>

      <div className="flex justify-center w-full mt-10">
        <CarouselControl
          type="previous"
          title="Go to previous skill"
          handleClick={handlePreviousClick}
        />
        <CarouselControl
          type="next"
          title="Go to next skill"
          handleClick={handleNextClick}
        />
      </div>
    </div>
  );
}

// Add CSS for sliding animation
<style jsx>{`
  .slide-right {
    animation: slide-right 1s forwards;
  }
  .slide-left {
    animation: slide-left 1s forwards;
  }
  @keyframes slide-right {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
  @keyframes slide-left {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`}</style>;
