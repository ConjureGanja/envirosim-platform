// client/src/pages/WorldBible.tsx

import { useEffect, useState } from 'react';
import { useParams, Link, Routes, Route, useLocation } from 'react-router-dom';
import { Book, Users, Map, Flag, Box, Loader2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { World } from '../types';

// Sub-components (Placeholders for now)
const Overview = ({ world }: { world: World }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <section className="bg-surface p-6 rounded-xl border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-primary">Concept</h2>
      <p className="text-lg leading-relaxed text-gray-300">{world.description}</p>
    </section>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <section className="bg-surface p-6 rounded-xl border border-gray-700">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Flag className="w-5 h-5 text-accent" /> Tone & Genre</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-sm font-semibold">{world.genre}</span>
          <span className="bg-accent/20 text-accent px-3 py-1 rounded-lg text-sm font-semibold">{world.tone}</span>
        </div>
      </section>
    </div>

    <section className="bg-surface p-6 rounded-xl border border-gray-700">
      <h3 className="text-xl font-bold mb-4">Historical Timeline</h3>
      <div className="space-y-6 border-l-2 border-gray-700 ml-3 pl-8 relative">
        {world.lore.history.map((event, idx) => (
          <div key={idx} className="relative">
            <span className="absolute -left-[41px] bg-surface border-2 border-primary w-5 h-5 rounded-full"></span>
            <span className="text-primary font-bold block mb-1">{event.year}</span>
            <h4 className="text-lg font-semibold text-white">{event.event}</h4>
            <p className="text-gray-400 mt-1">{event.description}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const Characters = ({ world }: { world: World }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {world.characters.map((char) => (
      <div key={char.id} className="bg-surface rounded-xl overflow-hidden border border-gray-700 flex flex-col">
        <div className="h-48 bg-gray-800 relative group" tabIndex={0}>
           {/* Placeholder for character image */}
           <div className="absolute inset-0 flex items-center justify-center text-gray-600">
             <span className="text-sm px-8 text-center">{char.imagePrompt}</span>
           </div>
           {/* Action overlay */}
           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium" aria-label={`Generate image for ${char.name}`}>Generate Image</button>
           </div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-4">
             <h3 className="text-xl font-bold">{char.name}</h3>
             <span className="text-sm text-primary font-medium">{char.role}</span>
          </div>
          <p className="text-gray-400 text-sm mb-4 flex-1">{char.description}</p>
          <div className="mt-auto pt-4 border-t border-gray-700">
             <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Archetype</span>
             <p className="text-sm text-gray-300">{char.archetype}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Locations = ({ world }: { world: World }) => (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {world.locations.map((loc) => (
        <div key={loc.id} className="bg-surface rounded-xl p-6 border border-gray-700 flex gap-6">
            <div className="w-1/3 bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 text-xs p-4 text-center">
                {loc.imagePrompt}
            </div>
            <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{loc.name}</h3>
                <span className="inline-block bg-accent/20 text-accent text-xs px-2 py-1 rounded mb-3">{loc.type}</span>
                <p className="text-gray-400">{loc.description}</p>
            </div>
        </div>
      ))}
    </div>
);

const Assets3D = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-primary/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Box className="w-8 h-8 text-primary" />
                3D Asset Workflow
            </h2>
            <p className="text-lg text-gray-300 mb-6">
                Turn your generated concept art into 3D models using AI tools like Microsoft Copilot or Meshy.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 font-bold">1</div>
                    <h3 className="font-bold mb-2">Generate Image</h3>
                    <p className="text-sm text-gray-400">Create a clean, front-facing concept image in the Characters or Locations tab.</p>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 font-bold">2</div>
                    <h3 className="font-bold mb-2">Download & Prompt</h3>
                    <p className="text-sm text-gray-400">Save the image. Open Microsoft Copilot/Designer and upload it.</p>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 font-bold">3</div>
                    <h3 className="font-bold mb-2">Convert to 3D</h3>
                    <p className="text-sm text-gray-400">Use prompt: "Create a 3D model GLB file based on this image". (Results may vary per tool availability).</p>
                </div>
            </div>
        </div>
    </div>
);

export const WorldBible = () => {
  const { id } = useParams();
  const [world, setWorld] = useState<World | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Mock fetch or real fetch
    // For now we will try to fetch from Firestore, but if it fails (permissions/mock), we might need fallback
    const fetchWorld = async () => {
        if (!id) return;
        try {
            const docRef = doc(db, 'worlds', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setWorld(docSnap.data() as World);
            } else {
                // Fallback for demo if not found in Firestore (e.g. if we just clicked from dashboard mock)
                // In real app, handle 404
                if (id === '1') {
                   // Mock data for Dashboard link
                   setWorld({
                     id: '1',
                     name: 'Neon Nexus',
                     concept: '...',
                     genre: 'Cyberpunk',
                     tone: 'Dark',
                     description: 'A cyberpunk city...',
                     lore: { history: [], factions: [] },
                     characters: [],
                     locations: [],
                     plotPoints: [],
                     assets: []
                   });
                }
            }
        } catch (e) {
            console.error("Error fetching world:", e);
        }
    };
    fetchWorld();
  }, [id]);

  if (!world) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const tabs = [
    { id: '', label: 'Overview', icon: Book },
    { id: 'characters', label: 'Characters', icon: Users },
    { id: 'locations', label: 'Locations', icon: Map },
    { id: 'assets', label: '3D & Assets', icon: Box },
  ];

  const currentTab = location.pathname.split('/').pop();

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
            <h1 className="font-bold text-xl truncate">{world.name}</h1>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{world.genre}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            {tabs.map(tab => {
                const isActive = tab.id === '' ? (currentTab === '' || !tabs.some(t => t.id === currentTab)) : currentTab === tab.id;
                return (
                    <Link
                        key={tab.id}
                        to={`/world/${id}/${tab.id}`}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <tab.icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                    </Link>
                );
            })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-8">
        <Routes>
            <Route path="/" element={<Overview world={world} />} />
            <Route path="/characters" element={<Characters world={world} />} />
            <Route path="/locations" element={<Locations world={world} />} />
            <Route path="/assets" element={<Assets3D />} />
        </Routes>
      </main>
    </div>
  );
};
