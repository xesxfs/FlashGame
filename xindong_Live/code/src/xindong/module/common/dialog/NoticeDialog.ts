/**
 * 公告对话框
 * @author chenkai
 * @date 2017/12/1
 */
class NoticeDialog extends BaseDialog{
	private noticeLabel:eui.Label;   //通知标题
	private wxLabel:eui.Label;       //微信公众号

	public constructor() {
		super();
		this.skinName = "NoticeDialogSkin";
	}

	/**设置通知标题 */
	public setNoticeTitle(title:string){
		this.noticeLabel.text = title;
	}

	/**设置微信号和QQ号 */
	public setWx(wxNum:string, qqNum:string){
		this.wxLabel.text = "公众号:" + wxNum + "    客服QQ:" + qqNum;
	}
}