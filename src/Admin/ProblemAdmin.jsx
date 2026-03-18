import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const ProblemAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Problems List');
  const [activeSidebar, setActiveSidebar] = useState('Problems');
  const [selectedProblem, setSelectedProblem] = useState(null);
  // State for mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [problemData, setProblemData] = useState([
    { id: 1, type: 'problem', name: 'CGPA calculator', status: 'In Progress', detailedDescription: "I don't clearly understand the exact formula used for SGPA and CGPA calculation. Each subject has different credits, and multiplying credit with grade points manually often leads to mistakes." },
    { id: 2, type: 'problem', name: 'Attendance System', status: 'Open to Built', detailedDescription: "A digital solution for professors to track student attendance efficiently using QR codes." },
    { id: 3, type: 'problem', name: 'Library Manager', status: 'In Progress', detailedDescription: "An automated management system to handle book issuing, returns, and inventory updates." },
    { id: 4, type: 'problem', name: 'Alumni Portal', status: 'Open to Built', detailedDescription: "A platform for alumni to network and share job opportunities with current students." },
    { id: 5, type: 'problem', name: 'Event Registration', status: 'In Progress', detailedDescription: "An end-to-end solution for managing registrations for college festivals." },
    { id: 6, type: 'problem', name: 'Campus Map', status: 'Open to Built', detailedDescription: "An interactive map of the campus providing real-time directions to all departments." }
  ]);

  const [requestData, setRequestData] = useState([
    { id: 101, type: 'request', title: 'Bus Route Tracker', category: 'Social', name: 'Rithish Barath N', year: 'II', email: '2k24cse160@kiot.ac.in', mobile: '98989 92929', section: 'C', detailedDescription: "Many students miss their buses because there is no way to know the exact location of the vehicle. A GPS-based tracker would solve this by providing estimated arrival times at each stop." }
  ]);

  const [lockRequestData, setLockRequestData] = useState([
    { id: 201, type: 'lock', title: 'CGPA Calculator', category: 'Social', name: 'Rithish Barath N', year: 'II', email: '2k24cse160@kiot.ac.in', mobile: '98989 92929', section: 'C', mentor: 'Sanjeevsurya AP/CSE', detailedDescription: "I don't clearly understand the exact formula used for SGPA and CGPA calculation." }
  ]);

  const handleSidebarClick = (name) => {
  setActiveSidebar(name);
  setIsMenuOpen(false);

  if (name === "Announcement") navigate("/admin");
  if (name === "Activities") navigate("/admin/activities");
  if (name === "Members") navigate("/admin/members");
  if (name === "Glories") navigate("/admin/glories");
  if (name === "Problems") navigate("/admin/problems");
  if (name === "Suggestion") navigate("/admin/suggestion");
};
  const handleAddToList = (request) => {
    const newProblem = { id: Date.now(), type: 'problem', name: request.title, status: 'Open to Built', detailedDescription: request.detailedDescription };
    setProblemData([newProblem, ...problemData]);
    setRequestData(requestData.filter(r => r.id !== request.id));
    setSelectedProblem(null);
    setActiveTab('Problems List');
  };

  const handleApproveLock = (lockReq) => {
    const problemExists = problemData.some(p => p.name.toLowerCase() === lockReq.title.toLowerCase());
    if (problemExists) {
      setProblemData(problemData.map(p => p.name.toLowerCase() === lockReq.title.toLowerCase() ? { ...p, status: 'In Progress' } : p));
    } else {
      const newProblem = { id: Date.now(), type: 'problem', name: lockReq.title, status: 'In Progress', detailedDescription: lockReq.detailedDescription };
      setProblemData([newProblem, ...problemData]);
    }
    setLockRequestData(lockRequestData.filter(l => l.id !== lockReq.id));
    setSelectedProblem(null);
    setActiveTab('Problems List');
  };

  const handleDeny = (id, type) => {
    if (type === 'request') setRequestData(requestData.filter(r => r.id !== id));
    if (type === 'lock') setLockRequestData(lockRequestData.filter(l => l.id !== id));
    setSelectedProblem(null);
  };

  const Icons = {
    Megaphone: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 13v-2Z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>,
    Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
    Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Trophy: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
    Lightbulb: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.1.7.8 1.3 1.5 1.5 2.4"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>,
    MessageSquare: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>,
    X: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  };

  const sidebarItems = [
    { name: 'Announcement', icon: <Icons.Megaphone /> },
    { name: 'Activities', icon: <Icons.Calendar /> },
    { name: 'Members', icon: <Icons.Users /> },
    { name: 'Glories', icon: <Icons.Trophy /> },
    { name: 'Problems', icon: <Icons.Lightbulb /> },
    { name: 'Suggestion', icon: <Icons.MessageSquare /> },
  ];

  const tabs = ['Problems List', 'Problem Request', 'Lock Request'];

  const renderContent = () => {
    if (selectedProblem) {
      const isListItem = selectedProblem.type === 'problem';
      const isRequest = selectedProblem.type === 'request';
      const isLock = selectedProblem.type === 'lock';

      return (
        <div className="flex flex-col min-h-full">
          <header className="mb-6 flex-shrink-0">
            <h2 className="text-xl md:text-2xl font-bold text-[#023347] mb-4">
              {isListItem ? "Problem Details" : "Problem Request"}
            </h2>
          </header>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 flex-1 mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-[#023347] mb-6 md:mb-8">{selectedProblem.name || selectedProblem.title}</h3>
            
            {!isListItem && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 mb-10">
                <div className="flex items-center"><span className="font-bold text-[#023347] w-24">Name</span><span className="text-gray-600 break-all">{selectedProblem.name}</span></div>
                <div className="flex items-center"><span className="font-bold text-[#023347] w-24">Email</span><span className="text-gray-600 break-all">{selectedProblem.email}</span></div>
                <div className="flex items-center"><span className="font-bold text-[#023347] w-24">Year</span><span className="text-gray-600">{selectedProblem.year}</span></div>
                <div className="flex items-center"><span className="font-bold text-[#023347] w-24">Mobile</span><span className="text-gray-600">{selectedProblem.mobile}</span></div>
                <div className="flex items-center"><span className="font-bold text-[#023347] w-24">Section</span><span className="text-gray-600">{selectedProblem.section}</span></div>
                {isLock && (
                  <div className="flex items-center"><span className="font-bold text-[#023347] w-24">Mentor</span><span className="text-gray-600">{selectedProblem.mentor}</span></div>
                )}
              </div>
            )}

            <div className="mb-4">
              <h4 className="text-lg font-bold text-[#023347] mb-3">Detailed Description</h4>
              <div className="text-gray-700 leading-relaxed space-y-4 text-sm md:text-base">
                <p>{selectedProblem.detailedDescription}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-2 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 flex-shrink-0 pb-2">
            <button onClick={() => setSelectedProblem(null)} className="bg-[#023347] text-white px-8 py-2.5 rounded-lg font-medium text-sm hover:bg-[#012535] transition-all shadow-md active:scale-95">Back</button>
            {(isRequest || isLock) && (
              <button 
                onClick={() => isRequest ? handleAddToList(selectedProblem) : handleApproveLock(selectedProblem)}
                className="bg-[#023347] text-white px-8 py-2.5 rounded-lg font-medium text-sm hover:bg-[#012535] transition-all shadow-md active:scale-95"
              >
                Approve
              </button>
            )}
            {(isRequest || isLock) && (
              <button onClick={() => handleDeny(selectedProblem.id, selectedProblem.type)} className="bg-red-600 text-white px-8 py-2.5 rounded-lg font-medium text-sm hover:bg-red-700 transition-all shadow-md active:scale-95">Deny</button>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'Problem Request' || activeTab === 'Lock Request') {
      const data = activeTab === 'Problem Request' ? requestData : lockRequestData;
      return (
        <div className="flex flex-col min-h-full">
          <header className="mb-6 flex-shrink-0">
            <h2 className="text-xl md:text-2xl font-bold text-[#023347] mb-4">Problem Statements</h2>
            <div className="flex space-x-4 md:space-x-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-xs md:text-sm font-semibold transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-[#023347]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2A8E9E]"></div>}
                </button>
              ))}
            </div>
          </header>
          <div className="pt-4 space-y-4 pb-8 flex-1">
            {data.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-400 font-medium">No pending {activeTab.toLowerCase()}s</div>
            ) : (
              <>
                <div className="hidden lg:flex bg-white rounded-xl border border-[#2A8E9E] shadow-sm items-center px-6 py-3 text-gray-500 font-semibold text-center mx-2">
                  <div className="w-1/4">Title</div><div className="w-1/4">Category</div><div className="w-1/4">Name</div><div className="w-1/4">Year</div><div className="w-[120px] ml-auto">Action</div>
                </div>
                {data.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-lg flex flex-col lg:flex-row items-center px-6 py-6 text-center transition-all hover:scale-[1.01] mx-2 space-y-4 lg:space-y-0">
                    <div className="w-full lg:w-1/4 font-bold text-[#023347] text-lg">{item.title}</div>
                    <div className="w-full lg:w-1/4 text-gray-600"><span className="lg:hidden font-bold">Category: </span>{item.category}</div>
                    <div className="w-full lg:w-1/4 text-gray-600"><span className="lg:hidden font-bold">By: </span>{item.name}</div>
                    <div className="w-full lg:w-1/4 text-gray-600"><span className="lg:hidden font-bold">Year: </span>{item.year}</div>
                    <div className="w-full lg:w-[120px] lg:ml-auto">
                      <button onClick={() => setSelectedProblem(item)} className="w-full lg:w-auto bg-[#023347] text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#012535] transition-all shadow-md active:scale-95 whitespace-nowrap">View Detail</button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col min-h-full">
        <header className="mb-6 flex-shrink-0">
          <h2 className="text-xl md:text-2xl font-bold text-[#023347] mb-4">Problem Statements</h2>
          <div className="flex space-x-4 md:space-x-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-xs md:text-sm font-semibold transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-[#023347]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2A8E9E]"></div>}
              </button>
            ))}
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-[#2A8E9E]/20 overflow-hidden mb-8 flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#2A8E9E] text-white">
                  <th className="px-4 md:px-6 py-4 font-semibold text-center">Problem</th>
                  <th className="px-4 md:px-6 py-4 font-semibold text-center">Status</th>
                  <th className="px-4 md:px-6 py-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {problemData.map((row) => (
                  <tr 
                    key={row.id} 
                    className="bg-white transition-all duration-300 hover:bg-gray-50 relative group cursor-default"
                  >
                    <td className="px-4 md:px-6 py-5 text-[#023347] text-center font-bold text-sm md:text-base">{row.name}</td>
                    <td className="px-4 md:px-6 py-5 text-center">
                      <span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold whitespace-nowrap ${
                        row.status === 'In Progress' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-5 text-center">
                      <button 
                        onClick={() => setSelectedProblem(row)}
                        className="bg-[#023347] text-white px-4 md:px-6 py-2 rounded-md font-medium text-xs md:text-sm hover:bg-[#012535] transition-all shadow-md active:scale-95 whitespace-nowrap"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex-1 bg-white"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#f0f4f8] font-sans overflow-hidden relative">
      
      {/* Sidebar Overlay for Mobile */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#023347] text-white flex flex-col shadow-xl transition-transform duration-300 transform
        lg:relative lg:translate-x-0
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Portal</h1>
          <button className="lg:hidden" onClick={() => setIsMenuOpen(false)}>
            <Icons.X />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleSidebarClick(item.name)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-200 ${activeSidebar === item.name ? 'bg-[#2A8E9E] text-white' : 'text-gray-300 hover:bg-[#012535]'}`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button onClick={() => setIsMenuOpen(true)} className="text-[#023347]">
            <Icons.Menu />
          </button>
          <h1 className="text-lg font-bold text-[#023347]">Admin Portal</h1>
          <div className="w-6" /> {/* Placeholder to center text */}
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
          {renderContent()}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default function App() {
  return <ProblemAdmin />;
}