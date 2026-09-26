import React, { useEffect, useRef } from 'react';

/**
 * ResearchIntelligenceBackground
 * 
 * An abstract "Living Research Graph" visualization specifically designed for
 * academic research discovery and intelligence.
 * 
 * Visualizes the cycle:
 * Research Paper → Key Concept → Evidence → Connections → New Ideas
 * 
 * Monochromatic academic visual language: White, Neutral Gray, Rich Black (#171717).
 * Preserves high negative space (70-80% content focus, 20-30% subtle background).
 */
export const ResearchIntelligenceBackground = ({
  nodeCount: propNodeCount,
  connectionDistance: propConnectionDistance,
  animationSpeed = 1,
  opacity = 1,
  pulseFrequency = 1,
  interactionRadius = 130,
  className = ""
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Accessibility check: prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Node count adaptation for responsiveness
    const getCalculatedNodeCount = (w) => {
      if (propNodeCount) return propNodeCount;
      if (w < 640) return 16;  // Mobile: minimal, ultra-clean
      if (w < 1024) return 28; // Tablet: balanced
      return 46;               // Desktop: rich research graph framing the hero
    };

    let count = getCalculatedNodeCount(width);
    const maxConnectionDist = propConnectionDistance || (width < 640 ? 90 : 135);

    // Mouse coordinates (normalized)
    const mouse = {
      x: -2000,
      y: -2000,
      radius: interactionRadius,
      active: false
    };

    let scrollY = window.scrollY || 0;

    // Node Types
    const NODE_TYPES = {
      PAPER: 'paper',       // Abstract rounded document
      CONCEPT: 'concept',   // Clean point
      EVIDENCE: 'evidence', // Concentric anchor node
      IDEA: 'idea'          // Geometric diamond (convergent)
    };

    // Cluster centers to frame the Hero area and preserve negative space
    // Hero center is roughly (0.5 * width, 0.35 * height)
    const getClusterCenters = (w, h) => [
      { x: w * 0.18, y: h * 0.24, radius: w * 0.18 }, // Top-Left: Literature pool
      { x: w * 0.82, y: h * 0.26, radius: w * 0.18 }, // Top-Right: Methodology & Datasets
      { x: w * 0.16, y: h * 0.74, radius: w * 0.20 }, // Bottom-Left: Evidence matrix
      { x: w * 0.84, y: h * 0.72, radius: w * 0.20 }, // Bottom-Right: Synthesis & Ideas
      { x: w * 0.50, y: h * 0.08, radius: w * 0.14 }  // Top Flank: Cross-disciplinary bridge
    ];

    let clusters = getClusterCenters(width, height);

    // Initialize Living Research Graph Nodes
    let nodes = [];
    const initGraph = () => {
      nodes = [];
      clusters = getClusterCenters(width, height);

      for (let i = 0; i < count; i++) {
        // Assign to a peripheral cluster to keep hero text clean
        const cluster = clusters[i % clusters.length];
        const angle = Math.random() * Math.PI * 2;
        const distFromCenter = Math.random() * cluster.radius;

        let posX = cluster.x + Math.cos(angle) * distFromCenter;
        let posY = cluster.y + Math.sin(angle) * distFromCenter;

        // Ensure nodes stay within screen boundaries
        posX = Math.max(20, Math.min(width - 20, posX));
        posY = Math.max(20, Math.min(height - 20, posY));

        // Depth tiers: 0.55 (background slow), 0.8 (midground), 1.0 (foreground)
        const depth = Math.random() < 0.35 ? 0.55 : Math.random() < 0.7 ? 0.8 : 1.0;

        // Determine node type:
        // ~18% Paper nodes, ~28% Evidence nodes, ~54% Concept nodes
        let type = NODE_TYPES.CONCEPT;
        const typeRoll = Math.random();
        if (typeRoll < 0.18) {
          type = NODE_TYPES.PAPER;
        } else if (typeRoll < 0.46) {
          type = NODE_TYPES.EVIDENCE;
        }

        nodes.push({
          id: i,
          type,
          x: posX,
          y: posY,
          baseX: posX,
          baseY: posY,
          vx: (Math.random() - 0.5) * 0.22 * animationSpeed * depth,
          vy: (Math.random() - 0.5) * 0.22 * animationSpeed * depth,
          rotation: (Math.random() - 0.5) * 0.15,
          rotSpeed: (Math.random() - 0.5) * 0.001 * animationSpeed,
          depth,
          baseAlpha: (0.16 + Math.random() * 0.22) * opacity * (depth * 0.8 + 0.2),
          pulseOffset: Math.random() * Math.PI * 2,
          pulseBoost: 0,
          connections: []
        });
      }
    };

    initGraph();

    // Active Idea Nodes (Emerge from converging evidence, stay, then gently dissolve)
    let ideaNodes = [];
    let lastIdeaSpawnTime = 0;

    const spawnIdeaNode = (timestamp) => {
      if (nodes.length < 4 || ideaNodes.length >= (width < 640 ? 1 : 2)) return;

      // Find 2 or 3 nearby evidence/concept nodes in a cluster
      const candidates = nodes.filter(n => n.type !== NODE_TYPES.PAPER);
      if (candidates.length < 3) return;

      const seedNode = candidates[Math.floor(Math.random() * candidates.length)];
      const neighbors = candidates.filter(
        n => n.id !== seedNode.id && Math.hypot(n.x - seedNode.x, n.y - seedNode.y) < maxConnectionDist * 1.5
      );

      if (neighbors.length >= 2) {
        const p1 = seedNode;
        const p2 = neighbors[0];
        const p3 = neighbors[1];

        // Midpoint where idea forms
        const targetX = (p1.x + p2.x + p3.x) / 3;
        const targetY = (p1.y + p2.y + p3.y) / 3;

        ideaNodes.push({
          x: targetX,
          y: targetY,
          parents: [p1.id, p2.id, p3.id],
          spawnTime: timestamp,
          duration: 7000 + Math.random() * 3000, // 7-10s lifetime
          size: 6.5,
          alpha: 0,
          phase: 'emerging' // emerging -> sustained -> dissolving
        });
      }
    };

    // Evidence Flow Packets (Signals traveling along structured research paths)
    let signals = [];
    const maxSignalCount = width < 640 ? 3 : 7;

    const initSignals = () => {
      signals = [];
      for (let i = 0; i < maxSignalCount; i++) {
        signals.push({
          fromId: null,
          toId: null,
          progress: Math.random(),
          speed: (0.003 + Math.random() * 0.004) * animationSpeed,
          active: false
        });
      }
    };

    initSignals();

    // Research Pulse: wave rippling across connected literature
    let activePulses = [];
    let lastPulseTime = 0;

    const triggerResearchPulse = (originNode) => {
      activePulses.push({
        x: originNode.x,
        y: originNode.y,
        radius: 2,
        maxRadius: 44,
        alpha: 0.32 * opacity,
        originId: originNode.id
      });
      originNode.pulseBoost = 0.45;
    };

    // Resize Handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      count = getCalculatedNodeCount(width);
      initGraph();
      initSignals();
      ideaNodes = [];
      activePulses = [];
    };

    // Mouse Listeners (Desktop only for subtle focus)
    const handleMouseMove = (e) => {
      if (width < 768) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -2000;
      mouse.y = -2000;
    };

    const handleScroll = () => {
      scrollY = window.scrollY || 0;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // RENDER LOOP
    let lastFrameTime = performance.now();
    let time = 0;

    const render = (currentTime) => {
      const dt = Math.min(32, currentTime - lastFrameTime);
      lastFrameTime = currentTime;
      time += 0.015 * animationSpeed;

      ctx.clearRect(0, 0, width, height);

      // Parallax scroll offset (gentle)
      const parallaxY = scrollY * 0.035;

      // 1. Trigger Organic Idea Formation (Rare, ~every 16-24 seconds)
      if (!prefersReducedMotion && currentTime - lastIdeaSpawnTime > (18000 / pulseFrequency)) {
        spawnIdeaNode(currentTime);
        lastIdeaSpawnTime = currentTime;
      }

      // 2. Trigger Research Pulse (~every 10-14 seconds)
      if (!prefersReducedMotion && currentTime - lastPulseTime > (12000 / pulseFrequency)) {
        const paperNodes = nodes.filter(n => n.type === NODE_TYPES.PAPER || n.type === NODE_TYPES.EVIDENCE);
        if (paperNodes.length > 0) {
          const origin = paperNodes[Math.floor(Math.random() * paperNodes.length)];
          triggerResearchPulse(origin);
        }
        lastPulseTime = currentTime;
      }

      // 3. Update & Draw Research Pulses
      for (let p = activePulses.length - 1; p >= 0; p--) {
        const pulse = activePulses[p];
        pulse.radius += 0.45 * animationSpeed;
        pulse.alpha = Math.max(0, 0.32 * opacity * (1 - pulse.radius / pulse.maxRadius));

        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y - parallaxY, pulse.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(23, 23, 23, ${pulse.alpha})`;
        ctx.lineWidth = 0.85;
        ctx.stroke();

        // Stimulate connected nodes touched by pulse wave
        if (!prefersReducedMotion) {
          nodes.forEach(node => {
            if (node.id !== pulse.originId) {
              const d = Math.hypot(node.x - pulse.x, node.y - pulse.y);
              if (Math.abs(d - pulse.radius) < 4) {
                node.pulseBoost = Math.max(node.pulseBoost, 0.3);
              }
            }
          });
        }

        if (pulse.radius >= pulse.maxRadius) {
          activePulses.splice(p, 1);
        }
      }

      // 4. Update Node Positions & Hero Repulsion Field
      // Keep hero center (35% to 65% width, 22% to 56% height) clear for readability
      const heroCenterX = width * 0.5;
      const heroCenterY = height * 0.38;
      const heroAvoidanceRadius = Math.min(width * 0.26, 260);

      nodes.forEach((node) => {
        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;
          node.rotation += node.rotSpeed;

          // Gentle repulsion away from hero center text to preserve negative space
          const hdx = node.x - heroCenterX;
          const hdy = node.y - heroCenterY;
          const hDist = Math.hypot(hdx, hdy);

          if (hDist < heroAvoidanceRadius && hDist > 0) {
            const hForce = (1 - hDist / heroAvoidanceRadius) * 0.08;
            node.x += (hdx / hDist) * hForce;
            node.y += (hdy / hDist) * hForce;
          }

          // Gentle mouse proximity drift (desktop only)
          if (mouse.active) {
            const mdx = node.x - mouse.x;
            const mdy = node.y - mouse.y;
            const mDist = Math.hypot(mdx, mdy);

            if (mDist < mouse.radius && mDist > 0) {
              const mForce = (1 - mDist / mouse.radius) * 0.12;
              node.x += (mdx / mDist) * mForce;
              node.y += (mdy / mDist) * mForce;
            }
          }

          // Boundary bounce with soft margins
          if (node.x < 15) { node.x = 15; node.vx = Math.abs(node.vx); }
          else if (node.x > width - 15) { node.x = width - 15; node.vx = -Math.abs(node.vx); }

          if (node.y < 15) { node.y = 15; node.vy = Math.abs(node.vy); }
          else if (node.y > height - 15) { node.y = height - 15; node.vy = -Math.abs(node.vy); }

          // Fade pulse boost
          if (node.pulseBoost > 0) {
            node.pulseBoost = Math.max(0, node.pulseBoost - 0.008);
          }
        }
      });

      // 5. Build Structured Connections (Enforce sparse, academic relationships)
      // Limit to max 3 connections per node to eliminate particle-mesh clutter
      const connections = [];
      const nodeDegrees = new Array(nodes.length).fill(0);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (nodeDegrees[i] >= 3 || nodeDegrees[j] >= 3) continue;

          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxConnectionDist) {
            nodeDegrees[i]++;
            nodeDegrees[j]++;
            connections.push({ from: n1, to: n2, dist });

            // Connection line opacity: very subtle, monochrome
            const proximityFactor = 1 - dist / maxConnectionDist;
            let lineAlpha = proximityFactor * 0.085 * opacity;

            // Highlight if connected to mouse or pulsing
            if (mouse.active) {
              const mdist1 = Math.hypot(n1.x - mouse.x, n1.y - mouse.y);
              const mdist2 = Math.hypot(n2.x - mouse.x, n2.y - mouse.y);
              if (mdist1 < mouse.radius || mdist2 < mouse.radius) {
                lineAlpha = Math.min(0.22, lineAlpha + 0.06);
              }
            }

            if (n1.pulseBoost > 0 || n2.pulseBoost > 0) {
              lineAlpha = Math.min(0.26, lineAlpha + Math.max(n1.pulseBoost, n2.pulseBoost) * 0.15);
            }

            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y - parallaxY * n1.depth);
            ctx.lineTo(n2.x, n2.y - parallaxY * n2.depth);
            ctx.strokeStyle = `rgba(23, 23, 23, ${lineAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // 6. Update & Render Evidence Flow Packets
      if (connections.length > 0 && !prefersReducedMotion) {
        signals.forEach((sig) => {
          if (!sig.active || sig.progress >= 1) {
            // Find a connection starting from a Paper or Evidence node if possible
            const preferredConns = connections.filter(
              c => c.from.type === NODE_TYPES.PAPER || c.from.type === NODE_TYPES.EVIDENCE
            );
            const pool = preferredConns.length > 0 && Math.random() < 0.7 ? preferredConns : connections;
            const chosen = pool[Math.floor(Math.random() * pool.length)];

            if (chosen) {
              sig.from = chosen.from;
              sig.to = chosen.to;
              sig.progress = 0;
              sig.active = true;
            }
          }

          if (sig.active && sig.from && sig.to) {
            sig.progress += sig.speed;

            const curX = sig.from.x + (sig.to.x - sig.from.x) * sig.progress;
            const curY = (sig.from.y + (sig.to.y - sig.from.y) * sig.progress) - parallaxY * sig.from.depth;

            // Micro-signal packet (Academic Evidence traveling through graph)
            ctx.beginPath();
            ctx.arc(curX, curY, 1.3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 0, 0, ${0.45 * opacity})`;
            ctx.fill();

            // Subtle trailing whisker (1.5px)
            const trailProgress = Math.max(0, sig.progress - 0.04);
            const trailX = sig.from.x + (sig.to.x - sig.from.x) * trailProgress;
            const trailY = (sig.from.y + (sig.to.y - sig.from.y) * trailProgress) - parallaxY * sig.from.depth;

            ctx.beginPath();
            ctx.moveTo(trailX, trailY);
            ctx.lineTo(curX, curY);
            ctx.strokeStyle = `rgba(0, 0, 0, ${0.2 * opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      }

      // 7. Update & Draw Dynamic Idea Nodes (◇ Convergence)
      for (let k = ideaNodes.length - 1; k >= 0; k--) {
        const idea = ideaNodes[k];
        const age = currentTime - idea.spawnTime;

        if (age < 2000) {
          // Emerging: parent nodes emit subtle convergence rays
          idea.phase = 'emerging';
          idea.alpha = (age / 2000) * 0.75 * opacity;

          // Convergence rays
          idea.parents.forEach(parentId => {
            const parent = nodes.find(n => n.id === parentId);
            if (parent) {
              ctx.beginPath();
              ctx.moveTo(parent.x, parent.y - parallaxY * parent.depth);
              ctx.lineTo(idea.x, idea.y - parallaxY);
              ctx.strokeStyle = `rgba(23, 23, 23, ${idea.alpha * 0.25})`;
              ctx.lineWidth = 0.65;
              ctx.setLineDash([3, 5]);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          });
        } else if (age < idea.duration - 2000) {
          // Sustained Idea Node
          idea.phase = 'sustained';
          idea.alpha = 0.75 * opacity;
        } else if (age < idea.duration) {
          // Dissolving
          idea.phase = 'dissolving';
          idea.alpha = ((idea.duration - age) / 2000) * 0.75 * opacity;
        } else {
          ideaNodes.splice(k, 1);
          continue;
        }

        // Draw Idea Diamond Node (◇)
        const iy = idea.y - parallaxY;
        const halfS = idea.size * 0.7;

        ctx.save();
        ctx.translate(idea.x, iy);

        // Subtle pulsing halo
        const haloPulse = Math.sin(time * 2) * 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -(halfS + 3 + haloPulse));
        ctx.lineTo(halfS + 3 + haloPulse, 0);
        ctx.lineTo(0, halfS + 3 + haloPulse);
        ctx.lineTo(-(halfS + 3 + haloPulse), 0);
        ctx.closePath();
        ctx.strokeStyle = `rgba(0, 0, 0, ${idea.alpha * 0.22})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // Main diamond shape
        ctx.beginPath();
        ctx.moveTo(0, -halfS);
        ctx.lineTo(halfS, 0);
        ctx.lineTo(0, halfS);
        ctx.lineTo(-halfS, 0);
        ctx.closePath();
        ctx.fillStyle = `rgba(255, 255, 255, ${idea.alpha * 0.9})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(0, 0, 0, ${idea.alpha * 0.85})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      }

      // 8. Render Research Nodes (Distinctive Types)
      nodes.forEach((node) => {
        const ny = node.y - parallaxY * node.depth;
        const breathing = Math.sin(time * 0.8 + node.pulseOffset) * 0.05;
        const currentAlpha = Math.max(0.08, Math.min(0.65, node.baseAlpha + breathing + node.pulseBoost));

        if (node.type === NODE_TYPES.PAPER) {
          // --- Paper Node: Miniature Rounded Document Outline ---
          const w = 12 * node.depth;
          const h = 16 * node.depth;
          const r = 2;

          ctx.save();
          ctx.translate(node.x, ny);
          ctx.rotate(node.rotation);

          // Document background & outline
          ctx.beginPath();
          ctx.roundRect(-w / 2, -h / 2, w, h, r);
          ctx.fillStyle = `rgba(255, 255, 255, 0.6)`;
          ctx.fill();
          ctx.strokeStyle = `rgba(23, 23, 23, ${currentAlpha * 0.85})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();

          // 3 miniature horizontal lines representing published research
          const linePad = 2.5 * node.depth;
          ctx.beginPath();
          ctx.moveTo(-w / 2 + linePad, -h / 4);
          ctx.lineTo(w / 2 - linePad, -h / 4);
          ctx.moveTo(-w / 2 + linePad, 0);
          ctx.lineTo(w / 2 - linePad * 1.6, 0);
          ctx.moveTo(-w / 2 + linePad, h / 4);
          ctx.lineTo(w / 2 - linePad, h / 4);
          ctx.strokeStyle = `rgba(23, 23, 23, ${currentAlpha * 0.55})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();

          ctx.restore();
        } else if (node.type === NODE_TYPES.EVIDENCE) {
          // --- Evidence Node: Concentric Verified Anchor Point ---
          const radius = 2.4 * node.depth;
          const outerRadius = 5.2 * node.depth;

          // Inner solid core
          ctx.beginPath();
          ctx.arc(node.x, ny, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(23, 23, 23, ${currentAlpha * 0.8})`;
          ctx.fill();

          // Outer faint concentric ring
          ctx.beginPath();
          ctx.arc(node.x, ny, outerRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(23, 23, 23, ${currentAlpha * 0.35})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        } else {
          // --- Concept Node: Clean Academic Circular Point ---
          const radius = 2.1 * node.depth;
          ctx.beginPath();
          ctx.arc(node.x, ny, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(23, 23, 23, ${currentAlpha * 0.7})`;
          ctx.fill();
        }
      });

      // Continue loop if motion allowed
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Initial render
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [
    propNodeCount,
    propConnectionDistance,
    animationSpeed,
    opacity,
    pulseFrequency,
    interactionRadius
  ]);

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`} 
      aria-hidden="true"
    >
      {/* Layer 1 & 2: Preserves the authentic academic monochrome environment with subtle ambient lighting */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          background: 'radial-gradient(circle at 50% 18%, rgba(255,255,255,0.92) 0%, rgba(250,250,250,0.65) 50%, rgba(245,245,245,0.35) 100%)'
        }}
      />
      
      {/* Living Research Graph Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block" 
      />
    </div>
  );
};

export default ResearchIntelligenceBackground;
