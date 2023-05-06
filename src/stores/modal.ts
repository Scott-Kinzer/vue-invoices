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

export const usePopModal = defineStore('popModal', {
  state: () => {
    return { isPopModalOpen: false }
  },
  actions: {
    openPopModal() {
      this.isPopModalOpen = true;
    },
    closePopModal() {
      this.isPopModalOpen = false;
    }
  },
})


