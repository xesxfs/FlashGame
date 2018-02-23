/**
 * 领取按钮
 * @author chenkai
 * @date 2017/11/28
 */
class ActLingQuBtn extends eui.Component{
	private redTip:eui.Image;
	public gainBtn:eui.Button;    //领取
	public alreadyBtn:eui.Button; //已领取
	public noGainBtn:eui.Button;  //未领取

	public constructor() {
		super();
		this.skinName = "ActLingQuBtnSkin";
	}

	public childrenCreated(){
		
	}
	
	//设置领取按钮状态
	public setStatus(status:GainRewardStatus){
		//可领取
		if(status == GainRewardStatus.CanRev){
			this.gainBtn.visible = true;      
			this.alreadyBtn.visible = false; 
			this.noGainBtn.visible = false; 
			this.showRed(true);
		//已领取
		}else if(status == GainRewardStatus.AlreadyRev){
			this.gainBtn.visible = false;      
			this.alreadyBtn.visible = true; 
			this.noGainBtn.visible = false; 
			this.showRed(false);
		//不可领取
		}else{
			this.gainBtn.visible = false;      
			this.alreadyBtn.visible = false; 
			this.noGainBtn.visible = true; 
			this.showRed(false);
		}
	}

	//显示红点
	public showRed(value:boolean){
		this.redTip.visible = value;
	}
}