/**
 * 恋爱信息
 * @author sven 
 * 2017/12/27
 */
class LoveInfo {
    public loveList: Array<LoveItemVo>;
}

class LoveItemVo {
    public cons: number;
    /**剩余时间 */
    public wait: number;
    public duration: number;
    public free_times: number;
    public id: number;
    public lock: boolean;
    public need_tool: 0;
    public pic: string;
    public score: number;
    public title: string;
    public tool_id: number;
    public unlock_days: number;
}