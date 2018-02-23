/**
 * 排行列表项
 * @author chenkai 2017/12/14
 */
class RankGold extends eui.ItemRenderer{
	private no1Img:eui.Image;       //前3名图标
	private no2Img:eui.Image;
	private no3Img:eui.Image;
	private rankLabel:eui.Label;    //排行文本
	private nameLabel:eui.Label;    //昵称文本
	private assetLabel:eui.Label;   //拥有财产文本
	private heartImg:eui.Image;     //心动图标

	public constructor() {
		super();
		this.skinName = "RankGoldSkin";
	}

	protected dataChanged(){

		let rankVO:RankVO = this.data;

		//排名前3图标
		this.rankLabel.text = "";
		this.no1Img.visible = false;
		this.no2Img.visible = false;
		this.no3Img.visible = false;
		if(rankVO.rank == 1){
			this.no1Img.visible = true;
		}else if(rankVO.rank == 2){
			this.no2Img.visible = true;
		}else if(rankVO.rank == 3){
			this.no3Img.visible = true;
		}else{
			this.rankLabel.text = rankVO.rank + "";
		}

		//昵称
		this.nameLabel.text = rankVO.nick_name;

		//分值
		this.assetLabel.text = StringTool.formatMoney(rankVO.score);
	}
}