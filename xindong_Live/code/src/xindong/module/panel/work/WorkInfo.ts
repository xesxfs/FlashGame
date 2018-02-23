/**
 * 恋爱信息
 * @author sven 
 * 2017/12/27
 */
class WorkInfo {
    public workList: Array<WorkItemVo>;
}

class WorkItemVo {
    public cd: number;
    public wait: number;
    public duration: number;
    public free_times: number;
    public fudiamond: number;
    public gain_gold: number;
    public id: number;
    public pic: string;
    /**解锁状态 */
    public post: string;
    public title: string;
    public ugold: number;
}

class WorkStatus {
    public static work: string = "work";
    public static near: string = "promotion";
    public static quick: string = "fpromotion";
}