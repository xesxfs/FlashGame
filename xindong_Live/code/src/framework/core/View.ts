/**
 * 视图管理类
 * 管理视图代理Mediator
 * @author chenkai
 * @date 2017/11/17
 */
class View extends SingleClass{
	/**mediator数组 */
	public mediatorMap = {};

    /**
     * 注册Mediator
     */
    public registerMediator(mediatorName:string, mediator:Mediator){
        if(this.mediatorMap[mediatorName] != null){
            return;
        }
        this.mediatorMap[mediatorName] = mediator;
        mediator.onRegister();
    }

    /**
     * 注销Mediator
     */
    public removeMediator(mediatorName:string){
        let mediator:Mediator = this.mediatorMap[mediatorName];
        if(mediator){
            delete this.mediatorMap[mediatorName];
            mediator.onRemove();
        }
    }

    /**
     * 获取Mediator
     */
    public retrieveMediator(mediatorName:string ) : Mediator{
        return this.mediatorMap[ mediatorName ];
    }
}