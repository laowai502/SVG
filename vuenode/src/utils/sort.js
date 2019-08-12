/**
 * Created by laowai on 2018/07/31.
 */

/**
 * 冒泡排序
 * @param {Array} arr
 * @param {Function} fn 用来控制升序、降序
 */
export function buddle(arr, fn) {
	let len = arr.length
	while (len--) {
		for (let i = 0; i < len; i++) {
			if (fn(arr[i], arr[i + 1]) > 0) {
				[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
			}
		}
	}
}

/**
 * 插入排序
 * @param {Array} arr
 */
export function insert(arr) {

}
