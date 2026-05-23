"use client"

import { createClient } from "@/lib/supabase/client"
import { ArrowRight, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

interface University {
    id: string;
    name: string;
    city: string;
    country: string;
    tier: string;
    description: string;
    hero_image: string;
    slug: string;
}

const categories = ["All", "Mid", "Top", "Mid-High", "Low", "Mid-Low"]

const Universities = () => {
    const supabase = createClient();
    const [universities, setUniversities] = useState<University[]>([])
    const [search, setSearch] = useState("")
    const [activeCategory, setActiveCategory] = useState('All');
    const [filtered, setFiltered] = useState<University[]>(universities);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase.from("university").select("id, name, city, country, tier, description, hero_image, slug");
            setUniversities(data ?? [])
        }

        fetchData()
    }, [])

    // console.log(universities)

    useEffect(() => {
        const timeout = setTimeout(() => {
            const q = search.toLowerCase();
            setFiltered(
                universities.filter(
                    (u) =>
                    (
                        u.name.toLowerCase().includes(q)
                    )
                )
            );
        }, 500)
        return () => clearTimeout(timeout)
    }, [search, universities]);

    useEffect(() => {
        setFiltered(activeCategory === 'All'
            ? universities
            : universities.filter(event => `${event.tier}` === `${activeCategory}-tier`))
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
                        <Image className="rounded-md max-h-40 w-full object-cover" width={200} height={100} unoptimized src={uni?.hero_image} alt={uni.name} />
                        <p className="text-gray-400 text-xl font-semibold ml-2 mt-4">
                            {uni.name}
                        </p>
                        <p className="text-zinc-400 text-sm/6 mt-2 ml-2 mb-2">
                            {uni.description}
                        </p>
                        <Link href={`/universities/${uni.slug}`} className="flex items-center gap-2 shadow dark:shadow-white shadow-black rounded-xl px-5 py-2 w-fit">Read more <ArrowRight /></Link>
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