/**
 * 对话框基类
 * @author chenkai
 * @since 2017/10/14
 * 
 * show()       显示
 * hide()       隐藏
 * setContent() 设置内容文本
 * setTitle()   设置标题文本
 * setOk()      OK回调函数
 * setCancel()  Cancel回调函数
 * destoryMe()  销毁
 */
class BaseDialog extends eui.Component{
	protected okBtn:eui.Button;        //确定按钮
	protected cancelBtn:eui.Button;    //取消按钮
	protected contentLabel:eui.Label;  //内容文本
	protected titleLabel:eui.Label;    //标题文本
	protected contentGroup:eui.Group;  //内容Group

	public ok:Function;                //确定回调
	public cancel:Function;            //取消回调
	public thisObject:any;             //回调执行对象
	public data:any;                   //传递的数据

	public constructor() {
		super();
		this.percentWidth = 100;
		this.percentHeight = 100;
	}
	
	/**显示 */
	public show(){
		this.playEnterAnim();
		App.LayerManager.dialogLayer.addChild(this);
		this.okBtn && CommomBtn.btnClick(this.okBtn, this.onOkTouch, this);
		this.cancelBtn && CommomBtn.btnClick(this.cancelBtn, this.onCancelTouch, this);
	}

	//播放弹框入场动画
    protected playEnterAnim(){
        if(this.contentGroup){
            this.contentGroup.scaleX = 0;
		    this.contentGroup.scaleY = 0;
		    egret.Tween.get(this.contentGroup).to({scaleX:1, scaleY:1},300,egret.Ease.backOut);
        }
    }

	/**隐藏 */
	public hide(){
		App.LayerManager.dialogLayer.removeChild(this);
		this.okBtn && CommomBtn.removeClick(this.okBtn, this.onOkTouch, this);
		this.cancelBtn && CommomBtn.removeClick(this.cancelBtn, this.onCancelTouch, this);
	}

	/**设置内容 */
	public setContent(content:string){
		if(this.contentLabel){
			this.contentLabel.text = content;
		}
	}

	/**设置标题 */
	public setTitle(title:string){
		if(this.titleLabel){
			this.titleLabel.text = title;
		}
	}

	/**设置确定回调 */
	public setOk(callBack:Function, thisObject:any, data:any = null){
		this.ok = callBack;
		this.thisObject = thisObject;
		this.data = data;
	}

	/**设置取消回调 */
	public setCancel(callBack:Function, thisObject:any){
		this.cancel = callBack;
		this.thisObject = thisObject;
	}

	private onOkTouch(){
		if(this.ok && this.thisObject){
			this.ok.call(this.thisObject, this.data);
		}
		this.destoryMe();
	}

	private onCancelTouch(){
		if(this.cancel && this.thisObject){
			this.cancel.call(this.thisObject);
		}
		this.destoryMe();
	}

	/**销毁 */
	public destoryMe(){
		this.cancel = null;
		this.ok = null;
		this.thisObject = null;
		this.data = null;
		this.okBtn &&  CommomBtn.removeClick(this.okBtn, this.onOkTouch, this);
		this.cancelBtn && CommomBtn.removeClick(this.cancelBtn, this.onCancelTouch, this);
		this.parent && this.parent.removeChild(this);
	}
	
}