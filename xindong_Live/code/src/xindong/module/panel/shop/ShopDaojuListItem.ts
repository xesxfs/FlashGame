/**
 * @author xiongjian 
 * @date 2017/9/4
 * 道具列表item
 */
class ShopDaojuListItem extends BaseUI {

    public maskImg:eui.Rect;        //道具图片遮罩
    public daojuImg: eui.Image;     //道具图片
    public cName: eui.Label;        //中文名
    public eName: eui.Label;
    public miaoshuLabel: eui.Label; //描述
          
    public buyLimitLabel:eui.Label;  //限购
    
    private buyBtn:eui.Button;       //购买按钮
    private nameLabel:eui.Label;     //道具名称
    public priceLabel: eui.Label;    //价格

    public recData: any //本条数据
    private oldData;


    public constructor() {
        super();
        this.skinName = "ShopDaojuListItemSkin";
        
    }

    public childrenCreated(){
        this.buyLimitLabel.text = "";
        this.miaoshuLabel.text = "";
        this.eName.text = "";
        this.cName.text = "";
        this.daojuImg.mask = this.maskImg;
    }

    protected onEnable() {
        this.buyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buyBtnTouch, this);
    }


    protected onRemove() {
        this.buyBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.buyBtnTouch, this);
    }

    public setData(data) {
        this.recData = data;
    }

    /**中文名 */
    public setCName(str) {
        this.nameLabel.text = str;
    }

    /**道具图片 */
    public setImg(url) {
        this.daojuImg.source = RES.getRes(url);
    }

    /**描述 */
    public setMiaoShu(des, quantity) {
        this.miaoshuLabel.text = des;
    }

    /**设置金币 */
    public setGold(str) {
        this.priceLabel.text = str;
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