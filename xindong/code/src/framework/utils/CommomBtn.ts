/**
 * @author xiongjian 
 * @date　2017-10-14
 */
class CommomBtn {
    //事件列表
    private static eventList = {};

    /**
     * 注册按钮点击事件
     * @param target 按钮
     * @param cb     点击回调
     * @param thisObject 执行对象
     * @param type 声音播放类型  1普通点击  2退出   3换页
     */
    public static btnClick(target:any, cb:Function, thisObject:any, type = 1) {
        let list:Array<any> = this.eventList[target.hashCode + ""];

        if(list == null){
            list = new Array<any>();
            this.eventList[target.hashCode + ""] = list;
        }
        let len = list.length;
        for(var i=0;i<len;i++){
            if(list[i][0] == cb && list[i][1] == thisObject){
                return;
            }
        }
        var btnClick:BtnClick = new BtnClick(target, cb, thisObject, type);
        list.push([cb, thisObject, btnClick]);
    }

    /**
     * 移除按钮点击事件
     * @param target 按钮
     * @param cb 点击回调
     * @param thisObject 执行对象
     */
    public static removeClick(target:any, cb:Function, thisObject:any){
        let list:Array<any> = this.eventList[target.hashCode + ""];
        if(list != null){
            let len = list.length;
            for(let i=len-1;i>=0;i--){
                if(list[i][0] == cb && list[i][1] == thisObject){
                    let btnClick:BtnClick = list[i][2];
                    btnClick.destoryMe();
                    list[i].length = 0;
                    list.splice(i,1);
                }
            }
        }
    }
}



class BtnClick{
    private type:number;
    private target:any;
    private thisObject:any;
    private cb:Function;

    public constructor(target:any, cb:Function, thisObject:any, type:number = 1){
        this.target = target;
        this.cb = cb;
        this.thisObject = thisObject;
        this.type = type;
        
        this.initAnchorOffset();

        this.target.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.target.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
    }

    //触摸开始，播放声音和扩展动画
    private onTouchBegin(){
        App.StageUtils.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        
        this.playSound();
        this.playOutAnim(); 
    }

    //点击，执行回调
    private onTouchTap(){
        this.cb.apply(this.thisObject);
    }

    //触摸释放，播放收缩动画
    private onTouchEnd(){
        this.playBackAnim();
        App.StageUtils.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
    }

    //播放声音
    private playSound(){
        switch (this.type) {
            case 1:
                App.SoundManager.playEffect(SoundManager.button);
                break;
            case 2:
                App.SoundManager.playEffect(SoundManager.close);
                break;
            case 3:
                App.SoundManager.playEffect(SoundManager.page_switch);
                break;
        }
    }

    //播放扩展动画
    private playOutAnim(){
        egret.Tween.get(this.target).set({ scaleX: 1, scaleY: 1 }).to({ scaleX: 1.05, scaleY: 1.05 },30);
    }

    //播放收缩动画
    private playBackAnim(){
        egret.Tween.get(this.target).to({ scaleX: 1, scaleY: 1 },30);
    }

    //设置锚点为中心
    private initAnchorOffset(){
        if(this.target.anchorOffsetX != this.target.width/2 && this.target.anchorOffsetY != this.target.height/2){
            this.target.anchorOffsetX = this.target.width / 2;
            this.target.anchorOffsetY = this.target.height / 2;
            this.target.x = this.target.x + this.target.width / 2;
            this.target.y = this.target.y + this.target.height / 2;
        }
    }

    //销毁
    public destoryMe(){
        this.target.scaleX = 1;
        this.target.scaleY = 1;
        egret.Tween.removeTweens(this.target);
        this.target.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.target.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        App.StageUtils.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        this.target = null;
        this.cb = null;
        this.thisObject = null;
    }
}