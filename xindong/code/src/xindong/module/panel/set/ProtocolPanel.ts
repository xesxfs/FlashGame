/**
 * 协议面板
 * @author chenkai
 * @since 2017/10/17
 */
class ProtocolPanel extends BasePanel{
	private guanbiBtn:eui.Button;
	private okBtn:eui.Button;
	private protocalScroller:eui.Scroller;
	private protocalImg:eui.Image;
	private bImgLoaded:boolean = false;
	private contentLabel:eui.Label;

	public constructor() {
		super();
		this.skinName = "ProtocalPanelSkin";
	}

	public childrenCreated(){
		this.contentLabel.text = App.DataCenter.userAgreeInfo.content;
	}


    public onEnable() {
		CommomBtn.btnClick(this.guanbiBtn, this.onClose, this,2);
		CommomBtn.btnClick(this.okBtn, this.onClose, this,1);

		this.protocalScroller.viewport.scrollV = 0;
    }
  
    public onRemove() {
		CommomBtn.removeClick(this.guanbiBtn, this.onClose, this);
		CommomBtn.removeClick(this.okBtn, this.onClose, this);

		this.protocalScroller.stopAnimation();
    }

	private onClose(){
		App.PanelManager.open(PanelConst.SetPanel);
        this.hide();
	}
}