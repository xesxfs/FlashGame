/**
 * 反馈
 * @author chenkai 2017/12/27
 */
class FeedBackPanel extends BasePanel{
	private contentEdit:eui.EditableText;   //内容文本
	private submitBtn:eui.Button;           //提交
	private closeBtn:eui.Button;            //关闭

	public constructor() {
		super();
		this.skinName = "FeedBackPanelSkin";
	}

	public childrenCreated(){

	}

	public onEnable(){
		this.playEnterAnim();
		//初始化文本	
		this.contentEdit.prompt = "输入内容";
		this.contentEdit.maxChars = 100;
		this.contentEdit.text = "";

		//按钮监听
		CommomBtn.btnClick(this.submitBtn, this.onSubmit,this);
		CommomBtn.btnClick(this.closeBtn, this.onClose, this);
	}

	public onRemove(){
		CommomBtn.removeClick(this.submitBtn, this.onSubmit,this);
		CommomBtn.removeClick(this.closeBtn, this.onClose, this);
	}

	//提交
	private onSubmit(){
		if(StringTool.trim(this.contentEdit.text) == ""){
			Tips.info("输入内容不能为空");
			return;
		}
		this.reqFeedBack();
	}

	//请求反馈
	private reqFeedBack(){
		let param = {content: StringTool.trim(this.contentEdit.text)};

		let http:HttpSender = new HttpSender();
		http.post(ProtocolHttpUrl.feedback,param ,this.revFeedBack, this);
	}

	//返回反馈
	private revFeedBack(data){
		if(data.code == 200){
			//清理输入内容
			this.contentEdit.text = "";

			//提示成功
			Tips.info("发送成功");
		}else{
			Tips.info(data.info);
		}
	}

	//关闭
	private onClose(){
		this.hide();
		App.PanelManager.open(PanelConst.SetPanel);
	}
}