"use client";

import Image from "next/image";

interface University {
    id: string;
    name: string;
    location: string;
    min_gpa: number;
    min_ielts: number;
    program: string[];
    tier: number;
    description: string;
    category: string;
    image_url: string;
    website_url: string;
}

interface Props {
    id: string;
    data: University | null;
}

const HERO_IMAGE =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDp42mKWLfW2B-20xh3ymfDQ2uYPsjxnUup4CuITGX36uRf0468-5CsX_pl2UlecmRD_fd0WdysF5Unhk2rtmt5TK5RjS1e6qAXG645eSDj6vEL5ZdKZcQfHzUcCSGn24LQFJGTucQ2Gk4Dh_fDfZrziFvUkJa9YMQrz4v_mj8mP1DQ12rGCrNMvckhY5TY-TPExrWT1E6JgUQfir7cokMS0RszV9LHDNPU9IoGYj_RWNBsbATQW7r5UBQp33Au4LnkC7SuridYb_o";

const LOGO_IMAGE =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDdaR6Sb7EgBt7LPfqeZCrrHkAX667kxKRcZun6EvfoFAacdWDLCj1h2DtB_2lSMt5_nMPr-PBqyXhkVdhhtXPz2hyhFdAvgk8Jmjlg85wFy10wehkkeoEekx7sGNT_2FTxy86UuCiNtjSy8CQMGAEABjdFjy0NJfxf05DCzJTzyqQvFSx6yGWoSBHTTQgojGsUQQdNXfFWVWy-aCqPUHmp0_CEYwz5iJyvRFk3pbQ3aI2HvE8c0gJdN6SL4RFaMKZdAxI7khH1x40";

const LAB_IMAGE =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDDh3cvD7Edxk_2RecRVFjKURAUkdsrwu9kzxZ-dXY0AgPp14H0WdWmwa-eCMuoUkmCHE6YoYaNzgCmLRb9vqtaUAg874AKphm-MTb_MmxcwV-OSCAJBqQNnJCyrcBwNROPmkz4cFsAwblZjijQNnyxtsyX6IY5-tTBR0ZcvHIn5Heeo1RBWYBmEorXq96BDQWisZmMyr2P41PTY2sQhvI0Y5KYxYVeNvRyqM1pdbeayqKcwTSTaheAPIeSJfTmEknB4MNSba2yXtg";

const stats = [
    { icon: "leaderboard", label: "World Ranking", value: "#3", sub: "QS World 2024" },
    { icon: "location_on", label: "Location", value: "Stanford, CA", sub: "Bay Area" },
    { icon: "groups", label: "Enrollment", value: "~17,000", sub: "Undergrad + Grad" },
    { icon: "account_balance", label: "Research Institution", value: "Private", sub: "Status" },
];

const departments = [
    { icon: "code", name: "Computer Science", desc: "World-renowned research center" },
    { icon: "engineering", name: "Engineering", desc: "Cutting-edge technical innovation" },
    { icon: "gavel", name: "Stanford Law", desc: "Global leader in legal education" },
    { icon: "medical_services", name: "School of Medicine", desc: "Pioneering healthcare research" },
];

const admissionStats = [
    { label: "SAT Range", value: "1470–1570" },
    { label: "ACT Range", value: "34–35" },
    { label: "Acceptance Rate", value: "~3.9%" },
    { label: "Regular Decision", value: "Jan 5" },
];

const campusLife = [
    { icon: "home", text: "Guaranteed housing for all 4 years of undergraduate study." },
    { icon: "diversity_3", text: "Over 600 student-led organizations and cultural centers." },
    { icon: "directions_bike", text: "Vibrant Palo Alto surroundings with tech hubs and nature trails." },
];

