/**
 * @author laowai
 * @description 拖拽边缘检测，通过事件坐标点和目标元素offsetTop，offsetLeft，判断是拖放到目标元素中心还是边缘，边缘判断 宽 20% ~ 80%，高 20% ~ 80%
 * 注: 此方法元素之间的高度是相等，所以判断Y时，据条件简化 （故此方法不适用于流式布局）
 * @param {Document} drag 拖动的元素
 * @param {Document} drop 拖放到的元素
 * @param {DocumentEvent} e 事件点，用户获取x，y坐标，都是用兼容的属性，所以不做兼容判断
 * @return {Boolean} 若返回为null（不操作）， true（边缘）， false（中心）
 */
export function isEdge(drag, drop, e) {
	let res = null
	const a = drag || null
	const b = drop || null
	if (!a || !b || !e) {
		return res
	}
	const aX = a.getBoundingClientRect()
	const bX = b.getBoundingClientRect()
	/**
	 * 从左到右为，从上到下为正
	 */
	const checkX = () => {
		const percent = ((e.clientX - bX.x) / bX.width).toFixed(2)
		return percent < 0.2 || percent > 0.8
	}
	const checkY = () => {
		const percent = ((e.clientY - bX.y) / bX.height).toFixed(2)
		return percent < 0.2 || percent > 0.8
	}
	if (a && b && e) {
		if (aX.x < bX.x) {
			if(aX.y > bX.y) { //↗
				res = checkX() || checkY()
			} else if(aX.y === bX.y) { //→
				res = checkX()
			} else { //↘
				res = checkX() || checkY()
			}
		} else if (aX.x > bX.x) {
			if(aX.y > bX.y) { //↖
				res = checkX() || checkY()
			} else if(aX.y === bX.y) { //←
				res = checkX()
			} else { //↙
				res = checkX() || checkY()
			}
		} else { //↓ & ↑
			res = checkY()
		}
	}
	return res
}
