/**
 * App 基类
 * @author chenkai
 * @since 2017/11/1
 */
class Facade extends SingleClass{
    private view:View;   //视图类

    public constructor(){
		super();
        this.view = View.getInstance();
    }

    /**
     * 注册Mediator
     */
    public registerMediator(mediatorName:string, mediator:Mediator){
        this.view.registerMediator(mediatorName, mediator);
    }

    /**
     * 注销Mediator
     */
    public removeMediator(mediatorName:string){
        this.view.removeMediator(mediatorName);
    }

    /**
     * 获取Mediator
     */
    public retrieveMediator(mediatorName:string ) : Mediator{
        return this.view.retrieveMediator(mediatorName);
    }

    /**派发事件 */
	public sendEvent(type:string , data:any = null){
		App.EventManager.sendEvent(type, data);
	}

	/**监听事件 */
	public addEvent(type:string, listener:Function, thisObject:any){
		App.EventManager.addEvent(type, listener, thisObject);
	}

	/**移除事件 */
	public removeEvent(type:string, listener:Function, thisObject:any){
		App.EventManager.removeEvent(type, listener, thisObject);
	}
}