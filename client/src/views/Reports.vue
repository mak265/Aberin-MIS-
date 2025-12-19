<template>
  <div class="page-container">
    <Navbar />

    <div class="container mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 tracking-tight">Reports & Analytics</h1>
          <p class="text-gray-500 mt-1">Generate insights and track performance</p>
        </div>
        <div class="flex gap-2">
           <button 
            @click="exportToPDF" 
            class="btn-secondary flex items-center shadow-sm"
            :disabled="reportData.length === 0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      <!-- Report Tabs -->
      <div class="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="currentTab = tab.id"
          class="px-5 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap border"
          :class="currentTab === tab.id 
            ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/20' 
            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Filters Card -->
      <div class="card mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Start Date</label>
            <input type="date" v-model="filters.startDate" class="input-field" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">End Date</label>
            <input type="date" v-model="filters.endDate" class="input-field" />
          </div>
          <div v-if="currentTab === 'usage'">
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Project</label>
            <select v-model="filters.projectId" class="input-field">
              <option value="">All Projects</option>
              <option v-for="proj in projects" :key="proj._id" :value="proj._id">{{ proj.name }}</option>
            </select>
          </div>
          <div :class="currentTab === 'usage' ? '' : 'md:col-start-4'">
            <button 
              @click="fetchReport" 
              class="btn-primary w-full flex items-center justify-center py-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Generate Report
            </button>
          </div>
        </div>
      </div>

      <!-- Report Content -->
      <div class="card p-0 overflow-hidden min-h-[400px]">
        <div v-if="loading" class="flex flex-col items-center justify-center h-64 text-gray-500">
          <svg class="animate-spin h-10 w-10 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating report data...
        </div>

        <div v-else-if="reportData.length > 0" class="overflow-x-auto">
          <!-- Inventory Snapshot -->
          <table v-if="currentTab === 'inventory'" class="min-w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-gray-50 border-b border-gray-100 uppercase tracking-wider text-xs font-bold text-gray-500">
              <tr>
                <th class="px-6 py-4">Item Code</th>
                <th class="px-6 py-4">Name</th>
                <th class="px-6 py-4">Category</th>
                <th class="px-6 py-4">Quantity</th>
                <th class="px-6 py-4 text-right">Est. Value</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="item in reportData" :key="item._id" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 font-mono text-gray-600">{{ item.itemCode || '—' }}</td>
                <td class="px-6 py-4 font-medium text-gray-900">{{ item.name }}</td>
                <td class="px-6 py-4 text-gray-500">
                  <span class="px-2 py-1 rounded bg-gray-100 text-xs">{{ item.category?.name || 'Uncategorized' }}</span>
                </td>
                <td class="px-6 py-4">
                  <span :class="item.quantity <= item.minStock ? 'text-red-600 font-bold' : 'text-gray-700'">
                    {{ item.quantity }} {{ item.unit }}
                  </span>
                  <span v-if="item.quantity <= item.minStock" class="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Low</span>
                </td>
                <td class="px-6 py-4 text-right font-mono text-gray-700">₱{{ (item.quantity * item.price).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Stock In / Out History -->
          <table v-if="['stockIn', 'stockOut'].includes(currentTab)" class="min-w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-gray-50 border-b border-gray-100 uppercase tracking-wider text-xs font-bold text-gray-500">
              <tr>
                <th class="px-6 py-4">Date</th>
                <th class="px-6 py-4">Item</th>
                <th class="px-6 py-4">Quantity</th>
                <th class="px-6 py-4">{{ currentTab === 'stockIn' ? 'Supplier' : 'Project / Requested By' }}</th>
                <th class="px-6 py-4">User</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="txn in reportData" :key="txn._id" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 text-gray-500">{{ new Date(txn.date).toLocaleDateString() }}</td>
                <td class="px-6 py-4 font-medium text-gray-900">{{ txn.item?.name }}</td>
                <td class="px-6 py-4">
                  <span :class="currentTab === 'stockIn' ? 'text-green-600' : 'text-blue-600'" class="font-bold">
                    {{ currentTab === 'stockIn' ? '+' : '-' }}{{ txn.quantity }} {{ txn.unit }}
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-600">
                  {{ currentTab === 'stockIn' ? (txn.supplier || '—') : `${txn.project?.name || '—'} (${txn.requestedBy || '—'})` }}
                </td>
                <td class="px-6 py-4 text-gray-500 text-xs">{{ txn.user?.email }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Low Stock -->
          <table v-if="currentTab === 'lowStock'" class="min-w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-red-50 border-b border-red-100 uppercase tracking-wider text-xs font-bold text-red-800">
              <tr>
                <th class="px-6 py-4">Item Name</th>
                <th class="px-6 py-4">Current Stock</th>
                <th class="px-6 py-4">Minimum Level</th>
                <th class="px-6 py-4">Deficit</th>
                <th class="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-red-50">
              <tr v-for="item in reportData" :key="item._id" class="hover:bg-red-50/50 transition-colors">
                <td class="px-6 py-4 font-medium text-gray-900">{{ item.name }}</td>
                <td class="px-6 py-4 text-red-600 font-bold">{{ item.quantity }} {{ item.unit }}</td>
                <td class="px-6 py-4 text-gray-600">{{ item.minStock }} {{ item.unit }}</td>
                <td class="px-6 py-4 text-red-700 font-bold">-{{ item.minStock - item.quantity }}</td>
                <td class="px-6 py-4 text-right">
                   <router-link to="/stock" class="text-xs font-bold bg-white border border-red-200 text-red-600 px-3 py-1 rounded hover:bg-red-50">
                     Restock
                   </router-link>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Usage By Project -->
          <table v-if="currentTab === 'usage'" class="min-w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-gray-50 border-b border-gray-100 uppercase tracking-wider text-xs font-bold text-gray-500">
              <tr>
                <th class="px-6 py-4">Project</th>
                <th class="px-6 py-4">Item</th>
                <th class="px-6 py-4">Total Consumed</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="usage in reportData" :key="usage._id" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 font-bold text-gray-800">{{ usage.projectDetails?.name || 'Unknown Project' }}</td>
                <td class="px-6 py-4 text-gray-600">{{ usage.itemDetails?.name }}</td>
                <td class="px-6 py-4 font-medium text-blue-600">{{ usage.totalQuantity }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center h-64 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l5.414 5.414a1 1 0 01.586 1.414V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-lg font-medium text-gray-500">No data found</p>
          <p class="text-sm">Try adjusting the filters or selecting a different report.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '../services/api';
import Navbar from '../components/Navbar.vue';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Ensure correct import

const tabs = [
  { id: 'inventory', label: 'Current Inventory' },
  { id: 'stockIn', label: 'Stock In' },
  { id: 'stockOut', label: 'Stock Out' },
  { id: 'lowStock', label: 'Low Stock' },
  { id: 'usage', label: 'Project Usage' }
];

const currentTab = ref('inventory');
const reportData = ref([]);
const projects = ref([]);
const loading = ref(false);
const filters = ref({
  startDate: '',
  endDate: '',
  projectId: ''
});

// Load projects for filter
onMounted(async () => {
  try {
    const res = await api.getProjects();
    projects.value = res.data;
  } catch (err) {
    console.error(err);
  }
  fetchReport();
});

watch(currentTab, () => {
  reportData.value = [];
  fetchReport();
});

const fetchReport = async () => {
  loading.value = true;
  try {
    const params = { ...filters.value };
    let res;

    switch (currentTab.value) {
      case 'inventory':
        res = await api.getInventoryReport(); 
        break;
      case 'stockIn':
        res = await api.getStockInReport(params);
        break;
      case 'stockOut':
        res = await api.getStockOutReport(params);
        break;
      case 'lowStock':
        res = await api.getLowStockReport();
        break;
      case 'usage':
        res = await api.getUsageByProject(params);
        break;
    }

    if (res && res.data) {
        reportData.value = res.data;
    } else {
        reportData.value = [];
    }
  } catch (err) {
    console.error("Report fetch error:", err);
    reportData.value = [];
  } finally {
    loading.value = false;
  }
};

const exportToPDF = () => {
  const doc = new jsPDF();
  doc.text(`${tabs.find(t => t.id === currentTab.value).label} Report`, 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

  let columns = [];
  let rows = [];

  if (currentTab.value === 'inventory') {
    columns = ["Code", "Name", "Category", "Qty", "Unit", "Value"];
    rows = reportData.value.map(i => [
      i.itemCode || '-', i.name, i.category?.name || '-', i.quantity, i.unit, `$${(i.quantity * i.price).toFixed(2)}`
    ]);
  } else if (['stockIn', 'stockOut'].includes(currentTab.value)) {
    columns = ["Date", "Item", "Qty", "Ref/Supplier", "User"];
    rows = reportData.value.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.item?.name,
      `${t.quantity} ${t.unit}`,
      currentTab.value === 'stockIn' ? t.supplier : t.project?.name,
      t.user?.email
    ]);
  } else if (currentTab.value === 'lowStock') {
    columns = ["Item", "Current", "Min", "Deficit"];
    rows = reportData.value.map(i => [i.name, i.quantity, i.minStock, i.minStock - i.quantity]);
  } else if (currentTab.value === 'usage') {
    columns = ["Project", "Item", "Total Used"];
    rows = reportData.value.map(u => [u.projectDetails?.name, u.itemDetails?.name, u.totalQuantity]);
  }

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 30,
  });

  doc.save(`${currentTab.value}_report.pdf`);
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>