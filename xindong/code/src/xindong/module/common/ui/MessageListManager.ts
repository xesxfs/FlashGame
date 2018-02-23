/**
 * 消息列表管理类
 * @author xiongjian
 * @date 2017/9/1
 */

class MessageListManager extends SingleClass {

	private listPool: ObjectPool;

	private list:MessageList = new MessageList();

	public constructor() {
		super();
		this.listPool = ObjectPool.getPool(MessageList.NAME);
	}

	/**获取一个消息弹框A，两条 */
	public getBoxA(): MessageList {
		this.list.skinName = "Message2ListSkin";
		return this.list;
	}

	/**获取一个消息弹框B，三条 */
	public getBoxB(): MessageList {
		this.list.skinName = "Message3ListSkin";
		return this.list;
	}

	/**获取一个消息框C,四条 */
	public getBoxC(): MessageList {
		this.list.skinName = "Message4ListSkin";
		return this.list;
	}

	/**回收所有弹框*/
	public recycleAllBox() {
		if(this.list){
			this.list.parent && this.list.parent.removeChild(this.list);
		}
	}

}