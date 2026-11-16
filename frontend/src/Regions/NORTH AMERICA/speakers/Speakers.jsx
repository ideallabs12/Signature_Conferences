import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase.jsx";
import { NaNavbar } from "../NAHome/Nahome";
import "./Speakers.css";
import Footer from "../../../Components/Footer/footer";

export const speakerCategories = [
  { id: "all", label: "All Speakers" },
  { id: "women-leadership", label: "Women & Leadership" },
  { id: "ai-stem", label: "AI & STEM" },
  { id: "business", label: "Business" },
  { id: "wellness", label: "Wellness" },
];

function SpeakersHero() {
  return (
    <section className="na-speakers-hero">
      <div className="na-speakers-hero__content">
        <span className="na-speakers-hero__tag">
          Signature Global Conferences — Speakers
        </span>
        <h1 className="na-speakers-hero__title">
          VOICES THAT
          <br />
          MOVE <em>THE WORLD</em>
        </h1>
      </div>
    </section>
  );
}

function SpeakerCard({ speaker }) {
  const [imgError, setImgError] = useState(false);
  const label = speaker.speaker_name || speaker.role;

  return (
    <article className="na-speaker-card">
      <div className="na-speaker-card__frame">
        {!imgError ? (
          <img
            src={speaker.image_url}
            alt={speaker.speaker_name || "Speaker"}
            className="na-speaker-card__img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="na-speaker-card__img-fallback" />
        )}

        {label && (
          <>
            <div className="na-speaker-card__scrim" />
            <span className="na-speaker-card__label">{label}</span>
          </>
        )}
      </div>
    </article>
  );
}

function SpeakersGrid() {
  const { data: speakers = [], isLoading } = useQuery({
    queryKey: ["speakers", "north-america"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("speakers")
        .select("id, speaker_name, role, image_url, region, display_order")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return (data || []).filter((row) => {
        const r = (row.region || "").trim().toLowerCase();
        return !r || r === "all" || r === "north-america" || r === "north america";
      });
    },
  });

  return (
    <section className="na-speakers-grid-section">
      <div className="na-speakers-grid-section__inner">
        {isLoading ? null : (
          <div className="na-speakers-grid">
            {speakers.map((speaker) => (
              <SpeakerCard key={speaker.id} speaker={speaker} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Speakers() {
  return (
    <div className="na-page">
      <NaNavbar />
      <SpeakersHero />
      <SpeakersGrid />
      <Footer theme="northamerica" />
    </div>
  );
}
