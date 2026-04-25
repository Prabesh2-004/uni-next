"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

interface University {
    id: string | number;
    title: string;
    description: string;
    category: string;
    image: string;
}

const categories = ["All", "Private", "Public", "Top Ranked", "Hotel Management", "Computer Science", "CA"]

const universities: University[] = [
    {
        id: 1,
        title: "Harvard University",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore..",
        category: "Private",
        image: "https://i.pinimg.com/1200x/64/31/55/643155cd8caec4c2779194a5da75e707.jpg"
    },
    {
        id: 2,
        title: "Cambridge University",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore..",
        category: "Public",
        image: "https://i.pinimg.com/736x/fe/45/d6/fe45d657ac130b2c6728de5ddf3892cf.jpg"
    },
    {
        id: 3,
        title: "Stanford University",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore..",
        category: "CA",
        image: "https://i.pinimg.com/1200x/ab/65/e8/ab65e8119fb5debe971917fddd23ec95.jpg"
    },
]

const Universities = () => {
    const [search, setSearch] = useState("")
    const [activeCategory, setActiveCategory] = useState('All');
    const [filtered, setFiltered] = useState<University[]>(universities);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const q = search.toLowerCase();
            setFiltered(
                universities.filter(
                    (u) =>
                    (
                        u.title.toLowerCase().includes(q)
                    )
                )
            );
        }, 500)
        return () => clearTimeout(timeout)
    }, [search, universities]);

    useEffect(() => {
        setFiltered(activeCategory === 'All'
            ? universities
            : universities.filter(event => event.category === activeCategory))
    }, [activeCategory])

    return (
        <div className="flex flex-col gap-10 items-center pt-4 lg:px-20 md:px-10 px-5">
            <div className="flex items-center border pl-3 gap-2 bg-white dark:bg-black border-gray-500/30 h-[46px] rounded-md overflow-hidden max-w-md w-full">
                <Search />
                <input type="text" onChange={(e) => setSearch(e.target.value)} placeholder="Search for universities" className="w-full h-full outline-none bg-white dark:bg-black text-sm" />
            </div>
            <div className="flex flex-wrap gap-4">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-6 py-2 rounded-full font-medium text-sm hover:bg-secondary transition-colors ${activeCategory === category
                            ? 'bg-secondary text-on-secondary'
                            : 'bg-surface-container-highest text-on-surface-variant hover:bg-outline-variant'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((uni) => (
                    <div key={uni.id} className="p-4 bg-white dark:bg-black border border-gray-200 hover:-translate-y-1 transition duration-300 rounded-lg shadow shadow-black/10 w-full">
                        <Image className="rounded-md max-h-40 w-full object-cover" width={200} height={100} src={uni.image} alt={uni.title} />
                        <p className="text-gray-400 text-xl font-semibold ml-2 mt-4">
                            {uni.title}
                        </p>
                        <p className="text-zinc-400 text-sm/6 mt-2 ml-2 mb-2">
                            {uni.description}
                        </p>
                        <Button variant={"outline"}>Read more <ArrowRight /></Button>
                    </div>
                ))}
            </div>
            <div className="shadow px-8 py-5 border rounded-xl flex items-center">
                <div className="max-w-4xl">
                    <h1 className="text-2xl font-serif mb-2">Can{"'"}t see what you are looking for?</h1>
                    <p>Get Personalized Recommendations, By complete your academic profile to let our AI match you with the best-fit universities worldwide.</p>
                </div>
                <Link href={'/universities/personal-info'} className="px-4 py-2 border rounded-lg shadow shadow-white">Get Recommendations</Link>
            </div>
        </div>
    )
}

export default Universities 