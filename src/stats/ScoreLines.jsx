import * as React from 'react'
import * as d3 from 'd3'
import { scaleOrdinal, scaleLinear, line, curveBasis, select, schemeCategory10, axisBottom, axisLeft, selectAll } from 'd3'
import { Header } from 'semantic-ui-react'

import './ScoreLine.scss'

class ScoreLines extends React.PureComponent {

    componentDidMount() {
        this.drawScores();
    }

    drawScores() {
        const {game, cPlayers} = this.props;
        // Compute all totals
        var max = 0, min = 0;

        const totalsByPlayers = cPlayers.map(({ player, color }) => {
            var totals = game.rounds.reduce((array, round, index) => {
                let t = array[index] + (round.scores[player] || 0);
                if (t < min) {
                    min = t;
                }
                if (t > max) {
                    max = t;
                }
                array.push(t);
                return array;
            }, [0]);

            return { player, totals, color };
        });

        const svg = select(this.container),
            margin = { top: 20, right: 10, bottom: 30, left: 40 },
            width = svg.attr("width") - margin.left - margin.right,
            height = svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = scaleLinear().range([0, width]).domain([0, game.rounds.length]),
            y = scaleLinear().range([height, 0]).domain([min, max]);
            // z = scaleOrdinal(schemeCategory10);

        var _line = line()
            // .curve(curveBasis)
            .x((d, idx) => x(idx))
            .y(y);

        // z.domain(players.map(function (c) { return c.id; }));
        // z.domain(players);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("Points");

        var player = g.selectAll(".player")
            .data(totalsByPlayers)
            .enter().append("g")
            .attr("class", "player");

        player.append("path")
            .attr("class", "line")
            .attr("d", d => _line(d.totals))
            .style("stroke", d => d.color);

        // player.append("text")
        //     .datum(d => { return { id: d.id, value: d.values[d.values.length - 1] }; })
        //     .attr("transform", function (d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
        //     .attr("x", 3)
        //     .attr("dy", "0.35em")
        //     .style("font", "10px sans-serif")
        //     .text(function (d) { return d.id; });
    }

    render() {
        return <div>
            <Header>Les scores</Header>
            <svg width="400" height="300" ref={ref => this.container = ref}></svg>
        </div>
    }
}

export default ScoreLines