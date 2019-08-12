import { restfulApi } from '@/utils/restful'

const admin = {
	'access_token': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJfbmFtZSI6ImFkbWluIiwiaXNTdXBlckFkbWluIjoiMSIsInVzZXJOYW1lIjoiTXIuQUciLCJ1c2VySWQiOiIxIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9VU0VSIl0sImNsaWVudF9pZCI6InZ1ZSIsInNjb3BlIjpbInJlYWQiXSwiZXhwaXJlIjoxNTM2NzU1NTY0OTk1LCJleHAiOjE1MzY3NjYzNjQsImRlcGFydCI6InJvb3QiLCJqdGkiOiI4NWViMjI1YS0xZDg1LTQ1NWMtOGRiZi03NTBiNmZhMGEyNzAiLCJ0ZW5hbnQiOiJhYzg4Y2ViMzg2YWE0MjMxYjA5YmY0NzJjYjkzN2MyNCJ9.d-Ji5XEfX2Sq8-2z87eSLYSURIr8UiVyv6vzNlKfkcYpIFnGrE41bLOmWhKtSsTwxh5--OnKCWn6BXbNGzMavnqOEFtnn4vivKN8rMkSX4LvONsgMlKjXOkt10veqBFsWCxV5uTblqTaG-iBXjDHyY_nzh2c_E7WGII4iPDxN9o',
	'token_type': 'bearer',
	'refresh_token': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJfbmFtZSI6ImFkbWluIiwiaXNTdXBlckFkbWluIjoiMSIsInVzZXJOYW1lIjoiTXIuQUciLCJ1c2VySWQiOiIxIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9VU0VSIl0sImNsaWVudF9pZCI6InZ1ZSIsInNjb3BlIjpbInJlYWQiXSwiZXhwaXJlIjoxNTM2NzU1NTY0OTk1LCJhdGkiOiI4NWViMjI1YS0xZDg1LTQ1NWMtOGRiZi03NTBiNmZhMGEyNzAiLCJleHAiOjE1MzkzNDM5NjQsImRlcGFydCI6InJvb3QiLCJqdGkiOiIxYTYzNmNhZi04YWEyLTQ5OWMtYmRmZi1mZGViOGQ1YmQ5NDEiLCJ0ZW5hbnQiOiJhYzg4Y2ViMzg2YWE0MjMxYjA5YmY0NzJjYjkzN2MyNCJ9.GnzRUTXxC_TiDDCsU__PjnB2m9UK6wwoCRDI-JIKLu1RmYYl2ggAAbVHB98cfPy8gCtB8lZ2rMzwrJUhILEOKJZgNBydJfQ6FCpGGO7i6TZry3CHImDx-e_885C84uSDvzeaLZJ2HS0AFTrzFZTLwJ3UvTMRKZ_1WNeX32aCs_M',
	'expires_in': 14399,
	'scope': 'read',
	'sub': 'admin',
	'expire': '2018-09-12 20:32:44',
	'isSuperAdmin': '1',
	'depart': 'root',
	'userName': 'Mr.AG',
	'userId': '1',
	'tenant': 'ac88ceb386aa4231b09bf472cb937c24',
	'jti': '85eb225a-1d85-455c-8dbf-750b6fa0a270'
}

const userInfo = {
	'id': '1',
	'username': 'admin',
	'name': 'Mr.AG',
	'description': '',
	'elements': [],
	'menu': []
}

export default {
	loginByUsername: () => restfulApi(admin),
	getUserInfo: () => restfulApi(userInfo),
	logout: () => restfulApi(null, 'success')
}