"use client";
export const FormattedText = (text) => {
  return text?.trim()?.toLowerCase()?.replace(/\s+/g, "-");
};