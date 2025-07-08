'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Player {
  name: string;
  position: string[];
  capHits: Record<string, string>;
}

interface CapHitLineGraphProps {
  data: Player[];
  selectedTeam: {
    colors: string[];
  };
}

export default function CapHitTeamLineGraph({ data, selectedTeam }: CapHitLineGraphProps) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current || !data.length) return;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const width = 750;
    const height = 250;
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const groupBy = {
      Forwards: ['LW', 'RW', 'C'],
      Defense: ['LD', 'RD'],
      Goalies: ['G'],
    };

    const years = Object.keys(data[0]?.capHits || []);

    const totals: Record<string, number> = {};
    const positionTotals: Record<'Forwards' | 'Defense' | 'Goalies', Record<string, number>> = {
      Forwards: {},
      Defense: {},
      Goalies: {},
    };

    years.forEach((year) => {
      totals[year] = 0;
      positionTotals.Forwards[year] = 0;
      positionTotals.Defense[year] = 0;
      positionTotals.Goalies[year] = 0;

      data.forEach((player) => {
        const raw = player.capHits[year] || '0';
        const cap = parseInt(raw.replace(/[^0-9.-]+/g, '')) || 0;
        totals[year] += cap;

        if (player.position.some((p) => groupBy.Forwards.includes(p))) {
          positionTotals.Forwards[year] += cap;
        }
        if (player.position.some((p) => groupBy.Defense.includes(p))) {
          positionTotals.Defense[year] += cap;
        }
        if (player.position.some((p) => groupBy.Goalies.includes(p))) {
          positionTotals.Goalies[year] += cap;
        }
      });
    });

    const yearNums = years.map((y) => parseInt(y.split('/')[0]));
    const x = d3.scaleLinear()
      .domain(d3.extent(yearNums) as [number, number])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(Object.values(totals))!])
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

    g.append('g')
      .call(d3.axisLeft(y).tickFormat(d => `$${(d as number) / 1_000_000}M`));

    const lineGenerator = (series: Record<string, number>) =>
      d3.line<number>()
        .x((_, i) => x(yearNums[i]))
        .y((_, i) => y(series[years[i]]))(yearNums.map((_, i) => i));

    const teamColor = selectedTeam.colors?.[0] || '#3B82F6';

    const paths = [
      { name: 'Total', series: totals, color: 'black', strokeWidth: 2.5, dash: null },
      { name: 'Forwards', series: positionTotals.Forwards, color: teamColor, strokeWidth: 1.5, dash: '4 2' },
      { name: 'Defense', series: positionTotals.Defense, color: teamColor, strokeWidth: 1.5, dash: '2 2' },
      { name: 'Goalies', series: positionTotals.Goalies, color: teamColor, strokeWidth: 1.5, dash: '1 3' },
    ];

    paths.forEach(({ series, color, strokeWidth, dash }) => {
      g.append('path')
        .attr('d', lineGenerator(series)!)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', strokeWidth)
        .attr('stroke-dasharray', dash || null);
    });

    const legend = g.append('g').attr('transform', `translate(${innerWidth - 100},20)`);

    paths.forEach((p, i) => {
      const row = legend.append('g').attr('transform', `translate(0,${i * 20})`);
      row.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', p.color)
        .attr('stroke-width', p.strokeWidth)
        .attr('stroke-dasharray', p.dash || null);

      row.append('text')
        .attr('x', 25)
        .attr('y', 5)
        .attr('font-size', '10px')
        .text(p.name);
    });
  }, [data, selectedTeam]);

  return (
    <div className="mt-8">
      <svg ref={ref}></svg>
    </div>
  );
}
