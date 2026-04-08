import ConsumerForm from "../components/forms/ConsumerForm";
import Hero from "../components/home/Hero";
import InfoCards from "../components/home/InfoCards";

function Home({ onNavigate }) {
  return (
    <div className="space-y-8">
      <Hero
        onViewMenu={() => onNavigate("menu")}
        onOpenDashboard={() => onNavigate("dashboard")}
      />
      <InfoCards onNavigate={onNavigate} />
      <ConsumerForm />
    </div>
  );
}

export default Home;
