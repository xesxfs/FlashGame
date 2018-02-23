/**
 * 钻石UI
 * @author chenkai
 * @date 2017/12/6
 */
class DiamondUI extends eui.Component{
	/**钻石文本 */
	private diamondLabel:eui.BitmapLabel;

	public constructor() {
		super();
		this.skinName = "DiamondUISkin";
	}

	/**设置钻石数量 */
	public setDiamond(value:number){
		this.diamondLabel.text = value + "";
	}
}