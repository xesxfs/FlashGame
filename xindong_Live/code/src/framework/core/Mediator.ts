/**
 * 视图代理
 * 负责Http、Socket通讯、以及视图模块之间的通讯
 * @author chenkai
 * @since 2017/11/1
 */
class Mediator {
	/**Facade */
	public facade:Facade;

	public constructor(){
		this.facade = Facade.getInstance();
	}

	/**注册时调用 */
	public onRegister(){

	}

	/**注销时调用 */
	public onRemove(){
		
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