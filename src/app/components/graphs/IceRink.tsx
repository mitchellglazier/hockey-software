'use client';

import React, { useEffect, useRef } from 'react';
import { RINK_MAP } from '../../../../public/d3Rink';
import * as d3 from 'd3';
import { useTeam } from '../../context/TeamContext'

const IceRink: React.FC<{ events: any[] }> = ({ events }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { selectedTeam } = useTeam();  

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const rinkGroup = svg.append('g')
      .attr('transform', 'translate(0, 0) scale(0.4)');

    const config = {
      parent: rinkGroup,
      desiredWidth: 700,
      fullRink: true,
      horizontal: true,
    };

    const drawRink = RINK_MAP(config);
    drawRink();

    const scale = config.desiredWidth / 85;
    const markerGroup = rinkGroup.append('g').attr('class', 'events');

    const markers = markerGroup.selectAll('g.event')
      .data(events)
      .enter()
      .append('g')
      .attr('class', 'event')
      .attr('transform', d => `translate(${d.x * scale}, ${d.y * scale})`);

    markers.append('circle')
      .attr('r', 18)
      .attr('fill', d => d.type === 'shot' ? 'yellow' : 'green')
      .attr('stroke', 'black')
      .attr('stroke-width', 1);

    markers.append('text')
      .text(d => {
        const names = d.player.split(' ');
        return names.length >= 2
          ? `${names[0][0]}${names[1][0]}`.toUpperCase()
          : names[0].substring(0, 2).toUpperCase();
      })
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .style('font-size', '18px')
      .style('fill', 'black');

    if (selectedTeam?.logo) {
      rinkGroup.append('image')
        .attr('href', selectedTeam.logo)
        .attr('x', (config.desiredWidth / 2) + 390)
        .attr('y', (85 / 2 * scale) - 75)         
        .attr('width', 200)                      
        .attr('height', 200)
        .attr('opacity', 0.8);                   
    }

  }, [events, selectedTeam]);



  return (
    <>
      <style>{`
        .blue-line { fill: blue; }
        .red-line { fill: red; }
        .red-faceoff { stroke: red; }
        .rink-face { stroke: gray; fill: white; }
        .goal-crease { fill: lightblue; stroke: red; }
        .center-line { fill: red; }
        .neutral-faceoff { stroke: blue; }
        .danger-line { stroke: gray; }
      `}</style>
      <svg
        ref={svgRef}
        width={800}
        height={400}
      />
    </>
  );
};

export default IceRink;

