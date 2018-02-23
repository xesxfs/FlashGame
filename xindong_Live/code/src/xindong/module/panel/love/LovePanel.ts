/**
 * 恋爱面板
 * @author sven
 * 2017.12.29
 */
class LovePanel extends BasePanel {
    public itemList:eui.List;
    public topMenu:TopMenu;

    private guideGroup:eui.Group;   //引导Group
    private loveHand:eui.Image;     //指引的手
    private hitAreaImg:eui.Image;   //点击区域

    public constructor() {
        super();
        this.skinName = "LovePanelSkin";
    }

    protected childrenCreated() {
        this.itemList.itemRenderer = LoveBox;
        this.itemList.useVirtualLayout = false;
    }

    public onEnable() {
        this.setGuide();
        this.reTopUI();
        this.topMenu.showConfig(true, true, TopMenuTitle.Love);

        this.initList();
    }

    public onRemove() {
    }

    /**初始化列表 */
    private initList() {
        let list = App.DataCenter.Love.loveList;
        let ac:eui.ArrayCollection = new eui.ArrayCollection(list);
		this.itemList.dataProvider = ac;
    }

    /**刷新顶部UI */
    public reTopUI() {
        this.topMenu.setAssetUI();
    }

    /**引导 */
    public setGuide() {
        if (App.DataCenter.loveGuide) {
            this.guideGroup.visible = true;
            egret.Tween.get(this.loveHand, { loop: true })
            .to({ x: this.loveHand.x + 40}, 600)
            .to({ x:this.loveHand.x}, 800)
            .wait(100);
            GuideCircle.getInstacen().show(this.hitAreaImg);
            this.hitAreaImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGuideTouch, this);
        }
    }

    //点击引导
    private onGuideTouch(){
        GuideCircle.getInstacen().hide();
        this.hitAreaImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGuideTouch, this);
        this.guideGroup.visible = false;
        egret.Tween.removeTweens(this.loveHand);

        let http = new HttpSender();
        let param = {};
        http.post(ProtocolHttpUrl.guideDone, param, this.finishGuideBack, this);
    }

    /**引导完成返回 */
    private finishGuideBack(data) {
        if (data.code == 200) {
            App.DataCenter.loveGuide = false;
            App.DataCenter.guide.fill_nick_name = data.data.fill_nick_name;
            App.DataCenter.guide.emph_zone = data.data.emph_zone;
            App.DataCenter.guide.video = data.data.video;

            //第一个LoveBox进行恋爱
            let loveBox:LoveBox = this.itemList.getElementAt(0) as LoveBox;
            loveBox && loveBox.onClickBegin();
            
        } else {
            Tips.info(data.info);
        }
    }

    

   

}