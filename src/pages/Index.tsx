import Header from "@/components/Header";
import ResumeContent from "@/components/ResumeContent";
import ProjectsList from "@/components/ProjectsList";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <ResumeContent />
        <ProjectsList />
      </main>
    </div>
  );
};

export default Index;
