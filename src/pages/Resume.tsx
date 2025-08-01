import Header from "@/components/Header";
import ResumeContent from "@/components/ResumeContent";

const Resume = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <ResumeContent />
      </main>
    </div>
  );
};

export default Resume;