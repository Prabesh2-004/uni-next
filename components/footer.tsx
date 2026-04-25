import Link from "next/link";

export default function Footer() {
    const links = [
        {
            link: '/resume',
            title: 'Resume'
        },
        {
            link: '/booking',
            title: 'Counselor Booking'
        },
        {
            link: '/universities',
            title: 'Universities'
        },
        {
            link: '/events',
            title: 'Events'
        },
        {
            link: '/strategy-hub',
            title: 'Strategy Hub'
        },
    ]
    return (
        <footer className="px-10 mt-10 w-full">
            <div className="w-full border"/>
            <div className="flex flex-col md:flex-row items-start justify-center gap-10 py-10 border-b border-gray-500/30">

                <div className="max-w-96">
                    <Link href={'/'} className="text-xl">Dream Uni</Link>
                    <p className="mt-6 text-sm text-gray-500">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been.
                    </p>
                </div>

                <div className="w-1/2 flex flex-wrap md:flex-nowrap justify-between">
                    <div>
                        <h2 className="font-semibold text-gray-500 mb-5">RESOURCES</h2>
                        {links.map((link, index) => (
                            <ul key={index} className="text-sm py-1 text-gray-500 space-y-2 list-none">
                                <li><Link href={link.link}>{link.title}</Link></li>
                            </ul>
                        ))}
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-900 mb-5">COMPANY</h2>
                        <div className="text-sm text-gray-500 space-y-2 list-none">
                            <li><a href="#">About</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Privacy</a></li>
                            <li><a href="#">Terms</a></li>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center shadow-[0px_4px_25px_0px_#0000000D] text-gray-900/60 rounded-xl max-w-lg md:w-full w-11/12 md:py-8 py-6">
                    {/* <div className="flex items-center justify-center p-3 bg-red-100 rounded-full">
                        <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/model/faceIcon.svg" alt="faceIcon" />
                    </div> */}
                    <h2 className="text-slate-400 font-medium mt-3 text-lg">Enjoying this post?</h2>
                    <p className="text-sm text-slate-400 mt-1 md:w-80 w-72 text-center">Subscribe to get more content like this delivered to your inbox for free!</p>
                    <div className="flex items-center mt-5 w-full md:px-16 px-6">
                        <input type="email" placeholder="Enter Your Email" className="text-sm border-r-0 outline-none border border-gray-500/50 pl-3 w-full h-10 rounded-l-md" />
                        <button type="button" className="font-medium text-sm text-white bg-gray-900/90 w-36 h-10 rounded-r-md">Subscribe</button>
                    </div>
                </div>
            </div>
            <p className="py-4 text-center text-xs md:text-sm text-gray-500">
                Copyright 2024 © <Link href="https://prabeshlamichhane2004.com.np">Dream Uni</Link>. All Right Reserved.
            </p>
        </footer>
    );
};