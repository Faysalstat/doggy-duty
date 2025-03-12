export const MENUITEM = [
    {
      label: 'Home',
      items: [
        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
      ],
    },
    {
      label: 'Modules',
      items: [
        {
          label: 'Work Order',
          icon: 'pi pi-fw pi-cart-plus',
          items: [
            {
              label: 'History',
              icon: 'pi pi-fw pi-list',
              routerLink: ['/work-order/history'],
            },
            {
              label: 'Invoice',
              icon: 'pi pi-fw pi-file-pdf',
              routerLink: ['/work-order/invoice'],
            },
          ],
        },
        {
          label: 'Services',
          icon: 'pi pi-fw pi-truck',
          routerLink: ['/service/list']
        },
        {
          label: 'Community',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/community/list']
        }
      ],
    },
    {
      label: 'Need Help?',
      items: [
        {
          label: 'FAQ',
          icon: 'pi pi-fw pi-question',
          routerLink: ['/documentation'],
        },
        {
          label: 'Tutorials',
          icon: 'pi pi-fw pi-sitemap',
          routerLink: ['/documentation'],
        },
      ],
    },
  ];
  
  