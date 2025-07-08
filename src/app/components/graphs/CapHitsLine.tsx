'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface CapHitsChartProps {
  capHits: Record<string, string>;
}

export default function CapHitsChart({ capHits }: CapHitsChartProps) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const data = Object.entries(capHits)
      .map(([year, value]) => ({
        year,
        capHit: parseInt(value.replace(/[^0-9.-]+/g, '')) || 0,
      }))
      .filter(d => d.capHit > 0)
      .sort((a, b) => a.year.localeCompare(b.year));

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const x = d3
      .scalePoint()
      .domain(data.map(d => d.year))
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.capHit)!])
      .nice()
      .range([height, 0]);

    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const line = d3
      .line<{ year: string; capHit: number }>()
      .x(d => x(d.year)!)
      .y(d => y(d.capHit))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3B82F6')
      .attr('stroke-width', 2)
      .attr('d', line);

    g.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.year)!)
      .attr('cy', d => y(d.capHit))
      .attr('r', 4)
      .attr('fill', '#3B82F6');

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append('g').call(d3.axisLeft(y).tickFormat(d => `$${(d as number) / 1_000_000}M`));
  }, [capHits]);

  return <svg ref={ref}></svg>;
}
