/**
 * 任务提示
 * @author chenkai
 * @date 2017/12/6
 */
class TaskTipUI extends eui.Component{
	private tishiLabel:eui.Label;

	public constructor() {
		super();
		this.skinName = "TaskTipUISkin";
	}

	public childrenCreated(){

	}

	public setTip(msg:string){
		this.tishiLabel.text = msg;
	}
}