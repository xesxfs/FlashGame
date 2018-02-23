/**
 * 商城物品选项
 * @author chenkai 2018/1/9
 */
class ShopListItem extends eui.ItemRenderer{
	private maskImg: eui.Rect;             //图片遮罩
    private toolImg: eui.Image;            //道具图片
    private nameLabel:eui.Label;           //道具名称
    private buyBtn:eui.Button;             //购买按钮
	private priceImg:eui.Image;            //价格图片
    private priceLabel:eui.Label;          //价格文本
    private doubleImg:eui.Image;           //首冲双倍

	public constructor() {
		super();
		this.skinName = "ShopListItemSkin";
	}

	protected dataChanged(){
		//职场和道具需要显示名字
		if(this.data.tid == ShopTid.Work || this.data.tid == ShopTid.Tool){
			this.toolImg.mask = this.maskImg;
			this.maskImg.visible = true;
			this.nameLabel.text = this.data.cname;
		}else{
			this.toolImg.mask = null;
			this.maskImg.visible = false;
			this.nameLabel.text = "";
		}

		//道具图片
		this.toolImg.source = RES.getRes(this.data.pic);
		
		//价格
		if(this.data.coin_type == ShopCoinType.Rmb){  
			//人民币  
			this.priceImg.source = "";
			this.priceLabel.text = this.data.price + "元";
		}else if(this.data.coin_type == ShopCoinType.Diamond){  
			//钻石
			this.priceImg.source = RES.getRes("com_diamond_icon_png");
			this.priceLabel.text = this.data.price;
		}else{
			//金币                                         
			this.priceImg.source = RES.getRes("com_gold_icon_png");
			this.priceLabel.text = this.data.price;
		}

		//点击购买
		CommomBtn.btnClick(this.buyBtn, this.onTouchTap, this);
	}

	//点击购买
	private onTouchTap(){
		let panel:ShopPanel = App.PanelManager.getPanel(PanelConst.ShopPanel);
		panel.onBuyHandler(this.data);
	}
}