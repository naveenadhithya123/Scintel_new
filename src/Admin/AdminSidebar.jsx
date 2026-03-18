import React from "react";
import { useNavigate } from "react-router-dom";

/* ===== ICONS ===== */

const MegaphoneIcon = () => (
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
<path d="M11 5L6 9H2V15H6L11 19V5Z"/>
<path d="M19.07 4.93C20.94 6.81 22 9.33 22 12C22 14.67 20.94 17.19 19.07 19.07"/>
<path d="M15.53 8.47C16.44 9.38 17 10.63 17 12C17 13.37 16.44 14.62 15.53 15.53"/>
</svg>
);

const ActivitiesIcon = () => (
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
<line x1="16" y1="2" x2="16" y2="6"/>
<line x1="8" y1="2" x2="8" y2="6"/>
<line x1="3" y1="10" x2="21" y2="10"/>
<circle cx="12" cy="16" r="1" fill="currentColor"/>
</svg>
);

const MembersIcon = () => (
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
<circle cx="9" cy="7" r="4"/>
<path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
<path d="M16 3.13a4 4 0 0 1 0 7.75"/>
</svg>
);

const GloriesIcon = () => (
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
<circle cx="12" cy="9" r="6"/>
<path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5"/>
<circle cx="12" cy="9" r="2" fill="currentColor"/>
</svg>
);

const ProblemsIcon = () => (
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
<path d="M9 18h6"/>
<path d="M10 22h4"/>
<path d="M15.1 17.1c1.8-1.4 2.9-3.5 2.9-5.9 0-4-3.1-7.2-7-7.2S4 7.1 4 11.2c0 2.4 1.1 4.5 2.9 5.9"/>
</svg>
);

const SuggestionIcon = () => (
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
<path d="M12 7v4M12 14h.01"/>
</svg>
);

/* ===== SIDEBAR ===== */

export default function AdminSidebar(){

const navigate = useNavigate();

return(

<aside className="w-64 flex-shrink-0 bg-[#023347] flex flex-col text-white h-full overflow-y-auto no-scrollbar">

<div className="p-8 pb-4 flex flex-col items-center flex-shrink-0">
<h2 className="text-2xl font-bold tracking-tight">
Admin Portal
</h2>
</div>

<nav className="flex flex-col gap-1 px-3 mt-4">

<div
onClick={() => navigate("/")}
className="flex items-center p-3 px-6 cursor-pointer text-sm font-medium rounded-xl transition-all duration-300 text-[#CBD5E0] hover:bg-white/5"
>
<span className="mr-4 opacity-95"><MegaphoneIcon/></span>
<span>Announcement</span>
</div>

<div onClick={() => navigate("/admin/activities")}
className="flex items-center p-3 px-6 cursor-pointer text-sm font-medium text-[#CBD5E0] hover:bg-white/5 transition-colors rounded-xl">
<span className="mr-4 opacity-70"><ActivitiesIcon/></span>
<span>Activities</span>
</div>

<div
onClick={() => navigate("/admin/members")}
className="flex items-center p-3 px-6 cursor-pointer text-sm font-medium text-[#CBD5E0] hover:bg-white/5 transition-colors rounded-xl"
>
<span className="mr-4 opacity-70"><MembersIcon/></span>
<span>Members</span>
</div>

<div
onClick={() => navigate("/admin/glories")}
className="flex items-center p-3 px-6 cursor-pointer text-sm font-medium text-[#CBD5E0] hover:bg-white/5 transition-colors rounded-xl"
>
<span className="mr-4 opacity-70"><GloriesIcon/></span>
<span>Glories</span>
</div>

<div 
onClick={() => navigate("/admin/problems")}
className="flex items-center p-3 px-6 cursor-pointer text-sm font-medium text-[#CBD5E0] hover:bg-white/5 transition-colors rounded-xl">
<span className="mr-4 opacity-70"><ProblemsIcon/></span>
<span>Problems</span>
</div>

<div
onClick={() => navigate("/admin/suggestion")}
className="flex items-center p-3 px-6 cursor-pointer text-sm font-medium text-[#CBD5E0] hover:bg-white/5 transition-colors rounded-xl"
>
<span className="mr-4 opacity-70"><SuggestionIcon/></span>
<span>Suggestion</span>
</div>

</nav>

</aside>

);

}