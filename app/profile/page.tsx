// "use client"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { createClient } from "@/lib/supabase/client";
// import { useEffect, useState } from "react";

// interface User {
//     id: string;
//     email: string;
//     first_name: string;
//     last_name: string;
//     bio: string;
//     avatar_url: string;
// }

// export default function ProfilePage() {
//     const [userData, setUserData] = useState<User | null>(null);

//     useEffect(() => {
//         async function fetchData() {
//             const supabase = createClient();
//             const { data: { user } } = await supabase.auth.getUser();
//             if (user) {
//                 const { data: profile } = await supabase
//                     .from('profiles')
//                     .select('*')
//                     .eq('id', user.id)
//                     .single();
//                 setUserData(profile);
//             }
//         }
//         fetchData();
//     }, []);

//     return (
//         <div className="flex gap-3 pt-20 items-center h-screen px-4 py-8">
//             <div className="flex-">
//                 <div className="flex flex-col gap-4">
//                     <div className="flex items-center flex-col justify-center gap-4 text-center">
//                         <Avatar className="h-8 w-8 rounded-lg" size="xl">
//                             <AvatarImage src={userData?.avatar_url} alt={userData?.first_name} />
//                             <AvatarFallback className="rounded-lg">{userData?.first_name?.charAt(0)}{userData?.last_name?.charAt(0)}</AvatarFallback>
//                         </Avatar>

//                         <div className="flex flex-col">
//                             <h1 className="text-2xl font-bold">{userData?.first_name} {userData?.last_name}</h1>
//                             <p className="text-gray-500">{userData?.email}</p>
//                             <p className="text-gray-500 max-w-lg">{userData?.bio}</p>
//                         </div>
//                         <Button>Edit Profile</Button>
//                     </div>
//                 </div>
//             </div>
//             <div className="flex-3 w-full">
//                 <p>hello</p>
//             </div>
//         </div>
//     );
// }


import { createClient } from "@/lib/supabase/server";
import UserInfo from "./userInfo";
import UpdateProfileForm from "./updateProfileForm";

export default async function ProfilePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return <div>Not logged in</div>;

    const [profileRes, resumesRes, bookingsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("resumes").select("*").eq("user_id", user.id),
        supabase.from("booking").select("*, counselor(*)").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);

    const profile = profileRes.data;
    const resumes = resumesRes?.data || [];
    const bookings = bookingsRes?.data || [];

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 h-screen px-4 py-8">
            <div className="grid md:grid-cols-2 gap-6 ">
                <UserInfo profile={profile} email={user.email!} />
                <UpdateProfileForm profile={profile} />
            </div>

            <History resumes={resumes} bookings={bookings} />
        </div>
    );
}

// function UpdateProfile({ profile }: any) {
//     return (
//         <form action={updateProfile} className="p-6 rounded-2xl shadow space-y-4 shadow-gray-500">
//             <h2 className="text-lg font-semibold">Update Profile</h2>

//             <Input
//                 name="first_name"
//                 defaultValue={profile?.first_name || ""}
//                 placeholder="First Name"
//                 className="input"
//             />

//             <Input
//                 name="last_name"
//                 defaultValue={profile?.last_name || ""}
//                 placeholder="Last Name"
//                 className="input"
//             />

//             <Input
//                 name="phone"
//                 defaultValue={profile?.phone || ""}
//                 placeholder="Phone"
//                 className="input"
//             />

//             <Textarea
//                 name="bio"
//                 defaultValue={profile?.bio || ""}
//                 placeholder="Bio"
//                 rows={4}
//                 className="input"
//             />

//             <Input
//                 name="password"
//                 type="password"
//                 placeholder="New Password"
//                 className="input"
//             />

//             <Button type="submit">
//                 Save Changes
//             </Button>
//         </form>
//     );
// }

async function History({ resumes, bookings }: any) {
    return (
        <div className="space-y-6">
            {/* Resumes */}
            {/* <div className="p-6 rounded-2xl shadow">
                <h2 className="font-semibold mb-4">Your Resumes</h2>

                {resumes.length === 0 ? (
                    <p>No resumes found</p>
                ) : (
                    <ul className="space-y-2">
                        {resumes.map((r: any) => (
                            <li key={r.id} className="border p-3 rounded">
                                <p>{r.title}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(r.created_at).toLocaleDateString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div> */}

            {/* Bookings */}
            <div className="p-6 rounded-2xl shadow shadow-gray-500">
                <h2 className="font-semibold mb-4">Counselor Bookings</h2>

                {bookings.length === 0 ? (
                    <p>No bookings found</p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {bookings.map((b: any) => {
                            const isoDate = JSON.parse(b.appointment_date).iso;

                            return (
                                <div
                                    key={b.id}
                                    className=" shadow-md rounded-2xl p-5 border hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Header */}
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-semibold text-gray-500">
                                            Booking Details
                                        </h2>

                                        <span
                                            className={`text-xs font-medium px-3 py-1 rounded-full
              ${b.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : b.status === "approved"
                                                        ? "bg-green-100 text-green-700"
                                                        : b.status === "completed"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {b.status}
                                        </span>
                                    </div>

                                    {/* Counselor */}
                                    <div className="mb-4">
                                        <h3 className="text-sm font-semibold text-gray-500 mb-1">
                                            Counselor
                                        </h3>
                                        <div className="rounded-lg p-3 space-y-1">
                                            <p className="font-medium text-gray-500">
                                                {b.counselor?.first_name} {b.counselor?.last_name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {b.counselor?.email}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {b.counselor?.phone}
                                            </p>
                                        </div>
                                    </div>

                                    {/* User */}
                                    <div className="mb-4">
                                        <h3 className="text-sm font-semibold text-gray-500 mb-1">
                                            Your Info
                                        </h3>
                                        <div className=" rounded-lg p-3 space-y-1">
                                            <p className="font-medium text-gray-500">{b.full_name}</p>
                                            <p className="text-sm text-gray-500">{b.email}</p>
                                            <p className="text-sm text-gray-500">{b.phone}</p>
                                            {b.description && (
                                                <p className="text-sm text-gray-500 italic">
                                                    &quot;{b.description}&quot;
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex justify-between items-center border-t pt-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Date</p>
                                            <p className="font-medium text-gray-500">{isoDate}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">Time</p>
                                            <p className="font-medium text-gray-500">
                                                {b.appointment_time}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
