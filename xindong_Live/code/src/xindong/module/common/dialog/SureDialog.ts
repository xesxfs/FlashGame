/**
 * 接收分享奖励弹框
 * @author chenkai
 * @date 2017/11/21
 */
class SureDialog extends BaseDialog{
	public diamondIcon:eui.Image;
	public gainLabel:eui.Label;
	public noGainLabel:eui.Label;

	public constructor() {
		super();
		this.skinName = "SureDialogSkin";
	}

    public setInteractAnsReward(trueNum:number, award:number, callBack:Function, thisObj:any){
		this.contentLabel.textFlow = <Array<egret.ITextElement>>[
    		{text: "本次测试一共答对了", style: {"textColor": 0x666666}},
			{text: trueNum + "", style: {"textColor": 0x0099CC}},
			{text: "道题，\n获得", style: {"textColor": 0x666666}},
			{text: award+"", style: {"textColor": 0xFF0033}},
			{text: "好感度！", style: {"textColor": 0x666666}}
		];

        this.setOk(callBack, thisObj);
	}

	/**
	 * 设置电话结算
	 * @param heart 本次通话获得的总心动值
	 */
	public setTelScore(heart:number, callBack:Function, thisObj:any){
		this.contentLabel.textFlow = <Array<egret.ITextElement>>[
    		{text: "本次通话共获得", style: {"textColor": 0x9F9F9F}},
			{text: heart + "", style: {"textColor": 0xFF6275}},
			{text: "好感度", style: {"textColor": 0x9F9F9F}}
		];

		this.setOk(callBack, thisObj);
	}

	/**
	 * 设置微信结算
	 * @param heart 本次微信获得的总心动值
	 */
	public setWechatScore(heart:number, callBack:Function, thisObj:any){
		this.contentLabel.textFlow = <Array<egret.ITextElement>>[
    		{text: "本次通话共获得", style: {"textColor": 0x9F9F9F}},
			{text: heart + "", style: {"textColor": 0xFF6275}},
			{text: "好感度", style: {"textColor": 0x9F9F9F}}
		];

		this.setOk(callBack, thisObj);
	}

	/**
	 * 设置升职礼包购买成功提示
	 */
	public setBuyWorkSuccess(workName: string, gold: number) {
		this.contentLabel.textFlow = <Array<egret.ITextElement>>[
    		{text: "恭喜您成功升职到", style: {"textColor": 0x9F9F9F}},
			{text: workName, style: {"textColor": 0xFF6275}},
			{text: "职位，\n并获得", style: {"textColor": 0x9F9F9F}},
			{text: gold + "", style: {"textColor": 0xFF6275}},
			{text: "金币", style: {"textColor": 0x9F9F9F}}
		];
	}
}