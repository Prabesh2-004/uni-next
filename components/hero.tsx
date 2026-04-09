import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight, ReceiptText } from "lucide-react";

export function Hero() {
  return (
    <section className="relative w-full h-screen">
      <Image
        src="/hero-uni.jpg"
        alt="university"
        fill
        sizes="(max-height: 90vh) height: 100vh"
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black/45" />

      {/* Content sits on top */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-12">
        <h1 className="text-white text-6xl font-bold text-center">
          Start Your{" "}
          <span className="block text-blue-400">Dream University Journey</span>
        </h1>
        <p className="max-w-xl text-center my-3 opacity-80 text-white text-lg">
          Personalized guidance to help you to navigate the complex world of
          international university applications. Get expert counseling, CV
          support and academic support.
        </p>
        <div className="flex gap-4">
          <Link href={"/booking"}>
            <Button variant={"default"} size={"lg"} className="cursor-pointer px-5">
              Book Counselor <ArrowRight />
            </Button>
          </Link>
          <Link href={"/resume"}>
            <Button variant={"secondary"} size={"lg"} className="cursor-pointer px-5">
              Build Resume <ReceiptText />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
