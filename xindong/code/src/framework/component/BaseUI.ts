/**
 * 自定义UI
 * @author chenkai 
 * @date 2016/7/5
 */
class BaseUI extends eui.Component{
	public constructor() {
      super();
      this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onEnable,this);
      this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemove,this);
	}
	
    /**组件创建完毕*/
    protected childrenCreated() {
        
    }

    /**添加到场景中*/
    protected onEnable() {
        
    }

    /**从场景中移除*/
    protected onRemove() {

    }

    /**隐藏*/
    public hide() {
        this.parent && this.parent.removeChild(this);
    }

    /**销毁*/
    protected destoryMe() {

    }

    
}
