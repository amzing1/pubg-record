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
    },
    {
      name: 'web3d',
      routerName: 'web3d',
      children: [
        {
          name: 'shader-practice',
          routerName: 'shader-practice',
          children: []
        },
        {
          name: 'shader-wave',
          routerName: 'shader-wave',
          children: []
        },
        {
          name: 'shader-galaxy',
          routerName: 'shader-galaxy',
          children: []
        },
        {
          name: 'shader-light',
          routerName: 'shader-light',
          children: []
        },
        {
          name: 'shader-hologram',
          routerName: 'shader-hologram',
          children: []
        }
      ]
    }
  ])

  function getSubNavs(routeName: 'annotation' | 'web3d'): NavItem[] {
    return navList.value.find((v) => v.name === routeName)?.children || []
  }

  return {
    navList,
    getSubNavs
  }
}
