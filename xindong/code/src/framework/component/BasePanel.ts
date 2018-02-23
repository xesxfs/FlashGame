/**
 * 面板基类
 * @author chenkai
 * @date 2016/6/27
 */
class BasePanel extends eui.Component{
    protected contentGroup:eui.Group;
    
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
}