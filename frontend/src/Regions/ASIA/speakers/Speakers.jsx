import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase.jsx";
import { Navbar } from "../Home/asia.jsx";
import "./Speakers.css";
import "../Home/asia.css";
import Footer from "../../../Components/Footer/footer";

function SpeakersHero() {
  return (
    <section className="as-sp-hero">
      <div className="as-sp-hero__glow" />
      <div className="as-sp-hero__inner">
        <p className="as-sp-hero__kicker">
          <span className="as-sp-hero__line" />
          Signature Global Conferences — Speakers
          <span className="as-sp-hero__line" />
        </p>
        <h1 className="as-sp-hero__title">
          Voices That
          <br />
          Move The World
        </h1>
      </div>
    </section>
  );
}

function SpeakerCard({ speaker }) {
  return (
    <article className="as-sp-card">
      <div className="as-sp-card__imageWrap">
        <img
          src={speaker.image_url}
          alt={speaker.speaker_name || "Speaker"}
          className="as-sp-card__img"
          loading="lazy"
        />
        <div className="as-sp-card__overlay">
          <p className="as-sp-card__name">{speaker.speaker_name}</p>
        </div>
      </div>
    </article>
  );
}

function SpeakersGrid() {
  const { data: speakers = [], isLoading } = useQuery({
    queryKey: ["speakers", "asia"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("speakers")
        .select("id, speaker_name, role, image_url, region, display_order")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return (data || []).filter((row) => {
        const r = (row.region || "").trim().toLowerCase();
        return !r || r === "all" || r === "asia";
      });
    },
  });

  return (
    <section className="as-sp-grid-section">
      <div className="as-sp-grid-section__inner">
        {isLoading ? null : (
          <div className="as-sp-grid">
            {speakers.map((speaker) => (
              <SpeakerCard key={speaker.id} speaker={speaker} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function AsiaSpeakers() {
  return (
    <div className="as-page">
      <Navbar />
      <SpeakersHero />
      <SpeakersGrid />
      <Footer theme="asia" />
    </div>
  );
}
