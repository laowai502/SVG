import Layout from '@/views/layout/Layout'

export default {
	id: 'chat',
	path: '/chat',
	component: Layout,
	redirect: '/chat/im',
	name: 'chat',
	meta: {
		title: '聊天室'
	},
	children: [
        {
			id: 'im',
			path: 'im',
            name: 'im',
			component: () =>
                import('@/views/chat/chat'),
            meta: {
                title: 'IM'
            }
		},
        {
			id: 'login',
			path: 'login',
			name: 'login',
			component: () =>
                import('@/views/chat/login'),
            hidden: true
		}
	]
}
