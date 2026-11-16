import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase.jsx";
import SEO from "../../Components/SEO.jsx";
import "./speakers.css";

function SpeakersHero() {
  return (
    <section className="global-sp-hero">
      <div className="global-sp-hero__glow" />
      <div className="global-sp-hero__inner">
        <p className="global-sp-hero__kicker">
          <span className="global-sp-hero__line" />
          Signature Global Conferences — Speakers
          <span className="global-sp-hero__line" />
        </p>
        <h1 className="global-sp-hero__title">
          Voices That <br />
          <span>Move The World</span>
        </h1>
        <p className="global-sp-hero__sub">
          Meet the visionary speakers, industry pioneers, and thought leaders inspiring change across our global stages.
        </p>
      </div>
    </section>
  );
}

function SpeakerCard({ speaker }) {
  return (
    <article className="global-sp-card">
      <div className="global-sp-card__imageWrap">
        <img
          src={speaker.image_url}
          alt={speaker.speaker_name || "Speaker"}
          className="global-sp-card__img"
          loading="lazy"
        />
        <div className="global-sp-card__overlay">
          {speaker.role && <p className="global-sp-card__role">{speaker.role}</p>}
          {speaker.speaker_name && (
            <h3 className="global-sp-card__name">{speaker.speaker_name}</h3>
          )}
        </div>
      </div>
    </article>
  );
}

export default function GlobalSpeakers() {
  const { data: speakers = [], isLoading, error } = useQuery({
    queryKey: ["speakers", "global"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("speakers")
        .select("id, speaker_name, role, image_url, region, display_order")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  if (error) {
    console.error("Failed to fetch speakers:", error.message);
  }

  return (
    <div className="global-sp-page">
      <SEO title="Speakers" />
      <SpeakersHero />
      <section className="global-sp-grid-section">
        <div className="global-sp-grid-section__inner">
          {isLoading ? (
            <div className="global-sp-status">Loading speakers...</div>
          ) : speakers.length === 0 ? (
            <div className="global-sp-status">No speakers found.</div>
          ) : (
            <div className="global-sp-grid">
              {speakers.map((speaker) => (
                <SpeakerCard key={speaker.id} speaker={speaker} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
