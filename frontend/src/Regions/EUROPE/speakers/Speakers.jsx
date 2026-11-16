import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase.jsx";
import { Navbar } from "../Landingpage/eurohome.jsx";
import "./Speakers.css";
import "../Landingpage/eurohome.css";
import Footer from "../../../Components/Footer/footer";

/* ─── HERO ───────────────────────────────────── */
function SpeakersHero() {
  return (
    <section className="europe-speakers-hero">
      <div className="europe-speakers-hero__content">
        <span className="europe-speakers-hero__tag">
          Signature Global Conferences · Speakers
        </span>
        <h1 className="europe-speakers-hero__title">
          Voices That <br /> Move the World
        </h1>
      </div>
    </section>
  );
}

/* ─── CARD ───────────────────────────────────── */
function SpeakerCard({ speaker }) {
  return (
    <div className="europe-speakers-card">
      <img
        src={speaker.image_url}
        alt={speaker.speaker_name || "Speaker"}
        className="europe-speakers-card__img"
        loading="lazy"
      />
      {speaker.speaker_name && (
        <div className="europe-speakers-card__overlay">
          <span className="europe-speakers-card__name">{speaker.speaker_name}</span>
        </div>
      )}
    </div>
  );
}

/* ─── GRID ───────────────────────────────────── */
function SpeakersGrid() {
  const { data: speakers = [], isLoading } = useQuery({
    queryKey: ["speakers", "europe"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("speakers")
        .select("id, speaker_name, role, image_url, region, display_order")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return (data || []).filter((row) => {
        const r = (row.region || "").trim().toLowerCase();
        return !r || r === "all" || r === "europe";
      });
    },
  });

  return (
    <section className="europe-speakers-grid-section">
      {isLoading ? null : (
        <div className="europe-speakers-grid">
          {speakers.map((speaker) => (
            <SpeakerCard key={speaker.id} speaker={speaker} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ─── ROOT ───────────────────────────────────── */
export default function Speakers() {
  return (
    <div className="europe-page">
      <Navbar />
      <SpeakersHero />
      <SpeakersGrid />
      <Footer theme="europe" />
    </div>
  );
}
