import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import VerifyOtp from '../views/VerifyOtp.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import ResetPassword from '../views/ResetPassword.vue';
import Dashboard from '../views/Dashboard.vue';
import ClientDashboard from '../views/ClientDashboard.vue';
import Inventory from '../views/Inventory.vue';
import POS from '../views/POS.vue';
import Categories from '../views/Categories.vue';
import Projects from '../views/Projects.vue';
import ProjectDetails from '../views/ProjectDetails.vue';
import StockOps from '../views/StockOps.vue';
import OrderCatalog from '../views/OrderCatalog.vue';
import MyOrders from '../views/MyOrders.vue';
import OrderManagement from '../views/OrderManagement.vue';
import Reports from '../views/Reports.vue';
import Users from '../views/Users.vue';
import SalesHistory from '../views/SalesHistory.vue';
import AuditTrail from '../views/AuditTrail.vue';
import DeliveryDashboard from '../views/DeliveryDashboard.vue';

import TransactionRecords from '../views/TransactionRecords.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/verify-otp', component: VerifyOtp },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/reset-password', component: ResetPassword },
  { 
    path: '/dashboard', 
    component: Dashboard, 
    meta: { requiresAuth: true, roles: ['admin', 'warehouse_staff', 'site_engineer'] } 
  },
  { 
    path: '/client-dashboard', 
    component: ClientDashboard, 
    meta: { requiresAuth: true, roles: ['client'] } 
  },
  { 
    path: '/inventory', 
    component: Inventory, 
    meta: { requiresAuth: true, roles: ['admin', 'warehouse_staff', 'site_engineer'] } 
  },
  { 
    path: '/pos', 
    component: POS, 
    meta: { requiresAuth: true, roles: ['admin'] } 
  },
  { 
    path: '/categories', 
    component: Categories, 
    meta: { requiresAuth: true, roles: ['admin'] } 
  },
  { 
    path: '/projects', 
    component: Projects, 
    meta: { requiresAuth: true, roles: ['admin'] } 
  },
  {
    path: '/projects/:id',
    component: ProjectDetails,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  { 
    path: '/transactions', 
    component: TransactionRecords, 
    meta: { requiresAuth: true, roles: ['admin', 'site_engineer'] } 
  },
  { 
    path: '/reports', 
    component: Reports, 
    meta: { requiresAuth: true, roles: ['admin', 'site_engineer'] } 
  },
  { 
    path: '/users', 
    component: Users, 
    meta: { requiresAuth: true, roles: ['admin'] } 
  },
  { 
    path: '/stock', 
    component: StockOps, 
    meta: { requiresAuth: true, roles: ['admin'] } 
  },
  { 
    path: '/sales-history', 
    component: SalesHistory, 
    meta: { requiresAuth: true, roles: ['admin'] } 
  },
  { 
    path: '/order-catalog', 
    component: OrderCatalog, 
    meta: { requiresAuth: true, roles: ['client'] } 
  },
  { 
    path: '/my-orders', 
    component: MyOrders, 
    meta: { requiresAuth: true, roles: ['client'] } 
  },
  { 
    path: '/orders-manage', 
    component: OrderManagement, 
    meta: { requiresAuth: true, roles: ['admin'] } 
  },
  {
    path: '/audit-trail',
    component: AuditTrail,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/deliveries',
    component: DeliveryDashboard,
    meta: { requiresAuth: true, roles: ['delivery', 'admin'] }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.token) {
    next('/login');
  } else {
    const roles = to.meta.roles;
    if (roles && authStore.user && !roles.includes(authStore.user.role)) {
      next('/dashboard');
    } else {
      next();
    }
  }
});

export default router;
