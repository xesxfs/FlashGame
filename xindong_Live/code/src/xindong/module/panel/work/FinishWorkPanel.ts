/**
 * 完成工作面板
 * @author xiongjian
 * @deta 2017/9/5
 */
class FinishWorkPanel extends BasePanel {
    public recData;
    public xinLabel: eui.Label;
    public okBtn: eui.Button;

    public constructor() {
        super();
        this.skinName = "FinishWorkPanelSkin";
    }

    /**组件创建完毕*/
    protected childrenCreated() {
        
    }

    /**添加到场景中*/
    public onEnable(data:any = null) {
        this.recData = data;
        this.playEnterAnim();
        this.recData && this.setLabel(this.recData);
      
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