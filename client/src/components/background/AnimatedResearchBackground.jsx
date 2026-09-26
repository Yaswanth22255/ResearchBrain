import React, { useEffect, useRef } from 'react';

export const AnimatedResearchBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Node count based on device width
    const getNodeCount = (w) => {
      if (w < 640) return 14; // mobile
      if (w < 1024) return 26; // tablet
      return 44; // desktop
    };

    let nodeCount = getNodeCount(width);
    const maxConnectionDistance = width < 640 ? 80 : 120;

    // Mouse coordinates (normalized to document)
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 130,
      active: false
    };

    // Initialize nodes
    let nodes = [];
    const initNodes = () => {
      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.5 + 1.8, // 1.8px - 3.3px
          baseAlpha: Math.random() * 0.25 + 0.2, // 0.20 - 0.45
          pulseOffset: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.01
        });
      }
    };
    initNodes();

    // Data flow signal pulses moving along network links
    let signals = [];
    const maxSignals = width < 640 ? 2 : 5;
    const initSignals = () => {
      signals = [];
      for (let i = 0; i < maxSignals; i++) {
        signals.push({
          fromIndex: Math.floor(Math.random() * nodeCount),
          toIndex: Math.floor(Math.random() * nodeCount),
          progress: Math.random(),
          speed: Math.random() * 0.006 + 0.003
        });
      }
    };
    initSignals();

    // Subtle background geometric circles
    const geometricShapes = [
      { x: width * 0.82, y: height * 0.28, radius: 180, rot: 0, rotSpeed: 0.0003 },
      { x: width * 0.15, y: height * 0.72, radius: 240, rot: 0, rotSpeed: -0.0002 },
      { x: width * 0.5, y: height * 0.15, radius: 120, rot: 0, rotSpeed: 0.0004 }
    ];

    // Handle Resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      nodeCount = getNodeCount(width);
      initNodes();
      initSignals();
      geometricShapes[0].x = width * 0.82;
      geometricShapes[0].y = height * 0.28;
      geometricShapes[1].x = width * 0.15;
      geometricShapes[1].y = height * 0.72;
      geometricShapes[2].x = width * 0.5;
      geometricShapes[2].y = height * 0.15;
    };

    window.addEventListener('resize', handleResize);

    // Mouse listeners for subtle interactive response
    const handleMouseMove = (e) => {
      if (width < 768) return; // Disable mouse effect on mobile
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      // 1. Draw subtle geometric rings (preserves pure monochromatic aesthetic)
      geometricShapes.forEach((shape) => {
        shape.rot += shape.rotSpeed;
        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rot);

        ctx.beginPath();
        ctx.arc(0, 0, shape.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.025)';
        ctx.lineWidth = 1;
        ctx.setLineDash([8, 12]);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, shape.radius * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.015)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 16]);
        ctx.stroke();

        ctx.restore();
      });

      // 2. Update and Draw Network Connections
      const activeConnections = [];

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDistance) {
            activeConnections.push({ from: i, to: j });
            const alpha = (1 - dist / maxConnectionDistance) * 0.07;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Subtle mouse proximity connection
        if (mouse.active) {
          const mdx = nodes[i].x - mouse.x;
          const mdy = nodes[i].y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mDist < mouse.radius) {
            const mAlpha = (1 - mDist / mouse.radius) * 0.08;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 0, 0, ${mAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Very gentle organic drift towards/away from mouse
            if (!prefersReducedMotion) {
              const force = (1 - mDist / mouse.radius) * 0.15;
              nodes[i].x -= (mdx / mDist) * force;
              nodes[i].y -= (mdy / mDist) * force;
            }
          }
        }
      }

      // 3. Information Flow Signal Pulses
      if (activeConnections.length > 0 && !prefersReducedMotion) {
        signals.forEach((signal) => {
          signal.progress += signal.speed;
          if (signal.progress >= 1) {
            signal.progress = 0;
            // Pick a random currently connected pair
            const randomConn = activeConnections[Math.floor(Math.random() * activeConnections.length)];
            if (randomConn) {
              signal.fromIndex = randomConn.from;
              signal.toIndex = randomConn.to;
            }
          }

          const fromNode = nodes[signal.fromIndex];
          const toNode = nodes[signal.toIndex];

          if (fromNode && toNode) {
            const sx = fromNode.x + (toNode.x - fromNode.x) * signal.progress;
            const sy = fromNode.y + (toNode.y - fromNode.y) * signal.progress;

            // Signal pulse dot
            ctx.beginPath();
            ctx.arc(sx, sy, 1.4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.fill();
          }
        });
      }

      // 4. Update and Draw Nodes
      nodes.forEach((node) => {
        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;

          // Gentle bounce off screen edges
          if (node.x < 0) {
            node.x = 0;
            node.vx *= -1;
          } else if (node.x > width) {
            node.x = width;
            node.vx *= -1;
          }

          if (node.y < 0) {
            node.y = 0;
            node.vy *= -1;
          } else if (node.y > height) {
            node.y = height;
            node.vy *= -1;
          }
        }

        // Gentle breathing opacity
        const pulse = Math.sin(time * 0.8 + node.pulseOffset) * 0.08;
        const currentAlpha = Math.max(0.1, Math.min(0.55, node.baseAlpha + pulse));

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(23, 23, 23, ${currentAlpha})`;
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
      aria-hidden="true"
    >
      {/* Subtle organic ambient radial light (matching existing white/gray theme) */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          background: 'radial-gradient(circle at 50% 18%, rgba(255,255,255,0.9) 0%, rgba(250,250,250,0.6) 50%, rgba(245,245,245,0.3) 100%)'
        }}
      />
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block" 
      />
    </div>
  );
};

export default AnimatedResearchBackground;
