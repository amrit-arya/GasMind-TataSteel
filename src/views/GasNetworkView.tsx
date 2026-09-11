import React, { useState } from 'react';
import { useGasData } from '../context/GasDataContext';
import { Network, Filter, Zap, Info, Layers } from 'lucide-react';
import { ParticleCard } from '../components/MagicBento';

interface SankeyNode {
  id: string;
  name: string;
  category: 'source' | 'header' | 'consumer';
  gasType: 'BF Gas' | 'CO Gas' | 'LD Gas';
  value: number;
  color: string;
}

interface SankeyLink {
  id: string;
  sourceId: string;
  targetId: string;
  gasType: 'BF Gas' | 'CO Gas' | 'LD Gas';
  value: number;
  color: string;
}

export const GasNetworkView: React.FC = () => {
  const { isLive } = useGasData();
  const [filterGas, setFilterGas] = useState<string>('all');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'sankey' | 'topology'>('sankey');

  const nodes: SankeyNode[] = [
    // Column 1: Sources (Left)
    { id: 'bf-i', name: 'Blast Furnace I', category: 'source', gasType: 'BF Gas', value: 465000, color: '#FFFFFF' },
    { id: 'bf-h', name: 'Blast Furnace H', category: 'source', gasType: 'BF Gas', value: 450000, color: '#FFFFFF' },
    { id: 'bf-g', name: 'Blast Furnace G', category: 'source', gasType: 'BF Gas', value: 322000, color: '#FFFFFF' },
    { id: 'bf-f', name: 'Blast Furnace F', category: 'source', gasType: 'BF Gas', value: 240000, color: '#FFFFFF' },
    { id: 'bf-c', name: 'Blast Furnace C', category: 'source', gasType: 'BF Gas', value: 162000, color: '#FFFFFF' },
    { id: 'bf-e', name: 'Blast Furnace E', category: 'source', gasType: 'BF Gas', value: 82200, color: '#FFFFFF' },
    { id: 'co-new', name: 'New BPP (Batt 10,11)', category: 'source', gasType: 'CO Gas', value: 80000, color: '#E4E4E7' },
    { id: 'co-old', name: 'Old BPP (Batt 8,9)', category: 'source', gasType: 'CO Gas', value: 62000, color: '#E4E4E7' },
    { id: 'ld-1-3', name: 'LD-1 & LD-3 Converter', category: 'source', gasType: 'LD Gas', value: 85000, color: '#D4D4D8' },
    { id: 'ld-2', name: 'LD-2 Converter', category: 'source', gasType: 'LD Gas', value: 65000, color: '#D4D4D8' },

    // Column 2: Headers & Storage (Middle)
    { id: 'hdr-bf', name: 'BF Gas Trunk & 100k Holder', category: 'header', gasType: 'BF Gas', value: 1721200, color: '#FFFFFF' },
    { id: 'hdr-co', name: 'CO Gas Header & 80k Holder', category: 'header', gasType: 'CO Gas', value: 142000, color: '#E4E4E7' },
    { id: 'hdr-ld', name: 'LD Gas Recovery & 50k Holder', category: 'header', gasType: 'LD Gas', value: 150000, color: '#D4D4D8' },

    // Column 3: Consumers (Right)
    { id: 'cons-bf-int', name: 'BF Internal Heating', category: 'consumer', gasType: 'BF Gas', value: 536000, color: '#A1A1AA' },
    { id: 'cons-ph6', name: 'Power House #6', category: 'consumer', gasType: 'BF Gas', value: 300000, color: '#A1A1AA' },
    { id: 'cons-coke', name: 'Coke Plant Underfiring', category: 'consumer', gasType: 'BF Gas', value: 270000, color: '#A1A1AA' },
    { id: 'cons-ph3', name: 'Power House #3', category: 'consumer', gasType: 'BF Gas', value: 190000, color: '#A1A1AA' },
    { id: 'cons-ph4-bf', name: 'Power House #4 (BF)', category: 'consumer', gasType: 'BF Gas', value: 150000, color: '#A1A1AA' },
    { id: 'cons-ph5', name: 'Power House #5', category: 'consumer', gasType: 'BF Gas', value: 130000, color: '#A1A1AA' },
    { id: 'cons-hsm-bf', name: 'HSM Mill (BF)', category: 'consumer', gasType: 'BF Gas', value: 75000, color: '#A1A1AA' },
    { id: 'cons-pp-bf', name: 'Pellet Plant (BF)', category: 'consumer', gasType: 'BF Gas', value: 60000, color: '#A1A1AA' },
    { id: 'cons-misc-bf', name: 'LCP & TSCR Plants', category: 'consumer', gasType: 'BF Gas', value: 25000, color: '#A1A1AA' },

    { id: 'cons-hsm-co', name: 'HSM Mill (CO)', category: 'consumer', gasType: 'CO Gas', value: 30000, color: '#71717A' },
    { id: 'cons-ph4-co', name: 'Power House #4 (CO)', category: 'consumer', gasType: 'CO Gas', value: 22000, color: '#71717A' },
    { id: 'cons-pp-co', name: 'Pellet Plant (CO)', category: 'consumer', gasType: 'CO Gas', value: 18000, color: '#71717A' },
    { id: 'cons-mills-co', name: 'Mergemills 1-9', category: 'consumer', gasType: 'CO Gas', value: 11000, color: '#71717A' },
    { id: 'cons-crm-co', name: 'CRM & TPL Lines', category: 'consumer', gasType: 'CO Gas', value: 14000, color: '#71717A' },
    { id: 'cons-other-co', name: 'Auxiliary CO Units', category: 'consumer', gasType: 'CO Gas', value: 39600, color: '#71717A' },

    { id: 'cons-ld-store', name: 'LD Buffer Storage', category: 'consumer', gasType: 'LD Gas', value: 150000, color: '#52525B' }
  ];

  const links: SankeyLink[] = [
    { id: 'l-bf-i', sourceId: 'bf-i', targetId: 'hdr-bf', gasType: 'BF Gas', value: 465000, color: '#FFFFFF' },
    { id: 'l-bf-h', sourceId: 'bf-h', targetId: 'hdr-bf', gasType: 'BF Gas', value: 450000, color: '#FFFFFF' },
    { id: 'l-bf-g', sourceId: 'bf-g', targetId: 'hdr-bf', gasType: 'BF Gas', value: 322000, color: '#FFFFFF' },
    { id: 'l-bf-f', sourceId: 'bf-f', targetId: 'hdr-bf', gasType: 'BF Gas', value: 240000, color: '#FFFFFF' },
    { id: 'l-bf-c', sourceId: 'bf-c', targetId: 'hdr-bf', gasType: 'BF Gas', value: 162000, color: '#FFFFFF' },
    { id: 'l-bf-e', sourceId: 'bf-e', targetId: 'hdr-bf', gasType: 'BF Gas', value: 82200, color: '#FFFFFF' },
    { id: 'l-co-new', sourceId: 'co-new', targetId: 'hdr-co', gasType: 'CO Gas', value: 80000, color: '#E4E4E7' },
    { id: 'l-co-old', sourceId: 'co-old', targetId: 'hdr-co', gasType: 'CO Gas', value: 62000, color: '#E4E4E7' },
    { id: 'l-ld-1-3', sourceId: 'ld-1-3', targetId: 'hdr-ld', gasType: 'LD Gas', value: 85000, color: '#D4D4D8' },
    { id: 'l-ld-2', sourceId: 'ld-2', targetId: 'hdr-ld', gasType: 'LD Gas', value: 65000, color: '#D4D4D8' },

    { id: 'l-bf-int', sourceId: 'hdr-bf', targetId: 'cons-bf-int', gasType: 'BF Gas', value: 536000, color: '#FFFFFF' },
    { id: 'l-ph6', sourceId: 'hdr-bf', targetId: 'cons-ph6', gasType: 'BF Gas', value: 300000, color: '#FFFFFF' },
    { id: 'l-coke', sourceId: 'hdr-bf', targetId: 'cons-coke', gasType: 'BF Gas', value: 270000, color: '#FFFFFF' },
    { id: 'l-ph3', sourceId: 'hdr-bf', targetId: 'cons-ph3', gasType: 'BF Gas', value: 190000, color: '#FFFFFF' },
    { id: 'l-ph4-bf', sourceId: 'hdr-bf', targetId: 'cons-ph4-bf', gasType: 'BF Gas', value: 150000, color: '#FFFFFF' },
    { id: 'l-ph5', sourceId: 'hdr-bf', targetId: 'cons-ph5', gasType: 'BF Gas', value: 130000, color: '#FFFFFF' },
    { id: 'l-hsm-bf', sourceId: 'hdr-bf', targetId: 'cons-hsm-bf', gasType: 'BF Gas', value: 75000, color: '#FFFFFF' },
    { id: 'l-pp-bf', sourceId: 'hdr-bf', targetId: 'cons-pp-bf', gasType: 'BF Gas', value: 60000, color: '#FFFFFF' },
    { id: 'l-misc-bf', sourceId: 'hdr-bf', targetId: 'cons-misc-bf', gasType: 'BF Gas', value: 25000, color: '#FFFFFF' },

    { id: 'l-hsm-co', sourceId: 'hdr-co', targetId: 'cons-hsm-co', gasType: 'CO Gas', value: 30000, color: '#E4E4E7' },
    { id: 'l-ph4-co', sourceId: 'hdr-co', targetId: 'cons-ph4-co', gasType: 'CO Gas', value: 22000, color: '#E4E4E7' },
    { id: 'l-pp-co', sourceId: 'hdr-co', targetId: 'cons-pp-co', gasType: 'CO Gas', value: 18000, color: '#E4E4E7' },
    { id: 'l-mills-co', sourceId: 'hdr-co', targetId: 'cons-mills-co', gasType: 'CO Gas', value: 11000, color: '#E4E4E7' },
    { id: 'l-crm-co', sourceId: 'hdr-co', targetId: 'cons-crm-co', gasType: 'CO Gas', value: 14000, color: '#E4E4E7' },
    { id: 'l-other-co', sourceId: 'hdr-co', targetId: 'cons-other-co', gasType: 'CO Gas', value: 39600, color: '#E4E4E7' },

    { id: 'l-ld-store', sourceId: 'hdr-ld', targetId: 'cons-ld-store', gasType: 'LD Gas', value: 150000, color: '#D4D4D8' }
  ];

  const filteredNodes = filterGas === 'all' 
    ? nodes 
    : nodes.filter(n => n.gasType === filterGas);

  const filteredLinks = filterGas === 'all'
    ? links
    : links.filter(l => l.gasType === filterGas);

  const svgWidth = 1000;
  const svgHeight = 720;
  const colX = { source: 80, header: 460, consumer: 840 };
  const nodeWidth = 24;

  const calculateNodePositions = () => {
    const layout: Record<string, { x: number; y: number; height: number }> = {};
    const totalMaxVal = 2013200;
    const availableHeight = svgHeight - 80;

    (['source', 'header', 'consumer'] as const).forEach(cat => {
      const catNodes = filteredNodes.filter(n => n.category === cat);
      const catTotal = catNodes.reduce((acc, n) => acc + n.value, 0);
      let currentY = 40;

      catNodes.forEach(n => {
        const height = Math.max(16, (n.value / Math.max(catTotal, totalMaxVal)) * (availableHeight - (catNodes.length - 1) * 16));
        layout[n.id] = {
          x: colX[cat],
          y: currentY,
          height
        };
        currentY += height + 16;
      });
    });

    return layout;
  };

  const nodePositions = calculateNodePositions();

  const computeRibbonPath = (link: SankeyLink) => {
    const srcPos = nodePositions[link.sourceId];
    const tgtPos = nodePositions[link.targetId];
    if (!srcPos || !tgtPos) return '';

    const srcX = srcPos.x + nodeWidth;
    const tgtX = tgtPos.x;

    const srcNode = nodes.find(n => n.id === link.sourceId);
    const tgtNode = nodes.find(n => n.id === link.targetId);
    
    const srcH = (link.value / (srcNode?.value || link.value)) * srcPos.height;
    const tgtH = (link.value / (tgtNode?.value || link.value)) * tgtPos.height;

    const y0 = srcPos.y + srcPos.height / 2;
    const y1 = tgtPos.y + tgtPos.height / 2;

    const dx = (tgtX - srcX) * 0.45;

    return `
      M ${srcX} ${y0 - srcH / 2}
      C ${srcX + dx} ${y0 - srcH / 2}, ${tgtX - dx} ${y1 - tgtH / 2}, ${tgtX} ${y1 - tgtH / 2}
      L ${tgtX} ${y1 + tgtH / 2}
      C ${tgtX - dx} ${y1 + tgtH / 2}, ${srcX + dx} ${y0 + srcH / 2}, ${srcX} ${y0 + srcH / 2}
      Z
    `;
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header & Control Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="font-mono text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Network className="w-6 h-6 text-white" />
            Industrial Byproduct Gas Flow - Sankey Diagram
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Volumetric flow distribution from Primary Generating Furnaces → Main Storage Headers → Plant Consumers.
          </p>
        </div>

        {/* Filter Controls & Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-mono shadow-sm">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400">Stream:</span>
            <select
              value={filterGas}
              onChange={(e) => setFilterGas(e.target.value)}
              className="bg-transparent text-white font-bold border-none focus:ring-0 text-xs font-mono cursor-pointer"
            >
              <option value="all" className="bg-zinc-950 text-white">All Gas Streams (2.01M Nm³/h)</option>
              <option value="BF Gas" className="bg-zinc-950 text-white">BF Gas Stream (1.72M Nm³/h)</option>
              <option value="CO Gas" className="bg-zinc-950 text-white">CO Gas Stream (142k Nm³/h)</option>
              <option value="LD Gas" className="bg-zinc-950 text-white">LD Gas Stream (150k Nm³/h)</option>
            </select>
          </div>

          <button
            onClick={() => setViewMode(viewMode === 'sankey' ? 'topology' : 'sankey')}
            className="px-3.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-mono font-bold text-black hover:bg-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-black" />
            <span>{viewMode === 'sankey' ? 'Sankey Flow View' : 'Topology Grid'}</span>
          </button>
        </div>
      </div>

      {/* Main Sankey Visualization Container */}
      <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 relative overflow-hidden shadow-lg">
        {/* Top Summary Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-black border border-zinc-800 p-3.5 rounded-lg text-xs font-mono mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-white" />
              <span className="text-white font-bold">BF Gas: 1,721,200 Nm³/h</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-zinc-300" />
              <span className="text-zinc-200 font-bold">CO Gas: 142,000 Nm³/h</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-zinc-500" />
              <span className="text-zinc-400 font-bold">LD Gas: 150,000 Nm³/h</span>
            </div>
          </div>
          <div className="text-zinc-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>Hover on flows or nodes to highlight active volumetric paths</span>
          </div>
        </div>

        {/* SVG Sankey Canvas */}
        <div className="overflow-x-auto">
          <svg className="w-full min-w-[900px] h-[720px]" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            <defs>
              <linearGradient id="grad-bf" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="grad-co" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4D4D8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#D4D4D8" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="grad-ld" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#71717A" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#71717A" stopOpacity="0.85" />
              </linearGradient>
            </defs>

            {/* Column Titles */}
            <text x={colX.source + 12} y={24} fill="#A1A1AA" fontSize="11" fontFamily="Inter, monospace" fontWeight="700" textAnchor="middle">
              GENERATING FURNACES & SOURCES
            </text>
            <text x={colX.header + 12} y={24} fill="#A1A1AA" fontSize="11" fontFamily="Inter, monospace" fontWeight="700" textAnchor="middle">
              DISTRIBUTION HEADERS & GASHOLDERS
            </text>
            <text x={colX.consumer + 12} y={24} fill="#A1A1AA" fontSize="11" fontFamily="Inter, monospace" fontWeight="700" textAnchor="middle">
              DOWNSTREAM INDUSTRIAL CONSUMERS
            </text>

            {/* Sankey Flow Links (Ribbons) */}
            {filteredLinks.map((link) => {
              const path = computeRibbonPath(link);
              if (!path) return null;

              const isHighlighted = 
                hoveredLink === link.id || 
                hoveredNode === link.sourceId || 
                hoveredNode === link.targetId;

              const opacity = hoveredNode || hoveredLink ? (isHighlighted ? 0.9 : 0.12) : 0.45;
              const gradId = link.gasType === 'BF Gas' ? 'url(#grad-bf)' : link.gasType === 'CO Gas' ? 'url(#grad-co)' : 'url(#grad-ld)';

              return (
                <g key={link.id} className="transition-opacity duration-200">
                  <path
                    d={path}
                    fill={gradId}
                    stroke={link.color}
                    strokeWidth={isHighlighted ? "1.5" : "0.5"}
                    opacity={opacity}
                    className="cursor-pointer hover:opacity-90 transition-all duration-200"
                    onMouseEnter={() => setHoveredLink(link.id)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <title>{`${link.sourceId} → ${link.targetId}: ${link.value.toLocaleString()} Nm³/h`}</title>
                  </path>
                </g>
              );
            })}

            {/* Sankey Nodes */}
            {filteredNodes.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;

              const isNodeHovered = hoveredNode === node.id;

              return (
                <g 
                  key={node.id} 
                  className="cursor-pointer transition-transform duration-200"
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <rect
                    x={pos.x}
                    y={pos.y}
                    width={nodeWidth}
                    height={pos.height}
                    rx="4"
                    fill={node.color}
                    stroke="#000000"
                    strokeWidth="2"
                    className={`transition-all duration-200 ${isNodeHovered ? 'ring-2 ring-offset-2 ring-white' : ''}`}
                  />

                  <text
                    x={node.category === 'source' ? pos.x - 10 : node.category === 'consumer' ? pos.x + nodeWidth + 10 : pos.x + nodeWidth / 2}
                    y={pos.y + pos.height / 2 + 4}
                    fill="#FFFFFF"
                    fontSize="11"
                    fontFamily="Inter"
                    fontWeight="700"
                    textAnchor={node.category === 'source' ? 'end' : node.category === 'consumer' ? 'start' : 'middle'}
                    className="select-none"
                  >
                    {node.name}
                  </text>

                  <text
                    x={node.category === 'source' ? pos.x - 10 : node.category === 'consumer' ? pos.x + nodeWidth + 10 : pos.x + nodeWidth / 2}
                    y={pos.y + pos.height / 2 + 18}
                    fill="#A1A1AA"
                    fontSize="10"
                    fontFamily="Inter, monospace"
                    fontWeight="600"
                    textAnchor={node.category === 'source' ? 'end' : node.category === 'consumer' ? 'start' : 'middle'}
                    className="select-none"
                  >
                    {(node.value / 1000).toFixed(1)}k Nm³/h
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </ParticleCard>

      {/* Excel Telemetry Data Notes */}
      <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg space-y-2 relative overflow-hidden">
        <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-white" />
          Fuel Management Sankey Stream Insights
        </h3>
        <ul className="text-xs font-mono text-zinc-400 space-y-1.5 list-disc pl-5">
          <li><strong className="text-white">Blast Furnace Gas Stream:</strong> 6 Blast Furnaces contribute 1,721,200 Nm³/h output. Demand across 9 consumers totals 1,736,000 Nm³/h (-14,800 Nm³/h deficit covered by 100k gasholder buffer).</li>
          <li><strong className="text-white">Coke Oven Gas Stream:</strong> Old BPP & New BPP generate 142,000 Nm³/h total output. Demand across 18 consumer units totals 134,600 Nm³/h (+7,400 Nm³/h net surplus stored in 80k gasholder).</li>
          <li><strong className="text-white">Linz-Donawitz Gas Stream:</strong> LD-1, LD-2 & LD-3 converters generate 150,000 Nm³/h available recovery gas routed directly into the 50k gasholder storage.</li>
        </ul>
      </ParticleCard>
    </div>
  );
};

export default GasNetworkView;
