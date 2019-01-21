/**
 * 礼包兑换
 * @author chenkai
 * @date 2017/11/27
 */
class PageExchangeUI extends eui.Component{
	private okBtn:eui.Button;             //确认
	private inputLabel:eui.EditableText;  //兑换码输入

	public constructor() {
		super();
		this.skinName = "PageExchangeUISkin";
	}

	public childrenCreated(){
		this.inputLabel.text = "";
		CommomBtn.btnClick(this.okBtn, this.reqInviteGain, this);
	}

	public updateView(){
		this.inputLabel.text = "";
	}

	//请求兑换
	private reqInviteGain(){
		let http:HttpSender = new HttpSender();
		let param = {"code":this.inputLabel.text};
		http.post(ProtocolHttpUrl.inviteGain, param, this.revInviteGain, this);
	}

	//返回兑换结果
	private revInviteGain(data){
		if(data.code == 200){
			this.inputLabel.text = "";

			App.DataCenter.UserInfo.gold = data.data.gold;
			App.DataCenter.UserInfo.power = data.data.power;
			App.DataCenter.UserInfo.diamond = data.data.diamond;
			App.DataCenter.UserInfo.hearts = data.data.hearts;

			App.EventManager.sendEvent(EventConst.UPDATE_SIWEI);
			
			Tips.info("兑换成功，奖励已放入背包中");
		}else{
			this.inputLabel.text = "";
			Tips.info(data.info);
		}
	}

}