/**
 * 接收分享奖励弹框
 * @author chenkai
 * @date 2017/11/21
 */
class ShareGainDialog extends BaseDialog{
	public diamondIcon:eui.Image;
	public gainLabel:eui.Label;
	public noGainLabel:eui.Label;

	public constructor() {
		super();
		this.skinName = "ShareGainDialogSkin";
	}

	public setGain(){
		this.diamondIcon.visible = true;
		this.gainLabel.visible = true;
		this.noGainLabel.visible = false;
		this.gainLabel.text = "获得5钻石";
	}

	public setNoGain(){
		this.diamondIcon.visible = false;
		this.gainLabel.visible = false;
		this.noGainLabel.visible = true;
		this.noGainLabel.text  = "每日首次分享可获得钻石奖励哟!";
	}
}