import { Hero } from "@/components/hero";

export const metadata = {
  title: "Dream Uni",
  description: "Dream Uni - Your one stop solution for all your university needs, CV Builder, University Finder, Event Finder, Strategy Hub, and more.",
}

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="flex-1 flex flex-col max-w-screen h-[calc(100vh-65px)] w-full">
          <Hero />
        </div>
      </div>
    </main>
  );
}
