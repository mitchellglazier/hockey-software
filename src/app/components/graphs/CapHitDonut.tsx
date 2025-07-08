'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface CapHitDonutProps {
  data: any[];
  selectedCapYear: string | null;
  selectedTeam: {
    colors: string[];
  };
   onPlayerClick: (player: any) => void;
}

export default function CapHitDonut({ data, selectedCapYear, selectedTeam, onPlayerClick }: CapHitDonutProps) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!selectedCapYear || !ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    const innerRadius = 70;

    svg.attr('width', width).attr('height', height);
    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const parsedData = data
      .map((d) => ({
        ...d,
        name: d.name,
        cap: parseInt(d.capHit.replace(/[^0-9.-]+/g, '')) || 0,
        status: d.status,
      }))
      .filter((d) => d.cap > 0);

    const total = d3.sum(parsedData.map((d) => d.cap));
    const avg = parsedData.length ? total / parsedData.length : 0;

    const pie = d3.pie<{ name: string; cap: number; status: string }>().value((d) => d.cap)(
      parsedData
    );
    const arc = d3
      .arc<d3.PieArcDatum<{ name: string; cap: number }>>()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const tooltip = d3.select('#tooltip');

    const baseColor = d3.color(selectedTeam?.colors?.[1] || '#007AC2')!;
    const colorInterpolator = d3.interpolateRgb(baseColor.brighter(1), baseColor.darker(1));

    g.selectAll('path')
      .data(pie)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (_, i) => colorInterpolator(i / parsedData.length))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .on('mouseover', (_, d) => {
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d.data.name} (${d.data.status})</strong><br/>${d3.format('$,.0f')(d.data.cap)}`
          );
      })
      .on('mousemove', (event) => {
        tooltip.style('left', `${event.offsetX + 10}px`).style('top', `${event.offsetY + 10}px`);
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      })
      .on('click', (_, d) => {
        tooltip.style('opacity', 0);
  onPlayerClick(d.data);
});

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .style('font-size', '1rem')
      .style('font-weight', 'bold')
      .text(d3.format('$,.0f')(avg));

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.5em')
      .style('font-size', '.75rem')
      .style('font-weight', 'semibold')
      .text('Avg Cap Hit');
  }, [data, selectedCapYear, onPlayerClick, selectedTeam]);

  return (
    <div className="relative flex flex-col items-center">
      <svg ref={ref}></svg>
      <div
        id="tooltip"
        className="absolute bg-white shadow-md border text-sm rounded px-2 py-1 pointer-events-none opacity-0 transition-opacity duration-200"
        style={{ top: 0, left: 0 }}
      ></div>
    </div>
  );
}
