import React from 'react';
import { 
  Building2, 
  User, 
  Award, 
  Code2, 
  Cpu, 
  Flame, 
  Layers, 
  BarChart3, 
  Sliders, 
  AlertTriangle, 
  FileText, 
  Clock, 
  ShieldCheck, 
  HelpCircle, 
  Zap, 
  Sparkles,
  ArrowRight,
  Terminal,
  Activity,
  GitBranch
} from 'lucide-react';
import { ParticleCard } from '../../components';
import { useGasData } from '../../context';

export const AboutView: React.FC = () => {
  const { setCurrentView } = useGasData();

  const systemModules = [
    {
      id: 'overview',
      name: 'Overview Dashboard',
      icon: BarChart3,
      desc: 'Central command console showing real-time KPI metrics, total gas production vs demand, net buffer status, and critical alerts.'
    },
    {
      id: 'generation',
      name: 'Gas Generation',
      icon: Flame,
      desc: 'Dedicated telemetry monitoring Blast Furnace Gas (BFG), Coke Oven Gas (COG), and Linz-Donawitz Gas (LDG) production units.'
    },
    {
      id: 'consumption',
      name: 'Gas Consumption',
      icon: Zap,
      desc: 'Live tracking of fuel consumption across Power Plants, Rolling Mills, Reheating Furnaces, and Steam Generation Boilers.'
    },
    {
      id: 'balance',
      name: 'Gas Balance & Storage',
      icon: Layers,
      desc: 'Holder storage capacities, net pressure dynamics, flaring loss minimization, and real-time gas balancing algorithms.'
    },
    {
      id: 'network',
      name: 'Sankey Flow Network',
      icon: GitBranch,
      desc: 'Visual flow topology mapping real-time volumetric gas distribution from generation plants directly to consumer facilities.'
    },
    {
      id: 'simulation',
      name: 'Simulation Workspace',
      icon: Sliders,
      desc: 'Interactive operational sandbox enabling fuel substitution modeling, load balancing, and flare reduction testing.'
    },
    {
      id: 'scenario',
      name: 'Scenario Analysis',
      icon: Activity,
      desc: 'What-if operational scenario modeling for unit trips, maintenance outages, emergency load shedding, and peak load optimization.'
    },
    {
      id: 'alerts',
      name: 'Operational Alerts',
      icon: AlertTriangle,
      desc: 'Real-time alert console prioritizing system warnings, pressure drops, excess flaring notifications, and recommended actions.'
    },
    {
      id: 'reports',
      name: 'Reports & Exports',
      icon: FileText,
      desc: 'Shift summaries, daily gas consumption logs, custom date range filtering, and automated PDF/CSV export generation.'
    },
    {
      id: 'timeline',
      name: 'Event Timeline',
      icon: Clock,
      desc: 'Chronological timeline recording operational events, valve status shifts, automated safety triggers, and system state transitions.'
    },
    {
      id: 'audit',
      name: 'Audit Trail',
      icon: ShieldCheck,
      desc: 'Immutable security log documenting operator actions, setpoint updates, system config modifications, and user access records.'
    }
  ];

  const techStack = [
    { name: 'React 18', type: 'UI Framework', desc: 'Component-based user interface with dynamic state management' },
    { name: 'TypeScript', type: 'Language', desc: 'Strict static typing for data models and component safety' },
    { name: 'Vite', type: 'Build Tool', desc: 'Next-generation hyper-fast module bundling and developer server' },
    { name: 'Tailwind CSS', type: 'Styling', desc: 'Utility-first CSS engine customized for dark monochrome aesthetics' },
    { name: 'GSAP', type: 'Animations', desc: 'GreenSock Animation Platform driving particle canvases and Bento effects' },
    { name: 'Chart.js', type: 'Data Visualization', desc: 'High-performance interactive telemetry charts and real-time graphs' },
    { name: 'Lucide Icons', type: 'Iconography', desc: 'Clean vector system icons for modern dark UI clarity' },
    { name: 'jsPDF', type: 'Export Engine', desc: 'Client-side PDF report compilation and layout rendering' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 text-white">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-zinc-950 border border-zinc-800 p-8 rounded-2xl relative overflow-hidden">
        <div className="space-y-3 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Official Documentation & Project Overview</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white font-mono">
            About GASMIND
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Intelligent By-Product Gas Management System designed for steel plant optimization, flaring reduction, real-time gas balancing, and predictive simulation.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-black/80 border border-zinc-800 rounded-xl z-10 w-full md:w-auto text-center min-w-[240px]">
          <img 
            src="/gasmind_logo.jpg" 
            alt="GASMIND Logo" 
            className="w-16 h-16 object-contain rounded-lg border border-zinc-700 mb-3 filter grayscale hover:grayscale-0 transition-all duration-300"
          />
          <span className="text-lg font-bold font-mono tracking-widest text-white">GASMIND</span>
          <span className="text-xs text-zinc-400 font-mono">v1.0.0</span>
        </div>
      </div>

      {/* Author & Project Specification Card (EXACT REQ MATCH) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ParticleCard 
          clickEffect={true} 
          glowColor="255, 255, 255" 
          className="lg:col-span-1 bg-zinc-950 p-6 border border-zinc-800 rounded-2xl relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
              <div className="flex items-center gap-2 text-white font-mono font-semibold">
                <Award className="w-5 h-5 text-zinc-300" />
                <span>PROJECT CREDENTIALS</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300">v1.0.0</span>
            </div>

            <div className="space-y-5 font-mono">
              <div className="p-4 bg-black border border-zinc-800 rounded-xl space-y-3">
                <div className="text-center pb-2 border-b border-zinc-800">
                  <div className="text-xl font-bold tracking-widest text-white">GASMIND</div>
                  <div className="text-xs text-zinc-400 mt-1">Intelligent By-Product Gas Management</div>
                </div>

                <div className="space-y-2 text-sm text-zinc-300 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 text-xs uppercase">Developer</span>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      AMRIT ARYA
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 text-xs uppercase">Department</span>
                    <span className="text-white text-xs flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                      Fuel Management Dept
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 text-xs uppercase">Context</span>
                    <span className="text-xs text-zinc-300">Tata Steel Internship</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 text-xs uppercase">Release</span>
                    <span className="text-xs font-semibold text-white">Version v1.0.0</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-zinc-400 leading-relaxed bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/80">
                Developed during Tata Steel Internship Project under the Fuel Management Department to streamline energy allocation, monitor gas holder dynamics, and mitigate flaring overheads.
              </div>
            </div>
          </div>
        </ParticleCard>

        {/* First Time User Quick Start Guide */}
        <ParticleCard 
          clickEffect={true} 
          glowColor="255, 255, 255" 
          className="lg:col-span-2 bg-zinc-950 p-6 border border-zinc-800 rounded-2xl relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-white font-mono font-semibold border-b border-zinc-800 pb-4 mb-4">
              <HelpCircle className="w-5 h-5 text-zinc-300" />
              <span>FIRST-TIME USER ONBOARDING & QUICK START</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black p-4 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                  <span className="w-6 h-6 rounded-full bg-zinc-800 text-white flex items-center justify-center text-xs">1</span>
                  <span>Sidebar Navigation</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Use the left sidebar menu to navigate between 11 dedicated modules. You can collapse or expand the sidebar for maximum dashboard visibility.
                </p>
              </div>

              <div className="bg-black p-4 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                  <span className="w-6 h-6 rounded-full bg-zinc-800 text-white flex items-center justify-center text-xs">2</span>
                  <span>Monitor Gas Balance</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Check the <strong className="text-white">Gas Balance</strong> and <strong className="text-white">Overview Dashboard</strong> pages to inspect live holder volumes (BFG, COG, LDG) and flare loss alerts.
                </p>
              </div>

              <div className="bg-black p-4 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                  <span className="w-6 h-6 rounded-full bg-zinc-800 text-white flex items-center justify-center text-xs">3</span>
                  <span>Run Simulations</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Open the <strong className="text-white">Simulation Workspace</strong> to adjust fuel allocation sliders (Power Plant vs Mills) and test real-time optimization scenarios.
                </p>
              </div>

              <div className="bg-black p-4 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                  <span className="w-6 h-6 rounded-full bg-zinc-800 text-white flex items-center justify-center text-xs">4</span>
                  <span>Export Reports</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Visit the <strong className="text-white">Reports & Exports</strong> module to generate instant, formatted PDF shift reports for plant management audit compliance.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button 
                onClick={() => setCurrentView('overview')}
                className="px-4 py-2 bg-white text-black font-mono text-xs font-bold rounded-lg hover:bg-zinc-200 transition-all flex items-center gap-2"
              >
                <span>Launch Overview Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentView('simulation')}
                className="px-4 py-2 bg-zinc-900 text-white font-mono text-xs font-medium rounded-lg border border-zinc-700 hover:border-white transition-all flex items-center gap-2"
              >
                <span>Open Simulation Workspace</span>
              </button>
            </div>
          </div>
        </ParticleCard>
      </div>

      {/* System Features & Modules Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 font-mono text-lg font-bold text-white">
            <Terminal className="w-5 h-5 text-zinc-300" />
            <span>SYSTEM MODULES & FEATURE BREAKDOWN</span>
          </div>
          <span className="text-xs font-mono text-zinc-400">11 Full-Featured Modules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemModules.map((mod) => {
            const IconComp = mod.icon;
            return (
              <ParticleCard 
                key={mod.id}
                clickEffect={true} 
                glowColor="255, 255, 255"
                className="bg-zinc-950 p-5 border border-zinc-800 rounded-xl relative hover:border-white transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-zinc-600 transition-colors">
                      <IconComp className="w-5 h-5 text-white" />
                    </div>
                    <button 
                      onClick={() => setCurrentView(mod.id as any)}
                      className="text-xs font-mono text-zinc-400 group-hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <h3 className="font-mono font-bold text-white text-base mb-1">{mod.name}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{mod.desc}</p>
                </div>
              </ParticleCard>
            );
          })}
        </div>
      </div>

      {/* Technology Stack Specifications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 font-mono text-lg font-bold text-white">
            <Code2 className="w-5 h-5 text-zinc-300" />
            <span>TECHNICAL STACK & SYSTEM ARCHITECTURE</span>
          </div>
          <span className="text-xs font-mono text-zinc-400">Modern Web Tech</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {techStack.map((tech, i) => (
            <ParticleCard 
              key={i} 
              clickEffect={true} 
              glowColor="255, 255, 255"
              className="bg-zinc-950 p-4 border border-zinc-800 rounded-xl relative hover:border-white transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white text-sm">{tech.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">{tech.type}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed pt-1">{tech.desc}</p>
              </div>
            </ParticleCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutView;
