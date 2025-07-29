import Header from "@/components/Header";
import ResumeContent from "@/components/ResumeContent";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <ResumeContent />
      </main>
    </div>
  );
};

export default Index;
