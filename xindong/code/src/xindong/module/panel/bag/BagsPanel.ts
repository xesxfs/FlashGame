/**
 * 背包面板
 * @author xiongjian
 * @date 2017/9/11
 */
class BagsPanel extends BasePanel {

    public backBtn: eui.Button;
    public giftGroup: eui.Group;
    public nothingGroup: eui.Group;
    public heartPlugin: HeartsPlugins;
    public gotoShop:eui.Button;

    public constructor() {
        super();
        this.skinName = "BagsPanelSkin";
    }

    /**组件创建完毕*/
    protected childrenCreated() {

    }

    /**添加到场景中*/
    public onEnable() {
        this.init();
      
        CommomBtn.btnClick(this.backBtn,this.close,this,2);
        CommomBtn.btnClick(this.gotoShop,this.gotoTouch,this,1);
    }

    /**从场景中移除*/
    public onRemove() {
        CommomBtn.removeClick(this.backBtn,this.close,this);
        CommomBtn.removeClick(this.gotoShop,this.gotoTouch,this);
    }

    public init() {
        let bags = App.DataCenter.Bags;
        console.log("bags", bags);
        this.giftGroup.removeChildren();
        if (bags.length > 0) {
            this.showNothingGroup(false);
        } else {
            this.showNothingGroup(true);
        }

        for (let i = 0; i < bags.length; i++) {
            let tool = bags[i];
            let item = new BagsGroupItem();
            //item.x = Math.floor(i % 3) * (366+48) + 48
            //item.y = Math.floor(i / 3) * 486 + 20;
            item.setImg(tool.pic);
            item.setTypeText(tool.cname);
            item.setToolsCount(tool.count);
            item.setData(tool);
            this.giftGroup.addChild(item);
        }

        this.setXinText(App.DataCenter.UserInfo.hearts, App.DataCenter.ConfigInfo.hearts);
    }



    /**显示没有道具 */
    public showNothingGroup(bo: boolean) {
        if (bo) {
            this.nothingGroup.visible = true;
        } else {
            this.nothingGroup.visible = false;
        }


    }

    /**设置爱心 */
    public setXinText(str, h) {
        if (h && h != "") {
            this.heartPlugin.setJindu(str, h);
        }
    }

    /**关闭 */
    private close() {
        this.hide();
        var gamescene = App.SceneManager.getScene(SceneConst.GameScene) as GameScene;
        gamescene.enterAnimation();
    }

    /**去商城 */
    private gotoTouch(){
        App.PanelManager.open(PanelConst.ShopPanel);
       let shop =<ShopPanel> App.PanelManager.getPanel(PanelConst.ShopPanel);
       shop.isBack = true;
    }

}