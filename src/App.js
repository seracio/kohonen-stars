import { range } from 'd3-array';
import { forceCollide, forceSimulation, forceX, forceY } from 'd3-force';
import { scaleLinear, scaleBand } from 'd3-scale';
import { interpolateSpectral } from 'd3-scale-chromatic';
import * as d3 from 'd3-selection';
import 'd3-selection-multi';
import { line } from 'd3-shape';
import { hexagonHelper } from 'kohonen';
import _ from 'lodash/fp';
import React, { Component } from 'react';

import results from '../data/result.json';

class App extends Component {

  render() {

    const haxagonsByLine = 13;
    const stepX = 60;
    const width = 900;
    const height = 900;

    const neurons = hexagonHelper.generateGrid(haxagonsByLine, haxagonsByLine);

    // hexagonData are normalized such as 2 neighbors have a distance of 1
    // we scale them to have this distance equal to 50
    const scaleGrid = scaleLinear()
      .domain([0, 1])
      .range([0, stepX]);

    // generate points of an hexagon
    const hexagonPoints = ([x,y]) => {
      // compute the radius of an hexagon
      const radius = (stepX / 2) / Math.cos(Math.PI / 6);
      return range(-Math.PI / 2, 2 * Math.PI, 2 * Math.PI / 6)
        .map(a => [x + Math.cos(a) * radius, y + Math.sin(a) * radius]);
    };

    // generate path of an hexagon
    const pathGen = _.flow(
      _.get('pos'),
      _.map(scaleGrid),
      hexagonPoints,
      line()
    );

    const scaleColor = scaleBand()
      .domain(['O', 'B', 'A', 'F', 'G', 'K', 'M'])
      .range([1, 0]);

    const scaleSize = scaleBand()
      .domain(['O', 'B', 'A', 'F', 'G', 'K', 'M'])
      .range([15, 5]);

    const getColor = _.flow(
      scaleColor,
      interpolateSpectral,
    );

    const startSimulation = gEl => {

      const getX = _.flow(
        _.get('[0]'),
        _.map(scaleGrid),
        _.get('[0]')
      );

      const getY = _.flow(
        _.get('[0]'),
        _.map(scaleGrid),
        _.get('[1]')
      );

      const getFill = _.flow(
        _.get('[1].spectralType'),
        _.slice(0,1),
        getColor,
      );

      const getSize = _.flow(
        _.get('[1].spectralType'),
        _.slice(0,1),
        scaleSize,
      );

      const g = d3.select(gEl);
      forceSimulation(results)
        .force('x', forceX(getX))
        .force('y', forceY(getY))
        .force('collide', forceCollide(getSize))
        .on('tick', () => {
          const circles = g.selectAll('.result').data(results);
          circles.enter()
            .append('circle')
            .attrs({
              'class': 'result',
              r: getSize,
            })
            .styles({
              fill: getFill
            })
            .merge(circles)
            .attrs({
              cx: _.get('x'),
              cy: _.get('y')
            });
        })
    };

    return (
      <div>
        <svg width={'100%'} height={'100%'} viewBox={`0 0 ${width} ${height}`}>
          <g>
            {neurons.map((n, i) =>
              <path
                d={pathGen(n)}
                key={i}
                style={{
                  fill: 'none',
                  stroke: '#ccc',
                }}
              />
            )}
          </g>
          <g ref={startSimulation}>
          </g>
        </svg>
      </div>
    );
  }
}

export default App;
