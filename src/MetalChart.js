'use strict';

import Component from 'metal-component';
import Soy from 'metal-soy';
import {Config} from 'metal-state';
import {bb, d3} from 'billboard.js';

import templates from './MetalChart.soy.js';

/**
 * Metal Chart component.
 */
class MetalChart extends Component {
	attached() {
		const config = this.constructChartConfig_();

		this.bbChart = bb.generate(config);

		this.on('columnsChanged', this.handleColumnsChanged_.bind(this));
		this.on('regionsChanged', this.handleRegionsChanged_.bind(this));
		this.on('typeChanged', this.handleTypeChanged_.bind(this));
	}

	constructAxisConfig_() {
		const {axisX, axisY2, axisY} = this;

		return {
			x: axisX,
			y2: axisY2,
			y: axisY
		}
	}

	constructChartConfig_() {
		const {area, element, regions} = this;

		const data = this.constructDataConfig_();
		const axis = this.constructAxisConfig_();

		return {
			area: area,
			bindto: element,
			data,
			regions: regions
		}
	}

	constructDataConfig_() {
		return {
			columns: this.columns,
			onclick: this.emitChartEvent_.bind(this, 'pointClick'),
			onout: this.emitChartEvent_.bind(this, 'pointMouseout'),
			onover: this.emitChartEvent_.bind(this, 'pointMouseover'),
			onselect: this.emitChartEvent_.bind(this, 'dataSelect'),
			onunselected: this.emitChartEvent_.bind(this, 'dataUnselected'),
			type: this.type
		}
	}

	emitChartEvent_(type) {
		this.emit.apply(this, arguments);
	}

	handleColumnsChanged_({newVal}) {
		const data = {
			columns: newVal
		};

		const removedIds = this.resolveRemovedColumns_(newVal);

		if (removedIds.length) {
			data.unload = removedIds;
		}

		this.bbChart.load(data);
	}

	handleRegionsChanged_({newVal}) {
		this.bbChart.regions(newVal);
	}

	handleTypeChanged_({newVal}) {
		this.bbChart.transform(newVal);
	}

	/**
	 * Determines which ids should be passed to the unload property.
	 * @static
	 * @type {!Object}
	 */
	resolveRemovedColumns_(newColumns) {
		const {columns} = this;

		const ids = newColumns.map(column => column[0]);

		return columns.reduce((removedIds, column) => {
			const id = column[0];

			if (ids.indexOf(id) === -1) {
				removedIds.push(id);
			}

			return removedIds;
		}, []);
	}
}
Soy.register(MetalChart, templates);

/**
 * State definition.
 * @static
 * @type {!Object}
 */
