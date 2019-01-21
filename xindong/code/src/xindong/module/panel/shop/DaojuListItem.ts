/**
 * @author xiongjian 
 * @date 2017/9/4
 * 道具列表item
 */
class DaojuListItem extends BaseUI {

    public daojuImg: eui.Image;
    public cName: eui.Label;
    public eName: eui.Label;
    public miaoshuLabel: eui.Label;
    public goldLabel: eui.Label;
    public buyBtn: eui.Button;
    public buyGroup:eui.Group;
    public maskImg:eui.Image;
    public buyLimitLabel:eui.Label;

    public recData: any //本条数据

    private oldData;

    public constructor() {
        super();
        this.skinName = "DaojuListItemSkin";
        this.buyGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buyBtnTouch, this);
        this.daojuImg.mask = this.maskImg;
    }

    public setData(data) {
        this.recData = data;
    }

    /**中文名 */
    public setCName(str) {
        if (str && str != "") {
            this.cName.text = str;
        }
    }

    /**英文名 */
    public setEName(str) {
        if (str && str != "") {
            this.eName.text = str;
        }
    }

    /**道具图片 */
    public setImg(url) {
        if (url && url != "") {
            this.daojuImg.source = url;
        }
    }

    /**描述 */
    public setMiaoShu(des, quantity) {
        if(quantity == 0){
            this.miaoshuLabel.text = des;
        }else{
            this.miaoshuLabel.textFlow = <Array<egret.ITextElement>>[
                {text: "送给女生可获得",style:{"textColor":0xB2B4B3}},
                {text: quantity + "", style: {"textColor": 0xF48664}},
                {text:"亲密度", style:{"textColor":0xB2B4B3}}
            ]
        }
    }

    /**设置金币 */
    public setGold(str) {
        if (str && str != "") {
            this.goldLabel.text = str;
        }
    }

    /**设置今日可购买 */
    public setBuyLimit(is_limit:boolean, buy_times:number, left_times:number){
        if(is_limit){
            this.buyLimitLabel.text = "今日可购买:" + left_times + "/" + buy_times;
        }else{
            this.buyLimitLabel.text = "";
        }
    }

    /**购买按钮点击 */
    private buyBtnTouch() {
        App.SoundManager.playEffect(SoundManager.button);
        App.PanelManager.open(PanelConst.BuyToolPanel,this.recData);

    }


}