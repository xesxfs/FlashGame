/**
 * 完成恋爱面板
 * @author xiongjian
 * @deta 2017/9/5
 */
class FinishLovePanel extends BasePanel {
    public xinLabel: eui.Label;
    public okBtn: eui.Button;

    public constructor() {
        super();
        this.skinName = "FinishLovePanelSkin";
    }

    /**组件创建完毕*/
    protected childrenCreated() {
        
    }

    /**添加到场景中*/
    public onEnable(data:any = null) {
        this.playEnterAnim();
        data && this.setLabel(data);
     
        CommomBtn.btnClick(this.okBtn,this.okBtnTouch,this,1);
    }

    /**从场景中移除*/
    public onRemove() {
        CommomBtn.removeClick(this.okBtn,this.okBtnTouch,this);
    }

    /**设置文本 */
    private setLabel(num) {
        this.xinLabel.text =  ""+ num ;
    }

    /**按钮点击 */
    private okBtnTouch() {
        this.hide();
    }

}