MetalChart.STATE = {
	/**
	 * Data that will be rendered to the chart.
	 * @instance
	 * @memberof MetalChart
	 * @type {?Object|undefined}
	 * @default undefined
	 */
	area: Config.shapeOf({
		above: Config.bool().value(false),
		zerobased: Config.bool().value(true),
	}),

	/**
	 * Styling and behavior of x axis.
	 * @instance
	 * @memberof MetalChart
	 * @type {?Object|undefined}
	 * @default undefined
	 */
	axisX: {
		categories: Config.array(),
		extent: Config.array(),
		height: Config.number(),
		label: Config.object().string(),
		localtime: Config.bool(),
		max: Config.number(),
		min: Config.number(),
		padding: Config.object(),
		show: Config.bool(),
		tick: Config.shapeOf({
			centered: Config.bool(),
			count: Config.number(),
			culling: Config.bool().shapeOf({
				max: Config.number()
			}),
			fit: Config.bool(),
			format: Config.func(),
			multiline: Config.bool(),
			outer: Config.bool(),
			rotate: Config.number(),
			values: Config.array(),
			width: Config.number()
		}),
		type: Config.oneOf(['category', 'indexed', 'timeseries'])
	},

	/**
	 * Styling and behavior of y2 axis.
	 * @instance
	 * @memberof MetalChart
	 * @type {?Object|undefined}
	 * @default undefined
	 */
	axisY2: Config.shapeOf({
		center: Config.number(),
		default: Config.array(),
		inner: Config.bool(),
		inverted: Config.bool(),
		label: Config.object().string(),
		max: Config.number(),
		min: Config.number(),
		padding: Config.number(),
		show: Config.bool(),
		tick: Config.shapeOf({
			count: Config.number(),
			format: Config.func(),
			outer: Config.bool(),
			values: Config.array()
		})
	}),

	/**
	 * Styling and behavior of y axis.
	 * @instance
	 * @memberof MetalChart
	 * @type {?Object|undefined}
	 * @default undefined
	 */
	axisY: {
		center: Config.number(),
		default: Config.array(),
		format: Config.func(),
		inner: Config.bool(),
		inverted: Config.bool(),
		label: Config.object().string(),
		max: Config.number(),
		min: Config.number(),
		padding: Config.object().string(),
		show: Config.bool(),
		tick: Config.shapeOf({
			count: Config.bool(),
			outer: Config.bool(),
			values: Config.array(),
		}),
		type: Config.oneOf(['category', 'indexed', 'timeseries'])
	},

	/**
	 * Styling and behavior of bars.
	 * @instance
	 * @memberof MetalChart
	 * @type {?Object|undefined}
	 * @default undefined
	 */
	bar: Config.shapeOf({
		width: Config.number(),
		zerobased: Config.bool()
	}),

	/**
	 * Defines a custom color pattern for chart.
	 * @instance
	 * @memberof MetalChart
	 * @type {?Object|undefined}
	 * @default undefined
	 */
	color: Config.shapeOf({
		pattern: Config.array(),
		threshhold: Config.shapeOf({
			unit: Config.string(),
			value: Config.array(),
			max: Config.number()
		})
	}),

	/**
	 * Data that will be rendered to the chart.
	 * @instance
	 * @memberof MetalChart
	 * @type {?Array|undefined}
	 * @default []
	 */
	columns: Config.array().value([]),

	/**
	 * Configuration options for donut chart.
	 * @instance
	 * @memberof MetalChart
	 * @type {?Object|undefined}
	 * @default undefined
	 */
	donut: Config.shapeOf({
		label: Config.shapeOf({
			show: Config.bool(),
			format: Config.func(),
			threshhold: Config.number(),
			ratio: Config.func().number(),
		}),
		expand: Config.bool(),
		width: Config.number(),
		title: Config.string(),
		padAngle: Config.number()
	}),

	/**
	 * Configuration options for guage chart.
	 * @instance
	 * @memberof MetalChart
	 * @type {?Object|undefined}
	 * @default undefined
	 */
	gauge: Config.shapeOf({
		fullCircle: Config.bool(),
		lable: Config.shapeOf({
			show: Config.bool(),
			format: Config.func(),
		}),
		expand: Config.bool(),
		min: Config.number(),
		max: Config.number(),
		startingAngle: Config.number(),
		units: Config.string(),
		width: Config.number()
	}),

	/**
	 * Configuration options for grid chart.
	 * @instance
	 * @memberof MetalChart
	 * @type {?Object|undefined}
	 * @default undefined
	 */
	grid: Config.shapeOf({ // Cross reference this with source code, have a feeling this info is wrong
		focus: Config.shapeOf({
			show: Config.bool(),
		}),
		lines: Config.shapeOf({
			front: Config.bool()
		}),
		x: Config.shapeOf({
			show: Config.bool(),
			lines: Config.shapeOf({
				class: Config.string(),
				position: Config.oneOf(['start', 'middle', 'end']),
				text: Config.string(),
				value: Config.string()
			})
		}),
		y: Config.shapeOf({
			show: Config.bool(),
			lines: Config.shapeOf({
				class: Config.string(),
				position: Config.oneOf(['start', 'middle', 'end']),
				text: Config.string(),
				value: Config.string()
			})
		}),
		ticks: Config.number()
	}),

	/**
	 * intersection TODO.
	 * @instance
	 * @memberof MetalChart
	 * @type {?object|undefined}
	 * @default undefined
	 */
	intersection: Config.shapeOf({
		enabled: Config.bool(),
		brighten: Config.bool(),
		inputType: Config.shapeOf({
			mouse: Config.bool(),
			touch: Config.bool()
		})
	}),

	/**
	 * legend TODO.
	 * @instance
	 * @memberof MetalChart
	 * @type {?object|undefined}
	 * @default undefined
	 */
	legend: Config.shapeOf({
		show: Config.bool(),
		hide: Config.bool(),
		position: Config.oneOf(['bottom', 'right', 'inset']),
		inset: Config.shapeOf({
			anchor: Config.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
			x: Config.number(),
			y: Config.number(),
			step: Config.number()
		})
	}),

	/**
	 * Sets padding on chart.
	 * @instance
	 * @memberof MetalChart
	 * @type {?object|undefined}
	 * @default undefined
	 */
	padding: Config.shapeOf({
		bottom: Config.number(),
		left: Config.number(),
		right: Config.number(),
		top: Config.number()
	}),

	/**
	 * Configuration options for pie chart.
	 * @instance
	 * @memberof MetalChart
	 * @type {?Object|undefined}
	 * @default undefined
	 */
	pie: Config.shapeOf({
		label: Config.shapeOf({
			show: Config.bool(),
			format: Config.func(),
			threshhold: Config.number(),
			ratio: Config.func().number()
		}),
		expand: Config.bool(),
		padAngle: Config.number()
	}),

	/**
	 * Configuration options for chart points.
	 * @instance
	 * @memberof MetalChart
	 * @type {?Object|undefined}
	 * @default undefined
	 */
	point: Config.shapeOf({
		show: Config.bool(),
		r: Config.number(),
		focus: Config.shapeOf({
			expand: Config.shapeOf({
				enabled: Config.bool(),
				r: Config.bool()
			}),
			select: Config.shapeOf({
				r: Config.number()
			})
		})
	}),

	/**
	 * Creates custom regions on chart that can be styled.
	 * @instance
	 * @memberof MetalChart
	 * @type {?object|undefined}
	 * @default {}
	 */
	regions: Config.shapeOf({
		class: Config.string(),
		enabled: Config.oneOf(['x', 'y']).required(),
		end: Config.array().required(),
		start: Config.number().required(),
	}),

	/**
	 * Determines if chart auto resizes when viewport size changes.
	 * @instance
	 * @memberof MetalChart
	 * @type {?object|undefined}
	 * @default {}
	 */
	resize: Config.shapeOf({
		auto: Config.bool()
	}),

	/**
	 * Sets size of chart.
	 * @instance
	 * @memberof MetalChart
	 * @type {?object|undefined}
	 * @default {}
	 */
	size: Config.shapeOf({
		height: Config.number(),
		width: Config.number()
	}),

	/**
	 * Determines interpolation type of spline charts.
	 * @instance
	 * @memberof MetalChart
	 * @type {?object|undefined}
	 * @default {}
	 */
	spline: Config.shapeOf({
		interpolation: Config.shapeOf({
			type: Config.string()
		})
	}),

	/**
	 * Config options for subcharts.
	 * @instance
	 * @memberof MetalChart
	 * @type {?object|undefined}
	 * @default {}
	 */
	subchart: Config.shapeOf({
		show: Config.bool(),
		size: Config.shapeOf({
			height: Config.number()
		}),
		onbrush: Config.func()
	}),

	/**
	 * Customizes classname for svg element.
	 * @instance
	 * @memberof MetalChart
	 * @type {?object|undefined}
	 * @default {}
	 */
	svg: Config.shapeOf({
		classname: Config.string()
	}),

	/**
	 * Display options for title element.
	 * @instance
	 * @memberof MetalChart
	 * @type {?object|undefined}
	 * @default {}
	 */
	title: Config.shapeOf({
		text: Config.string(),
		padding: Config.shapeOf({
			bottom: Config.number(),
			left: Config.number(),
			right: Config.number(),
			top: Config.number()
		}),
		position: Config.string()
	}),

	/**
	 * Display options for tooltip.
	 * @instance
	 * @memberof MetalChart
	 * @type {?object|undefined}
	 * @default {}
	 */
	tooltip: Config.shapeOf({
		show: Config.bool(),
		grouped: Config.bool(),
		format: Config.shapeOf({
			name: Config.func(),
			title: Config.func(),
			value: Config.func()
		}),
		contents: Config.func()
	}),

	/**
	 * Sets duration of transitions.
	 * @instance
	 * @memberof MetalChart
	 * @type {?object|undefined}
	 * @default {}
	 */
	transition: Config.shapeOf({
		duration: Config.number()
	}),

	/**
	 * The variety of chart that will be rendered.
	 * @instance
	 * @memberof MetalChart
	 * @type {?string|undefined}
	 * @default line
	 */
	type: Config.oneOf([
		'area',
		'area-spline',
		'area-step',
		'bar',
		'donut',
		'gauge',
		'line',
		'pie',
		'scatter',
		'spline',
		'step',
	]).value('line'),

	/**
	 * Configuration for bb chart zoom capabilities.
	 * @instance
	 * @memberof MetalChart
	 * @type {?object|undefined}
	 * @default {}
	 */
	zoom: Config.shapeOf({
		enabled: Config.bool().value(true),
		rescale: Config.bool().value(false),
		extent: Config.array(),
		onzoom: Config.func(),
		onzoomstart: Config.func(),
		onzoomend: Config.func()
	})
};

export { MetalChart };
export default MetalChart;
