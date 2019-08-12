import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import moment from 'moment';

@IonicPage()
@Component({
	selector: 'page-message',
	templateUrl: 'message.html',
})
export class MessagePage {
	dataDate: string;
	nowDate;
	week ? : Array < String > ; //星期
	calData; 					//日期
	today: number;				//当天
	dijizhou: number; 			//当前显示第几周周索引
	zhouji: number; 			//周几索引
	dijiyue: number; 			//记录当前月数,判断是否跨年
	index: number; 				//以当天为准,时间偏移量

	@ViewChild(Slides) slides: Slides;

	constructor(public el: ElementRef) {}

	ionViewDidLoad() {
		moment.locale('zh-CN');
		this.init();
	}
	
	init(): void {
		this.index = 0;
		this.nowDate = moment().add('months', this.index).format('YYYY年MMM');
		this.today = moment().date();
		this.week = ['一', '二', '三', '四', '五', '六', '日'];
		this.dijiyue = moment().month(); //init
		this.calData = this.showDivData(this.index)
		this.dataDate = moment().format('YYYY-MM-DD');
		this.showDivData(this.index).then(data => {		
			this.calData = data;
			this.dataDate = moment().format('YYYY-MM-DD');
			let todayDom = this.el.nativeElement.querySelector('.now-today')
			if(todayDom) {
				todayDom.style.backgroundColor = 'rgb(255, 153, 0)';
			}
		});
	}
	showDivData(i: number): Promise<any> {
		let maxNum = moment().add('months', i).daysInMonth(),
			nmaxNum = moment().add('months', i - 1).daysInMonth(),
			lmaxNum = moment().add('months', i + 1).daysInMonth(),
			dayNum = moment().add('months', i).date(),
			monthNum = moment().add('months', i).month(),
			firstDayWeek = moment().add('months', i).startOf('month').day(),
			weeksInMonth = this.getMonthWeekNum(firstDayWeek, maxNum);

		//拼数据主要用到当天是本月的第几周,和周几的两个索引
		this.zhouji = moment().add('months', i).day();
		this.dijizhou = this.getMonthWeek(dayNum, this.zhouji);
		this.dijiyue = monthNum; //保存一下用于下次判断
		return Promise.resolve(this.isMonth(this.isDay(this.zhouji, dayNum, maxNum, nmaxNum), weeksInMonth, this.dijizhou, this.zhouji, dayNum, maxNum, nmaxNum, lmaxNum));
	}
	/**
	 * 通过日期数,和周几取每个月第几周 
	 * dayNum日期数
	 * weekNum这个日期是周几
	 */
	private getMonthWeek(dayNum: number, weekNum: number) {
		weekNum = weekNum == 0 ? 7 : weekNum;
		return Math.ceil((dayNum + (7 - weekNum)) / 7);
	}
	/**
	 * 根据当月第一天是周几和本月天数取每个月有几周
	 * fwNum 当月第一天周几
	 * dayMax 当月一共多少天
	 */
	private getMonthWeekNum(fwNum, dayMax) {
		fwNum = fwNum == 0 ? 7 : fwNum;
		if((dayMax == 31 && fwNum > 5) || (dayMax == 30 && fwNum == 7)) {
			return 6;
		} else if(dayMax == 28 && fwNum == 1) {
			return 4;
		} else {
			return 5;
		}
	}
	/*
	 * 每周数据包括边缘数据
	 * week: 星期数,0表示周日
	 * day: 当天天数
	 * mdays: 本月天数
	 * ndays: 上月天数
	 */
	private isDay(week: number, day: number, mdays: number, ndays: number): any {
		let data = [day];
		switch(week) {
			case 0:
				for(let i = 0; i < 6; i++) {
					data.unshift((day - i - 1) > 0 ? (day - i - 1) : ndays + (day - i - 1));
				}
				break;
			case 1:
				for(let i = 0; i < 6; i++) {
					data.push((day + i + 1) <= mdays ? (day + i + 1) : (day + i + 1) - mdays);
				}
				break;
			case 2:
				for(let i = 0; i < 6; i++) {
					if(i <= 0) {
						data.unshift((day - i - 1) > 0 ? (day - i - 1) : ndays + (day - i - 1));
					} else {
						data.push((day + i) <= mdays ? (day + i) : (day + i) - mdays);
					}
				}
				break;
			case 3:
				for(let i = 0; i < 6; i++) {
					if(i <= 1) {
						data.unshift((day - i - 1) > 0 ? (day - i - 1) : ndays + (day - i - 1));
					} else {
						data.push((day + i - 1) <= mdays ? (day + i - 1) : (day + i - 1) - mdays);
					}
				}
				break;
			case 4:
				for(let i = 0; i < 6; i++) {
					if(i <= 2) {
						data.unshift((day - i - 1) > 0 ? (day - i - 1) : ndays + (day - i - 1));
					} else {
						data.push((day + i - 2) <= mdays ? (day + i - 2) : (day + i - 2) - mdays);
					}
				}
				break;
			case 5:
				for(let i = 0; i < 6; i++) {
					if(i <= 3) {
						data.unshift((day - i - 1) > 0 ? (day - i - 1) : ndays + (day - i - 1));
					} else {
						data.push((day + i - 3) <= mdays ? (day + i - 3) : (day + i - 3) - mdays);
					}
				}
				break;
			case 6:
				for(let i = 0; i < 6; i++) {
					if(i <= 4) {
						data.unshift((day - i - 1) > 0 ? (day - i - 1) : ndays + (day - i - 1));
					} else {
						data.push((day + i - 4) <= mdays ? (day + i - 4) : (day + i - 4) - mdays);
					}
				}
				break;
		}
		return data;
	}
	/*
	 * 返回[[]]以当天起,本月五周的数据,包括边缘数据
	 * thisWeek: 本星期数据
	 * maxWeek: 当月星期数
	 * weekNum: 本月第几周
	 * week: 星期数,0表示周日
	 * day: 当天天数
	 * mdays: 本月天数
	 * ndays: 上月天数
	 * ldays: 下月天数处理边缘数据
	 */
	private isMonth(thisWeek, maxWeek: number, weekNum: number, week: number, day: number, mdays: number, ndays: number, ldays: number): any {
		let data = [thisWeek];
		switch(weekNum) {
			case 1:
				for(let i = 1; i < maxWeek; i++) {
					data.push(this.isDay(week, (day + i * 7) - mdays > 0 ? (day + i * 7) - mdays : (day + i * 7), (day + i * 7) - mdays > 0 ? ldays : mdays, (day + i * 7) - mdays > 0 ? mdays : ndays));
				}
				break;
			case 2:
				for(let i = 1; i < maxWeek - 1; i++) {
					if(i <= 1) {
						data.unshift(this.isDay(week, (day - i * 7) < 1 ? ndays + (day - i * 7) : day - i * 7, (day - i * 7) < 1 ? ndays : mdays, ndays));
						data.push(this.isDay(week, day + i * 7, mdays, ndays));
					} else {
						data.push(this.isDay(week, (day + i * 7) - mdays > 0 ? (day + i * 7) - mdays : (day + i * 7), (day + i * 7) - mdays > 0 ? ldays : mdays, (day + i * 7) - mdays > 0 ? mdays : ndays));
					}
				}
				break;
			case 3:
				for(let i = 1; i < 3; i++) {
					if(i <= 1) {
						data.unshift(this.isDay(week, day - i * 7, mdays, ndays));
						data.push(this.isDay(week, (day + i * 7) - mdays > 0 ? (day + i * 7) - mdays : (day + i * 7), (day + i * 7) - mdays > 0 ? ldays : mdays, (day + i * 7) - mdays > 0 ? mdays : ndays));
					} else {
						data.unshift(this.isDay(week, (day - i * 7) < 1 ? ndays + (day - i * 7) : day - i * 7, (day - i * 7) < 1 ? ndays : mdays, ndays));
						if(maxWeek > 4) {
							data.push(this.isDay(week, (day + i * 7) - mdays > 0 ? (day + i * 7) - mdays : (day + i * 7), (day + i * 7) - mdays > 0 ? ldays : mdays, (day + i * 7) - mdays > 0 ? mdays : ndays));
						}
					}
				}
				if(maxWeek > 5) {
					data.push(this.isDay(week, (day + 3 * 7) - mdays > 0 ? (day + 3 * 7) - mdays : (day + 3 * 7), (day + 3 * 7) - mdays > 0 ? ldays : mdays, (day + 3 * 7) - mdays > 0 ? mdays : ndays));
				}
				break;
			case 4:
				for(let i = 1; i < 4; i++) {
					if(i <= 1) {
						data.push(this.isDay(week, (day + i * 7) - mdays > 0 ? (day + i * 7) - mdays : (day + i * 7), (day + i * 7) - mdays > 0 ? ldays : mdays, (day + i * 7) - mdays > 0 ? mdays : ndays));
						data.unshift(this.isDay(week, day - i * 7, mdays, ndays));
					} else if(i <= 1 && maxWeek < 5) {
						data.unshift(this.isDay(week, day - i * 7, mdays, ndays));
					} else {
						data.unshift(this.isDay(week, (day - i * 7) < 1 ? ndays + (day - i * 7) : day - i * 7, (day - i * 7) < 1 ? ndays : mdays, ndays));
					}
				}
				if(maxWeek > 5) {
					data.push(this.isDay(week, (day + 2 * 7) - mdays > 0 ? (day + 2 * 7) - mdays : (day + 2 * 7), (day + 2 * 7) - mdays > 0 ? ldays : mdays, (day + 2 * 7) - mdays > 0 ? mdays : ndays));
				}
				break;
			case 5:
				for(let i = 1; i < 5; i++) {
					if(i <= 3) {
						data.unshift(this.isDay(week, day - i * 7, mdays, ndays));
					} else {
						data.unshift(this.isDay(week, (day - i * 7) < 1 ? ndays + (day - i * 7) : day - i * 7, (day - i * 7) < 1 ? ndays : mdays, ndays));
					}
				}
				if(maxWeek > 5) {
					data.push(this.isDay(week, (day + 7) - mdays > 0 ? (day + 7) - mdays : (day + 7), (day + 7) - mdays > 0 ? ldays : mdays, (day + 7) - mdays > 0 ? mdays : ndays));
				}
				break;
			case 6:
				for(let i = 1; i < maxWeek; i++) {
					data.unshift(this.isDay(week, (day - i * 7) < 1 ? ndays + (day - i * 7) : day - i * 7, (day - i * 7) < 1 ? ndays : mdays, ndays));
				}
				break;
		}
		return data;
	}
	lastMonth() {
		this.index--;
		this.nowDate = moment().add('months', this.index).format('YYYY年MMM');
		this.showDivData(this.index).then(data => {
			this.calData = data;
			if(this.slides.getActiveIndex() == 5 || this.slides.getActiveIndex() == 6) {
				this.slides.slideTo(4);
			}
		});
	}
	nextMonth() {
		this.index++;
		this.nowDate = moment().add('months', this.index).format('YYYY年MMM');
		this.showDivData(this.index).then(data => {
			this.calData = data;
			if(this.slides.getActiveIndex() == 5 || this.slides.getActiveIndex() == 6) {
				this.slides.slideTo(4);
			}
		});
	}
	toToday() {
		this.init();
		this.slides.slideTo(this.dijizhou - 1);
		this.el.nativeElement.querySelector('.now-today').style.backgroundColor = 'rgb(255, 153, 0)';
	}
	showDetail(el) {
		if(el.target.style.backgroundColor == 'rgb(255, 153, 0)'){
			return false;
		}
		let Allspan = this.el.nativeElement.querySelectorAll('.dayspan');
		for(let i = 0; i < Allspan.length; i++) {
			Allspan[i].style.backgroundColor = "rgb(102, 102, 102)"
		}
		el.target.style.backgroundColor = 'rgb(255, 153, 0)';
		let nowtime = moment().add('months', this.index).format('YYYY-MM');
		if(el.target.innerHTML.length == 1) {
			this.dataDate = nowtime + "-0" + el.target.innerHTML
		} else {
			this.dataDate = nowtime + "-" + el.target.innerHTML
		}
	}
}
