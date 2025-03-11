import React from "react";
import { skills } from "@/data";
import { SkillCarousel } from "./ui/carousel";

const Skills = () => {
  return (
    <div className="py-20 w-full" id="skills">
      <h1 className="heading">
        Programming <span className="text-purple">Skills</span>
      </h1>

      <div className="w-full mt-12 flex flex-col items-center justify-center">
        <div className="w-full">
          <SkillCarousel skills={skills} />
        </div>
      </div>
    </div>
  );
};

export default Skills;
