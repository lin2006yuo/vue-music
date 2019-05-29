export default [
  {
    path: "/",
    redirect: "/recommend"
  },
  {
    path: "/recommend",
    component: () => import("components/recommend/recommend"),
    children: [
      {
        path: ":id",
        component: () => import("components/disc/disc")
      }
    ]
  },
  {
    path: "/singer",
    component: () => import("components/singer/singer"),
    children: [
      {
        path: ":id",
        component: () => import("components/singer-detail/singer-detail")
      }
    ]
  },
  {
    path: "/rank",
    component: () => import("components/rank/rank"),
    children: [
      { path: ":id", component: () => import("components/top-list/top-list") }
    ]
  },
  {
    path: "/search",
    component: () => import("components/singer/singer"),
    children: [
      {
        path: ":id",
        component: () => import("components/singer-detail/singer-detail")
      }
    ]
  }
];
