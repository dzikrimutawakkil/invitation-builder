import React, { useState } from 'react';
import { Settings, Sparkles, LayoutList, Pencil, Calendar, MapPin, User, Send } from 'lucide-react';

// --- UI Components for Reusable Elements ---

// Standard input component
const InputField = ({ label, type = 'text', value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
      placeholder={`Enter ${label.toLowerCase()}`}
    />
  </div>
);

// Textarea input component
const TextareaField = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows="3"
      className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 resize-none"
      placeholder={`Enter the invitation message`}
    />
  </div>
);

// --- Template Definitions (The Components) ---

// Template 1: Minimalist (Clean and Formal)
const TemplateMinimalist = ({ data }) => (
  <div className="p-8 bg-white border-2 border-gray-100 rounded-2xl shadow-xl text-center max-w-lg mx-auto">
    <p className="text-sm font-semibold tracking-widest text-indigo-600 uppercase mb-2">{data.host}</p>
    <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b-2 border-indigo-100 pb-2">
      {data.title}
    </h1>
    <div className="space-y-4 text-gray-600">
      <div className="flex items-center justify-center space-x-2">
        <Calendar className="w-5 h-5 text-indigo-500" />
        <span className="font-medium">{data.date} @ {data.time}</span>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <MapPin className="w-5 h-5 text-indigo-500" />
        <span>{data.location}</span>
      </div>
    </div>
    <p className="mt-8 text-lg italic text-gray-700 leading-relaxed">
      "{data.message}"
    </p>
  </div>
);

// Template 2: Elegant (Themed and Scripted)
const TemplateElegant = ({ data }) => (
  <div className="p-10 bg-pink-50 rounded-3xl shadow-2xl text-center max-w-lg mx-auto border-4 border-pink-200">
    <div className="text-pink-600 mb-4 flex justify-center">
      <Sparkles className="w-8 h-8 mr-2" />
      <p className="font-serif text-xl">The pleasure of your company is requested</p>
    </div>
    <h1 className="text-6xl font-['Georgia',_serif] text-pink-900 mb-8 italic tracking-wide font-light">
      {data.title}
    </h1>

    <div className="bg-white p-4 rounded-xl shadow-inner inline-block">
      <p className="text-gray-700 text-lg font-semibold mb-2">{data.date} at {data.time}</p>
      <p className="text-gray-500 text-sm">{data.location}</p>
    </div>

    <p className="mt-8 text-md text-pink-800 leading-snug">
      {data.message}
    </p>
    <p className="mt-6 text-sm text-pink-600 font-bold">Hosted by: {data.host}</p>
  </div>
);

// Template 3: Modern (Bold and Structured)
const TemplateModern = ({ data }) => (
  <div className="p-8 bg-gray-900 rounded-2xl shadow-2xl max-w-lg mx-auto text-white flex flex-col items-center">
    <div className="w-full bg-yellow-500 p-4 rounded-t-lg text-center">
      <h1 className="text-3xl font-black uppercase tracking-widest text-gray-900">
        {data.title}
      </h1>
    </div>

    <div className="p-6 w-full space-y-4">
      <div className="flex items-center space-x-3">
        <Calendar className="w-6 h-6 text-yellow-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-gray-400">WHEN</p>
          <p className="font-bold">{data.date} / {data.time}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <MapPin className="w-6 h-6 text-yellow-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-gray-400">WHERE</p>
          <p className="font-bold">{data.location}</p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-700">
        <p className="text-gray-300 text-base leading-relaxed">{data.message}</p>
      </div>
    </div>

    <div className="w-full bg-gray-800 p-3 rounded-b-lg text-right">
      <p className="text-xs font-light text-yellow-500">A personal invitation from {data.host}</p>
    </div>
  </div>
);


const templateMap = {
  minimalist: TemplateMinimalist,
  elegant: TemplateElegant,
  modern: TemplateModern,
};

// --- Main Application Component ---
const App = () => {
  const [invitationData, setInvitationData] = useState({
    title: "The Annual Gala Dinner",
    date: "Saturday, November 23rd",
    time: "6:30 PM",
    location: "The Grand Ballroom, City Center",
    host: "The Community Leaders",
    message: "We cordially invite you to an evening of celebration and fundraising. Your presence would be an honor.",
  });

  const [selectedTemplate, setSelectedTemplate] = useState('minimalist');

  const updateData = (key, value) => {
    setInvitationData(prev => ({ ...prev, [key]: value }));
  };

  const CurrentTemplate = templateMap[selectedTemplate];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-inter antialiased">
      <style>{`
        .font-inter { font-family: 'Inter', sans-serif; }
        .h-fit-sticky { 
            position: sticky;
            top: 1rem;
        }
      `}</style>
      
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center justify-center">
          <Pencil className="w-8 h-8 mr-3 text-indigo-600" />
          Invitation Builder
        </h1>
        <p className="text-gray-500 mt-2">Design your perfect website invitation letter, component by component.</p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- Column 1: Template Selector --- */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-xl h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
            <LayoutList className="w-5 h-5 mr-2 text-indigo-500" />
            1. Select Template
          </h2>
          <div className="space-y-4">
            {Object.keys(templateMap).map(key => (
              <button
                key={key}
                onClick={() => setSelectedTemplate(key)}
                className={`w-full py-3 px-4 text-left rounded-lg transition duration-200 shadow-md
                  ${selectedTemplate === key
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-300 transform scale-[1.01]'
                    : 'bg-gray-100 text-gray-800 hover:bg-indigo-50 hover:shadow-lg'
                  }
                `}
              >
                <div className="font-semibold capitalize">{key} Template</div>
                <div className="text-xs opacity-80 mt-1">
                  {key === 'minimalist' && 'Clean, modern, and direct.'}
                  {key === 'elegant' && 'Formal, themed, with script accents.'}
                  {key === 'modern' && 'Bold colors and structured layout.'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* --- Column 2: Content Editor --- */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-xl h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-indigo-500" />
            2. Edit Content
          </h2>
          <InputField 
            label="Invitation Title" 
            value={invitationData.title} 
            onChange={(v) => updateData('title', v)} 
          />
          <InputField 
            label="Host/Sender Name" 
            value={invitationData.host} 
            onChange={(v) => updateData('host', v)} 
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField 
              label="Date (e.g., Sat, Nov 23rd)" 
              value={invitationData.date} 
              onChange={(v) => updateData('date', v)} 
            />
            <InputField 
              label="Time (e.g., 6:30 PM)" 
              value={invitationData.time} 
              onChange={(v) => updateData('time', v)} 
            />
          </div>
          <InputField 
            label="Location/Venue" 
            value={invitationData.location} 
            onChange={(v) => updateData('location', v)} 
          />
          <TextareaField 
            label="Main Message" 
            value={invitationData.message} 
            onChange={(v) => updateData('message', v)} 
          />
        </div>

        {/* --- Column 3: Live Preview --- */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-xl h-fit-sticky">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-indigo-500" />
              3. Live Preview
            </h2>
            <div className="min-h-[400px] flex items-center justify-center">
              <CurrentTemplate data={invitationData} />
            </div>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => console.log("Final Invitation Data:", invitationData)}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-xl hover:bg-indigo-700 transition duration-200 flex items-center justify-center mx-auto"
            >
              <Send className="w-5 h-5 mr-2" />
              Finalize & Share (Concept)
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default App;