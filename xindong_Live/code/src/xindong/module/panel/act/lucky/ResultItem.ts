/**
 * 十连抽奖励
 * @author chenkai 2017/12/29
 */
class ResultItem extends eui.Component{
	private itemImg:eui.Image;    //奖励图片
	private nameLabel:eui.Label;  //名称

	public constructor() {
		super();
		this.skinName = "ResultItemSkin";
	}

	public setName(name:string){
		this.nameLabel.text = name;
	}

	public setImg(imgUrl:string){
		this.itemImg.source = RES.getRes(imgUrl);
	}
}