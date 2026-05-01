'use client'

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

const icons = {
  circleUser: (
    <FontAwesomeIcon
      icon={faCircleUser}
      className="flex !w-[1.125rem] !h-[1.125rem] justify-center items-center text-[#718ebf]"
    />
  ),
};

const TextInputField = ({
  label = "Text",
  type = "text",
  placeholder = "Enter text",
  value,
  onChange,
  name,
  disabled = false,
  leftIcon = false,
  required = false
}) => {
  return (
    <div className="flex flex-col gap-[0.5rem] w-[20rem] justify-center items-start shrink-0">
      {label && (
        <label htmlFor={name} className="text-md text-black">
          {label}
        </label>
      )}

      <div className="relative w-full">
        {leftIcon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            {leftIcon}
          </span>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
                        w-full h-[2.8125rem] border-2 border-[#a8b9c7] px-[1rem] py-[0.625rem] text-sm rounded-[1.25rem]
                        focus:outline-none focus:ring-2 focus:ring-hazuan-primary focus:border-hazuan-primary
                        disabled:bg-[#DFEAF2] disabled:cursor-not-allowed disabled:border-1
                        ${leftIcon ? "pl-10" : ""} 
                    `}
        />
      </div>
    </div>
  );
};

export default TextInputField;
