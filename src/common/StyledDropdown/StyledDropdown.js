"use client";
import React, { useState, useEffect, useRef } from "react";
import { MdKeyboardArrowDown, MdCheck } from "react-icons/md";

// Shared dropdown used across the site (publication filters, activity filters, donation forms).
// options: [{ value, label }]. placeholder: text shown while nothing is selected (not listed in the menu).
const StyledDropdown = ({
  options,
  value,
  onChange,
  className = "",
  ariaLabel,
  disabled = false,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const selected = options.find(
    (option) => String(option.value) === String(value)
  );
  const showPlaceholder = !selected && !!placeholder;
  const current = selected || (showPlaceholder ? null : options[0]);

  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const handleSelect = (optionValue) => {
    setOpen(false);
    onChange(optionValue);
  };

  // Every label (including the placeholder) shares one grid cell, so the
  // trigger keeps the width of the longest label whatever is selected.
  const labelItems = [
    ...(placeholder ? [{ key: "__placeholder", label: placeholder, shown: showPlaceholder }] : []),
    ...options.map((option) => ({
      key: option.value,
      label: option.label,
      shown: !!current && String(option.value) === String(current.value),
    })),
  ];

  return (
    <div className={`styled-dropdown ${className}`} ref={wrapRef}>
      <button
        type="button"
        className={`styled-dropdown-trigger${open ? " is-open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="styled-dropdown-label">
          {labelItems.map((item) => (
            <span
              key={item.key}
              className="styled-dropdown-label-item"
              style={{ visibility: item.shown ? "visible" : "hidden" }}
            >
              {item.label}
            </span>
          ))}
        </span>
        <MdKeyboardArrowDown className="styled-dropdown-caret" />
      </button>

      {open && (
        <ul className="styled-dropdown-menu" role="listbox">
          {options.map((option) => {
            const isSelected = !!current && String(option.value) === String(current.value);
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                className={`styled-dropdown-option${isSelected ? " is-selected" : ""}`}
                onClick={() => handleSelect(option.value)}
              >
                <span>{option.label}</span>
                {isSelected && <MdCheck className="styled-dropdown-check" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default StyledDropdown;
