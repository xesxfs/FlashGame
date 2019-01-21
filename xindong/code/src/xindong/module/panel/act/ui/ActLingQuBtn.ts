/**
 * 领取按钮
 * @author chenkai
 * @date 2017/11/28
 */
class ActLingQuBtn extends eui.Component{
	private redTip:eui.Image;
	public btn:eui.Button;

	public constructor() {
		super();
		this.skinName = "ActLingQuBtnSkin";
	}

	public childrenCreated(){
		
	}
	
	public showRed(value:boolean){
		this.redTip.visible = value;
	}
}