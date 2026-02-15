import React, { useRef, useEffect } from 'react';

/**
 * Minimap - A 2D top-down view of the room showing:
 * - Room boundaries (walls)
 * - Furniture positions as colored dots
 * - Player position as a blue arrow showing facing direction
 * 
 * Props:
 * - roomWidth, roomDepth: room dimensions
 * - items: furniture array with positions
 * - playerPos: { x, z } player position
 * - playerRotation: Y-axis rotation in radians (facing direction)
 * - visible: whether minimap is shown
 */
export default function Minimap({ roomWidth, roomDepth, items, playerPos, playerRotation, visible }) {
  const canvasRef = useRef(null);
  const size = 160; // Minimap pixel size
  const padding = 12;

  useEffect(() => {
    if (!visible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const drawSize = size - padding * 2;

    // Clear
    ctx.clearRect(0, 0, size, size);

    // Background
    ctx.fillStyle = 'rgba(20, 20, 20, 0.85)';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, 10);
    ctx.fill();

    // Room outline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(padding, padding, drawSize, drawSize);

    // Floor fill
    ctx.fillStyle = 'rgba(92, 58, 33, 0.3)';
    ctx.fillRect(padding, padding, drawSize, drawSize);

    // Helper: convert world coords to minimap coords
    const worldToMinimap = (worldX, worldZ) => {
      const nx = (worldX + roomWidth / 2) / roomWidth; // 0 to 1
      const nz = (worldZ + roomDepth / 2) / roomDepth; // 0 to 1
      return {
        x: padding + nx * drawSize,
        y: padding + nz * drawSize
      };
    };

    // Draw furniture items as dots
    const furnitureColors = {
      'Table': '#f59e0b',
      'Chair': '#8b5cf6',
      'Bed': '#ec4899',
      'Cabinet': '#6366f1',
      'Lamp': '#fbbf24',
      'Sofa': '#10b981',
      'Bookshelf': '#f97316',
      'Rug': '#14b8a6',
      'Plant': '#22c55e',
      'TV': '#6b7280',
    };

    items.forEach((item) => {
      const pos = worldToMinimap(item.position[0], item.position[2]);
      const color = furnitureColors[item.type] || '#888';
      
      // Dot
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Subtle glow
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = color + '33';
      ctx.fill();
    });

    // Draw player position as an arrow
    if (playerPos) {
      const pp = worldToMinimap(playerPos.x, playerPos.z);
      
      // Player glow
      ctx.beginPath();
      ctx.arc(pp.x, pp.y, 10, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(pp.x, pp.y, 0, pp.x, pp.y, 10);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Player dot
      ctx.beginPath();
      ctx.arc(pp.x, pp.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Direction arrow
      if (playerRotation !== undefined) {
        const arrowLen = 12;
        // In Three.js, rotation.y = 0 faces -Z, so we adjust
        const angle = playerRotation + Math.PI; // Flip to match minimap orientation
        const ax = pp.x + Math.sin(angle) * arrowLen;
        const ay = pp.y + Math.cos(angle) * arrowLen;

        ctx.beginPath();
        ctx.moveTo(pp.x, pp.y);
        ctx.lineTo(ax, ay);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Arrowhead
        const headLen = 5;
        const headAngle = 0.5;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(
          ax - headLen * Math.sin(angle - headAngle),
          ay - headLen * Math.cos(angle - headAngle)
        );
        ctx.moveTo(ax, ay);
        ctx.lineTo(
          ax - headLen * Math.sin(angle + headAngle),
          ay - headLen * Math.cos(angle + headAngle)
        );
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Room dimensions label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${roomWidth}m × ${roomDepth}m`, size / 2, size - 3);

  }, [visible, roomWidth, roomDepth, items, playerPos, playerRotation]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 60,
      right: 20,
      zIndex: 10,
      pointerEvents: 'none',
      opacity: 0.9,
      transition: 'opacity 0.3s'
    }}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          borderRadius: '10px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      />
    </div>
  );
}
