"use client";
import React, { useState, useEffect, useRef } from "react";
import { MdKeyboardArrowDown, MdCheck } from "react-icons/md";

const OPTIONS = [
  { value: "all", label: "All" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "alpha", label: "Alphabetical" },
  { value: "favourites", label: "My Favourites" },
];

// Custom dropdown: the native <select> popup cannot be styled, so the list is drawn here.
const PublicationFilter = (props) => {
  const [internalValue, setInternalValue] = useState("all");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const selectedValue =
    props.value !== undefined && props.value !== null
      ? props.value
      : internalValue;
  const selected =
    OPTIONS.find((option) => option.value === selectedValue) || OPTIONS[0];

  // Close on outside click or Escape while the list is open
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

  const handleSelect = (value) => {
    setInternalValue(value);
    setOpen(false);
    props.HandleOrderBy(value);
  };

  return (
    <div className="publication-filter-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`publication-filter-dropdown${open ? " is-open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="publication-filter-label">
          {/* All labels share one grid cell; only the selected one is visible.
              The button therefore keeps the width of the longest label. */}
          {OPTIONS.map((option) => (
            <span
              key={option.value}
              className="publication-filter-label-item"
              style={{ visibility: option.value === selected.value ? "visible" : "hidden" }}
            >
              {option.label}
            </span>
          ))}
        </span>
        <MdKeyboardArrowDown className="publication-filter-caret" />
      </button>

      {open && (
        <ul className="publication-filter-menu" role="listbox">
          {OPTIONS.map((option) => {
            const isSelected = option.value === selected.value;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                className={`publication-filter-option${isSelected ? " is-selected" : ""}`}
                onClick={() => handleSelect(option.value)}
              >
                <span>{option.label}</span>
                {isSelected && <MdCheck className="publication-filter-check" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PublicationFilter;
