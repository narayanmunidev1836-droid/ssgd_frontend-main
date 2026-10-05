"use client";
import React, { useState } from "react";
import "./ReadMoreText.css";

const decodeEntities = (text) =>
  text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));

const toPlain = (html) =>
  decodeEntities(String(html || "").replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();

// Long HTML block: shows a plain-text preview, then the full formatted text on "Read more".
const ReadMoreText = ({ html, limit = 450, className = "" }) => {
  const [open, setOpen] = useState(false);
  const plain = toPlain(html);

  if (plain.length <= limit) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
  }

  if (open) {
    return (
      <div className={className}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <button type="button" className="rmt-toggle" onClick={() => setOpen(false)}>
          Show less
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {plain.slice(0, limit).trimEnd()}&hellip;{" "}
      <button type="button" className="rmt-toggle rmt-inline" onClick={() => setOpen(true)}>
        Read more
      </button>
    </div>
  );
};

export default ReadMoreText;