export default function UniversityPage({ id, data }: Props) {
    const stats = [
        { icon: "leaderboard", label: "World Ranking", value: `#${data?.tier}`, sub: "QS World 2024" },
        { icon: "location_on", label: "Location", value: data?.location, sub: "Bay Area" },
        { icon: "groups", label: "Enrollment", value: "~17,000", sub: "Undergrad + Grad" },
        { icon: "account_balance", label: "Research Institution", value: "Private", sub: "Status" },
    ];
    console.log(data)
    return (
        <main className="min-h-screen bg-[#F8F9FA] text-[#191C1D]">
            {/* Hero Section */}
            <section className="relative w-full h-[530px] min-h-[450px] flex items-end overflow-hidden">
                <img
                    src={data?.image_url}
                    alt="Stanford University Main Quad"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2342]/80 via-[#0A2342]/20 to-transparent" />
                <div className="relative max-w-7xl mx-auto w-full px-6 pb-20 flex flex-col md:flex-row items-center md:items-end gap-6">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-lg p-4 shadow-xl flex items-center justify-center -mb-8 md:mb-0 border border-[#E1E3E4]">
                        <img
                            src={LOGO_IMAGE}
                            alt="Stanford University Crest"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="text-center md:text-left">
                        <span className="inline-block px-3 py-1 bg-[#4295A0]/10 text-[#4295A0] rounded-full text-xs font-semibold tracking-widest mb-2">
                            PRIVATE RESEARCH
                        </span>
                        <h2 className="font-serif text-5xl font-semibold text-white tracking-tight">
                            {data?.name}
                        </h2>
                        <p className="text-2xl text-white/90 italic mt-1 font-serif">
                            The Wind of Freedom Blows
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Stats Bento */}
            <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
                {stats.map((s) => (
                    <div
                        key={s.label}
                        className="bg-white p-6 rounded-lg shadow-[0_4px_20px_rgba(10,35,66,0.08)] border-l-4 border-[#4295A0] transition-transform hover:-translate-y-1"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="material-symbols-outlined text-[#4295A0]">{s.icon}</span>
                            <span className="text-xs font-medium text-[#74777E]">{s.sub}</span>
                        </div>
                        <p className="text-3xl font-serif font-medium text-[#0A2342]">{s.value}</p>
                        <p className="text-sm font-semibold tracking-wide text-[#44474E] mt-1">{s.label}</p>
                    </div>
                ))}
            </section>

            {/* About & Details Grid */}
            <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20 mb-20">
                {/* About */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-[#E1E3E4]" />
                        <h3 className="font-serif text-2xl font-medium text-[#0A2342] px-4">
                            Institutional Profile
                        </h3>
                        <div className="h-px flex-1 bg-[#E1E3E4]" />
                    </div>
                    <p className="text-lg text-[#44474E] leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:text-[#0A2342]">
                        Stanford University is one of the world&apos;s leading research institutions. Since its
                        founding in 1891, Stanford has been dedicated to finding solutions to big challenges and
                        to preparing students for leadership in a complex world. Relationships between faculty
                        and students are a hallmark of the Stanford experience, which promotes a culture of
                        interdisciplinary collaboration that drives innovative discoveries.
                    </p>
                    <p className="text-base text-[#44474E]">
                        Located in the heart of Silicon Valley, the campus spans 8,180 acres and serves as a
                        hub for innovation, technology, and humanities. The university&apos;s mission is focused on
                        the pursuit of knowledge for the benefit of humanity.
                    </p>

                    {/* Departments */}
                    <div className="pt-12">
                        <h3 className="font-serif text-2xl font-medium text-[#0A2342] mb-6">
                            Distinguished Departments
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {departments.map((d) => (
                                <div
                                    key={d.name}
                                    className="group bg-[#F3F4F5] p-6 rounded-lg flex items-center gap-6 hover:bg-white transition-all hover:shadow-md cursor-pointer border-l-2 border-transparent hover:border-[#4295A0]"
                                >
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#4295A0]">
                                        <span className="material-symbols-outlined">{d.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold tracking-wide text-[#0A2342]">{d.name}</h4>
                                        <p className="text-xs font-medium text-[#44474E]">{d.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Side Cards */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Admissions Card */}
                    <div className="bg-[#0A2342] text-white p-12 rounded-xl shadow-xl">
                        <h3 className="font-serif text-2xl font-medium mb-6 border-b border-white/20 pb-2">
                            Admissions
                        </h3>
                        <div className="space-y-6 mb-12">
                            {admissionStats.map((a) => (
                                <div key={a.label} className="flex justify-between items-center">
                                    <span className="text-sm font-semibold tracking-wide opacity-80">{a.label}</span>
                                    <span className="text-sm font-semibold">{a.value}</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full bg-[#FED488] text-[#5D4201] py-4 rounded-lg text-sm font-semibold tracking-wide hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2">
                            APPLY TO STANFORD
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </button>
                    </div>

                    {/* Campus Life Card */}
                    <div className="bg-white p-12 rounded-xl border border-[#E1E3E4]">
                        <h3 className="font-serif text-2xl font-medium text-[#0A2342] mb-6">Campus Life</h3>
                        <div className="space-y-6">
                            {campusLife.map((c) => (
                                <div key={c.icon} className="flex gap-4">
                                    <span className="material-symbols-outlined text-[#4295A0] mt-1">{c.icon}</span>
                                    <p className="text-base text-[#44474E]">{c.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Highlight Section */}
            <section className="max-w-7xl mx-auto px-6 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="order-2 md:order-1 relative">
                        <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src={LAB_IMAGE}
                                alt="Students collaborating in a research laboratory"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-lg shadow-xl max-w-xs border border-[#E1E3E4] hidden lg:block">
                            <p className="font-serif italic text-[#0A2342] text-lg">
                                &ldquo;The intersection of technology and humanity happens here every single day.&rdquo;
                            </p>
                            <p className="text-xs font-medium text-[#74777E] mt-4">— Faculty of Research</p>
                        </div>
                    </div>

                    <div className="order-1 md:order-2 space-y-6 pl-0 md:pl-12">
                        <span className="text-sm font-bold text-[#4295A0] tracking-widest uppercase">
                            Global Impact
                        </span>
                        <h2 className="font-serif text-3xl font-medium text-[#0A2342]">
                            Preparing the next generation of global citizens.
                        </h2>
                        <p className="text-lg text-[#44474E]">
                            Stanford is not just a university; it is an ecosystem that nurtures talent across
                            disciplines. From the arts and social sciences to the hardest engineering problems,
                            our students are at the forefront of change.
                        </p>
                        <div className="flex gap-6 pt-1">
                            <div className="text-center">
                                <p className="text-2xl font-serif font-medium text-[#4295A0]">98%</p>
                                <p className="text-xs font-medium text-[#74777E]">Career Placement</p>
                            </div>
                            <div className="w-px h-full bg-[#E1E3E4]" />
                            <div className="text-center">
                                <p className="text-2xl font-serif font-medium text-[#4295A0]">81+</p>
                                <p className="text-xs font-medium text-[#74777E]">Nobel Laureates</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}