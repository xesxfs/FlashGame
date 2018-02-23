/**
 * 首冲礼包
 * @author chenkai
 * @date 2017/11/27
 */
class ActPage2UI extends eui.Component{
	private chongzhiBtn:eui.Button;   //充值
	private lingquBtn:eui.Button;     //领取
	private priceLabel:eui.Label;     //价值198元

	private rewardImg0:eui.Image;     //奖励图片
	private rewardImg1:eui.Image;
	private rewardImg2:eui.Image;
	private rewardImgList:Array<eui.Image>;

	private rewardLabel0:eui.Label;   //奖励文本
	private rewardLabel1:eui.Label;
	private rewardLabel2:eui.Label;
	private rewardLabelList:Array<eui.Label>;

	private id:number;               //礼包id

	public constructor() {
		super();
		this.skinName = "ActPage2UISkin";
	}

	public childrenCreated(){
		//初始化界面
		this.rewardImgList = [this.rewardImg0, this.rewardImg1, this.rewardImg2];
		this.rewardLabelList = [this.rewardLabel0, this.rewardLabel1, this.rewardLabel2];
		for(let i=0;i<3;i++){
			this.rewardImgList[i].source = "";
			this.rewardLabelList[i].text = "";
		}
		this.priceLabel.text = "";


		//按钮监听
		CommomBtn.btnClick(this.lingquBtn, this.reqRewardGain, this);
		CommomBtn.btnClick(this.chongzhiBtn, this.onChongZhi, this);
	}

	/**更新页面 */
	public updateView(){
		this.reqFpayReward();
	}
	
	/**请求首付礼包详情 */
	private reqFpayReward(){
		let http:HttpSender = new HttpSender();
		http.post(ProtocolHttpUrl.fpayReward, {}, this.revFpayReward, this);
	}

	/**接收首付礼包详情 */
	private revFpayReward(data){
		if(data.code == 200){
			//奖励物品图片和名字
			for(let i=0;i<3;i++){
				this.rewardImgList[i].source = data.data.package[i].pic;
				this.rewardLabelList[i].text = data.data.package[i].cname + "x" + data.data.package[i].num;
			}

			//奖励价值
			this.priceLabel.text = data.data.price + "";

			 //未购买, 未领取
			 if(data.data.status == SCGainStatus.NoBuy){
			   	this.lingquBtn.visible = false;
			   	this.chongzhiBtn.visible = true;
			 //已购买, 未领取
			 }else if(data.data.status == SCGainStatus.HasBuy){
				this.lingquBtn.visible = true;
				this.lingquBtn.enabled = true;
			 	this.chongzhiBtn.visible = false;
			 //已购买已领取
			 }else{
				 this.lingquBtn.visible = true;
				 this.lingquBtn.enabled = false;
			 	 this.chongzhiBtn.visible = false;
			 }

			//记录礼包id
			this.id = data.data.id;

		}else{
			Tips.info(data.info);
		}
	}

	//充值
	private onChongZhi(){
		//关闭活动中心
		App.PanelManager.close(PanelConst.ActPanel);
		//跳转到商城充值页面
		App.PanelManager.open(PanelConst.ShopPanel, 2);
	}	

	//请求首冲礼包奖励
	private reqRewardGain(){
		let http:HttpSender = new HttpSender();
		let param = {"gid":this.id};
		http.post(ProtocolHttpUrl.rewardGin, param, this.revReqRewardGain, this );
	}

	//接收首冲礼包奖励
	private revReqRewardGain(data){
		if(data.code == 200){
			//灰化领取
			this.lingquBtn.enabled = false;

			//隐藏首冲礼包按钮
			App.DataCenter.first_gift = true;
			let actPanel:ActPanel = App.PanelManager.getPanel(PanelConst.ActPanel);
			actPanel.updateView();

			//更新红点提示
			App.EventManager.sendEvent(EventConst.UPDATE_RED_TIP);

			//更新四维
			App.DataCenter.UserInfo.gold = data.data.gold;
			App.DataCenter.UserInfo.power = data.data.power;
			App.DataCenter.UserInfo.diamond = data.data.diamond;
			App.DataCenter.UserInfo.hearts = data.data.hearts;
			App.EventManager.sendEvent(EventConst.UPDATE_SIWEI);

			Tips.info(LanConst.act1_00);
		}else{
			Tips.info(data.info);
		}
	}
}
