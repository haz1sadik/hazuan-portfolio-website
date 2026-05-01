'use client';

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const icons = {
  squarePlus: (
    <FontAwesomeIcon
      icon={faSquarePlus}
      className="flex w-4.5 !-4.5 justify-center items-center"
    />
  ),
  chevronRight: (
    <FontAwesomeIcon
      icon={faChevronRight}
      className="flex w-4.5 h-4.5 justify-center items-center "
    />
  ),
};

const PrimaryButton = ({
  href,
  onClick,
  leftIcon = false,
  rightIcon = false,
  text = "Button",
  disabled = false,
}) => {
  const content = (
    <>
      {leftIcon && icons.squarePlus}
      <span>{text}</span>
      {rightIcon && icons.chevronRight}
    </>
  );

  const style =
    "inline-flex font-semibold text-[0.975rem] items-center justify-center gap-[0.5rem] rounded-full px-[1.25rem] py-[0.625rem] bg-hazuan-primary hover:bg-hazuan-primary-hover disabled:bg-hazuan-primary/45 text-white text-sm cursor-pointer disabled:cursor-not-allowed";

  if (href) {
    return (
      <Link href={href} className={style}>
        {content}
      </Link>
    );
  }

  return (
    <>
      <button onClick={onClick} className={style} disabled={disabled}>
        {content}
      </button>
    </>
  );
};

export default PrimaryButton;
