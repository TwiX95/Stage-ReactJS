import Dashboard from "views/Dashboard/Dashboard";
import UserProfile from "views/UserProfile/UserProfile";
import TableList from "views/TableList/TableList";
import Upgrade from "views/Upgrade/Upgrade";
import Settings from "views/Settings/Settings";
import CalendarClass from "views/Calendar/Calendar";
import Menu from "views/Menu/Menu";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Accueil",
    icon: "pe-7s-graph",
    component: Dashboard
  },
  {
    path: "/calendar",
    name: "Calendrier",
    icon: "pe-7s-date",
    component: CalendarClass
  },
  {
    path: "/user",
    name: "Mon restaurant",
    icon: "pe-7s-user",
    component: UserProfile
  },
  {
    path: "/menu",
    name: "Mes menus",
    icon: "pe-7s-note2",
    component: Menu
  },
  {
    path: "/table",
    name: "Statistiques",
    icon: "pe-7s-graph1",
    component: TableList
  },
  {
    path: "/config",
    name: "Paramètres",
    icon: "pe-7s-tools",
    component: Settings
  },
  {
    path: "/help",
    name: "Aide",
    icon: "pe-7s-help1",
    component: Upgrade
  },
  {
    upgrade: true,
    path: "/upgrade",
    name: "Déconnexion",
    icon: "pe-7s-close",
    component: Upgrade
  },
  { redirect: true, path: "/", to: "/dashboard", name: "Dashboard" }
];

export default dashboardRoutes;
