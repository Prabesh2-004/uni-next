import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight, Calendar1 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative w-full h-[calc(100vh-65px)] italic font-serif">
      <Image
        src="/university-her.jpg"
        alt="university"
        fill
        sizes="(max-height: 90vh) height: 90vh"
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black/55" />

      {/* Content sits on top */}
      <div className="relative z-10 flex flex-col justify-center h-full px-5">
        <h1 className="text-white text-6xl">
          Start Your{" "}
          <span className="block">Dream University Journey</span>
        </h1>
        <p className="max-w-xl my-3 text-white">
          Personalized guidance to help you to navigate the complex world of
          international university applications. Get expert counseling, CV
          support and academic support.
        </p>
        <div className="flex gap-4">
          <Link href={"/booking"}>
            <Button variant={"default"} size={"lg"} className="cursor-pointer text-white font-bold bg-blue-600 hover:bg-blue-500 font-sans px-5">
              Book Counselor <ArrowRight />
            </Button>
          </Link>
          <Link href={"/events"}>
            <Button variant={"ghost"} size={"lg"} className="cursor-pointer text-white font-bold font-sans px-5">
              Explore Programs <Calendar1 />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
