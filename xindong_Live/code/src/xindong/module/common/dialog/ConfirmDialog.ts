/**
 * 带有确认和取消的对话框
 * @author chenkai
 * @date 2017/11/22
 */
class ConfirmDialog extends BaseDialog{

	public constructor() {
		super();
		this.skinName = "ConfirmDialogSkin";
	}

	/**
	 * 货币不足提示跳转弹窗
	 * @param type 货币类型：1.金币  2.钻石
	 */
	public setLackCurrency(type:number = 1) {
		let currencyStr: string = "";
		let page: ShopPage;
		if (type == 1) {
			currencyStr = "金币";
			page = ShopPage.Gold;
		}
		else {
			currencyStr = "钻石";
			page = ShopPage.Diamond;
		}
		this.setContent(currencyStr + "数量不足，是否前往商城购买？");
		this.setOk(()=>{
			let shopPanel: ShopPanel = App.PanelManager.getPanel(PanelConst.ShopPanel);
			if (shopPanel && shopPanel.parent ) {
				shopPanel.switchPage(page);
			}
			else {
				App.PanelManager.closeAll();
				App.PanelManager.open(PanelConst.ShopPanel, page);
			}
		},this);
	}

	// 收藏解锁花费金币
	public setCollectionGold(gold) {
		this.contentLabel.textFlow = <Array<egret.ITextElement>>[
			{text: "确认花费", style: {"textColor": 0x8d6b6a}},
			{text: gold + "金币", style: {"textColor": 0xf84d5d}},
			{text: "解锁？", style: {"textColor": 0x8d6b6a}}
		];
	}

	//当恋爱道具不足时，询问购买恋爱道具
	public setBuyLove(toolName , price){
		this.setTitle("道具不足");
		
		this.contentLabel.textFlow = <Array<egret.ITextElement>>[
    		{text: "没有足够的", style: {"textColor": 0x8d6b6a}},
			{text: toolName + "", style: {"textColor": 0xf84d5d}},
			{text: ",花费", style: {"textColor": 0x8d6b6a}},
			{text: price + "金币", style: {"textColor": 0xf84d5d}},
			{text: "可以直接购买，是否购买？", style: {"textColor": 0x8d6b6a}}
		];
	}

	//使用钻石购买道具询问
	public setBuyUseDiamond(diamond:string){
		this.setTitle("提示");

		this.contentLabel.textFlow = <Array<egret.ITextElement>>[
    		{text: "您确定花费", style: {"textColor": 0x8d6b6a}},
			{text: diamond + "钻石", style: {"textColor": 0xf84d5d}},
			{text:"购买？", style:{"textColor": 0x8d6b6a}}
		];
	}

	//使用rmb购买道具询问
	public setBuyUseRmb(rmb:string){
		this.contentLabel.textFlow = <Array<egret.ITextElement>>[
    		{text: "您确定花费", style: {"textColor": 0x8d6b6a}},
			{text: "¥" + rmb, style: {"textColor": 0xf84d5d}},
			{text:"购买？", style:{"textColor": 0x8d6b6a}}
		];
	}
}