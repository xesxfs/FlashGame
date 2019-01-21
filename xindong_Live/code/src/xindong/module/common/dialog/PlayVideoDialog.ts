/**
 * 播放视频对话框。微信中不能自动播放视频，需要在touch事件中播放
 * @author chenkai
 * @date 2017/11/16
 */
class PlayVideoDialog extends BaseDialog{
	public blackBg:eui.Rect;
	public constructor() {
		super();
		this.skinName = "PlayVideoDialogSkin";
	}
	
	//显示时，是否需要黑色背景遮罩
	public show(black:boolean = true){
		this.blackBg.visible = black;
		super.show();
	}
}