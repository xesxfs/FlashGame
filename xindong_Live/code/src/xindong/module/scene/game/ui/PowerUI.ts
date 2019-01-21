/**
 * 体力UI
 * @author chenkai
 * @date 2017/12/6
 */
class PowerUI extends eui.Component{
	/**体力文本 */
	private powerLabel:eui.BitmapLabel;

	public constructor() {
		super();
		this.skinName = "PowerUISkin";
	}

	/**设置体力 */
	public setPower(power:number){	
		this.powerLabel.text = power + "";
	}

}