import React from 'react';
import moment from 'moment';
import {floorEr} from '../utils/helpers';

class HistoryTracker extends React.Component{
	state = {
		color: 'aqua',
		colorList: ['aqua', 'orange', 'pink', 'blue']
	};

	/**********************************************************
	Convert List of Days to Colors 
	*/
	renderBox = (date, countHabits) => {
		let numComplete = 0, historyData = this.props.history[date] || {};
		for(let habit in historyData){
			if(historyData[habit]) numComplete++;
		}

		let classComplete = `c-${this.state.color}-` + floorEr(numComplete/(Math.max(countHabits), 1) * 10);
		return (
			<div key={date} className={classComplete} data-date={date}></div>
			)
	}

	renderBoxLegend = (color) => (
		<h1>Hi</h1>
	)

	/**********************************************************
	Switch Color Palettes 
	*/
	renderColorSwitch = (color) => {
		const colorClasses = `color-switch color-switch-${color}`;
		return (
			<button className={colorClasses} key={color} onClick={()=> this.handleColorSwitch(color)}></button>
			)
	}

	handleColorSwitch = (color) => {
		this.setState({color})
	}

	/**********************************************************
	Convert List of Days to Colors 
	*/
	render(){
		const dateRange = new Array(30)
			.fill(moment().subtract(30, 'days'))
			.map((i, indx) => i.add(1, 'days')
			.format('MM-DD-YYYY'));
		const countHabits = this.props.habits ? Object.keys(this.props.habits).length : 0;
		return (
			<section className='container history'>
			<h2>How Has Your Tracking Been?</h2>
			<p>See how you have been doing</p>
			<div className='history-grid-wrapper flexer'>
			<div className='history-grid'>
				{dateRange.map(date => this.renderBox(date, countHabits))}
			</div>
			<div className='history-colors'>
				<h4>Choose a Color</h4>
				{this.state.colorList.map(this.renderColorSwitch)}
				<h4>Legend</h4>
				{this.state.colorList.map(this.renderBoxLegend)}
			</div>
			</div>
			</section>
		)
	}
}

export default HistoryTracker;