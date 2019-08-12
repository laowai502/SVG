import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

import { CommonService } from '../../service/CommonService';

@Component({
	selector: 'time-line',
	template: '<section class="time-line" [innerHTML]="htmlTemplate"></section>',
	providers: [CommonService]
})
export class TimeLineComponent {
	
	private htmlTemplate: string = '';

	constructor(private commonServive: CommonService, private events: Events) {}
	
	ngOnInit(){
		this.events.subscribe('data:reset', (data) => {
			this.htmlTemplate = '<div class="time-line-title">用时 '+data.serviceTimeNative+'</div>';
		    this.showTimeLine(data);
	    });
	}
	
	showTimeLine(data :any) :void {
		let orderArr = [];
		for(let i=0; i<data.record.length; i++){
			if(data.record[i].flowState === 6 || data.record[i].flowState === 5){
				data.record[i].orderId = i;
				orderArr.push(i);
			}
		}
		for(let i=0; i<data.record.length; i++){
			if(orderArr.length !== 0){				
				if(data.record[i].flowState === 6) data.record[i].startOffPos = data.record[i].recCarPos;
				if(data.record[i].flowState === 6 || data.record[i].flowState === 5){
					this.commonServive.reverseAddress(data.record[i].startOffPos).subscribe(res => {
						if(res.status === 0 && (res.result.sematic_description !== '' && res.result.formatted_address !== '')	){
							data.record[i].startOffPos = res.result.formatted_address + res.result.sematic_description;
						}
						if(data.record[i].orderId === orderArr[orderArr.length-1]){
							for(let j=0; j<data.record.length; j++){
								this.htmlTemplate += this.timeLineBlock(data.record[j]);
							}
						}
					});
					if(data.record[i].orderId === orderArr[orderArr.length-1]){
						break;
					}
				}
			}else{
				this.htmlTemplate += this.timeLineBlock(data.record[i]);
			}
		}				
	}
	timeLineBlock(data :any) :string {
		let html = '<div class="fit-title">'+data.title+'<span class="time-bill">'+data.timeDistance+'</span></div>',
			picArr = null;
		if(data.picFlag === 1){
			picArr = data.picUrls.split(';');
		}
		switch (data.flowState){
			case 1:
				html += `
					<div class="content">
						<div>工单类型 : ${data.woType}</div>
						<div>外出人数 : ${data.assignPeople}</div>
						<div>车辆位置 : ${data.carLocation}</div>
						<div>预计里程 : ${data.woType}</div>
						<div>处理账号 : ${data.handleAccount}</div>
						<div>处理时间 : ${data.handleTime}</div>
					</div>
				`
				break;
			case 2:
				html += `
					<div class="content">
						<div>是否联系司机 : ${data.conectDriver}</div>
						<div>回访说明 : ${data.operateMsg}</div>
						<div>处理账号 : ${data.handleAccount}</div>
						<div>处理时间 : ${data.handleTime}</div>
					</div>
				`
				break;
			case 3:
				html += `
					<div class="content">
						<div>申请账号 : ${data.handleAccount}</div>
						<div>申请时间 : ${data.handleTime}</div>
						<div>申请原因 : ${data.operateMsg}</div>
					</div>
				`
				break;
			case 4:
				html += `
					<div class="content">
						<div>处理账号 : ${data.handleAccount}</div>
						<div>处理时间 : ${data.handleTime}</div>
						<div>审核结果 : ${data.verifyResult}</div>
						<div>审核说明 : ${data.operateMsg}</div>
					</div>
				`
				break;
			case 5:
				html += `
					<div class="content">
						<div>处理账号 : ${data.handleAccount}</div>
						<div>处理时间 : ${data.handleTime}</div>
						<div>出发位置 : ${data.startOffPos}</div>
					</div>
				`
				break;
			case 6:
				html += `
					<div class="content">
						<div>接站时间 : ${data.handleTime}</div>
						<div>扫描账号 : ${data.handleAccount}</div>
						<div>接站位置 : ${data.startOffPos}</div>
					</div>
				`
				break;
			case 7:
				html += `
					<div class="content">
						<div>申请账号 : ${data.handleAccount}</div>
						<div>申请时间 : ${data.handleTime}</div>
						<div>申请原因 : ${data.operateMsg}</div>
					</div>
				`
				break;
			case 8:
				html += `
					<div class="content">
						<div>处理账号 : ${data.handleAccount}</div>
						<div>处理时间 : ${data.handleTime}</div>
					</div>
				`
				break;
			case 9:
				html += `
					<div class="content">
						<div>处理方式 : ${data.maintainWay}</div>
						<div>处理说明 : ${data.operateMsg}</div>
						<div>处理时间 : ${data.handleTime}</div>
						<div>处理账号 : ${data.handleAccount}</div>
						<div>检查照片 : </div>
						<div class="show-pic">
				`
				html += this.hasPic(picArr)+'</div></div>';
				break;
			case 10:
				html += `
					<div class="content">
						<div>检查过程 : ${data.recpairResult}</div>
						<div>处理方式 : ${data.maintainWay}</div>
						<div>处理过程 : ${data.recpairProcess}</div>
						<div>处理结果 : ${data.operateMsg}</div>
						<div>处理时间 : ${data.handleTime}</div>
						<div>处理账号 : ${data.handleAccount}</div>
						<div>检查照片 : </div>
						<div class="show-pic">
				`
				html += this.hasPic(picArr)+'</div></div>';
				break;
			case 11:
				html += `
					<div class="content">
						<div>关闭说明 : ${data.operateMsg}</div>
						<div>申请账号 : ${data.handleAccount}</div>
						<div>申请时间 : ${data.handleTime}</div>
					</div>
				`
				break;
			case 12:
				html += `
					<div class="content">
						<div>审核结果 : ${data.recpairResult}</div>
						<div>审核说明 : ${data.operateMsg}</div>
						<div>处理时间 : ${data.handleTime}</div>
						<div>处理账号 : ${data.handleAccount}</div>
					</div>
				`
				break;
			case 13:
				html += `
					<div class="content">
						<div>回复内容 : ${data.operateMsg}</div>
						<div>处理时间 : ${data.handleTime}</div>
						<div>处理账号 : ${data.handleAccount}</div>
					</div>
				`
				break;
			case 14: case 18: case 19:
				html += `
					<div class="content">
						<div>回访内容 : ${data.operateMsg}</div>
						<div>处理时间 : ${data.handleTime}</div>
						<div>处理账号 : ${data.handleAccount}</div>
					</div>
				`
				break;
			case 15:
				html += `
					<div class="content">
						<div>司机评价 : ${data.operateMsg}</div>
						<div>处理时间 : ${data.handleTime}</div>
						<div>处理账号 : ${data.handleAccount}</div>
					</div>
				`
				break;
			case 16:
				html += `
					<div class="content">
						<div>追访对象 : ${data.visitObject}</div>
						<div>追访内容 : ${data.operateMsg}</div>
						<div>处理账号 : ${data.handleAccount}</div>
						<div>处理时间 : ${data.handleTime}</div>
					</div>
				`
				break;
			case 20:
				html += `
					<div class="content">
						<div>服务评价 : ${data.serverStart}</div>
						<div>评论内容 : ${data.operateMsg}</div>
						<div>处理时间 : ${data.handleTime}</div>
						<div>处理账号 : ${data.handleAccount}</div>
						<div>处理说明 : ${data.operateMsg}</div>
					</div>
				`
				break;
			case 21:
				html += `
					<div class="content">
						<div>申请原因 : ${data.operateMsg}</div>
						<div>申请时间 : ${data.handleTime}</div>
						<div>申请账号 : ${data.handleAccount}</div>
					</div>
				`	
				break;
			case 22:
				html += `
					<div class="content">
						<div>处理时间 : ${data.handleTime}</div>
						<div>处理账号 : ${data.handleAccount}</div>
					</div>
				`	
				break;
			default:
				break;
		}
		return html+'<div class="fit-title"></div>';
	}
	
	
	
	hasPic(data:any):string{
		let html = '';
		if(data){			
			for(var i=0; i<data.length; i++){
				html += '<img src="'+data[i]+'" />';
			}
		}
		return html;
	}

}