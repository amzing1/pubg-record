import { ref } from 'vue'

type NavItem = {
  name: string
  routerName: string
  children: NavItem[]
}

export function useNavList() {
  const navList = ref<NavItem[]>([
    {
      name: 'pubg',
      routerName: 'pubg-record',
      children: []
    },
    {
      name: 'annotation',
      routerName: 'annotation',
      children: [
        {
          name: 'image',
          routerName: 'annotation-image',
          children: []
        },
        {
          name: 'text',
          routerName: 'annotation-text',
          children: []
        },
        {
          name: 'image',
          routerName: 'annotation-video',
          children: []
        }
      ]
    }
  ])

  function getSubNavs(routeName: 'annotation'): NavItem[] {
    return navList.value.find((v) => v.name === routeName)!.children
  }

  return {
    navList,
    getSubNavs
  }
}
