import Header from "@/components/Header";
import AboutMe from "@/components/AboutMe";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-4 pb-8">
        <AboutMe />
      </main>
    </div>
  );
};

export default About;