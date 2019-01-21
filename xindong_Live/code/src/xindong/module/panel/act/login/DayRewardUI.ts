/**
 * 每天奖励UI
 * @author chenkai
 * @date 2017/11/27
 */
class DayRewardUI extends eui.Component{
	public dayLabel:eui.Label;         //第x天
	public rewardImg0:eui.Image;       //奖励图片
	public rewardImg1:eui.Image;
	public rewardImg2:eui.Image;
	public rewardImgList:Array<eui.Image>;
	public rewardLabel0:eui.Label;     //奖励文本
	public rewardLabel1:eui.Label;
	public rewardLabel2:eui.Label;
	public rewardLabelList:Array<eui.Label>;
	public lingquBtn:ActLingQuBtn;     //领取
	public days:number;                //奖励所在的天数

	public constructor() {
		super();
		this.skinName = "DayRewardUISkin";
	}

	public childrenCreated(){
		//初始化奖励图片和文本
		this.rewardImgList = [this.rewardImg0, this.rewardImg1, this.rewardImg2];
		this.rewardLabelList = [this.rewardLabel0, this.rewardLabel1, this.rewardLabel2];
		for(let i=0;i<3;i++){
			this.rewardImgList[i].source = "";
			this.rewardLabelList[i].text = "";
		}
	}

	//更新界面
	public updateView(loginVO:loginVO){
		//第x天
		let dayStr = ["零","一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四","十五"];
		this.days = loginVO.days;
		this.dayLabel.text = "第" + dayStr[this.days] + "天";

		//奖励物品图片、名字、数量
		let packages:any = loginVO.gift.package;
		for(let j=0;j<packages.length;j++){
			this.rewardImgList[j].source = RES.getRes(packages[j].pic);
			this.rewardLabelList[j].text = packages[j].cname + "x" + packages[j].num;
		}

		//领取状态
		let status = loginVO.status;
		//设置领取按钮
		this.lingquBtn.setStatus(status);

		//可领取
		if(status == GainRewardStatus.CanRev){
			CommomBtn.btnClick(this.lingquBtn, this.reqLoginReward, this);
		}else{
			CommomBtn.removeClick(this.lingquBtn, this.reqLoginReward, this);
		}
	}

	//请求领取当天的奖励
	private reqLoginReward(){
		console.log("DayRewardUI >> 请求第" + this.days + "天奖励");
		let params = {"days":this.days};
		let http:HttpSender = new HttpSender();
		http.post(ProtocolHttpUrl.loginRewardGain, params, this.revLoginReward, this);
	}

	//接收领取当天的奖励
	private revLoginReward(data){
		if(data.code == 200){
			//更新领取按钮
			this.lingquBtn.setStatus(GainRewardStatus.AlreadyRev);

			//更新本地数据为已领取
			let login:any = App.DataCenter.actInfo.login.data;
			let len = login.length;
			for(let i=0;i<len;i++){
				let rewardData = login[i];
				if(this.days == rewardData.days){
					login[i].status = GainRewardStatus.AlreadyRev;
					break;
				}
			}

			//判断是否还有登录有奖可以领取
			let cannotRev = 0;  //尚未领取奖励数量
			let canRev = 0;     //能够领取奖励数量
			for(let i=0;i<len;i++){
				let rewardData = login[i];
				if(rewardData.status == GainRewardStatus.CannotRev){
					cannotRev++;
				}else if(rewardData.status == GainRewardStatus.CanRev){
					canRev++;
				}
			}
			if(canRev > 0){
				App.DataCenter.actInfo.login.status = 0;   //显示红点
			}else if(cannotRev > 0){	
				App.DataCenter.actInfo.login.status = 1;   //非0值，不显示红点
			}
					
			//更新数据
			App.DataCenter.UserInfo.gold = data.data.gold;
			App.DataCenter.UserInfo.diamond = data.data.diamond;
			App.DataCenter.UserInfo.hearts = data.data.hearts;
			App.EventManager.sendEvent(EventConst.UPDATE_SIWEI);

			//更新标签
			let actPanel:ActPanel = App.PanelManager.getPanel(PanelConst.ActPanel);
			actPanel.updateView();
			
			//提示领取成功
			Tips.info("领取成功");
		}else{
			Tips.info(data.info);
		}
	}


	//销毁
	public destoryMe(){
		this.parent && this.parent.removeChild(this);
		this.rewardImgList.length = 0;
		this.rewardLabelList.length = 0;
		CommomBtn.removeClick(this.lingquBtn, this.reqLoginReward, this);
	}

}