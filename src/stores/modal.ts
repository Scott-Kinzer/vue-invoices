import { defineStore } from 'pinia'

export const useInvoiceModal = defineStore('invoiceModal', {
  state: () => {
    return { isModalOpen: false }
  },
  actions: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    }
  },
})
