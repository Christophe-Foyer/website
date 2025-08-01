import Header from "@/components/Header";
import ProjectsList from "@/components/ProjectsList";

const Projects = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <ProjectsList />
      </main>
    </div>
  );
};

export default Projects;