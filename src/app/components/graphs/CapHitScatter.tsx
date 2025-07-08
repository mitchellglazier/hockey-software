'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Player {
  name: string;
  age: number;
  capHits: Record<string, string>;
}

interface CapHitScatterProps {
  data: Player[];
  selectedCapYear: string | null;
  selectedTeam: {
    colors: string[];
  };
}

export default function CapHitScatter({ data, selectedCapYear, selectedTeam }: CapHitScatterProps) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current || !selectedCapYear || !selectedTeam?.colors?.length) return;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove(); 

    const width = 750;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const yearStart = parseInt(selectedCapYear.split('/')[0]);
    const currentYear = new Date().getFullYear();

    const cleanData = data
      .map(player => {
        const capRaw = player.capHits[selectedCapYear] || '0';
        const capHit = parseInt(capRaw.replace(/[^0-9.-]+/g, '')) || 0;
        const projectedAge = player.age + (yearStart - currentYear);

        return {
          name: player.name,
          age: projectedAge,
          capHit,
        };
      })
      .filter(p => !isNaN(p.age) && p.capHit > 0);

    const x = d3.scaleLinear()
      .domain(d3.extent(cleanData, d => d.age) as [number, number])
      .nice()
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(cleanData, d => d.capHit)!])
      .nice()
      .range([innerHeight, 0]);

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickFormat(d => `${d}`));

    g.append('g').call(d3.axisLeft(y).tickFormat(d => `$${(d as number) / 1_000_000}M`));

    g.selectAll('circle')
      .data(cleanData)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.age))
      .attr('cy', d => y(d.capHit))
      .attr('r', 5)
      .attr('fill', selectedTeam?.colors?.[1] || selectedTeam?.colors?.[0] || '#3B82F6')
      .attr('opacity', 0.7);

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip bg-white shadow p-2 rounded text-sm absolute')
      .style('opacity', 0)
      .style('pointer-events', 'none');

    g.selectAll('circle')
      .on('mouseover', (_, d: any) => {
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.name}</strong><br/>Age: ${d.age}<br/>Cap Hit: $${d.capHit.toLocaleString()}`);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });

  }, [data, selectedCapYear, selectedTeam]);

  return (
    <div className="mt-6">
      <svg ref={ref}></svg>
    </div>
  );
}
