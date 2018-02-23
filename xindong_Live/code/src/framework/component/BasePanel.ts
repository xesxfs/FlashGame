/**
 * 面板基类
 * @author chenkai
 * @date 2016/6/27
 */
class BasePanel extends eui.Component{
    protected contentGroup:eui.Group;
    protected gloBgi:eui.Image;
    public topMenu:TopMenu;
    
    public constructor() {
        super();
        this.percentWidth = 100;
        this.percentHeight = 100;
    }
    
    /**播放弹框入场动画 */
    protected playEnterAnim(){
        if(this.contentGroup){
            this.contentGroup.scaleX = 0;
		    this.contentGroup.scaleY = 0;
		    egret.Tween.get(this.contentGroup).to({scaleX:1, scaleY:1},300,egret.Ease.backOut);
        }
    }

    /**添加到舞台时调用 */
    public onEnable(data:any = null){

    }

    /**从舞台移除时调用 */
    public onRemove(){

    }

    /**隐藏*/
    public hide() {
        this.parent && this.parent.removeChild(this);
    }

    /**销毁 */
    public destoryMe(){
        
    }

    /**更改背景图 */
    public changeBgi() {
        if (!this.gloBgi) return;
        if (App.DataCenter.UserInfo.bgi.length > 3) {
            this.gloBgi && (this.gloBgi.source = App.DataCenter.UserInfo.bgi+"_mohu_png");
        }
        else {
            console.warn("背景图url有点怪怪的");
        }
    }
}