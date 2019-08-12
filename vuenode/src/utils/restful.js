/**
 * Created by laowai on 2018/06/11
 */
export function restfulApi(data, mes) {
	return {
		data: data || null,
		message: mes || '',
		status: 200
	}
}
