<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <div class="container mx-auto px-6 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Reports & Analytics</h1>

      <!-- Tabs -->
      <div class="flex space-x-4 mb-6 overflow-x-auto pb-2">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="currentTab = tab.id"
          class="px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap"
          :class="currentTab === tab.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input type="date" v-model="filters.startDate" class="px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input type="date" v-model="filters.endDate" class="px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Project (Usage Report)</label>
          <select v-model="filters.projectId" class="px-3 py-2 border rounded-md w-48">
            <option value="">All Projects</option>
            <option v-for="proj in projects" :key="proj._id" :value="proj._id">{{ proj.name }}</option>
          </select>
        </div>
        <button 
          @click="fetchReport" 
          class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Generate Report
        </button>
        <button 
          @click="exportToPDF" 
          class="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900 transition ml-auto"
        >
          Export PDF
        </button>
      </div>

      <!-- Report Content -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        
        <!-- Inventory Snapshot -->
        <table v-if="currentTab === 'inventory'" class="min-w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="item in reportData" :key="item._id">
              <td class="px-6 py-4">{{ item.itemCode || 'N/A' }}</td>
              <td class="px-6 py-4">{{ item.name }}</td>
              <td class="px-6 py-4">{{ item.category?.name || 'Uncategorized' }}</td>
              <td class="px-6 py-4">
                <span :class="{'text-red-600 font-bold': item.quantity <= item.minStock}">
                  {{ item.quantity }} {{ item.unit }}
                </span>
              </td>
              <td class="px-6 py-4">${{ (item.quantity * item.price).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Stock In / Out History -->
        <table v-if="['stockIn', 'stockOut'].includes(currentTab)" class="min-w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {{ currentTab === 'stockIn' ? 'Supplier' : 'Project / Requested By' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="txn in reportData" :key="txn._id">
              <td class="px-6 py-4">{{ new Date(txn.date).toLocaleDateString() }}</td>
              <td class="px-6 py-4">{{ txn.item?.name }}</td>
              <td class="px-6 py-4 text-green-600 font-semibold">
                {{ txn.quantity }} {{ txn.unit }}
              </td>
              <td class="px-6 py-4">
                {{ currentTab === 'stockIn' ? txn.supplier : `${txn.project?.name || 'N/A'} (${txn.requestedBy})` }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ txn.user?.email }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Low Stock -->
        <table v-if="currentTab === 'lowStock'" class="min-w-full">
          <thead class="bg-red-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Item</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Current Qty</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Min Stock</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Deficit</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-red-100">
            <tr v-for="item in reportData" :key="item._id">
              <td class="px-6 py-4 font-medium text-gray-900">{{ item.name }}</td>
              <td class="px-6 py-4 text-red-600 font-bold">{{ item.quantity }} {{ item.unit }}</td>
              <td class="px-6 py-4">{{ item.minStock }}</td>
              <td class="px-6 py-4 text-red-800">{{ item.minStock - item.quantity }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Usage By Project -->
        <table v-if="currentTab === 'usage'" class="min-w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Used</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="usage in reportData" :key="usage._id">
              <td class="px-6 py-4 font-bold">{{ usage.projectDetails?.name || 'Unknown Project' }}</td>
              <td class="px-6 py-4">{{ usage.itemDetails?.name }}</td>
              <td class="px-6 py-4">{{ usage.totalQuantity }}</td>
            </tr>
          </tbody>
        </table>

        <div v-if="reportData.length === 0" class="p-8 text-center text-gray-500">
          No data available for the selected criteria.
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
import 'jspdf-autotable';

const tabs = [
  { id: 'inventory', label: 'Current Inventory' },
  { id: 'stockIn', label: 'Stock In History' },
  { id: 'stockOut', label: 'Stock Out History' },
  { id: 'lowStock', label: 'Low Stock Alerts' },
  { id: 'usage', label: 'Project Usage' }
];

const currentTab = ref('inventory');
const reportData = ref([]);
const projects = ref([]);
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
  try {
    const params = { ...filters.value };
    let res;

    switch (currentTab.value) {
      case 'inventory':
        res = await api.getInventoryReport(); // Usually just gets items
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

    if (res) reportData.value = res.data;
  } catch (err) {
    console.error("Report fetch error:", err);
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

  doc.autoTable({
    head: [columns],
    body: rows,
    startY: 30,
  });

  doc.save(`${currentTab.value}_report.pdf`);
};
</script>
