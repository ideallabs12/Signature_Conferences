import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase.jsx";
import { Navbar } from "../Landingpage/homepage.jsx";
import "./Speakers.css";
import Footer from "../../../Components/Footer/footer";
import "../Landingpage/homepage.css";

function unlockScroll() {
  const scrollY = Math.abs(parseInt(document.body.style.top || "0", 10));
  const targets = [document.documentElement, document.body];
  targets.forEach((el) => {
    el.style.removeProperty("overflow");
    el.style.removeProperty("overflow-x");
    el.style.removeProperty("overflow-y");
    el.style.removeProperty("height");
    el.style.removeProperty("max-height");
    el.style.removeProperty("position");
    el.style.removeProperty("top");
    el.style.removeProperty("left");
    el.style.removeProperty("width");
    el.style.removeProperty("padding-right");
  });
  if (scrollY > 0) window.scrollTo(0, scrollY);
}

/* ─── HERO ──────────────────────────────────── */
function SpeakersHero() {
  return (
    <section className="usa-sp-hero">
      <div className="usa-sp-hero__glow" />
      <div className="usa-sp-hero__content">
        <span className="usa-sp-hero__tag">Signature Global Conferences - Speakers</span>
        <h1 className="usa-sp-hero__title">
          Voices That
          <br />
          Move the World
        </h1>
      </div>
    </section>
  );
}

/* ─── SPEAKER CARD ───────────────────────────── */
function SpeakerCard({ speaker }) {
  return (
    <div className="usa-sp-card">
      <div className="usa-sp-card__image-wrap">
        <img
          src={speaker.image_url}
          alt={speaker.speaker_name || "Speaker"}
          className="usa-sp-card__img"
          loading="lazy"
        />
        <div className="usa-sp-card__overlay">
          {speaker.role && <p className="usa-sp-card__overlay-role">{speaker.role}</p>}
          <h3 className="usa-sp-card__overlay-name">{speaker.speaker_name}</h3>
        </div>
      </div>
    </div>
  );
}

/* ─── GRID ───────────────────────────────────── */
function SpeakersGrid() {
  const { data: speakers = [], isLoading } = useQuery({
    queryKey: ["speakers", "usa"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("speakers")
        .select("id, speaker_name, role, image_url, region, display_order")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return (data || []).filter((row) => {
        const r = (row.region || "").trim().toLowerCase();
        return !r || r === "all" || r === "usa";
      });
    },
  });

  return (
    <section className="usa-sp-grid-section">
      <div className="usa-sp-grid-section__inner">
        {isLoading ? null : (
          <div className="usa-sp-grid">
            {speakers.map((speaker) => (
              <SpeakerCard key={speaker.id} speaker={speaker} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── ROOT ───────────────────────────────────── */
export default function Speakers() {
  useEffect(() => {
    unlockScroll();
    const raf = requestAnimationFrame(unlockScroll);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="usa-page">
      <Navbar />
      <SpeakersHero />
      <SpeakersGrid />
      <Footer theme="usa" />
    </div>
  );
}
