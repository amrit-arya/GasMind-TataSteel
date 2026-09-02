import React, { useState } from 'react';
import { useGasData } from '../context/GasDataContext';
import { NetworkNode } from '../types';
import { Network, Filter, X, Zap, Activity } from 'lucide-react';

export const GasNetworkView: React.FC = () => {
  const { nodes, pipelines } = useGasData();
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [filterGas, setFilterGas] = useState<string>('all');
  const [animateFlow, setAnimateFlow] = useState<boolean>(true);

  const filteredNodes = filterGas === 'all' 
    ? nodes 
    : nodes.filter(n => n.gasType === filterGas);

  const filteredPipelines = filterGas === 'all'
    ? pipelines
    : pipelines.filter(p => p.gasType === filterGas);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#CBD5E1]">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Network className="w-6 h-6 text-[#FF6B00]" />
            Interactive Gas Network Topology Map
          </h2>
          <p className="text-xs text-[#475569] font-mono mt-1">
            Real-time pipeline flows, pressure drop gradients, and gasholder buffer dynamics.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-[#CBD5E1] px-3 py-1.5 rounded text-xs font-mono shadow-sm">
            <Filter className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="text-[#64748B]">Filter:</span>
            <select
              value={filterGas}
              onChange={(e) => setFilterGas(e.target.value)}
              className="bg-transparent text-[#0F172A] font-bold border-none focus:ring-0 text-xs font-mono cursor-pointer"
            >
              <option value="all">All Gas Lines</option>
              <option value="BF Gas">BF Gas Only</option>
              <option value="CO Gas">CO Gas Only</option>
              <option value="LD Gas">LD Gas Only</option>
            </select>
          </div>

          <button
            onClick={() => setAnimateFlow(!animateFlow)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold border transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm ${
              animateFlow 
                ? 'bg-[#FFF3E0] text-[#FF6B00] border-[#FF6B00]/40' 
                : 'bg-white text-[#64748B] border-[#CBD5E1]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{animateFlow ? 'Flow Pulse ON' : 'Flow Static'}</span>
          </button>
        </div>
      </div>

      {/* SVG Network Visualizer Container */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-6 relative overflow-hidden tech-grid-bg min-h-[540px] shadow-sm">
        {/* Legend Overlay */}
        <div className="absolute top-4 left-4 bg-white/95 border border-[#CBD5E1] p-3 rounded-lg text-xs font-mono space-y-2 z-10 shadow-md backdrop-blur">
          <div className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider border-b border-[#E2E8F0] pb-1">
            Network Legend
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF6B00]" />
            <span className="text-[#0F172A] font-bold">Generation Unit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#059669]" />
            <span className="text-[#0F172A] font-bold">Gasholder Buffer</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#D97706]" />
            <span className="text-[#0F172A] font-bold">Consumer Plant</span>
          </div>
        </div>

        {/* SVG Pipeline Canvas */}
        <svg className="w-full h-[480px]" viewBox="0 0 1000 750">
          {/* Pipelines */}
          {filteredPipelines.map((pipe) => {
            const fromNode = nodes.find(n => n.id === pipe.fromId);
            const toNode = nodes.find(n => n.id === pipe.toId);
            if (!fromNode || !toNode) return null;

            const strokeColor = pipe.gasType === 'BF Gas' ? '#FF6B00' : '#059669';

            return (
              <g key={pipe.id}>
                {/* Outer Pipe Shadow */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="#CBD5E1"
                  strokeWidth="8"
                />
                {/* Core Pipe Line */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={strokeColor}
                  strokeWidth="4"
                  opacity="0.8"
                />
                {/* Animated Flow Pulse Line */}
                {animateFlow && (
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="animate-flow"
                    opacity="0.9"
                  />
                )}
                {/* Flow Rate Tag */}
                <rect
                  x={(fromNode.x + toNode.x) / 2 - 40}
                  y={(fromNode.y + toNode.y) / 2 - 12}
                  width="80"
                  height="22"
                  rx="4"
                  fill="#FFFFFF"
                  stroke="#CBD5E1"
                />
                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2 + 3}
                  fill="#0F172A"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {(pipe.flowRate / 1000).toFixed(0)}k Nm³/h
                </text>
              </g>
            );
          })}

          {/* Network Nodes */}
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const nodeColor = node.type === 'generator' ? '#FF6B00' : node.type === 'holder' ? '#059669' : '#D97706';

            return (
              <g 
                key={node.id} 
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => setSelectedNode(node)}
              >
                {/* Node outer glow */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="32"
                  fill={nodeColor}
                  fillOpacity={isSelected ? "0.3" : "0.15"}
                  stroke={nodeColor}
                  strokeWidth={isSelected ? "3" : "2"}
                />
                {/* Node Inner Core */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="20"
                  fill="#FFFFFF"
                  stroke={nodeColor}
                  strokeWidth="2.5"
                />
                {/* Node Status Dot */}
                <circle
                  cx={node.x + 14}
                  cy={node.y - 14}
                  r="5.5"
                  fill={node.status === 'warning' ? '#D97706' : node.status === 'critical' ? '#DC2626' : '#059669'}
                />

                {/* Node Label Text */}
                <text
                  x={node.x}
                  y={node.y + 45}
                  fill="#0F172A"
                  fontSize="12"
                  fontFamily="Inter"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {node.name}
                </text>
                <text
                  x={node.x}
                  y={node.y + 60}
                  fill="#64748B"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {node.pressure} kPa
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Node Inspection Drawer Modal */}
      {selectedNode && (
        <div className="bg-white border border-[#FF6B00] rounded-lg p-5 relative animate-fade-in shadow-2xl">
          <button 
            onClick={() => setSelectedNode(null)}
            className="absolute top-4 right-4 text-[#64748B] hover:text-[#0F172A] p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-[#FFF3E0] text-[#FF6B00] rounded-lg border border-[#FF6B00]/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#0F172A]">{selectedNode.name}</h3>
              <p className="text-xs font-mono text-[#64748B]">Node ID: {selectedNode.id} • Type: {selectedNode.type.toUpperCase()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 font-mono">
            <div className="p-3 bg-[#F8F9FA] border border-[#CBD5E1] rounded">
              <span className="text-[10px] text-[#64748B] uppercase font-bold">Current Flow Rate</span>
              <p className="text-lg font-bold text-[#0F172A] mt-1">{(selectedNode.flowRate / 1000).toFixed(0)}k Nm³/h</p>
            </div>
            <div className="p-3 bg-[#F8F9FA] border border-[#CBD5E1] rounded">
              <span className="text-[10px] text-[#64748B] uppercase font-bold">Trunk Pressure</span>
              <p className="text-lg font-bold text-[#FF6B00] mt-1">{selectedNode.pressure} kPa</p>
            </div>
            <div className="p-3 bg-[#F8F9FA] border border-[#CBD5E1] rounded">
              <span className="text-[10px] text-[#64748B] uppercase font-bold">Health Status</span>
              <p className="text-lg font-bold text-[#059669] capitalize mt-1">{selectedNode.status}</p>
            </div>
          </div>

          <p className="text-xs text-[#334155] font-mono bg-[#F8F9FA] p-3 rounded border border-[#CBD5E1]">
            <span className="text-[#FF6B00] font-bold">Diagnostic Log: </span>
            {selectedNode.details || 'Operational parameters nominal. No alarm thresholds breached.'}
          </p>
        </div>
      )}
    </div>
  );
};
