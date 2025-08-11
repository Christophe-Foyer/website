import Header from "@/components/Header";
import ProjectsList from "@/components/ProjectsList";

const Projects = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-4 pb-8">
        <ProjectsList />
      </main>
    </div>
  );
};

export default Projects;