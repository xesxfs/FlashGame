/**
 * 天数
 * @author chenkai 2017/12/23
 */
class DayUI extends eui.Component{
	private dayLabel:eui.Label;   //天数

	public constructor() {
		super();
		this.skinName = "DayUISkin";
	}

	/**设置天数 */
	public setDay(day:number){
		this.dayLabel.text = day + "";
	}
}