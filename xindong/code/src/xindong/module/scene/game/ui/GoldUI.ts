/**
 * 金币UI
 * @author chenkai
 * @date 2017/12/6
 */
class GoldUI extends eui.Component{
	/**金币文本 */
	private goldLabel:eui.BitmapLabel;

	public constructor() {
		super();
		this.skinName = "GoldUISkin";
	}

	/**设置金币 */
	public setGold(gold:number){
		this.goldLabel.text = gold + "";
	}
}