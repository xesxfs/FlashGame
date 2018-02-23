/**
 * 互动答题信息
 * @author sven 
 * 2017/12/27
 */
class InteractAnsInfo {
    /**问题列表 */
    public questionList: Array<InteractQuesVo>;
    /**当前答到第几题 */
    public questionNum: number = 0;
    /**主面板显示需要的信息 */
    public cost: any;

    public readData(data) {
        this.questionNum = data.current;
        this.questionList = data.questions;
        // for (let i = 0;i < this.questionNum;i ++) {
        //     this.questionList.unshift(null);
        // }
    }
}

class InteractQuesVo {
    public id: number;
    public question: string;
    public answers: Array<InteractAnsVo>;
}

class InteractAnsVo {
    public answer: string;
    public cut: number;
    public cut_cons: number;
    public id: number;
    public qid: number;
    public score: number;
}

class InteractCostVo {
    public qtimes: number;
    public qcons: number;
    public qtype: number;
    public qstatus: string;  // "start" "continue"
    public qstart_video: string;
}