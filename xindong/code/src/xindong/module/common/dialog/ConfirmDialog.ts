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