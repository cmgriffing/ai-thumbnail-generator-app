import React from "react";

export function Header() {
  return (
    <header className="header flex flex-row px-[96px] py-[16px]">
      <div className="flex flex-row items-center justify-center">
        <img
          src="/logo.svg"
          alt="Thumb Farm logo"
          className="h-[32px] w-auto pr-[16px]"
        />
        <span className="uppercase whitespace-nowrap text-white">
          Thumb Farm
        </span>
      </div>
      <div className="flex flex-1"></div>
      {/* <a
        href="/"
        className="uppercase px-[48px] py-[16px] border-2 border-[#008545] text-white custom-border-radius"
      >
        WTF is this?
      </a> */}
    </header>
  );
}
