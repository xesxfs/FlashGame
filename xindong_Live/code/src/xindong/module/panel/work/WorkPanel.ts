/**
 * 恋爱面板
 * @author sven
 * 2018.1.2
 */
class WorkPanel extends BasePanel {
    public itemList:eui.List;
    public topMenu:TopMenu;

    private guideGroup:eui.Group;  //引导Group
    private hitAreaImg:eui.Image;  //引导点击区域
    private workHand:eui.Image;    //引导手指

    public constructor() {
        super();
        this.skinName = "WorkPanelSkin";
    }

    protected childrenCreated() {
        this.itemList.itemRenderer = WorkBox;
        this.itemList.useVirtualLayout = false;
    }

    public onEnable() {
        this.setGuide();
        this.reTopUI();
        this.topMenu.showConfig(true, true, TopMenuTitle.Work);

        this.initList();
    }

    public onRemove() {
    }

    /**初始化列表 */
    private initList() {
        let list = App.DataCenter.Work.workList;
        let ac:eui.ArrayCollection = new eui.ArrayCollection(list);
		this.itemList.dataProvider = ac;
    }

    /**刷新顶部UI */
    public reTopUI() {
        this.topMenu.setAssetUI();
    }

    /**引导 */
    public setGuide() {
        if (App.DataCenter.workGuide) {
            this.guideGroup.visible = true;
            egret.Tween.get(this.workHand, { loop: true })
            .to({ x: this.workHand.x + 40,  }, 600)
            .to({ x: this.workHand.x}, 800)
            .wait(100);
            this.hitAreaImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGuideTouch, this);
            GuideCircle.getInstacen().show(this.hitAreaImg);
        }
    }

    //点击引导
    private onGuideTouch(){
        GuideCircle.getInstacen().hide();
        this.hitAreaImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGuideTouch, this);
        this.guideGroup.visible = false;
        egret.Tween.removeTweens(this.workHand);

        let http = new HttpSender();
        let param = {};
        http.post(ProtocolHttpUrl.guideDone, param, this.finishGuideBack, this);
    }

    /**引导完成返回 */
    private finishGuideBack(data) {
        if (data.code == 200) {
            App.DataCenter.workGuide = false;
            App.DataCenter.guide.fill_nick_name = data.data.fill_nick_name;
            App.DataCenter.guide.emph_zone = data.data.emph_zone;
            App.DataCenter.guide.video = data.data.video;

            //第一个LoveBox进行恋爱
            let workBox:WorkBox = this.itemList.getElementAt(0) as WorkBox;
            workBox && workBox.onClickBegin();
            
        } else {
            Tips.info(data.info);
        }
    }
}