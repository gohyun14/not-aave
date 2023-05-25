import React from "react";

type ButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  secondary?: boolean;
};

const Button = ({ onClick, children, secondary }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`rounded-md px-[10px] py-[6px] text-sm shadow-sm transition-colors duration-300 ${
        secondary
          ? "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100"
          : "bg-zinc-800 text-white hover:bg-zinc-700"
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
