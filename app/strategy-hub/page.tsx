"use client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Pillar {
    icon: string;
    title: string;
    description: string;
}

interface Initiative {
    category: string;
    image: string;
    title: string;
    description: string;
    metaIcon: string;
    meta: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PILLARS: Pillar[] = [
    {
        icon: "school",
        title: "Academic Excellence",
        description:
            "Cultivating a rigorous learning environment that fosters critical thinking and prepares graduates for leadership in a rapidly evolving global landscape.",
    },
    {
        icon: "biotech",
        title: "Research Innovation",
        description:
            "Supporting interdisciplinary research hubs that tackle global challenges through groundbreaking discovery and collaborative industry partnerships.",
    },
    {
        icon: "person_celebrate",
        title: "Student Success",
        description:
            "Enhancing holistic student support systems, mental health resources, and career development initiatives to ensure every student thrives.",
    },
    {
        icon: "public",
        title: "Global Engagement",
        description:
            "Expanding our international footprint through strategic alliances, study abroad programs, and diverse community recruitment.",
    },
];

const INITIATIVES: Initiative[] = [
    {
        category: "Infrastructure",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80",
        title: "New Science Complex",
        description:
            "A state-of-the-art facility designed for interdisciplinary research in biotechnology and climate science.",
        metaIcon: "calendar_today",
        meta: "Phase 2: Completion 2025",
    },
    {
        category: "Education",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80",
        title: "Digital Learning Transformation",
        description:
            "Redesigning the curriculum with integrated AI tools and virtual laboratories for hybrid learning excellence.",
        metaIcon: "sync",
        meta: "Implementation: 80% Complete",
    },
    {
        category: "Global",
        image: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=600&q=80",
        title: "Global Research Network",
        description:
            "Establishing strategic partnerships with top-tier universities across five continents for joint PhD programs.",
        metaIcon: "public",
        meta: "12 Partnerships Active",
    },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function MaterialIcon({
    name,
    className = "",
    style,
}: {
    name: string;
    className?: string;
    style?: React.CSSProperties;
}) {
    return (
        <span className={`material-symbols-outlined ${className}`} style={style}>
            {name}
        </span>
    );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function HeroSection() {
    return (
        <section className="relative w-full h-[600px] flex items-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80"
                    alt="University campus"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#000d22]/50 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a2342]/85 to-transparent" />
            </div>

            <div className="relative z-10 px-8 max-w-7xl mx-auto w-full">
                <div className="max-w-2xl text-white">
                    <span className="inline-block px-4 py-2 bg-[#fed488] text-[#261900] text-sm font-semibold tracking-wide rounded-lg mb-6">
                        Strategy 2030
                    </span>
                    <h2 className="text-5xl font-semibold leading-tight tracking-tight mb-6 font-serif">
                        Empowering Futures, Advancing Knowledge: Our Strategy 2030.
                    </h2>
                    <p className="text-lg leading-relaxed mb-12 opacity-90">
                        A decadal blueprint designed to elevate research frontiers, enrich student
                        experiences, and solidify our global academic leadership through institutional
                        excellence.
                    </p>
                    <div className="flex gap-4 flex-wrap">
                        <button className="bg-[#d5e3ff] text-[#021c3a] px-12 py-4 rounded-lg text-sm font-semibold hover:bg-[#b2c7ef] transition-all active:scale-95 shadow-lg">
                            Read Full Vision
                        </button>
                        <button className="border border-white/40 text-white px-12 py-4 rounded-lg text-sm font-semibold backdrop-blur-sm hover:bg-white/10 transition-all active:scale-95">
                            Executive Summary
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

function StrategicPillars() {
    return (
        <section className="py-20 px-8 max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <h3 className="text-3xl font-semibold text-[#000d22] mb-2 font-serif">
                    Strategic Pillars
                </h3>
                <div className="h-1 w-20 bg-[#775a19] mx-auto" />
                <p className="mt-6 text-[#44474e] max-w-2xl mx-auto">
                    Our roadmap is built upon four foundational strengths that guide our institutional
                    priorities and resource allocation.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PILLARS.map((pillar) => (
                    <div
                        key={pillar.title}
                        className="bg-white p-12 rounded-xl border-l-4 border-[#775a19] shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="w-12 h-12 bg-[#0a2342] rounded-full flex items-center justify-center text-[#b2c7ef] mb-6 group-hover:scale-110 transition-transform">
                            <MaterialIcon name={pillar.icon} style={{ fontSize: 28 }} />
                        </div>
                        <h4 className="text-2xl font-semibold text-[#000d22] mb-4 font-serif">
                            {pillar.title}
                        </h4>
                        <p className="text-[#44474e]">{pillar.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function StudentSuccessResources() {
    return (
        <section className="bg-[#0a2342] py-20">
            <div className="px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h3 className="text-3xl font-semibold text-[#b2c7ef] mb-2 font-serif">
                        Student Success Resources
                    </h3>
                    <div className="h-1 w-20 bg-[#fed488] mx-auto" />
                    <p className="mt-6 text-[#768baf] max-w-2xl mx-auto">
                        Access curated materials designed to support your academic journey and professional
                        development.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* ── YouTube Video Card ── */}
                    <div className="bg-white/10 border border-[#b2c7ef]/20 rounded-xl overflow-hidden flex flex-col">
                        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                            <iframe className="absolute inset-0 w-full h-full" 
                            src="https://www.youtube.com/embed/Sv6dMFF_yts?si=-3Wt_3SqsaFD-at4" 
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            referrerPolicy="strict-origin-when-cross-origin" 
                            allowFullScreen 
                            />
                        </div>
                        <div className="p-6 flex flex-col gap-2">
                            <span className="text-xs font-medium uppercase tracking-widest text-[#fed488]">
                                Video Workshop
                            </span>
                            <h4 className="text-xl font-semibold text-white font-serif">
                                Mastering the IELTS: Strategies for a 8.0+
                            </h4>
                            <p className="text-[#768baf] text-sm">
                                Expert guidance on acing the International English Language Testing System.
                            </p>
                        </div>
                    </div>

                    {/* ── PDF Card ── */}
                    <div className="bg-white/10 border border-[#b2c7ef]/20 rounded-xl overflow-hidden flex flex-col">
                        <div className="w-full h-72">
                            <iframe
                                className="w-full h-full"
                                src="https://www.africau.edu/images/default/sample.pdf"
                                title="Sample Academic Guide PDF"
                            />
                        </div>
                        <div className="p-6 flex flex-col gap-2">
                            <span className="text-xs font-medium uppercase tracking-widest text-[#fed488]">
                                PDF Guide
                            </span>
                            <h4 className="text-xl font-semibold text-white font-serif">
                                Resume Excellence: Stand Out to Top Universities
                            </h4>
                            <p className="text-[#768baf] text-sm">
                                Comprehensive guide for building a high-impact academic and professional CV.
                            </p>
                            <a
                                href="https://www.africau.edu/images/default/sample.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-2 text-[#fed488] text-sm font-semibold hover:underline"
                            >
                                <MaterialIcon name="download" style={{ fontSize: 18 }} />
                                Download PDF
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function KeyInitiatives() {
    return (
        <section className="py-20 px-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h3 className="text-3xl font-semibold text-[#000d22] font-serif">Key Initiatives</h3>
                    <p className="text-[#44474e]">
                        Major transformation projects currently underway across campus.
                    </p>
                </div>
                <button className="text-[#775a19] text-sm font-semibold flex items-center gap-2 hover:underline">
                    View All Projects
                    <MaterialIcon name="arrow_forward" style={{ fontSize: 18 }} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {INITIATIVES.map((initiative) => (
                    <div
                        key={initiative.title}
                        className="bg-[#f3f4f5] rounded-xl overflow-hidden hover:bg-[#e7e8e9] transition-colors cursor-pointer group"
                    >
                        {/* Real Unsplash image */}
                        <div className="h-48 overflow-hidden">
                            <img
                                src={initiative.image}
                                alt={initiative.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        <div className="p-6">
                            <span className="text-xs font-semibold uppercase tracking-widest text-[#775a19] mb-2 block">
                                {initiative.category}
                            </span>
                            <h5 className="text-2xl font-semibold text-[#000d22] mb-4 font-serif">
                                {initiative.title}
                            </h5>
                            <p className="text-sm text-[#44474e] mb-6">{initiative.description}</p>
                            <div className="flex items-center gap-2 text-[#191c1d] text-sm font-semibold">
                                <MaterialIcon name={initiative.metaIcon} style={{ fontSize: 18 }} />
                                <span>{initiative.meta}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InstitutionalStrategyHub() {
    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                rel="stylesheet"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap"
                rel="stylesheet"
            />
            <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .font-serif { font-family: 'Newsreader', serif; }
        body { font-family: 'Public Sans', sans-serif; background-color: #f8f9fa; color: #191c1d; }
      `}</style>

            <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d]">
                <main>
                    <HeroSection />
                    <StrategicPillars />
                    <StudentSuccessResources />
                    <KeyInitiatives />
                </main>
            </div>
        </>
    );
}