import { Hero } from "@/components/hero";

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
