/**
 * 协议面板
 * @author chenkai
 * @since 2017/10/17
 */
class ProtocolPanel extends BasePanel{
	private closeBtn:eui.Button;             //关闭
	private okBtn:eui.Button;                //确定
	private protocalScroller:eui.Scroller;   //协议滚动容器         
	private contentLabel:eui.Label;          //协议内容

	public constructor() {
		super();
		this.skinName = "ProtocalPanelSkin";
	}

	public childrenCreated(){
		this.contentLabel.text = App.DataCenter.userAgreeInfo.content;
	}


    public onEnable() {
		CommomBtn.btnClick(this.closeBtn, this.onClose, this,2);
		CommomBtn.btnClick(this.okBtn, this.onClose, this,1);

		this.protocalScroller.viewport.scrollV = 0;
    }
  
    public onRemove() {
		CommomBtn.removeClick(this.closeBtn, this.onClose, this);
		CommomBtn.removeClick(this.okBtn, this.onClose, this);

		this.protocalScroller.stopAnimation();
    }

	private onClose(){
		App.PanelManager.open(PanelConst.SetPanel);
        this.hide();
	}
}