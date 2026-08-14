"use client";

import { useRef, useState } from "react";
import { CONDITIONS } from "./conditions";

export default function ConditionsMarquee() {
  const [active, setActive] = useState(null); // { condition, symptoms } | null
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  function openModal(item) {
    clearTimeout(timerRef.current);
    setPaused(true);
    setActive(item);
    timerRef.current = setTimeout(() => {
      setActive(null);
      setPaused(false);
    }, 2000);
  }

  function closeModal() {
    clearTimeout(timerRef.current);
    setActive(null);
    setPaused(false);
  }

  // The track is duplicated once so the CSS animation can loop seamlessly.
  const doubled = [...CONDITIONS, ...CONDITIONS];

  return (
    <>
      <div className="conditions-marquee" aria-label="Conditions we treat">
        <div className={`marquee-track${paused ? " is-paused" : ""}`}>
          {doubled.map((item, i) => (
            <button
              key={`${item.condition}-${i}`}
              className="condition-chip"
              type="button"
              onClick={() => openModal(item)}
            >
              {item.condition}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`symptom-modal${active ? " show" : ""}`}
        aria-hidden={active ? "false" : "true"}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        <div className="symptom-box" role="dialog" aria-modal="true" aria-labelledby="symptomTitle">
          <div className="modal-accent"></div>
          <h3 id="symptomTitle">{active ? active.condition : "Condition"}</h3>
          <p>{active ? active.symptoms : ""}</p>
          <p className="modal-note">
            General educational information only. Consult a qualified healthcare professional
            for diagnosis and individualized care.
          </p>
        </div>
      </div>
    </>
  );
}
