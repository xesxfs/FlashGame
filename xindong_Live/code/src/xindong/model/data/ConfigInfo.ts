/**
 * 配置信息
 * @author xiongjian 
 * @date 2007/9/8
 */
class ConfigInfo {
    /**可操作功能*/
    public avilable_event: any[]; 
    /**游戏天数*/
    public days: number = 0; 
    /**目标阶段恋爱值*/
    public hearts: number = 0;
    /**必须要完成的事件*/
    public main_event: any[];
    /**阶段结束时播放视频*/
    public video: string = ""; 
    /**主角名字 */
    public girl_name: string = "";
    /**已完成的主事件 */
    public finish_main_event: any[];

}