/**
 * 免费体力
 * @author chenkai
 * @date 2017/11/27
 */
class ActPage3UI extends eui.Component{
	private lingquBtn:eui.Button;  //领取

	public constructor() {
		super();
		this.skinName = "ActPage3UISkin";
	}

	public childrenCreated(){
		
	}

	public updateView(){
		//默认隐藏领取
		this.lingquBtn.visible = false;

		this.reqPowerStatus();
	}

	//请求体力是否可以领取
    private reqPowerStatus() {
        let http = new HttpSender();
        let param = {};
        http.post(ProtocolHttpUrl.tiliStatus, param, this.revPowerStatus, this);
    }

    //返回体力是否可以领取
    private revPowerStatus(data) {
        if (data.code == 200) {
            App.DataCenter.isPower = data.data.can_get_power;
			if(App.DataCenter.isPower){
				this.lingquBtn.visible = true;
				CommomBtn.btnClick(this.lingquBtn, this.reqPowerGain, this);
			}else{
				this.lingquBtn.visible = false;
			}
        } else {
            Tips.info("网络请求异常");
        }
    }

	//请求领取体力
	private reqPowerGain(){
		let http = new HttpSender();
        let param = {};
        http.post(ProtocolHttpUrl.powerGain,param,this.revPowerGain,this);
	}

	//接收领取体力结果
	private revPowerGain(data){
		if(data.code == 200){
            Tips.info("领取成功");
			//保存体力
            App.DataCenter.UserInfo.power = App.DataCenter.UserInfo.power + data.data.power;
			App.DataCenter.isPower = false;
			//重置界面
            this.lingquBtn.visible = false;
			CommomBtn.removeClick(this.lingquBtn, this.reqPowerGain, this);
			//更新四维
			App.EventManager.sendEvent(EventConst.UPDATE_SIWEI);
			App.EventManager.sendEvent(EventConst.UPDATE_RED_TIP);
        }else{
            Tips.info(data.info);
        }
	}
}