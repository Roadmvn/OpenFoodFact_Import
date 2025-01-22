<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">Générer une facture</h2>
      <div class="space-x-2">
        <button
          @click="generatePDF"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          :disabled="loading"
        >
          <i class="fas fa-file-pdf mr-2"></i>
          PDF
        </button>
        <button
          @click="generateCSV"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          :disabled="loading"
        >
          <i class="fas fa-file-csv mr-2"></i>
          CSV
        </button>
      </div>
    </div>

    <!-- Informations de la facture -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <h3 class="font-semibold mb-2">Informations client</h3>
        <div class="space-y-2">
          <p><span class="text-gray-600">Nom:</span> {{ order.customer.name }}</p>
          <p><span class="text-gray-600">Email:</span> {{ order.customer.email }}</p>
          <p><span class="text-gray-600">Téléphone:</span> {{ formatPhone(order.customer.phone) }}</p>
          <p><span class="text-gray-600">Adresse:</span> {{ order.customer.address }}</p>
        </div>
      </div>
      <div>
        <h3 class="font-semibold mb-2">Détails commande</h3>
        <div class="space-y-2">
          <p><span class="text-gray-600">N° Commande:</span> #{{ order.id }}</p>
          <p><span class="text-gray-600">Date:</span> {{ formatDate(order.date) }}</p>
          <p><span class="text-gray-600">Statut:</span> 
            <span :class="getStatusClass(order.status)">{{ order.status }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Articles -->
    <div class="mb-6">
      <h3 class="font-semibold mb-2">Articles</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
              <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase">Quantité</th>
              <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase">Prix unitaire</th>
              <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in order.items" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ item.name }}</td>
              <td class="px-6 py-4 text-right">{{ item.quantity }}</td>
              <td class="px-6 py-4 text-right">{{ formatPrice(item.price) }}</td>
              <td class="px-6 py-4 text-right">{{ formatPrice(item.price * item.quantity) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="px-6 py-4 text-right font-semibold">Sous-total</td>
              <td class="px-6 py-4 text-right">{{ formatPrice(subtotal) }}</td>
            </tr>
            <tr>
              <td colspan="3" class="px-6 py-4 text-right font-semibold">TVA (20%)</td>
              <td class="px-6 py-4 text-right">{{ formatPrice(tva) }}</td>
            </tr>
            <tr class="bg-gray-50">
              <td colspan="3" class="px-6 py-4 text-right font-semibold">Total</td>
              <td class="px-6 py-4 text-right font-bold">{{ formatPrice(total) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Notes -->
    <div class="mb-6">
      <h3 class="font-semibold mb-2">Notes</h3>
      <textarea
        v-model="notes"
        rows="3"
        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Ajouter des notes à la facture..."
      ></textarea>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { formatDate, formatPrice, formatPhone } from '@/utils/formatters'
import { useInvoiceStore } from '@/stores/invoice'

export default {
  name: 'InvoiceGenerator',
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const invoiceStore = useInvoiceStore()
    const loading = ref(false)
    const notes = ref('')

    const subtotal = computed(() => {
      return props.order.items.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    })

    const tva = computed(() => subtotal.value * 0.2)
    const total = computed(() => subtotal.value + tva.value)

    const getStatusClass = (status) => {
      const classes = {
        'En attente': 'bg-yellow-100 text-yellow-800',
        'Confirmée': 'bg-green-100 text-green-800',
        'Annulée': 'bg-red-100 text-red-800'
      }
      return `px-2 py-1 rounded-full text-xs ${classes[status] || ''}`
    }

    const generatePDF = async () => {
      loading.value = true
      try {
        await invoiceStore.generatePDF({
          order: props.order,
          notes: notes.value
        })
      } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error)
      } finally {
        loading.value = false
      }
    }

    const generateCSV = async () => {
      loading.value = true
      try {
        await invoiceStore.generateCSV({
          order: props.order,
          notes: notes.value
        })
      } catch (error) {
        console.error('Erreur lors de la génération du CSV:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      notes,
      subtotal,
      tva,
      total,
      formatDate,
      formatPrice,
      formatPhone,
      getStatusClass,
      generatePDF,
      generateCSV
    }
  }
}
</script>
