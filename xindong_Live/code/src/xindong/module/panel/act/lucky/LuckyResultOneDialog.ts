/**
 * 抽奖结果弹框
 * @author chenkai 2017/12/29
 */
class LuckyResultOneDialog extends BaseDialog{
	private nameLabel:eui.Label;  //奖励名称
	private luckyImg:eui.Image;   //奖励图片

	public constructor() {
		super();
		this.skinName = "LuckyResultOneDialogSkin";
	}

	/**设置结果 */
	public setResult(name:string, imgUrl:string){
		this.nameLabel.text = name;
		this.luckyImg.source = RES.getRes(imgUrl);
	}
}