'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PieChart = undefined;

var _PieChart = require('../PieChart');

var _Chart2 = require('./Chart');

var _Chart3 = _interopRequireDefault(_Chart2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Pie Chart component.
 * @augments Chart
 */
var PieChart = function (_Chart) {
  _inherits(PieChart, _Chart);

  function PieChart() {
    _classCallCheck(this, PieChart);

    return _possibleConstructorReturn(this, (PieChart.__proto__ || Object.getPrototypeOf(PieChart)).apply(this, arguments));
  }

  return PieChart;
}(_Chart3.default);

PieChart.PROPS = _PieChart.PieChart.STATE;

exports.PieChart = PieChart;
exports.default = PieChart;