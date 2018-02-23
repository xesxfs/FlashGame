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
	public yiLingquBtn:eui.Button;     //已领取
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
	public updateView(data){
		//第x天
		let dayStr = ["零","一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四","十五"];
		this.days = data.days;
		this.dayLabel.text = "第" + dayStr[this.days] + "天";

		//奖励物品图片、名字、数量
		let Goods = data.gift.package;
		for(let j=0;j<Goods.length;j++){
			this.rewardImgList[j].source = Goods[j].pic;
			this.rewardLabelList[j].text = Goods[j].cname + "x" + Goods[j].num;
		}

		//领取状态
		let status = data.status;
		if(status == RevRewardStatus.CanRev){    //未领取，但是可领取
			this.yiLingquBtn.visible = false;
			this.lingquBtn.visible = true;
			this.lingquBtn.showRed(true);
			this.lingquBtn.btn.enabled = true;
			CommomBtn.btnClick(this.lingquBtn, this.reqLoginReward, this);
		}else if(status == RevRewardStatus.AlreadyRev){  //已领取
			this.yiLingquBtn.visible = true;
			this.lingquBtn.visible = false;
		}else if(status  == RevRewardStatus.CannotRev){   //天数未够，不能领取
			this.yiLingquBtn.visible = false;
			this.lingquBtn.visible = true;
			this.lingquBtn.showRed(false);
			this.lingquBtn.btn.enabled = false;
			CommomBtn.removeClick(this.lingquBtn, this.reqLoginReward, this);
		}
	}


	//请求领取当天的奖励
	private reqLoginReward(){
		console.log("DayRewardUI >> 请求第" + this.days + "天奖励");
		let http:HttpSender = new HttpSender();
		let params = {"days":this.days};
		http.post(ProtocolHttpUrl.gainLoginReward, params, this.revLoginReward, this);
		
	}

	//接收领取当天的奖励
	private revLoginReward(data){
		if(data.code == 200){
			//更新领取按钮
			this.yiLingquBtn.visible = true;
			this.lingquBtn.visible = false;

			//更新本地数据为已领取
			let loginRewardInfo = App.DataCenter.loginRewardInfo;
			let len = loginRewardInfo.data.length;
			for(let i=0;i<len;i++){
				let rewardData = loginRewardInfo.data[i];
				if(this.days == rewardData.days){
					loginRewardInfo.data[i].status = RevRewardStatus.AlreadyRev;
					break;
				}
			}

			//判断是否还有登录有奖可以领取
			App.DataCenter.login_reward = LoginRewardStatus.NoRedTip;
			for(let i=0;i<len;i++){
				let rewardData = loginRewardInfo.data[i];
				if(rewardData.status == RevRewardStatus.CanRev){
					App.DataCenter.login_reward = LoginRewardStatus.RedTip;
					break;
				}
			}

			//更新四维
			App.DataCenter.UserInfo.gold = data.data.gold;
			App.DataCenter.UserInfo.power = data.data.power;
			App.DataCenter.UserInfo.diamond = data.data.diamond;
			App.DataCenter.UserInfo.hearts = data.data.hearts;
			App.EventManager.sendEvent(EventConst.UPDATE_SIWEI);

			//更新标签
			let actPanel:ActPanel = App.PanelManager.getPanel(PanelConst.ActPanel);
			actPanel.updateView();
			
			//提示领取成功
			Tips.info(LanConst.act0_00);
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