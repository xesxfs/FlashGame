/**
 * 背包列表Item 
 * @author xiongjian 
 * @date 2017/9/11
 */
class BagsGroupItem extends BaseUI {

    public daojuImg: eui.Image;
    public typeLabel: eui.Label;
    public countLabel: eui.Label;
    public maskImg:eui.Image;

    private transData;

    public constructor() {
        super();
        this.skinName = "BagsGroupItemSkin";
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    }



    /**添加到场景中*/
    protected onEnable() {
        this.daojuImg.mask = this.maskImg;
    }
    /**点击 */
    private onTouch() {
        App.SoundManager.playEffect(SoundManager.button);
        App.PanelManager.open(PanelConst.UseToolPanel,this.transData);

    }

    /**请求返回 */
    private onTouchBack(data) {
        if (data.code == 200) {
            Tips.info("使用成功");
        } else {
            Tips.info("" + data.info);
        }
    }

    /**设置数据 */
    public setData(data) {
        this.transData = data;
    }


    /**设置图片 */
    public setImg(url) {
        if (url && url != "") {
            this.daojuImg.source = url;
        }
    }

    /**道具类型 */
    public setTypeText(str) {
        if (str && str != "") {
            this.typeLabel.text = str;
        }
    }

    /**设置道具个数 */
    public setToolsCount(num) {
        if (num && num != "") {
            this.countLabel.text = "x " + num;
        }
    }


}